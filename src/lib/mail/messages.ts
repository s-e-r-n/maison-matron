import "server-only";
import type { mail_config } from "./config";
import {
  copy_labels,
  type mail_field,
  mail_field_schema,
  type mail_fields,
  sender_name_of,
} from "./form_table";

export type mail_message = {
  from: string;
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
  from: config.from,
  to: fields.email,
  replyTo: config.inbox,
  subject: "Votre demande est bien reçue",
  text: [
    greeting(fields.given_name),
    "",
    "Nous avons bien reçu votre demande et nous revenons vers vous rapidement.",
    "",
    "Vous pouvez répondre directement à ce message pour la compléter.",
    "",
    "À très vite,",
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
