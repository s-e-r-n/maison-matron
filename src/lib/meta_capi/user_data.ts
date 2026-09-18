import "server-only";
import { sha256_hex } from "./sha256";
import {
  clear_key_schema,
  type form_key,
  type hashed_key,
  hashed_key_schema,
  type identity,
  type user_data,
} from "./user_data_keys";
import { normalize_user_data_value } from "./user_data_normalization";

export type form_fields = Partial<Record<form_key, string>>;

export type request_identity = {
  country?: string;
  stored_identity: identity;
  external_id?: string;
  client_ip_address?: string;
  client_user_agent?: string;
  fbc?: string;
  fbp?: string;
};

export type user_data_sources = request_identity & {
  form_fields: form_fields;
  phone_country?: string;
};

const country_for = (key: hashed_key, sources: user_data_sources) =>
  key === "ph" ? (sources.phone_country ?? sources.country) : sources.country;

const fresh_identity = (sources: user_data_sources) => {
  const raw_values: Partial<Record<hashed_key, string>> = {
    ...sources.form_fields,
    country: sources.country,
  };
  const fresh: identity = {};
  for (const key of hashed_key_schema.options) {
    const raw = raw_values[key];
    const normalized = raw
      ? normalize_user_data_value(key, raw, country_for(key, sources))
      : undefined;
    if (normalized) fresh[key] = sha256_hex(normalized);
  }
  return fresh;
};

export const build_user_data = (sources: user_data_sources) => {
  const merged: identity = {
    ...sources.stored_identity,
    ...fresh_identity(sources),
  };
  const data: user_data = { ...merged };
  for (const key of clear_key_schema.options) {
    const value = sources[key];
    if (value) data[key] = value;
  }
  return { user_data: data, identity: merged };
};
