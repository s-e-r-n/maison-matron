import "server-only";
import { z } from "zod";
import type { dictionary_key } from "@/lib/form_contract/dictionary";

export const mail_field_schema = z.enum([
  "given_name",
  "family_name",
  "email",
  "tel",
  "organization",
  "postal_code",
  "locality",
  "message",
]);

export type mail_field = z.infer<typeof mail_field_schema>;

export type mail_fields = Partial<Record<mail_field, string>>;

export const mail_table: Record<mail_field, dictionary_key> = {
  given_name: "given-name",
  family_name: "family-name",
  email: "email",
  tel: "tel",
  organization: "organization",
  postal_code: "postal-code",
  locality: "address-level2",
  message: "freetext",
};

export const copy_labels: Record<mail_field, string> = {
  given_name: "Prénom",
  family_name: "Nom",
  email: "E-mail",
  tel: "Téléphone",
  organization: "Entreprise",
  postal_code: "Code postal",
  locality: "Localité",
  message: "Message",
};

const fallback_sender = "un visiteur";

export const sender_name_of = (fields: mail_fields) =>
  [fields.given_name, fields.family_name].filter(Boolean).join(" ") ||
  fields.email ||
  fallback_sender;
