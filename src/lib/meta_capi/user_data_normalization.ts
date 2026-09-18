import "server-only";
import { calling_code_of } from "./country_calling_codes";
import type { hashed_key } from "./user_data_keys";

const min_phone_digits = 7;
const max_phone_digits = 16;

const lowercase_trimmed = (raw: string) => raw.trim().toLowerCase();

const without_punctuation = (value: string) =>
  value.replace(/[\p{P}\p{S}]/gu, "");

const letters_and_digits_only = (value: string) =>
  value.replace(/[^\p{L}\p{N}]/gu, "");

const normalized_email = (raw: string) => {
  const email = lowercase_trimmed(raw);
  return /^[^\s@]+@[^\s@]+$/.test(email) ? email : "";
};

const normalized_name = (raw: string) =>
  without_punctuation(lowercase_trimmed(raw));

const normalized_city = (raw: string) =>
  letters_and_digits_only(lowercase_trimmed(raw));

const normalized_zip = (raw: string, country?: string) => {
  const compact = lowercase_trimmed(raw).replace(/[\s-]/g, "");
  return country === "us" ? compact.slice(0, 5) : compact;
};

const normalized_country = (raw: string) => {
  const code = lowercase_trimmed(raw);
  return /^[a-z]{2}$/.test(code) ? code : "";
};

const phone_digits = (raw: string) => {
  const compact = raw.trim().replace(/\(0\)/g, "");
  const carries_calling_code = /^(\+|00)/.test(compact);
  const digits = compact.replace(/\D/g, "").replace(/^0+/, "");
  return { digits, carries_calling_code };
};

const normalized_phone = (raw: string, country?: string) => {
  const { digits, carries_calling_code } = phone_digits(raw);
  const calling_code = country ? calling_code_of(country) : undefined;
  const number =
    carries_calling_code || !calling_code ? digits : `${calling_code}${digits}`;
  const plausible =
    number.length >= min_phone_digits && number.length <= max_phone_digits;
  return plausible ? number : "";
};

const normalizers: Record<
  hashed_key,
  (raw: string, country?: string) => string
> = {
  em: normalized_email,
  ph: normalized_phone,
  fn: normalized_name,
  ln: normalized_name,
  ct: normalized_city,
  zp: normalized_zip,
  country: normalized_country,
};

export const normalize_user_data_value = (
  key: hashed_key,
  raw: string,
  country?: string,
) => {
  const value = normalizers[key](raw, country);
  return value.length > 0 ? value : undefined;
};
