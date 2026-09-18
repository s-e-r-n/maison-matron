import { describe, expect, it } from "vitest";
import { request_context_from } from "../request_context";

const now_ms = 1_700_000_000_000;
const external_id = "6f1a2b3c-4d5e-4f60-8a71-92b3c4d5e6f7";
const hash = "a".repeat(64);

const context_of = (
  headers: Record<string, string>,
  cookies: Record<string, string> = {},
) =>
  request_context_from({
    headers: new Headers(headers),
    cookie: (name) => cookies[name],
    now_ms,
  });

describe("request_context_from", () => {
  it("reads every identifier the request carries and builds fbc from a newer click id", () => {
    const context = context_of(
      {
        "x-forwarded-for": "203.0.113.7, 10.0.0.1",
        "user-agent": "Mozilla/5.0",
        "x-vercel-ip-country": "CH",
        "x-meta-capi-url": "https://partner.example/landing?x=1",
        referer: "https://www.facebook.com/",
      },
      {
        _fbc: "fb.1.1600000000000.IwAR123",
        _fbp: "fb.1.1600000000000.42",
        external_id,
        meta_identity: `em=${hash}`,
      },
    );
    expect(context).toEqual({
      now_ms,
      client_ip_address: "203.0.113.7",
      client_user_agent: "Mozilla/5.0",
      country: "ch",
      event_source_url: "https://partner.example/landing?x=1",
      referrer_url: "https://www.facebook.com/",
      external_id,
      fbc: "fb.1.1600000000000.IwAR123",
      fbp: "fb.1.1600000000000.42",
      stored_identity: { em: hash },
    });
    const with_click = {
      "x-meta-capi-url": "https://partner.example/?fbclid=IwAR999",
    };
    expect(context_of(with_click).fbc).toBe("fb.1.1700000000000.IwAR999");
    expect(
      context_of(with_click, { _fbc: "fb.1.1600000000000.IwAR123" }).fbc,
    ).toBe("fb.1.1700000000000.IwAR999");
    expect(
      context_of(with_click, { _fbc: "fb.1.1600000000000.IwAR999" }).fbc,
    ).toBe("fb.1.1600000000000.IwAR999");
  });

  it("drops what is malformed instead of sending it, and unwraps an IPv4 mapped address", () => {
    const context = context_of(
      {
        "x-forwarded-for": "not an ip",
        "x-vercel-ip-country": "Switzerland",
        "x-meta-capi-url": "/relative",
        referer: "garbage",
      },
      {
        _fbc: "nope",
        _fbp: "fb.1.x.y",
        external_id: "not-a-uuid",
        meta_identity: "em=raw",
      },
    );
    expect(context).toEqual({ now_ms, stored_identity: {} });
    expect(
      context_of({ "x-forwarded-for": "::ffff:127.0.0.1" }).client_ip_address,
    ).toBe("127.0.0.1");
  });
});
