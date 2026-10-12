import { z } from "zod";

const required = "Ce champ est obligatoire.";

const invalid_phone_number = "Numéro invalide. Exemple : +41 79 123 45 67";

const letter = /\p{L}/u;

const filled = z.string({ error: required }).trim().min(1, { error: required });

export const phone_number = filled.pipe(
  z.string().refine((phone_number) => !letter.test(phone_number), {
    error: invalid_phone_number,
  }),
);
