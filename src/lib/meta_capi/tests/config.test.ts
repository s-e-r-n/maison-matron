import { describe, expect, it, vi } from "vitest";
import { parse_config } from "../config";

const complete = {
  META_CAPI_DATASET_ID: "1202835294532393",
  META_CAPI_ACCESS_TOKEN: "token",
  META_CAPI_GRAPH_VERSION: "v25.0",
  META_CAPI_PHONE_COUNTRY: "CH",
};

describe("parse_config", () => {
  it("the flag decides everything: false cuts, absent or true keeps, anything else stays off with a warn", () => {
    expect(parse_config({ META_CAPI_ENABLED: "false" })).toEqual({
      ok: false,
      code: "disabled",
      message: "META_CAPI_ENABLED is false",
    });
    expect(parse_config(complete).ok).toBe(true);
    expect(parse_config({ ...complete, META_CAPI_ENABLED: "true" }).ok).toBe(
      true,
    );
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(
      parse_config({ ...complete, META_CAPI_ENABLED: "yes" }),
    ).toMatchObject({ ok: false, code: "disabled" });
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it("reads the variables, treats a blank optional as absent, names the missing ones without their values", () => {
    expect(parse_config(complete)).toEqual({
      ok: true,
      config: {
        dataset_id: "1202835294532393",
        access_token: "token",
        graph_version: "v25.0",
        phone_country: "ch",
      },
    });
    const blank = parse_config({ ...complete, META_CAPI_PHONE_COUNTRY: "" });
    expect(blank.ok && blank.config.phone_country).toBeUndefined();
    expect(
      parse_config({
        ...complete,
        META_CAPI_ACCESS_TOKEN: "",
        META_CAPI_GRAPH_VERSION: "25.0",
      }),
    ).toEqual({
      ok: false,
      code: "misconfigured",
      message:
        "Invalid or missing environment variables: META_CAPI_ACCESS_TOKEN, META_CAPI_GRAPH_VERSION",
    });
  });
});
