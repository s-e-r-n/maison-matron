import { describe, expect, it, vi } from "vitest";
import type { capture_config } from "../config";
import { build_server_event } from "../event_payload";
import { send_event } from "../graph_api";

const config: capture_config = {
  dataset_id: "1202835294532393",
  access_token: "SECRET-TOKEN",
  graph_version: "v25.0",
};

const event = build_server_event({
  event_name: "Lead",
  event_time_ms: 1_700_000_000_000,
  event_source_url: "https://partner.example/landing",
  user_data: {
    client_ip_address: "203.0.113.7",
    client_user_agent: "Mozilla/5.0",
  },
});

const accepted = () =>
  Response.json(
    { events_received: 1, messages: [], fbtrace_id: "AbCdEf" },
    { status: 200 },
  );

const graph_error =
  (status: number, headers: Record<string, string> = {}) =>
  () =>
    Response.json(
      {
        error: {
          message: "Invalid parameter",
          type: "OAuthException",
          code: 100,
          fbtrace_id: "Trace1",
        },
      },
      { status, headers },
    );

const network_failure = () => {
  throw new TypeError("fetch failed");
};

const sending = (steps: Array<() => Response>, attempt_timeout_ms = 5000) => {
  const calls: Array<{ url: string; init: RequestInit | undefined }> = [];
  const fetch_fn: typeof fetch = async (input, init) => {
    calls.push({ url: String(input), init });
    const step = steps[calls.length - 1];
    if (!step) throw new Error("no more responses");
    return step();
  };
  const sleep = vi.fn(async () => {});
  const result = send_event(event, config, {
    fetch: fetch_fn,
    sleep,
    attempt_timeout_ms,
  });
  return { result, calls, sleep };
};

const body_of = (call: { init: RequestInit | undefined }) =>
  JSON.parse(String(call.init?.body));

describe("send_event", () => {
  it("posts the event once with the token in the body, never in the URL, and returns the acceptance", async () => {
    const { result, calls } = sending([accepted]);
    await expect(result).resolves.toEqual({
      ok: true,
      events_received: 1,
      fbtrace_id: "AbCdEf",
    });
    expect(calls).toHaveLength(1);
    expect(calls[0]?.url).toBe(
      "https://graph.facebook.com/v25.0/1202835294532393/events",
    );
    expect(calls[0]?.init?.method).toBe("POST");
    expect(body_of(calls[0] ?? { init: undefined })).toEqual({
      data: [event],
      access_token: "SECRET-TOKEN",
    });
  });

  it("never retries a refusal and never quotes the token", async () => {
    const { result, calls, sleep } = sending([graph_error(400), accepted]);
    const outcome = await result;
    expect(outcome).toMatchObject({ ok: false, code: "refused" });
    expect(outcome.ok === false && outcome.message).toContain(
      "Invalid parameter",
    );
    expect(outcome.ok === false && outcome.message).not.toContain(
      "SECRET-TOKEN",
    );
    expect(calls).toHaveLength(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it("retries 5xx and 429 with the expected intervals and the same event_id on every attempt", async () => {
    const { result, calls, sleep } = sending([
      graph_error(503),
      graph_error(429, { "retry-after": "3" }),
      accepted,
    ]);
    await expect(result).resolves.toMatchObject({
      ok: true,
      events_received: 1,
    });
    expect(sleep.mock.calls).toEqual([[1000], [3000]]);
    const ids = calls.map((call) => body_of(call).data[0].event_id);
    expect(ids).toEqual([event.event_id, event.event_id, event.event_id]);
  });

  it("gives up as unreachable after three failures, on a timeout, or when Meta asks to wait beyond the budget", async () => {
    const failed = sending([network_failure, network_failure, network_failure]);
    const outcome = await failed.result;
    expect(outcome).toMatchObject({ ok: false, code: "unreachable" });
    expect(outcome.ok === false && outcome.message).not.toContain(
      "SECRET-TOKEN",
    );
    expect(failed.calls).toHaveLength(3);
    expect(failed.sleep.mock.calls).toEqual([[1000], [2000]]);

    const hanging: typeof fetch = (_input, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () =>
          reject(init.signal?.reason),
        );
      });
    const sleep = vi.fn(async () => {});
    const timed_out = await send_event(event, config, {
      fetch: hanging,
      sleep,
      attempt_timeout_ms: 10,
    });
    expect(timed_out).toMatchObject({ ok: false, code: "unreachable" });
    expect(sleep).toHaveBeenCalledTimes(2);

    const budget = sending([
      graph_error(429, { "retry-after": "120" }),
      accepted,
    ]);
    await expect(budget.result).resolves.toMatchObject({
      ok: false,
      code: "unreachable",
    });
    expect(budget.calls).toHaveLength(1);
  });
});
