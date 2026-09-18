import type { SMTPTransportOptions } from "nodemailer";
import { describe, expect, it, vi } from "vitest";
import type { mail_config } from "../config";
import type { mail_message } from "../messages";
import { type mailer, send_message } from "../smtp";

const created: SMTPTransportOptions[] = [];

vi.mock("nodemailer", () => ({
  default: {
    createTransport: (options: SMTPTransportOptions) => {
      created.push(options);
      return { sendMail: async () => ({ messageId: "<default@partner>" }) };
    },
  },
}));

const config: mail_config = {
  host: "mail.infomaniak.com",
  port: 465,
  secure: true,
  user: "info@partner.example",
  password: "SECRET-PASSWORD",
  from: "Partner <info@partner.example>",
  inbox: "info@partner.example",
};

const message: mail_message = {
  from: config.from,
  to: "jane@example.com",
  replyTo: config.inbox,
  subject: "Votre demande est bien reçue",
  text: "Bonjour Jane,",
};

const through = (send: mailer["sendMail"]) =>
  send_message(message, config, { mailer_of: () => ({ sendMail: send }) });

const smtp_error = (text: string, code?: string) =>
  Object.assign(new Error(text), { code });

describe("send_message", () => {
  it("opens the SMTP transport with the configuration and 10 s on every step, one transport per send", async () => {
    await expect(send_message(message, config)).resolves.toEqual({
      ok: true,
      message_id: "<default@partner>",
    });
    expect(created).toEqual([
      {
        host: "mail.infomaniak.com",
        port: 465,
        secure: true,
        auth: { user: "info@partner.example", pass: "SECRET-PASSWORD" },
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 10_000,
        dnsTimeout: 10_000,
      },
    ]);
  });

  it("hands nodemailer the message as-is and answers with the message id", async () => {
    const send = vi.fn(async () => ({
      messageId: "<m1@partner>",
      accepted: ["jane@example.com"],
      rejected: [],
    }));
    await expect(through(send)).resolves.toEqual({
      ok: true,
      message_id: "<m1@partner>",
    });
    expect(send).toHaveBeenCalledExactlyOnceWith(message);
    await expect(through(async () => ({}))).resolves.toMatchObject({
      ok: false,
      code: "refused",
    });
  });

  it("refuses an authentication, envelope or message error, reports anything else as unreachable, never quotes the password", async () => {
    const refused = [
      smtp_error("Invalid login: 535 5.7.8 Authentication failed", "EAUTH"),
      smtp_error("No recipients defined", "EENVELOPE"),
      smtp_error("Message failed: 552 size exceeded", "EMESSAGE"),
    ];
    for (const error of refused) {
      const result = await through(async () => {
        throw error;
      });
      expect(result).toMatchObject({ ok: false, code: "refused" });
      expect(result.ok === false && result.message).toContain(error.message);
      expect(result.ok === false && result.message).not.toContain(
        "SECRET-PASSWORD",
      );
    }
    const unreachable = [
      smtp_error("Connection timeout", "ETIMEDOUT"),
      smtp_error("Connection closed unexpectedly", "ECONNECTION"),
      smtp_error("getaddrinfo ENOTFOUND", "EDNS"),
      smtp_error("Unexpected socket close"),
    ];
    for (const error of unreachable) {
      await expect(
        through(async () => {
          throw error;
        }),
      ).resolves.toMatchObject({ ok: false, code: "unreachable" });
    }
    await expect(
      through(async () => {
        throw "not an error";
      }),
    ).resolves.toEqual({
      ok: false,
      code: "unreachable",
      message: "SMTP failed without an error",
    });
  });
});
