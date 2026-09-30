import "server-only";
import type { mail_config } from "./config";
import {
  copy_labels,
  type mail_field,
  mail_field_schema,
  type mail_fields,
  sender_name_of,
} from "./form_table";

type mail_sender = string | { name: string; address: string };

export type mail_message = {
  from: mail_sender;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
};

export type lead_fields = mail_fields & { email: string };

const greeting = (given_name: string | undefined) =>
  given_name ? `Bonjour ${given_name},` : "Bonjour,";

export const confirmation_message = (
  fields: lead_fields,
  config: mail_config,
): mail_message => ({
  from: { name: "Maison Matron", address: config.from },
  to: fields.email,
  replyTo: config.inbox,
  subject: "Votre expertise offerte",
  text: [
    greeting(fields.given_name),
    "",
    "Votre demande d’expertise offerte est confirmée.",
    "",
    "Nous vous appelons rapidement (du lundi au vendredi entre 9 h et 17 h).",
    "",
    "Si vous souhaitez discuter tout de suite, composez le +41 21 539 46 75.",
    "",
    "Chaleureuses salutations,",
    "",
    "Maison Matron",
    "+41 21 539 46 75",
    "Route de Gilly 15, 1183 Bursins",
  ].join("\n"),
});

const copy_line = (field: mail_field, fields: mail_fields) =>
  `${copy_labels[field]} : ${fields[field] ?? ""}`;

export const copy_message = (
  fields: mail_fields,
  config: mail_config,
): mail_message => ({
  from: config.from,
  to: config.inbox,
  replyTo: fields.email ?? config.inbox,
  subject: `Nouvelle demande de ${sender_name_of(fields)}`,
  text: mail_field_schema.options
    .map((field) => copy_line(field, fields))
    .join("\n"),
});
