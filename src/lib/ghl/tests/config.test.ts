import { describe, expect, it } from "vitest";
import { parse_config } from "../config";

const complete = {
  GHL_API_TOKEN: "token",
  GHL_LOCATION_ID: "location",
  GHL_PIPELINE_ID: "pipeline",
  GHL_PIPELINE_STAGE_ID: "stage",
  GHL_FREETEXT_FIELD_ID: "field",
};

describe("parse_config", () => {
  it("the flag cuts, a complete env maps every field, a blank optional is absent and a blank token is kept as is", () => {
    expect(parse_config({ GHL_ENABLED: "false" })).toEqual({
      ok: false,
      code: "disabled",
      message: "GHL_ENABLED is false",
    });
    expect(parse_config(complete)).toEqual({
      ok: true,
      config: {
        api_token: "token",
        location_id: "location",
        pipeline_id: "pipeline",
        pipeline_stage_id: "stage",
        freetext_field_id: "field",
      },
    });
    const blank = parse_config({
      ...complete,
      GHL_API_TOKEN: "",
      GHL_PIPELINE_STAGE_ID: "",
      GHL_FREETEXT_FIELD_ID: "",
    });
    expect(blank.ok && blank.config.pipeline_stage_id).toBeUndefined();
    expect(blank.ok && blank.config.freetext_field_id).toBeUndefined();
    expect(blank.ok && blank.config.api_token).toBe("");
  });
});
