import "server-only";
import { z } from "zod";
import type { dispatch_failure } from "./dispatch_result";
import { module_enabled } from "./kill_switch";

const env_schema = z.object({
  WHATSAPP_BUSINESS_TOKEN: z.string().min(1),
  WHATSAPP_MODEL: z.string().regex(/^[a-z0-9_]{1,512}$/),
  WHATSAPP_DISPATCH_NUMBER_1: z.string().min(1).optional(),
  WHATSAPP_DISPATCH_NUMBER_2: z.string().min(1).optional(),
});

export type whatsapp_config = {
  access_token: string;
  template_name: string;
  recipients: [string, ...string[]];
};

export type config_result =
  | { ok: true; config: whatsapp_config }
  | dispatch_failure;

const without_blank_values = (env: Record<string, string | undefined>) =>
  Object.fromEntries(
    Object.entries(env).filter(
      ([, value]) => value !== undefined && value !== "",
    ),
  );

const misconfigured = (names: string): dispatch_failure => ({
  ok: false,
  code: "misconfigured",
  message: `Invalid or missing environment variables: ${names}`,
});

const at_least_one = <T>(list: T[]): list is [T, ...T[]] => list.length > 0;

export const parse_config = (
  env: Record<string, string | undefined>,
): config_result => {
  if (!module_enabled(env)) {
    return {
      ok: false,
      code: "disabled",
      message: "WHATSAPP_ENABLED is false",
    };
  }
  const parsed = env_schema.safeParse(without_blank_values(env));
  if (!parsed.success) {
    return misconfigured(
      parsed.error.issues.map((issue) => issue.path.join(".")).join(", "),
    );
  }
  const recipients = [
    parsed.data.WHATSAPP_DISPATCH_NUMBER_1,
    parsed.data.WHATSAPP_DISPATCH_NUMBER_2,
  ].filter((number): number is string => number !== undefined);
  if (!at_least_one(recipients)) {
    return misconfigured(
      "WHATSAPP_DISPATCH_NUMBER_1, WHATSAPP_DISPATCH_NUMBER_2",
    );
  }
  return {
    ok: true,
    config: {
      access_token: parsed.data.WHATSAPP_BUSINESS_TOKEN,
      template_name: parsed.data.WHATSAPP_MODEL,
      recipients,
    },
  };
};

export const read_config = () => parse_config(process.env);
