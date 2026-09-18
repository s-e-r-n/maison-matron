import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ghl_config } from "../config";
import type { delivery_failure } from "../delivery_result";
import type { contact_payload, opportunity_payload } from "../payloads";

const deferred: Array<() => Promise<void>> = [];
const upsert_contact =
  vi.fn<
    (
      payload: contact_payload,
      config: ghl_config,
    ) => Promise<{ ok: true; contact_id: string } | delivery_failure>
  >();
const create_opportunity =
  vi.fn<
    (
      payload: opportunity_payload,
      config: ghl_config,
    ) => Promise<{ ok: true; opportunity_id: string } | delivery_failure>
  >();
const read_config = vi.fn();

vi.mock("next/server", () => ({
  after: (task: () => Promise<void>) => {
    deferred.push(task);
  },
}));
vi.mock("../ghl_api", () => ({
  upsert_contact: (payload: contact_payload, config: ghl_config) =>
    upsert_contact(payload, config),
  create_opportunity: (payload: opportunity_payload, config: ghl_config) =>
    create_opportunity(payload, config),
}));
vi.mock("../config", () => ({ read_config: () => read_config() }));

const { deliver_to_ghl } = await import("../deliver");

const config: ghl_config = {
  api_token: "SECRET-TOKEN",
  location_id: "loc_1",
  pipeline_id: "pipe_1",
  pipeline_stage_id: "stage_1",
  freetext_field_id: "field_1",
};

const submission = () => {
  const form_data = new FormData();
  form_data.set("given-name", "Jane");
  form_data.set("family-name", "Doe");
  form_data.set("email", "jane@example.com");
  form_data.set("freetext", "Hello");
  return form_data;
};

const run_deferred = async () => {
  for (const task of deferred.splice(0)) await task();
};

beforeEach(() => {
  vi.clearAllMocks();
  deferred.length = 0;
  read_config.mockReturnValue({ ok: true, config });
  upsert_contact.mockResolvedValue({ ok: true, contact_id: "contact_1" });
  create_opportunity.mockResolvedValue({
    ok: true,
    opportunity_id: "opportunity_1",
  });
});

describe("deliver_to_ghl", () => {
  it("returns disabled and defers nothing when the module is off", () => {
    const disabled = {
      ok: false,
      code: "disabled",
      message: "GHL_ENABLED is false",
    };
    read_config.mockReturnValue(disabled);
    expect(deliver_to_ghl(submission())).toEqual(disabled);
    expect(deferred).toHaveLength(0);
  });

  it("returns at once, then upserts the contact and creates the opportunity on it after the response", async () => {
    expect(deliver_to_ghl(submission())).toEqual({ ok: true });
    expect(upsert_contact).not.toHaveBeenCalled();
    expect(deferred).toHaveLength(1);
    await run_deferred();
    expect(upsert_contact).toHaveBeenCalledExactlyOnceWith(
      {
        locationId: "loc_1",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        customFields: [{ id: "field_1", fieldValue: "Hello" }],
      },
      config,
    );
    expect(create_opportunity).toHaveBeenCalledExactlyOnceWith(
      {
        pipelineId: "pipe_1",
        locationId: "loc_1",
        name: "Jane Doe",
        status: "open",
        contactId: "contact_1",
        pipelineStageId: "stage_1",
      },
      config,
    );
  });

  it("skips the opportunity when the contact failed, warns, and the deferred task never rejects", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    upsert_contact.mockResolvedValue({
      ok: false,
      code: "unreachable",
      message: "timeout after 10000 ms",
    });
    deliver_to_ghl(submission());
    await expect(run_deferred()).resolves.toBeUndefined();
    expect(create_opportunity).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledExactlyOnceWith(
      "ghl: unreachable: timeout after 10000 ms",
    );
    warn.mockRestore();
  });
});
