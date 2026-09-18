import "server-only";
import { cookies, headers } from "next/headers";
import { connection } from "next/server";
import { z } from "zod";
import { valid_or_undefined } from "./boundary";
import {
  cookie_names,
  external_id_schema,
  fbc_schema,
  fbc_value,
  fbclid_of_fbc,
  fbclid_of_url,
  fbp_schema,
  parse_identity,
} from "./identity_cookies";
import { request_url_header } from "./identity_proxy";
import type { request_identity } from "./user_data";

export type request_context = request_identity & {
  event_source_url?: string;
  referrer_url?: string;
  now_ms: number;
};

type header_reader = { get: (name: string) => string | null };

type context_input = {
  headers: header_reader;
  cookie: (name: string) => string | undefined;
  now_ms: number;
};

const ip_schema = z.union([z.ipv4(), z.ipv6()]);
const page_url_schema = z.url({ protocol: /^https?$/ });
const country_schema = z.string().regex(/^[a-z]{2}$/);

const client_ip = (request_headers: header_reader) => {
  const [first = ""] = (request_headers.get("x-forwarded-for") ?? "").split(
    ",",
  );
  return valid_or_undefined(ip_schema, first.trim().replace(/^::ffff:/i, ""));
};

const freshest_fbc = (
  stored: string | undefined,
  page_url: string | undefined,
  now_ms: number,
) => {
  const fbclid = page_url ? fbclid_of_url(new URL(page_url)) : undefined;
  if (!fbclid) return stored;
  return stored && fbclid_of_fbc(stored) === fbclid
    ? stored
    : fbc_value(now_ms, fbclid);
};

export const request_context_from = ({
  headers: request_headers,
  cookie,
  now_ms,
}: context_input): request_context => {
  const event_source_url = valid_or_undefined(
    page_url_schema,
    request_headers.get(request_url_header),
  );
  return {
    now_ms,
    client_ip_address: client_ip(request_headers),
    client_user_agent: request_headers.get("user-agent")?.trim() || undefined,
    country: valid_or_undefined(
      country_schema,
      request_headers.get("x-vercel-ip-country")?.toLowerCase(),
    ),
    event_source_url,
    referrer_url: valid_or_undefined(
      page_url_schema,
      request_headers.get("referer"),
    ),
    external_id: valid_or_undefined(
      external_id_schema,
      cookie(cookie_names.external_id),
    ),
    fbc: freshest_fbc(
      valid_or_undefined(fbc_schema, cookie(cookie_names.fbc)),
      event_source_url,
      now_ms,
    ),
    fbp: valid_or_undefined(fbp_schema, cookie(cookie_names.fbp)),
    stored_identity: parse_identity(cookie(cookie_names.identity)),
  };
};

export const read_request_context = async () => {
  await connection();
  const [request_headers, cookie_store] = await Promise.all([
    headers(),
    cookies(),
  ]);
  return request_context_from({
    headers: request_headers,
    cookie: (name) => cookie_store.get(name)?.value,
    now_ms: Date.now(),
  });
};
