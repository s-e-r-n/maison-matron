import { z } from "zod";

const required = "Ce champ est obligatoire.";

const invalid_phone_number = "Numéro invalide. Exemple : 079 123 45 67";

const separators = /[\s./()-]/g;

const international_call_prefix = /^00/;

const swiss_national = /^0[1-9]\d{8}$/;

const international = /^\+[1-9]\d{6,14}$/;

const filled = z.string({ error: required }).trim().min(1, { error: required });

const dialable = (phone_number: string) =>
  phone_number.replace(separators, "").replace(international_call_prefix, "+");

const valid_phone_number = (phone_number: string) => {
  const dialed = dialable(phone_number);
  return swiss_national.test(dialed) || international.test(dialed);
};

export const phone_number = filled.pipe(
  z.string().refine(valid_phone_number, { error: invalid_phone_number }),
);
