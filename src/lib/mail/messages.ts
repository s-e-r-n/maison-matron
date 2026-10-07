import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { mail_config } from "./config";
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

const html_confirmation_text = (given_name: string | undefined) =>
  [
    "Bienvenue chez Maison Matron.",
    "",
    greeting(given_name),
    "",
    "Votre demande d’expertise offerte est confirmée.",
    "",
    "Nous vous appellerons très vite.",
    "",
    "Si vous souhaitez que l’on vous réponde plus précisément, vous pouvez joindre une photo de votre meuble en réponse à cet email.",
    "",
    "Si vous préférez discuter tout de suite\u00a0:",
    "",
    "+41 21 539 46 75",
    "",
    "Chaleureuses salutations,",
    "",
    "Maison Matron",
    "+41 21 539 46 75",
    "Route de Gilly 15, 1183 Bursins",
    "",
    "Suivez-nous sur instagram.com/maisonmatron",
    "maison-matron.ch",
  ].join("\n");

const confirmation_email_path = join(
  process.cwd(),
  "src/lib/mail/confirmation-email.html",
);

const given_name_token = "{{prénom}}";

const html_entities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const escaped_html = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) => html_entities[character] ?? character,
  );

const greeted_html = (template: string, given_name: string | undefined) =>
  given_name
    ? template.replaceAll(given_name_token, () => escaped_html(given_name))
    : template.replaceAll(` ${given_name_token}`, "");

const confirmation_html = async (given_name: string | undefined) => {
  try {
    const template = await readFile(confirmation_email_path, "utf8");
    return greeted_html(template, given_name);
  } catch (error) {
    console.warn(
      `mail: confirmation template unreadable, sent as text only: ${String(error)}`,
    );
    return undefined;
  }
};

export const html_confirmation_message = async (
  fields: lead_fields,
  config: mail_config,
): Promise<mail_message> => ({
  from: { name: "Maison Matron", address: config.from },
  to: fields.email,
  replyTo: config.inbox,
  subject: "Votre expertise offerte",
  text: html_confirmation_text(fields.given_name),
  html: await confirmation_html(fields.given_name),
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
