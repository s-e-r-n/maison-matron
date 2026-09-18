import { describe, expect, it } from "vitest";
import type { dictionary_key } from "../dictionary";
import { form_fields_of } from "../form_fields";

const table: Record<"firstName" | "email" | "freetext", dictionary_key> = {
  firstName: "given-name",
  email: "email",
  freetext: "freetext",
};

describe("form_fields_of", () => {
  it("reads each table key from its dictionary key, trims, drops blanks, files and inputs outside the table", () => {
    const form_data = new FormData();
    form_data.set("given-name", "  Jane ");
    form_data.set("email", "   ");
    form_data.set("tel", "079 123 45 67");
    form_data.set("freetext", new File(["x"], "x.txt"));
    expect(form_fields_of(form_data, table)).toEqual({ firstName: "Jane" });
  });

  it("joins several values of one key with a blank line, in submission order", () => {
    const form_data = new FormData();
    form_data.append("freetext", "first");
    form_data.append("freetext", " ");
    form_data.append("freetext", "second");
    expect(form_fields_of(form_data, table)).toEqual({
      freetext: "first\n\nsecond",
    });
  });
});
