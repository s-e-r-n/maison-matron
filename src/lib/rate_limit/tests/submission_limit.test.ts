import { afterEach, describe, expect, it, vi } from "vitest";
import type { config_result } from "../config";
import { submission_allowed } from "../submission_limit";
import { upstash_timeout_ms } from "../upstash_counter";

const config: config_result = {
  ok: true,
  config: {
    rest_url: "https://example.upstash.io",
    rest_token: "SECRET-TOKEN",
    allowed_ips: new Set(["198.51.100.9"]),
  },
};

const request = { host: "example.ch", ip: "203.0.113.7" };

type call = { url: string; init: RequestInit | undefined };

const counting = () => {
  const calls: call[] = [];
  const fetch_fn: typeof fetch = async (input, init) => {
    calls.push({ url: String(input), init });
    return Response.json([{ result: calls.length }, { result: 1 }]);
  };
  return { calls, fetch: fetch_fn };
};

const failing: typeof fetch = async () => {
  throw new TypeError("fetch failed");
};

const hanging: typeof fetch = (_input, init) =>
  new Promise((_resolve, reject) => {
    init?.signal?.addEventListener("abort", () => reject(init.signal?.reason));
  });

afterEach(() => {
  vi.restoreAllMocks();
});

describe("submission_allowed", () => {
  it("posts INCR then EXPIRE 86400 NX on lead:<host>:<ip> in one transaction with the token, lets twenty submissions through and refuses the twenty-first", async () => {
    const upstash = counting();
    const answers: boolean[] = [];
    for (let i = 0; i < 21; i += 1) {
      answers.push(
        await submission_allowed(request, config, { fetch: upstash.fetch }),
      );
    }
    expect(answers).toEqual([...Array.from({ length: 20 }, () => true), false]);
    const first = upstash.calls[0];
    expect(first?.url).toBe("https://example.upstash.io/multi-exec");
    expect(first?.init?.method).toBe("POST");
    expect(new Headers(first?.init?.headers).get("authorization")).toBe(
      "Bearer SECRET-TOKEN",
    );
    expect(JSON.parse(String(first?.init?.body))).toEqual([
      ["INCR", "lead:example.ch:203.0.113.7"],
      ["EXPIRE", "lead:example.ch:203.0.113.7", 86400, "NX"],
    ]);
  });

  it("never counts an allowed IP, and never calls Upstash while the limit is off", async () => {
    const upstash = counting();
    for (let i = 0; i < 21; i += 1) {
      expect(
        await submission_allowed(
          { host: "example.ch", ip: "198.51.100.9" },
          config,
          {
            fetch: upstash.fetch,
          },
        ),
      ).toBe(true);
    }
    expect(
      await submission_allowed(
        request,
        { ok: false, code: "off", message: "NODE_ENV is not production" },
        { fetch: upstash.fetch },
      ),
    ).toBe(true);
    expect(upstash.calls).toHaveLength(0);
  });

  it("lets the submission through with one warning when Upstash fails, is discarded, or does not answer within the 1 second timeout", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const discarded: typeof fetch = async () =>
      Response.json({ error: "ERR max daily request limit exceeded" });
    expect(await submission_allowed(request, config, { fetch: failing })).toBe(
      true,
    );
    expect(
      await submission_allowed(request, config, { fetch: discarded }),
    ).toBe(true);
    expect(upstash_timeout_ms).toBe(1_000);
    expect(
      await submission_allowed(request, config, {
        fetch: hanging,
        timeout_ms: 0,
      }),
    ).toBe(true);
    expect(warn.mock.calls.map(([line]) => String(line))).toEqual([
      "rate_limit: Upstash unreachable: network error: fetch failed, the submission goes through",
      "rate_limit: Upstash answered without a count, the submission goes through",
      "rate_limit: Upstash unreachable: timeout after 0 ms, the submission goes through",
    ]);
  });
});
