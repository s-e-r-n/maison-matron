import "server-only";
import { z } from "zod";
import type { whatsapp_config } from "./config";
import type { send_result } from "./dispatch_result";

export type transport = {
  fetch: typeof fetch;
  attempt_timeout_ms: number;
};

const graph_version = "v25.0";
const sender_phone_number_id = "1340444355816321";
const endpoint = `https://graph.facebook.com/${graph_version}/${sender_phone_number_id}/messages`;
const language_code = "fr_CH";
const live_test_recipient = "41766359652";

const default_transport: transport = {
  fetch: (input, init) => fetch(input, init),
  attempt_timeout_ms: 10_000,
};

const message_schema = z.object({ id: z.string().min(1) });

const accepted_schema = z.object({
  messages: z.tuple([message_schema], message_schema),
});

const error_schema = z.object({
  error: z.object({
    message: z.string(),
    code: z.number().optional(),
    fbtrace_id: z.string().optional(),
  }),
});

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

const blocked = (): send_result => ({
  ok: false,
  code: "blocked",
  message: `outside production a message leaves only with WHATSAPP_LIVE_TEST=1 on the command line and ${live_test_recipient} as recipient`,
});

const send_allowed = (to: string) =>
  process.env.NODE_ENV === "production" ||
  (process.env.WHATSAPP_LIVE_TEST === "1" && to === live_test_recipient);

const message_body = (
  to: string,
  values: string[],
  config: whatsapp_config,
) => ({
  messaging_product: "whatsapp",
  recipient_type: "individual",
  to,
  type: "template",
  template: {
    name: config.template_name,
    language: { code: language_code },
    components: [
      {
        type: "body",
        parameters: values.map((text) => ({ type: "text", text })),
      },
    ],
  },
});

const body_json = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
};

const accepted = (body: unknown): send_result => {
  const parsed = accepted_schema.safeParse(body);
  if (!parsed.success) {
    return refused("Meta answered 200 with an unexpected body");
  }
  return { ok: true, message_id: parsed.data.messages[0].id };
};

const refusal_message = (body: unknown, status: number) => {
  const parsed = error_schema.safeParse(body);
  if (!parsed.success) {
    return `Meta answered HTTP ${status} with an unexpected body`;
  }
  const { message, code, fbtrace_id } = parsed.data.error;
  const details = [
    code !== undefined && `code ${code}`,
    fbtrace_id && `fbtrace ${fbtrace_id}`,
  ]
    .filter(Boolean)
    .join(", ");
  return details
    ? `Meta refused the message: ${message} (${details})`
    : `Meta refused the message: ${message}`;
};

const transient = (status: number) => status === 429 || status >= 500;

const outcome_of = async (response: Response): Promise<send_result> => {
  if (response.ok) return accepted(await body_json(response));
  if (transient(response.status)) {
    return unreachable(`Meta answered HTTP ${response.status}`);
  }
  return refused(refusal_message(await body_json(response), response.status));
};

const failure_reason = (error: unknown, timeout_ms: number) => {
  if (!(error instanceof Error)) return "network error";
  return error.name === "TimeoutError"
    ? `timeout after ${timeout_ms} ms`
    : `network error: ${error.message}`;
};

export const send_template = async (
  to: string,
  values: string[],
  config: whatsapp_config,
  overrides: Partial<transport> = {},
): Promise<send_result> => {
  if (!send_allowed(to)) return blocked();
  const transport = { ...default_transport, ...overrides };
  try {
    const response = await transport.fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message_body(to, values, config)),
      signal: AbortSignal.timeout(transport.attempt_timeout_ms),
    });
    return await outcome_of(response);
  } catch (error) {
    return unreachable(
      `Meta unreachable: ${failure_reason(error, transport.attempt_timeout_ms)}`,
    );
  }
};
