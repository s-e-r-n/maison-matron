import { describe, expect, it } from "vitest";
import { form_fields_of } from "@/lib/form_contract/form_fields";
import { sha256_hex } from "../sha256";
import { build_user_data } from "../user_data";
import { form_table } from "../user_data_keys";

const request = {
  country: "ch",
  external_id: "6f1a2b3c-4d5e-4f60-8a71-92b3c4d5e6f7",
  client_ip_address: "203.0.113.7",
  client_user_agent: "Mozilla/5.0",
  fbc: "fb.1.1700000000000.IwAR123",
  fbp: "fb.1.1700000000000.42",
};

describe("build_user_data", () => {
  it("hashes the normalized form values read through the table, keeps the request values clear, ignores unknown names", () => {
    const form_data = new FormData();
    form_data.set("email", " Foo@Example.com ");
    form_data.set("tel", "06 12 34 56 78");
    form_data.set("address-level2", "La Chaux-de-Fonds");
    form_data.set("freetext", "not a Meta key");
    form_data.set("newsletter", "on");
    const { user_data, identity } = build_user_data({
      form_fields: form_fields_of(form_data, form_table),
      phone_country: "fr",
      stored_identity: {},
      ...request,
    });
    const hashed = {
      em: sha256_hex("foo@example.com"),
      ph: sha256_hex("33612345678"),
      ct: sha256_hex("lachauxdefonds"),
      country: sha256_hex("ch"),
    };
    expect(user_data).toEqual({ ...request, ...hashed });
    expect(identity).toEqual(hashed);
  });

  it("merges the stored identity, the fresh value wins, never an empty value", () => {
    const stored = {
      em: sha256_hex("old@example.com"),
      fn: sha256_hex("jean"),
    };
    const { user_data, identity } = build_user_data({
      form_fields: { em: "new@example.com" },
      stored_identity: stored,
      ...request,
    });
    expect(identity).toEqual({
      em: sha256_hex("new@example.com"),
      fn: sha256_hex("jean"),
      country: sha256_hex("ch"),
    });
    expect(user_data.em).toBe(sha256_hex("new@example.com"));
    const empty = build_user_data({
      form_fields: { em: "not an email" },
      stored_identity: {},
      client_ip_address: "203.0.113.7",
    });
    expect(empty.user_data).toEqual({ client_ip_address: "203.0.113.7" });
    expect(empty.identity).toEqual({});
  });
});
