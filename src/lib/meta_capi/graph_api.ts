import "server-only";
import { z } from "zod";
import type { send_result } from "./capture_result";
import type { capture_config } from "./config";
import type { server_event } from "./event_payload";

export type transport = {
  fetch: typeof fetch;
  sleep: (ms: number) => Promise<void>;
  attempt_timeout_ms: number;
};

const max_attempts = 3;
const retry_base_delay_ms = 1000;
const max_retry_delay_ms = 10_000;

const default_transport: transport = {
  fetch: (input, init) => fetch(input, init),
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  attempt_timeout_ms: 5000,
};

const success_schema = z.object({
  events_received: z.number().int().nonnegative(),
  fbtrace_id: z.string(),
});

const error_schema = z.object({
  error: z.object({
    message: z.string(),
    type: z.string().optional(),
    code: z.number().optional(),
    error_subcode: z.number().optional(),
    fbtrace_id: z.string().optional(),
  }),
});

type attempt =
  | { done: true; result: send_result }
  | { done: false; reason: string; retry_after_ms?: number };

const refused = (message: string): send_result => ({
  ok: false,
  code: "refused",
  message,
});

const unreachable = (message: string): send_result => ({
  ok: false,
  code: "unreachable",
  message,
});

const body_json = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
};

const accepted = (body: unknown): send_result => {
  const parsed = success_schema.safeParse(body);
  if (!parsed.success) {
    return refused("Meta answered 200 with an unexpected body");
  }
  return {
    ok: true,
    events_received: parsed.data.events_received,
    fbtrace_id: parsed.data.fbtrace_id,
  };
};

const refusal_message = (body: unknown, status: number) => {
  const parsed = error_schema.safeParse(body);
  if (!parsed.success) {
    return `Meta answered HTTP ${status} with an unexpected body`;
  }
  const { message, type, code, fbtrace_id } = parsed.data.error;
  const details = [
    type && `type ${type}`,
    code !== undefined && `code ${code}`,
    fbtrace_id && `fbtrace ${fbtrace_id}`,
  ]
    .filter(Boolean)
    .join(", ");
  return details
    ? `Meta refused the event: ${message} (${details})`
    : `Meta refused the event: ${message}`;
};

const retry_after_ms = (response: Response) => {
  const header = response.headers.get("retry-after");
  if (!header) return undefined;
  const seconds = Number(header);
  if (Number.isFinite(seconds)) return Math.max(0, seconds) * 1000;
  const at = Date.parse(header);
  return Number.isNaN(at) ? undefined : Math.max(0, at - Date.now());
};

const outcome_of = async (response: Response): Promise<attempt> => {
  if (response.ok) {
    return { done: true, result: accepted(await body_json(response)) };
  }
  if (response.status === 429) {
    return {
      done: false,
      reason: "HTTP 429",
      retry_after_ms: retry_after_ms(response),
    };
  }
  if (response.status >= 500) {
    return { done: false, reason: `HTTP ${response.status}` };
  }
  return {
    done: true,
    result: refused(
      refusal_message(await body_json(response), response.status),
    ),
  };
};

const failure_reason = (error: unknown, timeout_ms: number) => {
  if (!(error instanceof Error)) return "network error";
  return error.name === "TimeoutError"
    ? `timeout after ${timeout_ms} ms`
    : `network error: ${error.message}`;
};

const attempt_once = async (
  request: () => Promise<Response>,
  timeout_ms: number,
): Promise<attempt> => {
  try {
    return await outcome_of(await request());
  } catch (error) {
    return { done: false, reason: failure_reason(error, timeout_ms) };
  }
};

const delay_before_next = (retry_after: number | undefined, attempt: number) =>
  retry_after ?? retry_base_delay_ms * 2 ** (attempt - 1);

export const send_event = async (
  event: server_event,
  config: capture_config,
  overrides: Partial<transport> = {},
): Promise<send_result> => {
  const transport = { ...default_transport, ...overrides };
  const url = `https://graph.facebook.com/${config.graph_version}/${config.dataset_id}/events`;
  const body = JSON.stringify({
    data: [event],
    access_token: config.access_token,
  });
  const request = () =>
    transport.fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      signal: AbortSignal.timeout(transport.attempt_timeout_ms),
    });
  let last_reason = "";
  for (let attempt = 1; attempt <= max_attempts; attempt += 1) {
    const outcome = await attempt_once(request, transport.attempt_timeout_ms);
    if (outcome.done) return outcome.result;
    last_reason = outcome.reason;
    if (attempt === max_attempts) break;
    const delay_ms = delay_before_next(outcome.retry_after_ms, attempt);
    if (delay_ms > max_retry_delay_ms) {
      return unreachable(
        `Meta asked to retry after ${Math.round(delay_ms / 1000)} s, above the ${max_retry_delay_ms / 1000} s budget`,
      );
    }
    await transport.sleep(delay_ms);
  }
  return unreachable(
    `Meta unreachable after ${max_attempts} attempts, last: ${last_reason}`,
  );
};
