import "server-only";
import type { z } from "zod";

export const valid_or_undefined = <T>(
  schema: z.ZodType<T>,
  raw: string | null | undefined,
) => {
  if (!raw) return undefined;
  const parsed = schema.safeParse(raw);
  return parsed.success ? parsed.data : undefined;
};
