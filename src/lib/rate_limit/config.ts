import "server-only";

export type rate_limit_config = {
  rest_url: string;
  rest_token: string;
  allowed_ips: ReadonlySet<string>;
};

type inactive = { ok: false; code: "off" | "unconfigured"; message: string };

export type config_result = { ok: true; config: rate_limit_config } | inactive;

const allowed_ips_of = (raw: string | undefined) =>
  new Set(
    (raw ?? "")
      .split(",")
      .map((ip) => ip.trim())
      .filter((ip) => ip !== ""),
  );

export const parse_config = (
  env: Record<string, string | undefined>,
): config_result => {
  if (env.NODE_ENV !== "production") {
    return { ok: false, code: "off", message: "NODE_ENV is not production" };
  }
  const rest_url = env.UPSTASH_REDIS_REST_URL ?? "";
  const rest_token = env.UPSTASH_REDIS_REST_TOKEN ?? "";
  if (rest_url === "" || rest_token === "") {
    return {
      ok: false,
      code: "unconfigured",
      message: "UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is missing",
    };
  }
  return {
    ok: true,
    config: {
      rest_url,
      rest_token,
      allowed_ips: allowed_ips_of(env.RATE_LIMIT_ALLOWED_IPS),
    },
  };
};

export const read_config = () => parse_config(process.env);
