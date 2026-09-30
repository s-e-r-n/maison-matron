import { z } from "zod";

const required = "Ce champ est obligatoire.";

const filled = z.string({ error: required }).trim().min(1, { error: required });

const lead_schema = z.object({
  "given-name": filled,
  "family-name": filled,
  tel: filled,
  email: filled.pipe(
    z.email({ error: "Cette adresse email n'est pas valide." }),
  ),
  "postal-code": filled,
  freetext: filled,
});

type lead_field = keyof z.infer<typeof lead_schema>;

export type lead_errors = Partial<Record<lead_field, string>>;

const parsed_lead = (form_data: FormData) =>
  lead_schema.safeParse(Object.fromEntries(form_data));

export const valid_lead = (form_data: FormData) =>
  parsed_lead(form_data).success;

export const lead_errors_of = (form_data: FormData): lead_errors => {
  const lead = parsed_lead(form_data);
  if (lead.success) return {};
  const { fieldErrors } = z.flattenError(lead.error);
  const errors: lead_errors = {};
  for (const field of lead_schema.keyof().options) {
    errors[field] = fieldErrors[field]?.[0];
  }
  return errors;
};
