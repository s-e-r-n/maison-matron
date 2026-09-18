import { beforeEach, describe, expect, it, vi } from "vitest";
import type { mail_config } from "../config";
import type { mail_result } from "../mail_result";
import type { mail_message } from "../messages";

const deferred: Array<() => Promise<void>> = [];
const send_message =
  vi.fn<(message: mail_message, config: mail_config) => Promise<mail_result>>();
const read_config = vi.fn();

vi.mock("next/server", () => ({
  after: (task: () => Promise<void>) => {
    deferred.push(task);
  },
}));
vi.mock("../smtp", () => ({
  send_message: (message: mail_message, config: mail_config) =>
    send_message(message, config),
}));
vi.mock("../config", () => ({ read_config: () => read_config() }));

const { send_confirmation } = await import("../send");

const config: mail_config = {
  host: "mail.infomaniak.com",
  port: 465,
  secure: true,
  user: "info@partner.example",
  password: "SECRET-PASSWORD",
  from: "Partner <info@partner.example>",
  inbox: "info@partner.example",
};

const submission = () => {
  const form_data = new FormData();
  form_data.set("given-name", "Jane");
  form_data.set("family-name", "Doe");
  form_data.set("email", "jane@example.com");
  form_data.set("tel", "079 123 45 67");
  form_data.set("organization", "Acme");
  form_data.set("postal-code", "1204");
  form_data.set("address-level2", "Genève");
  form_data.set("freetext", "Hello there");
  return form_data;
};

const run_deferred = async () => {
  for (const task of deferred.splice(0)) await task();
};

beforeEach(() => {
  vi.clearAllMocks();
  deferred.length = 0;
  read_config.mockReturnValue({ ok: true, config });
  send_message.mockResolvedValue({ ok: true, message_id: "<m1@partner>" });
});

describe("send_confirmation", () => {
  it("returns disabled and defers nothing when the module is off", async () => {
    const disabled = {
      ok: false,
      code: "disabled",
      message: "MAIL_ENABLED is false",
    };
    read_config.mockReturnValue(disabled);
    await expect(send_confirmation(submission())).resolves.toEqual(disabled);
    expect(send_message).not.toHaveBeenCalled();
    expect(deferred).toHaveLength(0);
  });

  it("awaits the transactional mail to the lead and defers the copy of the whole form to the inbox", async () => {
    await expect(send_confirmation(submission())).resolves.toEqual({
      ok: true,
      message_id: "<m1@partner>",
    });
    expect(send_message).toHaveBeenCalledTimes(1);
    const [transactional] = send_message.mock.calls[0] ?? [];
    expect(transactional).toMatchObject({
      from: config.from,
      to: "jane@example.com",
      replyTo: config.inbox,
    });
    expect(transactional?.text).toContain("Bonjour Jane");
    expect(deferred).toHaveLength(1);
    await run_deferred();
    expect(send_message).toHaveBeenCalledTimes(2);
    const [copy] = send_message.mock.calls[1] ?? [];
    expect(copy).toMatchObject({
      from: config.from,
      to: config.inbox,
      replyTo: "jane@example.com",
      subject: "Nouvelle demande de Jane Doe",
    });
    expect(copy?.text).toBe(
      [
        "Prénom : Jane",
        "Nom : Doe",
        "E-mail : jane@example.com",
        "Téléphone : 079 123 45 67",
        "Entreprise : Acme",
        "Code postal : 1204",
        "Localité : Genève",
        "Message : Hello there",
      ].join("\n"),
    );
  });

  it("refuses a submission without email before any SMTP call, and still defers the copy", async () => {
    const form_data = new FormData();
    form_data.set("tel", "079 123 45 67");
    await expect(send_confirmation(form_data)).resolves.toMatchObject({
      ok: false,
      code: "refused",
    });
    expect(send_message).not.toHaveBeenCalled();
    expect(deferred).toHaveLength(1);
    await run_deferred();
    const [copy] = send_message.mock.calls[0] ?? [];
    expect(copy).toMatchObject({ to: config.inbox, replyTo: config.inbox });
    expect(copy?.text).toContain("Téléphone : 079 123 45 67");
    expect(copy?.text).toContain("E-mail : \n");
  });

  it("returns the transactional failure, warns for each failed mail, and the deferred copy never rejects", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    send_message.mockResolvedValue({
      ok: false,
      code: "unreachable",
      message: "ETIMEDOUT: Connection timeout",
    });
    await expect(send_confirmation(submission())).resolves.toEqual({
      ok: false,
      code: "unreachable",
      message: "ETIMEDOUT: Connection timeout",
    });
    await expect(run_deferred()).resolves.toBeUndefined();
    expect(warn.mock.calls).toEqual([
      ["mail: confirmation unreachable: ETIMEDOUT: Connection timeout"],
      ["mail: copy unreachable: ETIMEDOUT: Connection timeout"],
    ]);
    warn.mockRestore();
  });
});
