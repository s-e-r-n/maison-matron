import { headers } from "next/headers";
import { capture } from "@/lib/meta_capi/capture";

export const PageView = async () => {
  if ((await headers()).has("next-action")) return null;
  await capture("PageView");
  return null;
};
