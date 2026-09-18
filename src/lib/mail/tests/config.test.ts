import { describe, expect, it } from "vitest";
import { parse_config } from "../config";

const complete = {
  SMTP_HOST: "mail.infomaniak.com",
  SMTP_PORT: "587",
  SMTP_USER: "user",
  SMTP_PASSWORD: "password",
  SMTP_FROM: "from@example.com",
  MAIL_INBOX: "inbox@example.com",
};

describe("parse_config", () => {
  it("the flag cuts, the port decides the tls mode, an invalid or blank port falls back to 465", () => {
    expect(parse_config({ MAIL_ENABLED: "false" })).toEqual({
      ok: false,
      code: "disabled",
      message: "MAIL_ENABLED is false",
    });
    expect(parse_config(complete)).toEqual({
      ok: true,
      config: {
        host: "mail.infomaniak.com",
        port: 587,
        secure: false,
        user: "user",
        password: "password",
        from: "from@example.com",
        inbox: "inbox@example.com",
      },
    });
    const implicit = parse_config({ ...complete, SMTP_PORT: "465" });
    expect(implicit.ok && implicit.config).toMatchObject({
      port: 465,
      secure: true,
    });
    const blank = parse_config({ ...complete, SMTP_PORT: "" });
    expect(blank.ok && blank.config).toMatchObject({ port: 465, secure: true });
    const invalid = parse_config({ ...complete, SMTP_PORT: "abc" });
    expect(invalid.ok && invalid.config).toMatchObject({
      port: 465,
      secure: true,
    });
  });
});
