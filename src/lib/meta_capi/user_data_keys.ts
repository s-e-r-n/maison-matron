import "server-only";
import { z } from "zod";
import type { dictionary_key } from "@/lib/form_contract/dictionary";

export const hashed_key_schema = z.enum([
  "em",
  "ph",
  "fn",
  "ln",
  "ct",
  "zp",
  "country",
]);

export const form_key_schema = z.enum(["em", "ph", "fn", "ln", "ct", "zp"]);

export const clear_key_schema = z.enum([
  "external_id",
  "client_ip_address",
  "client_user_agent",
  "fbc",
  "fbp",
]);

export type hashed_key = z.infer<typeof hashed_key_schema>;
export type form_key = z.infer<typeof form_key_schema>;
export type clear_key = z.infer<typeof clear_key_schema>;
export type identity = Partial<Record<hashed_key, string>>;
export type user_data = Partial<Record<hashed_key | clear_key, string>>;

export const form_table: Record<form_key, dictionary_key> = {
  em: "email",
  ph: "tel",
  fn: "given-name",
  ln: "family-name",
  ct: "address-level2",
  zp: "postal-code",
};
