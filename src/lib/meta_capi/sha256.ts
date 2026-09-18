import "server-only";
import { createHash } from "node:crypto";

export const sha256_hex = (value: string) =>
  createHash("sha256").update(value, "utf8").digest("hex");
