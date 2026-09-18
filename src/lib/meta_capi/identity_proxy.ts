import "server-only";
import { type NextRequest, NextResponse } from "next/server";
import { valid_or_undefined } from "./boundary";
import {
  cookie_names,
  external_id_schema,
  fbc_schema,
  fbclid_of_url,
  fbp_schema,
  identity_cookie_options,
  identity_cookies_to_mint,
} from "./identity_cookies";
import { module_enabled } from "./kill_switch";

export const request_url_header = "x-meta-capi-url";

const random_number = () =>
  new DataView(crypto.getRandomValues(new Uint8Array(4)).buffer).getUint32(0);

const uuid = () => crypto.randomUUID();

const existing_cookies = (request: NextRequest) => ({
  fbc: valid_or_undefined(
    fbc_schema,
    request.cookies.get(cookie_names.fbc)?.value,
  ),
  fbp: valid_or_undefined(
    fbp_schema,
    request.cookies.get(cookie_names.fbp)?.value,
  ),
  external_id: valid_or_undefined(
    external_id_schema,
    request.cookies.get(cookie_names.external_id)?.value,
  ),
});

export const identity_proxy = (request: NextRequest) => {
  if (!module_enabled()) return NextResponse.next();
  const minted = identity_cookies_to_mint({
    existing: existing_cookies(request),
    fbclid: fbclid_of_url(request.nextUrl),
    now_ms: Date.now(),
    random_number,
    uuid,
  });
  for (const { name, value } of minted) request.cookies.set(name, value);
  const forwarded = new Headers(request.headers);
  forwarded.set(request_url_header, request.url);
  const response = NextResponse.next({ request: { headers: forwarded } });
  const options = identity_cookie_options(
    process.env.NODE_ENV === "production",
  );
  for (const { name, value } of minted)
    response.cookies.set(name, value, options);
  return response;
};
