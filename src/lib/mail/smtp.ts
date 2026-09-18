import "server-only";
import nodemailer, { type SendMailOptions } from "nodemailer";
import { z } from "zod";
import type { mail_config } from "./config";
import type { mail_failure, mail_result } from "./mail_result";
import type { mail_message } from "./messages";

export type mailer = {
  sendMail: (message: SendMailOptions) => Promise<unknown>;
};

export type transport = {
  mailer_of: (config: mail_config) => mailer;
};

const step_timeout_ms = 10_000;

const smtp_mailer = (config: mail_config): mailer =>
  nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.password },
    connectionTimeout: step_timeout_ms,
    greetingTimeout: step_timeout_ms,
    socketTimeout: step_timeout_ms,
    dnsTimeout: step_timeout_ms,
  });

const default_transport: transport = { mailer_of: smtp_mailer };

const sent_schema = z.object({ messageId: z.string().min(1) });

const rejection_schema = z.object({
  message: z.string(),
  code: z.string().optional(),
});

const refusal_codes = new Set([
  "EAUTH",
  "ENOAUTH",
  "EENVELOPE",
  "EMESSAGE",
  "ECONFIG",
  "EMAXRECIPIENTS",
]);

const failure_of = (error: unknown): mail_failure => {
  const parsed = rejection_schema.safeParse(error);
  if (!parsed.success) {
    return {
      ok: false,
      code: "unreachable",
      message: "SMTP failed without an error",
    };
  }
  const { message, code } = parsed.data;
  return {
    ok: false,
    code:
      code !== undefined && refusal_codes.has(code) ? "refused" : "unreachable",
    message: code ? `${code}: ${message}` : message,
  };
};

export const send_message = async (
  message: mail_message,
  config: mail_config,
  overrides: Partial<transport> = {},
): Promise<mail_result> => {
  const { mailer_of } = { ...default_transport, ...overrides };
  try {
    const parsed = sent_schema.safeParse(
      await mailer_of(config).sendMail(message),
    );
    return parsed.success
      ? { ok: true, message_id: parsed.data.messageId }
      : {
          ok: false,
          code: "refused",
          message: "SMTP accepted the message without a message id",
        };
  } catch (error) {
    return failure_of(error);
  }
};
