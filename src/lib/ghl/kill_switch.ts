import "server-only";
import { z } from "zod";

const flag_schema = z.enum(["true", "false"]);

export const module_enabled = (
  env: Record<string, string | undefined> = process.env,
) => {
  const raw = env.GHL_ENABLED;
  if (raw === undefined || raw === "") return true;
  const parsed = flag_schema.safeParse(raw);
  if (parsed.success) return parsed.data === "true";
  console.warn(
    'ghl: GHL_ENABLED must be "true" or "false", the module stays off',
  );
  return false;
};
