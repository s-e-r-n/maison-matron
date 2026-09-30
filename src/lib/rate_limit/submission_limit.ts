import "server-only";
import { headers } from "next/headers";
import { client_ip } from "@/lib/meta_capi/request_context";
import { type config_result, read_config } from "./config";
import { increment_count, type transport } from "./upstash_counter";

export type submission_request = { host: string; ip: string };

export const submission_limit = 20;
export const window_seconds = 86_400;

const submission_key = ({ host, ip }: submission_request) =>
  `lead:${host}:${ip}`;

const let_through = (reason: string) => {
  console.warn(`rate_limit: ${reason}, the submission goes through`);
  return true;
};

export const submission_allowed = async (
  request: submission_request | undefined,
  config: config_result,
  overrides: Partial<transport> = {},
): Promise<boolean> => {
  if (!request) return let_through("no client IP in the request");
  if (!config.ok) return config.code === "off" || let_through(config.message);
  if (config.config.allowed_ips.has(request.ip)) return true;
  const counted = await increment_count(
    submission_key(request),
    window_seconds,
    config.config,
    overrides,
  );
  if (!counted.ok) return let_through(counted.message);
  return counted.count <= submission_limit;
};

const request_of = (
  request_headers: Awaited<ReturnType<typeof headers>>,
): submission_request | undefined => {
  const ip = client_ip(request_headers);
  return ip ? { host: request_headers.get("host") ?? "", ip } : undefined;
};

export const lead_submission_allowed = async () =>
  submission_allowed(request_of(await headers()), read_config());
