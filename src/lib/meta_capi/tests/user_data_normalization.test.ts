import { describe, expect, it } from "vitest";
import { normalize_user_data_value } from "../user_data_normalization";

describe("normalize_user_data_value", () => {
  it("em: lowercases and trims, drops a non-email", () => {
    expect(normalize_user_data_value("em", "  Foo@Example.COM ")).toBe(
      "foo@example.com",
    );
    expect(normalize_user_data_value("em", "not an email")).toBeUndefined();
  });

  it("ph: digits only, calling code of the country, own code kept, implausible dropped", () => {
    expect(normalize_user_data_value("ph", "079 123 45 67", "ch")).toBe(
      "41791234567",
    );
    expect(normalize_user_data_value("ph", "+41 (0)79 123 45 67", "ch")).toBe(
      "41791234567",
    );
    expect(normalize_user_data_value("ph", "0041 79 123 45 67", "ch")).toBe(
      "41791234567",
    );
    expect(normalize_user_data_value("ph", "+33 6 12 34 56 78", "ch")).toBe(
      "33612345678",
    );
    expect(normalize_user_data_value("ph", "079 123 45 67")).toBe("791234567");
    expect(normalize_user_data_value("ph", "1234", "ch")).toBeUndefined();
  });

  it("fn: lowercase, no punctuation, accents kept", () => {
    expect(normalize_user_data_value("fn", " Jean-Pierre ")).toBe("jeanpierre");
    expect(normalize_user_data_value("fn", "Émilie")).toBe("émilie");
  });

  it("ln: same rule as fn", () => {
    expect(normalize_user_data_value("ln", "O'Brien")).toBe("obrien");
    expect(normalize_user_data_value("ln", "Müller")).toBe("müller");
  });

  it("ct: no punctuation, no symbols, no spaces", () => {
    expect(normalize_user_data_value("ct", "La Chaux-de-Fonds")).toBe(
      "lachauxdefonds",
    );
    expect(normalize_user_data_value("ct", "Genève")).toBe("genève");
    expect(normalize_user_data_value("ct", "St. Gallen")).toBe("stgallen");
  });

  it("zp: lowercase, no spaces or dashes, five digits in the US", () => {
    expect(normalize_user_data_value("zp", "SW1A 1AA", "gb")).toBe("sw1a1aa");
    expect(normalize_user_data_value("zp", "12345-6789", "us")).toBe("12345");
    expect(normalize_user_data_value("zp", "12345-6789", "ch")).toBe(
      "123456789",
    );
  });

  it("country: two letters or nothing", () => {
    expect(normalize_user_data_value("country", "CH")).toBe("ch");
    expect(normalize_user_data_value("country", "Switzerland")).toBeUndefined();
  });
});
