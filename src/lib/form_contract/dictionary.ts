import { z } from "zod";

export const dictionary_key_schema = z.enum([
  "given-name",
  "family-name",
  "email",
  "tel",
  "organization",
  "postal-code",
  "address-level2",
  "freetext",
]);

export type dictionary_key = z.infer<typeof dictionary_key_schema>;
