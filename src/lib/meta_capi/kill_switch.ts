import "server-only";
// Kill switch: META_CAPI_ENABLED=false makes the whole module inert, no request to Meta, no cookie written, capture answers { ok: false, code: "disabled" }. Absent means enabled.

import { z } from "zod";

const flag_schema = z.enum(["true", "false"]);

export const module_enabled = (
  env: Record<string, string | undefined> = process.env,
) => {
  const raw = env.META_CAPI_ENABLED;
  if (raw === undefined || raw === "") return true;
  const parsed = flag_schema.safeParse(raw);
  if (parsed.success) return parsed.data === "true";
  console.warn(
    'meta_capi: META_CAPI_ENABLED must be "true" or "false", the module stays off',
  );
  return false;
};
