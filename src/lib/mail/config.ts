import "server-only";
import { z } from "zod";
import { module_enabled } from "./kill_switch";

export type mail_config = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
  inbox: string;
};

type disabled = { ok: false; code: "disabled"; message: string };

export type config_result = { ok: true; config: mail_config } | disabled;

const implicit_tls_port = 465;

const port_schema = z.coerce.number().int().positive();

const port_of = (raw: string | undefined) => {
  const parsed = port_schema.safeParse(raw);
  return parsed.success ? parsed.data : implicit_tls_port;
};

export const parse_config = (
  env: Record<string, string | undefined>,
): config_result => {
  if (!module_enabled(env)) {
    return { ok: false, code: "disabled", message: "MAIL_ENABLED is false" };
  }
  const port = port_of(env.SMTP_PORT);
  return {
    ok: true,
    config: {
      host: env.SMTP_HOST ?? "",
      port,
      secure: port === implicit_tls_port,
      user: env.SMTP_USER ?? "",
      password: env.SMTP_PASSWORD ?? "",
      from: env.SMTP_FROM ?? "",
      inbox: env.MAIL_INBOX ?? "",
    },
  };
};

export const read_config = () => parse_config(process.env);
