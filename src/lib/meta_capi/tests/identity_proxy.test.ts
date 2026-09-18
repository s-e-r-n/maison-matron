import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { identity_proxy } from "../identity_proxy";

const landing = () =>
  new NextRequest("http://localhost:3000/?fbclid=IwAR_test");

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("identity_proxy", () => {
  it("mints the identity cookies when enabled and touches nothing when disabled", () => {
    vi.stubEnv("META_CAPI_ENABLED", "true");
    expect(
      identity_proxy(landing())
        .cookies.getAll()
        .map((cookie) => cookie.name),
    ).toEqual(["_fbp", "external_id", "_fbc"]);
    vi.stubEnv("META_CAPI_ENABLED", "false");
    const response = identity_proxy(landing());
    expect(response.cookies.getAll()).toEqual([]);
    expect(
      response.headers.get("x-middleware-request-x-meta-capi-url"),
    ).toBeNull();
  });
});
