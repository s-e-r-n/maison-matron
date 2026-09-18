import "server-only";

export type delivery_failure = {
  ok: false;
  code: "refused" | "unreachable" | "disabled";
  message: string;
};

export type delivery_result = { ok: true } | delivery_failure;

export type delivery_outcome =
  | { ok: true; contact_id: string; opportunity_id: string }
  | delivery_failure;
