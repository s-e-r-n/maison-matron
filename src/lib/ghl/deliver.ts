import "server-only";
import { after } from "next/server";
import { form_fields_of } from "@/lib/form_contract/form_fields";
import { type ghl_config, read_config } from "./config";
import type { delivery_outcome, delivery_result } from "./delivery_result";
import { type contact_fields, contact_table } from "./form_table";
import { create_opportunity, type transport, upsert_contact } from "./ghl_api";
import { contact_payload_of, opportunity_payload_of } from "./payloads";

export const deliver_lead = async (
  fields: contact_fields,
  config: ghl_config,
  overrides: Partial<transport> = {},
): Promise<delivery_outcome> => {
  const contact = await upsert_contact(
    contact_payload_of(fields, config),
    config,
    overrides,
  );
  if (!contact.ok) return contact;
  const opportunity = await create_opportunity(
    opportunity_payload_of(fields, config, contact.contact_id),
    config,
    overrides,
  );
  if (!opportunity.ok) return opportunity;
  return {
    ok: true,
    contact_id: contact.contact_id,
    opportunity_id: opportunity.opportunity_id,
  };
};

const report = (outcome: delivery_outcome) => {
  if (!outcome.ok) console.warn(`ghl: ${outcome.code}: ${outcome.message}`);
};

export const deliver_to_ghl = (form_data: FormData): delivery_result => {
  const config = read_config();
  if (!config.ok) return config;
  const fields = form_fields_of(form_data, contact_table);
  after(async () => report(await deliver_lead(fields, config.config)));
  return { ok: true };
};
