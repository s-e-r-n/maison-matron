import { identity_proxy } from "@/lib/meta_capi/identity_proxy";

export const proxy = identity_proxy;

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
