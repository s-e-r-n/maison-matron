import "server-only";
import { cookies } from "next/headers";
import { after } from "next/server";
import { form_fields_of } from "@/lib/form_contract/form_fields";
import type { capture_result } from "./capture_result";
import { type capture_config, read_config } from "./config";
import type { event_name } from "./event_dictionary";
import { build_server_event, type server_event } from "./event_payload";
import { send_event } from "./graph_api";
import {
  cookie_names,
  identity_cookie_options,
  serialize_identity,
} from "./identity_cookies";
import { read_request_context, type request_context } from "./request_context";
import { build_user_data } from "./user_data";
import { form_table, type identity, type user_data } from "./user_data_keys";

type capture_input = {
  event: event_name;
  context: request_context;
  form_data: FormData | undefined;
};

const in_production = () => process.env.NODE_ENV === "production";

const without_matching_identifier = (data: user_data) =>
  Object.keys(data).every(
    (key) => key === "client_ip_address" || key === "client_user_agent",
  );

const report_missing_identifier = (event: event_name) => {
  const message = `meta_capi: ${event} carries no matching identifier beyond the IP and the user agent, check the proxy matcher and the form input names`;
  if (!in_production()) throw new Error(message);
  console.warn(message);
};

const store_identity = async (merged: identity, stored: identity) => {
  const serialized = serialize_identity(merged);
  if (serialized === serialize_identity(stored)) return;
  try {
    const cookie_store = await cookies();
    cookie_store.set(
      cookie_names.identity,
      serialized,
      identity_cookie_options(in_production()),
    );
  } catch {
    console.warn(
      "meta_capi: meta_identity can only be written from a server action or a route handler",
    );
  }
};

const send_after_response = (event: server_event, config: capture_config) => {
  after(async () => {
    const result = await send_event(event, config);
    if (!result.ok) {
      console.warn(
        `meta_capi: ${event.event_name} ${result.code}: ${result.message}`,
      );
    }
  });
};

export const capture_in_context = async ({
  event,
  context,
  form_data,
}: capture_input): Promise<capture_result> => {
  const config = read_config();
  if (!config.ok) {
    if (config.code === "misconfigured") {
      console.warn(`meta_capi: ${config.message}`);
    }
    return config;
  }
  const { user_data: data, identity: merged } = build_user_data({
    ...context,
    form_fields: form_data ? form_fields_of(form_data, form_table) : {},
    phone_country: config.config.phone_country,
  });
  if (event !== "PageView" && without_matching_identifier(data)) {
    report_missing_identifier(event);
  }
  const server_event = build_server_event({
    event_name: event,
    event_time_ms: context.now_ms,
    event_source_url: context.event_source_url,
    referrer_url: context.referrer_url,
    user_data: data,
  });
  await store_identity(merged, context.stored_identity);
  send_after_response(server_event, config.config);
  return { ok: true };
};

export const capture = async (event: event_name, form_data?: FormData) => {
  const context = await read_request_context();
  return capture_in_context({ event, context, form_data });
};
