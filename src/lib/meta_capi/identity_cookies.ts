import "server-only";
import { z } from "zod";
import { hashed_key_schema, type identity } from "./user_data_keys";

export const cookie_names = {
  fbc: "_fbc",
  fbp: "_fbp",
  external_id: "external_id",
  identity: "meta_identity",
};

const ninety_days_s = 7_776_000;
const same_site: "lax" = "lax";
const max_fbclid_length = 1024;

export const identity_cookie_options = (secure: boolean) => ({
  httpOnly: true,
  secure,
  sameSite: same_site,
  maxAge: ninety_days_s,
  path: "/",
});

export const fbp_value = (now_ms: number, random_number: number) =>
  `fb.1.${now_ms}.${random_number}`;

export const fbc_value = (now_ms: number, fbclid: string) =>
  `fb.1.${now_ms}.${fbclid}`;

export const fbclid_of_fbc = (fbc: string) => fbc.split(".").slice(3).join(".");

export const fbclid_of_url = (url: URL) => {
  const fbclid = url.searchParams.get("fbclid");
  return fbclid && fbclid.length <= max_fbclid_length ? fbclid : undefined;
};

export const fbc_schema = z.string().regex(/^fb\.\d+\.\d+\..+$/);
export const fbp_schema = z.string().regex(/^fb\.\d+\.\d+\.\d+$/);
export const external_id_schema = z.uuid();

const hash_schema = z.string().regex(/^[a-f0-9]{64}$/);

export const parse_identity = (raw: string | undefined): identity => {
  const parsed: identity = {};
  for (const [key, value] of new URLSearchParams(raw ?? "")) {
    const known_key = hashed_key_schema.safeParse(key);
    if (known_key.success && hash_schema.safeParse(value).success) {
      parsed[known_key.data] = value;
    }
  }
  return parsed;
};

export const serialize_identity = (identity: identity) => {
  const params = new URLSearchParams();
  for (const key of hashed_key_schema.options) {
    const value = identity[key];
    if (value) params.set(key, value);
  }
  return params.toString();
};

type existing_cookies = { fbc?: string; fbp?: string; external_id?: string };

type mint_input = {
  existing: existing_cookies;
  fbclid?: string;
  now_ms: number;
  random_number: () => number;
  uuid: () => string;
};

const stale_fbc = (existing: existing_cookies, fbclid: string) =>
  !existing.fbc || fbclid_of_fbc(existing.fbc) !== fbclid;

export const identity_cookies_to_mint = ({
  existing,
  fbclid,
  now_ms,
  random_number,
  uuid,
}: mint_input) => {
  const minted: Array<{ name: string; value: string }> = [];
  if (!existing.fbp) {
    minted.push({
      name: cookie_names.fbp,
      value: fbp_value(now_ms, random_number()),
    });
  }
  if (!existing.external_id) {
    minted.push({ name: cookie_names.external_id, value: uuid() });
  }
  if (fbclid && stale_fbc(existing, fbclid)) {
    minted.push({ name: cookie_names.fbc, value: fbc_value(now_ms, fbclid) });
  }
  return minted;
};
