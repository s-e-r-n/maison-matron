import "server-only";
import { module_enabled } from "./kill_switch";

export type ghl_config = {
  api_token: string;
  location_id: string;
  pipeline_id: string;
  pipeline_stage_id?: string;
  freetext_field_id?: string;
};

type disabled = { ok: false; code: "disabled"; message: string };

export type config_result = { ok: true; config: ghl_config } | disabled;

const non_blank = (value: string | undefined) =>
  value !== undefined && value !== "" ? value : undefined;

export const parse_config = (
  env: Record<string, string | undefined>,
): config_result => {
  if (!module_enabled(env)) {
    return { ok: false, code: "disabled", message: "GHL_ENABLED is false" };
  }
  return {
    ok: true,
    config: {
      api_token: env.GHL_API_TOKEN ?? "",
      location_id: env.GHL_LOCATION_ID ?? "",
      pipeline_id: env.GHL_PIPELINE_ID ?? "",
      pipeline_stage_id: non_blank(env.GHL_PIPELINE_STAGE_ID),
      freetext_field_id: non_blank(env.GHL_FREETEXT_FIELD_ID),
    },
  };
};

export const read_config = () => parse_config(process.env);
