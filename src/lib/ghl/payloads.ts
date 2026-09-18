import "server-only";
import type { ghl_config } from "./config";
import { type contact_fields, opportunity_name_of } from "./form_table";

export type contact_payload = {
  locationId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  postalCode?: string;
  city?: string;
  customFields?: Array<{ id: string; fieldValue: string }>;
};

export type opportunity_payload = {
  pipelineId: string;
  locationId: string;
  name: string;
  status: "open";
  contactId: string;
  pipelineStageId?: string;
};

const custom_fields_of = (
  freetext: string | undefined,
  field_id: string | undefined,
) =>
  freetext && field_id ? [{ id: field_id, fieldValue: freetext }] : undefined;

export const contact_payload_of = (
  fields: contact_fields,
  config: ghl_config,
): contact_payload => ({
  locationId: config.location_id,
  firstName: fields.firstName,
  lastName: fields.lastName,
  email: fields.email,
  phone: fields.phone,
  companyName: fields.companyName,
  postalCode: fields.postalCode,
  city: fields.city,
  customFields: custom_fields_of(fields.freetext, config.freetext_field_id),
});

export const opportunity_payload_of = (
  fields: contact_fields,
  config: ghl_config,
  contact_id: string,
): opportunity_payload => ({
  pipelineId: config.pipeline_id,
  locationId: config.location_id,
  name: opportunity_name_of(fields),
  status: "open",
  contactId: contact_id,
  pipelineStageId: config.pipeline_stage_id,
});
