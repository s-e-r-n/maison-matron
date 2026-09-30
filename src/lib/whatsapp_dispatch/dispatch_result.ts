import "server-only";

export type send_failure = {
  ok: false;
  code: "refused" | "unreachable" | "blocked";
  message: string;
};

export type send_result = { ok: true; message_id: string } | send_failure;

export type dispatch_failure = {
  ok: false;
  code: "disabled" | "misconfigured";
  message: string;
};

export type dispatch_result =
  | { ok: true; sends: send_result[] }
  | dispatch_failure;
