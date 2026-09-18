import "server-only";
import { z } from "zod";
import type { ghl_config } from "./config";
import type { delivery_failure } from "./delivery_result";
import type { contact_payload, opportunity_payload } from "./payloads";

export type transport = {
  fetch: typeof fetch;
  timeout_ms: number;
};

export type contact_result =
  | { ok: true; contact_id: string }
  | delivery_failure;

export type opportunity_result =
  | { ok: true; opportunity_id: string }
  | delivery_failure;

const base_url = "https://services.leadconnectorhq.com";
const api_version = "v3";

const default_transport: transport = {
  fetch: (input, init) => fetch(input, init),
  timeout_ms: 10_000,
};

const upsert_response_schema = z.object({
  contact: z.object({ id: z.string().min(1) }),
});

const opportunity_response_schema = z.object({
  opportunity: z.object({ id: z.string().min(1) }),
});

const error_schema = z.object({
  message: z.union([z.string(), z.array(z.string())]),
});

type post_outcome = { ok: true; body: unknown } | delivery_failure;

const refused = (message: string): delivery_failure => ({
  ok: false,
  code: "refused",
  message,
});

const unreachable = (message: string): delivery_failure => ({
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

const refusal_message = (body: unknown, status: number, operation: string) => {
  const parsed = error_schema.safeParse(body);
  const detail = parsed.success
    ? [parsed.data.message].flat().join(", ")
    : "an unexpected body";
  return `GHL refused the ${operation}: HTTP ${status}, ${detail}`;
};

const transient = (status: number) => status === 429 || status >= 500;

const outcome_of = async (
  response: Response,
  operation: string,
): Promise<post_outcome> => {
  if (response.ok) return { ok: true, body: await body_json(response) };
  if (transient(response.status)) {
    return unreachable(
      `GHL answered HTTP ${response.status} to the ${operation}`,
    );
  }
  return refused(
    refusal_message(await body_json(response), response.status, operation),
  );
};

const failure_reason = (error: unknown, timeout_ms: number) => {
  if (!(error instanceof Error)) return "network error";
  return error.name === "TimeoutError"
    ? `timeout after ${timeout_ms} ms`
    : `network error: ${error.message}`;
};

const post_json = async (
  path: string,
  payload: contact_payload | opportunity_payload,
  config: ghl_config,
  transport: transport,
  operation: string,
): Promise<post_outcome> => {
  try {
    const response = await transport.fetch(`${base_url}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.api_token}`,
        Version: api_version,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(transport.timeout_ms),
    });
    return await outcome_of(response, operation);
  } catch (error) {
    return unreachable(
      `GHL unreachable for the ${operation}: ${failure_reason(error, transport.timeout_ms)}`,
    );
  }
};

export const upsert_contact = async (
  payload: contact_payload,
  config: ghl_config,
  overrides: Partial<transport> = {},
): Promise<contact_result> => {
  const outcome = await post_json(
    "/contacts/upsert",
    payload,
    config,
    { ...default_transport, ...overrides },
    "contact upsert",
  );
  if (!outcome.ok) return outcome;
  const parsed = upsert_response_schema.safeParse(outcome.body);
  return parsed.success
    ? { ok: true, contact_id: parsed.data.contact.id }
    : refused("GHL answered the contact upsert with an unexpected body");
};

export const create_opportunity = async (
  payload: opportunity_payload,
  config: ghl_config,
  overrides: Partial<transport> = {},
): Promise<opportunity_result> => {
  const outcome = await post_json(
    "/opportunities/",
    payload,
    config,
    { ...default_transport, ...overrides },
    "opportunity creation",
  );
  if (!outcome.ok) return outcome;
  const parsed = opportunity_response_schema.safeParse(outcome.body);
  return parsed.success
    ? { ok: true, opportunity_id: parsed.data.opportunity.id }
    : refused("GHL answered the opportunity creation with an unexpected body");
};
