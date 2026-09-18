import "server-only";
export type capture_failure = {
  ok: false;
  code: "refused" | "unreachable" | "misconfigured" | "disabled";
  message: string;
};

export type capture_result = { ok: true } | capture_failure;

export type send_result =
  | { ok: true; events_received: number; fbtrace_id: string }
  | capture_failure;
