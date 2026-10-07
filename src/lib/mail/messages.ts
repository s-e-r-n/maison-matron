import "server-only";
import type { mail_config } from "./config";
import type { confirmation_body } from "./confirmation_body";
import { copy_lines, type mail_fields } from "./form_table";

type mail_sender = string | { name: string; address: string };

export type mail_message = {
  from: mail_sender;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html?: string;
};

export type lead_fields = mail_fields & { email: string };

export const confirmation_message = (
  fields: lead_fields,
  body: confirmation_body,
  config: mail_config,
): mail_message => ({
  from: { name: "Maison Matron", address: config.from },
  to: fields.email,
  replyTo: config.inbox,
  subject: "Votre expertise offerte",
  text: body.text,
  html: body.html,
});

export const copy_message = (
  fields: mail_fields,
  form_id: string,
  config: mail_config,
): mail_message => ({
  from: config.from,
  to: config.inbox,
  replyTo: fields.email ?? config.inbox,
  subject: "Nouvelle demande",
  text: [
    ...copy_lines.map(
      ({ field, label }) => `${label} : ${fields[field] ?? ""}`,
    ),
    `Page : ${form_id}`,
    "Ne pas répondre à ce message",
    "Campagne Maison Matron",
  ].join("\n\n"),
});
