import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const capture = vi.fn<() => Promise<{ ok: true }>>();
const deliver_to_ghl = vi.fn<() => { ok: true }>();
const send_confirmation =
  vi.fn<
    () => Promise<
      | { ok: true; message_id: string }
      | { ok: false; code: "unreachable"; message: string }
    >
  >();
const redirect = vi.fn<(path: string) => void>();

vi.mock("@/lib/meta_capi/capture", () => ({ capture: () => capture() }));
vi.mock("@/lib/ghl/deliver", () => ({
  deliver_to_ghl: () => deliver_to_ghl(),
}));
vi.mock("@/lib/mail/send", () => ({
  send_confirmation: () => send_confirmation(),
}));
vi.mock("@/lib/rate_limit/submission_limit", () => ({
  lead_submission_allowed: async () => true,
}));
vi.mock("next/navigation", () => ({
  redirect: (path: string) => redirect(path),
}));

const pages = [
  {
    page: "/",
    form_id: "luxe",
    submit_lead: (await import("@/app/actions")).submit_lead,
  },
  {
    page: "/refection",
    form_id: "refection",
    submit_lead: (await import("@/app/refection/actions")).submit_lead,
  },
];

const endpoint = "https://graph.facebook.com/v25.0/1340444355816321/messages";

const submission = () => {
  const form_data = new FormData();
  form_data.append("given-name", "Jane");
  form_data.append("email", "jane.doe@example.com");
  return form_data;
};

const accepted = () =>
  Response.json({
    messaging_product: "whatsapp",
    contacts: [{ input: "41766359652", wa_id: "41766359652" }],
    messages: [{ id: "wamid.1", message_status: "accepted" }],
  });

const yield_to_event_loop = () =>
  new Promise<void>((resolve) => {
    setImmediate(resolve);
  });

const run_submission = (
  submit_lead: (typeof pages)[number]["submit_lead"],
  form_id: string,
) => {
  const capture_answer = Promise.withResolvers<{ ok: true }>();
  capture.mockReturnValue(capture_answer.promise);
  const meta_answer = Promise.withResolvers<Response>();
  const posts: string[] = [];
  const fetch_fn: typeof fetch = (input) => {
    posts.push(String(input));
    return meta_answer.promise;
  };
  vi.stubGlobal("fetch", fetch_fn);
  let exit: "none" | "failed" | "redirected" = "none";
  const done = submit_lead(form_id, submission()).then((result) => {
    exit = result ? "failed" : "redirected";
  });
  return {
    posts,
    settle_capture: () => capture_answer.resolve({ ok: true }),
    settle_meta: () => meta_answer.resolve(accepted()),
    exit: () => exit,
    done,
  };
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("WHATSAPP_ENABLED", "");
  vi.stubEnv("WHATSAPP_BUSINESS_TOKEN", "SECRET-TOKEN");
  vi.stubEnv("WHATSAPP_MODEL", "maisonmatron");
  vi.stubEnv("WHATSAPP_DISPATCH_NUMBER_1", "41766359652");
  vi.stubEnv("WHATSAPP_DISPATCH_NUMBER_2", "");
  vi.stubEnv("WHATSAPP_LIVE_TEST", "1");
  deliver_to_ghl.mockReturnValue({ ok: true });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe.each(pages)("submit_lead of $page", ({ form_id, submit_lead }) => {
  it("posts to WhatsApp once the rate limit allows and before capture settles, and reaches neither its failure return nor its redirect before the dispatch settles", async () => {
    send_confirmation.mockResolvedValue({ ok: true, message_id: "<m1@p>" });
    const redirected = run_submission(submit_lead, form_id);
    await yield_to_event_loop();
    expect(redirected.posts).toEqual([endpoint]);
    expect(capture).toHaveBeenCalledTimes(1);
    redirected.settle_capture();
    await yield_to_event_loop();
    expect(deliver_to_ghl).toHaveBeenCalledTimes(1);
    expect(send_confirmation).toHaveBeenCalledTimes(1);
    expect(redirect).not.toHaveBeenCalled();
    expect(redirected.exit()).toBe("none");
    redirected.settle_meta();
    await redirected.done;
    expect(redirect).toHaveBeenCalledExactlyOnceWith("/confirmation");
    expect(redirected.exit()).toBe("redirected");

    send_confirmation.mockResolvedValue({
      ok: false,
      code: "unreachable",
      message: "timeout after 10000 ms",
    });
    const failed = run_submission(submit_lead, form_id);
    await yield_to_event_loop();
    expect(failed.posts).toEqual([endpoint]);
    failed.settle_capture();
    await yield_to_event_loop();
    expect(send_confirmation).toHaveBeenCalledTimes(2);
    expect(failed.exit()).toBe("none");
    failed.settle_meta();
    await failed.done;
    expect(failed.exit()).toBe("failed");
    expect(redirect).toHaveBeenCalledTimes(1);
  });
});
