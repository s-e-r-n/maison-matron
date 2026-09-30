import { describe, expect, it } from "vitest";
import { parse_config } from "../config";

const production = {
  NODE_ENV: "production",
  UPSTASH_REDIS_REST_URL: "https://example.upstash.io",
  UPSTASH_REDIS_REST_TOKEN: "SECRET-TOKEN",
};

describe("parse_config", () => {
  it("is off outside production, unconfigured without both Upstash variables, and reads the allowed IPs trimmed, empty entries dropped", () => {
    expect(parse_config({ ...production, NODE_ENV: "test" })).toMatchObject({
      ok: false,
      code: "off",
    });
    expect(
      parse_config({ ...production, UPSTASH_REDIS_REST_TOKEN: "" }),
    ).toMatchObject({ ok: false, code: "unconfigured" });
    expect(parse_config(production)).toEqual({
      ok: true,
      config: {
        rest_url: "https://example.upstash.io",
        rest_token: "SECRET-TOKEN",
        allowed_ips: new Set(),
      },
    });
    const parsed = parse_config({
      ...production,
      RATE_LIMIT_ALLOWED_IPS: " 84.74.114.68, ,2001:db8::1 ",
    });
    expect(parsed.ok && [...parsed.config.allowed_ips]).toEqual([
      "84.74.114.68",
      "2001:db8::1",
    ]);
  });
});
