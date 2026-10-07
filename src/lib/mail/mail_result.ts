import "server-only";

export type mail_failure = {
  ok: false;
  code: "refused" | "unreachable" | "disabled" | "unreadable";
  message: string;
};

export type mail_result = { ok: true; message_id: string } | mail_failure;
