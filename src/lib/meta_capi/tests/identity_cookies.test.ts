import { describe, expect, it } from "vitest";
import {
  identity_cookies_to_mint,
  parse_identity,
  serialize_identity,
} from "../identity_cookies";

const hash = (letter: string) => letter.repeat(64);

const minting = (
  existing: { fbc?: string; fbp?: string; external_id?: string },
  fbclid?: string,
) =>
  identity_cookies_to_mint({
    existing,
    fbclid,
    now_ms: 1_700_000_000_000,
    random_number: () => 42,
    uuid: () => "6f1a2b3c-4d5e-4f60-8a71-92b3c4d5e6f7",
  });

const complete = {
  fbc: "fb.1.1600000000000.IwAR123",
  fbp: "fb.1.1600000000000.7",
  external_id: "6f1a2b3c-4d5e-4f60-8a71-92b3c4d5e6f7",
};

describe("identity_cookies_to_mint", () => {
  it("mints the three cookies on a first landing with a click id", () => {
    expect(minting({}, "IwAR123")).toEqual([
      { name: "_fbp", value: "fb.1.1700000000000.42" },
      { name: "external_id", value: "6f1a2b3c-4d5e-4f60-8a71-92b3c4d5e6f7" },
      { name: "_fbc", value: "fb.1.1700000000000.IwAR123" },
    ]);
  });

  it("replaces _fbc only on another click id and mints nothing otherwise", () => {
    expect(minting(complete, "IwAR123")).toEqual([]);
    expect(minting(complete)).toEqual([]);
    expect(minting(complete, "IwAR999")).toEqual([
      { name: "_fbc", value: "fb.1.1700000000000.IwAR999" },
    ]);
  });
});

describe("meta_identity", () => {
  it("round trips in dictionary order and drops unknown keys and values that are not a sha256", () => {
    const serialized = serialize_identity({
      ph: hash("b"),
      em: hash("a"),
      country: hash("c"),
    });
    expect(serialized).toBe(
      `em=${hash("a")}&ph=${hash("b")}&country=${hash("c")}`,
    );
    expect(parse_identity(serialized)).toEqual({
      em: hash("a"),
      ph: hash("b"),
      country: hash("c"),
    });
    expect(
      parse_identity(`em=${hash("a")}&foo=${hash("b")}&fn=raw%20name`),
    ).toEqual({ em: hash("a") });
    expect(parse_identity(undefined)).toEqual({});
  });
});
