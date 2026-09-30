import "server-only";
import { z } from "zod";
import type { rate_limit_config } from "./config";

export type transport = {
  fetch: typeof fetch;
  timeout_ms: number;
};

export type count_result =
  | { ok: true; count: number }
  | { ok: false; message: string };

export const upstash_timeout_ms = 1_000;

const default_transport: transport = {
  fetch: (input, init) => fetch(input, init),
  timeout_ms: upstash_timeout_ms,
};

const count_schema = z.tuple([z.object({ result: z.int().nonnegative() })]);

const transaction = (key: string, window_seconds: number) => [
  ["INCR", key],
  ["EXPIRE", key, window_seconds, "NX"],
];

const body_json = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
};

const failure_reason = (error: unknown, timeout_ms: number) => {
  if (!(error instanceof Error)) return "network error";
  return error.name === "TimeoutError"
    ? `timeout after ${timeout_ms} ms`
    : `network error: ${error.message}`;
};

const count_of = async (response: Response): Promise<count_result> => {
  const body = await body_json(response);
  if (!response.ok) {
    return { ok: false, message: `Upstash answered HTTP ${response.status}` };
  }
  const parsed = count_schema.safeParse(
    Array.isArray(body) ? body.slice(0, 1) : body,
  );
  return parsed.success
    ? { ok: true, count: parsed.data[0].result }
    : { ok: false, message: "Upstash answered without a count" };
};

export const increment_count = async (
  key: string,
  window_seconds: number,
  config: rate_limit_config,
  overrides: Partial<transport> = {},
): Promise<count_result> => {
  const { fetch: fetch_fn, timeout_ms } = {
    ...default_transport,
    ...overrides,
  };
  try {
    const response = await fetch_fn(`${config.rest_url}/multi-exec`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.rest_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction(key, window_seconds)),
      signal: AbortSignal.timeout(timeout_ms),
    });
    return await count_of(response);
  } catch (error) {
    return {
      ok: false,
      message: `Upstash unreachable: ${failure_reason(error, timeout_ms)}`,
    };
  }
};
