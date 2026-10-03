import { headers } from "next/headers";
import { userAgent } from "next/server";
import { capture } from "@/lib/meta_capi/capture";

export const PageView = async () => {
  const request_headers = await headers();
  if (request_headers.has("next-action")) return null;
  if (userAgent({ headers: request_headers }).isBot) return null;
  await capture("PageView");
  return null;
};
