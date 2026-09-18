import "server-only";
import { z } from "zod";
import { module_enabled } from "./kill_switch";

const env_schema = z.object({
  META_CAPI_DATASET_ID: z.string().regex(/^\d+$/),
  META_CAPI_ACCESS_TOKEN: z.string().min(1),
  META_CAPI_GRAPH_VERSION: z.string().regex(/^v\d+\.\d+$/),
  META_CAPI_PHONE_COUNTRY: z
    .string()
    .regex(/^[a-z]{2}$/i)
    .optional(),
});

export type capture_config = {
  dataset_id: string;
  access_token: string;
  graph_version: string;
  phone_country?: string;
};

type misconfigured = { ok: false; code: "misconfigured"; message: string };

type disabled = { ok: false; code: "disabled"; message: string };

export type config_result =
  | { ok: true; config: capture_config }
  | misconfigured
  | disabled;

const without_blank_values = (env: Record<string, string | undefined>) =>
  Object.fromEntries(
    Object.entries(env).filter(
      ([, value]) => value !== undefined && value !== "",
    ),
  );

export const parse_config = (
  env: Record<string, string | undefined>,
): config_result => {
  if (!module_enabled(env)) {
    return {
      ok: false,
      code: "disabled",
      message: "META_CAPI_ENABLED is false",
    };
  }
  const parsed = env_schema.safeParse(without_blank_values(env));
  if (!parsed.success) {
    const names = parsed.error.issues
      .map((issue) => issue.path.join("."))
      .join(", ");
    return {
      ok: false,
      code: "misconfigured",
      message: `Invalid or missing environment variables: ${names}`,
    };
  }
  return {
    ok: true,
    config: {
      dataset_id: parsed.data.META_CAPI_DATASET_ID,
      access_token: parsed.data.META_CAPI_ACCESS_TOKEN,
      graph_version: parsed.data.META_CAPI_GRAPH_VERSION,
      phone_country: parsed.data.META_CAPI_PHONE_COUNTRY?.toLowerCase(),
    },
  };
};

export const read_config = () => parse_config(process.env);
