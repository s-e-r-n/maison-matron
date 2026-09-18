import "server-only";
import type { dictionary_key } from "@/lib/form_contract/dictionary";

export type contact_field =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "companyName"
  | "postalCode"
  | "city"
  | "freetext";

export type contact_fields = Partial<Record<contact_field, string>>;

export const contact_table: Record<contact_field, dictionary_key> = {
  firstName: "given-name",
  lastName: "family-name",
  email: "email",
  phone: "tel",
  companyName: "organization",
  postalCode: "postal-code",
  city: "address-level2",
  freetext: "freetext",
};

const fallback_name = "Lead";

export const opportunity_name_of = (fields: contact_fields) =>
  [fields.firstName, fields.lastName].filter(Boolean).join(" ") ||
  fields.email ||
  fields.phone ||
  fallback_name;
