import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { mail_failure } from "./mail_result";

export type confirmation_body = { html: string; text: string };

type body_result = ({ ok: true } & confirmation_body) | mail_failure;

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

const greeted = (template: string, given_name: string | undefined) =>
  given_name
    ? template.replaceAll(given_name_token, () => given_name)
    : template.replaceAll(` ${given_name_token}`, "");

export const read_confirmation_body = async (
  given_name: string | undefined,
): Promise<body_result> => {
  try {
    const [html_template, text_template] = await Promise.all([
      readFile(join(process.cwd(), "mail/confirmation-email.html"), "utf8"),
      readFile(join(process.cwd(), "mail/confirmation-email.txt"), "utf8"),
    ]);
    return {
      ok: true,
      html: greeted(html_template, given_name && escaped_html(given_name)),
      text: greeted(text_template, given_name),
    };
  } catch (error) {
    return { ok: false, code: "unreadable", message: String(error) };
  }
};
