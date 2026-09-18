import { describe, expect, it } from "vitest";
import { dictionary_key_schema } from "@/lib/form_contract/dictionary";
import { mail_table, sender_name_of } from "../form_table";

describe("mail_table", () => {
  it("covers every key of the dictionary, so the copy carries the whole form", () => {
    expect(new Set(Object.values(mail_table))).toEqual(
      new Set(dictionary_key_schema.options),
    );
  });
});

describe("sender_name_of", () => {
  it("names the sender from the name fields, else the email, else a visitor", () => {
    expect(sender_name_of({ given_name: "Jane", family_name: "Doe" })).toBe(
      "Jane Doe",
    );
    expect(sender_name_of({ family_name: "Doe" })).toBe("Doe");
    expect(sender_name_of({ email: "jane@example.com" })).toBe(
      "jane@example.com",
    );
    expect(sender_name_of({})).toBe("un visiteur");
  });
});
