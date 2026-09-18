import { describe, expect, it } from "vitest";
import type { ghl_config } from "../config";
import { opportunity_name_of } from "../form_table";
import { contact_payload_of, opportunity_payload_of } from "../payloads";

const config: ghl_config = {
  api_token: "t",
  location_id: "loc_1",
  pipeline_id: "pipe_1",
};

describe("contact_payload_of", () => {
  it("carries the location and the fields, the free text as a custom field only with a field id", () => {
    const fields = {
      firstName: "Jane",
      email: "jane@example.com",
      freetext: "Hi",
    };
    expect(
      JSON.parse(JSON.stringify(contact_payload_of(fields, config))),
    ).toEqual({
      locationId: "loc_1",
      firstName: "Jane",
      email: "jane@example.com",
    });
    expect(
      contact_payload_of(fields, { ...config, freetext_field_id: "field_1" })
        .customFields,
    ).toEqual([{ id: "field_1", fieldValue: "Hi" }]);
  });
});

describe("opportunity_payload_of", () => {
  it("opens the opportunity on the contact, the stage only when configured", () => {
    expect(
      JSON.parse(
        JSON.stringify(
          opportunity_payload_of({ firstName: "Jane" }, config, "contact_1"),
        ),
      ),
    ).toEqual({
      pipelineId: "pipe_1",
      locationId: "loc_1",
      name: "Jane",
      status: "open",
      contactId: "contact_1",
    });
    expect(
      opportunity_payload_of(
        {},
        { ...config, pipeline_stage_id: "stage_1" },
        "contact_1",
      ).pipelineStageId,
    ).toBe("stage_1");
  });
});

describe("opportunity_name_of", () => {
  it("names the opportunity from the name fields, else the email, else the phone, else Lead", () => {
    expect(opportunity_name_of({ firstName: "Jane", lastName: "Doe" })).toBe(
      "Jane Doe",
    );
    expect(opportunity_name_of({ lastName: "Doe" })).toBe("Doe");
    expect(opportunity_name_of({ email: "jane@example.com" })).toBe(
      "jane@example.com",
    );
    expect(opportunity_name_of({ phone: "079 123 45 67" })).toBe(
      "079 123 45 67",
    );
    expect(opportunity_name_of({})).toBe("Lead");
  });
});
