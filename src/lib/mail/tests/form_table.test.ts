import { describe, expect, it } from "vitest";
import { dictionary_key_schema } from "@/lib/form_contract/dictionary";
import { mail_table } from "../form_table";

describe("mail_table", () => {
  it("covers every key of the dictionary, so the copy carries the whole form", () => {
    expect(new Set(Object.values(mail_table))).toEqual(
      new Set(dictionary_key_schema.options),
    );
  });
});
