import "server-only";
import { z } from "zod";

export const event_name_schema = z.enum([
  // "Lead" is always the number one conversion action. A site with a single conversion sends "Lead".
  "Lead",
  "CompleteRegistration",
  "Schedule",
  "PageView",
]);

export type event_name = z.infer<typeof event_name_schema>;
