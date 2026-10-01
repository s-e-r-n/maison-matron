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

export const copy_lines: ReadonlyArray<{ field: mail_field; label: string }> = [
  { field: "given_name", label: "Prénom" },
  { field: "family_name", label: "Nom" },
  { field: "tel", label: "Téléphone" },
  { field: "email", label: "Email" },
  { field: "postal_code", label: "Code postal" },
  { field: "message", label: "Besoin" },
];
