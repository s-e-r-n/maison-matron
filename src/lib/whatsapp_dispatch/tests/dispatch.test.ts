import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { dispatch_to_whatsapp } from "../dispatch";

const gray = "41766359652";
const another_number = "41764242396";
const endpoint = "https://graph.facebook.com/v25.0/1340444355816321/messages";

type call = { url: string; init: RequestInit | undefined };

const posting = (steps: Array<() => Response>) => {
  const calls: call[] = [];
  const fetch_fn: typeof fetch = async (input, init) => {
    calls.push({ url: String(input), init });
    const step = steps[calls.length - 1];
    if (!step) throw new Error("no more responses");
    return step();
  };
  return { calls, fetch: fetch_fn };
};

const holding = () => {
  const calls: call[] = [];
  const answers: Array<(response: Response) => void> = [];
  const fetch_fn: typeof fetch = (input, init) => {
    calls.push({ url: String(input), init });
    return new Promise((resolve) => answers.push(resolve));
  };
  return { calls, answers, fetch: fetch_fn };
};

const accepted = (message_id: string) => () =>
  Response.json({
    messaging_product: "whatsapp",
    contacts: [{ input: gray, wa_id: gray }],
    messages: [{ id: message_id, message_status: "accepted" }],
  });

const meta_error = (status: number, code: number) => () =>
  Response.json(
    {
      error: {
        message: `(#${code}) Meta refused`,
        type: "OAuthException",
        code,
        error_data: { messaging_product: "whatsapp", details: "details" },
        fbtrace_id: "AbCdEf",
      },
    },
    { status },
  );

const network_failure = () => {
  throw new TypeError("fetch failed");
};

const hanging: typeof fetch = (_input, init) =>
  new Promise((_resolve, reject) => {
    init?.signal?.addEventListener("abort", () => reject(init.signal?.reason));
  });

const reference_values = [
  "Jane",
  "Doe",
  "+41 76 666 69 69",
  "jane.doe@example.com",
  "1205",
  "J'aimerais faire réparer mon canapé en cuir",
];

const reference_submission = () => {
  const form_data = new FormData();
  form_data.append("given-name", "Jane");
  form_data.append("family-name", "Doe");
  form_data.append("tel", "+41 76 666 69 69");
  form_data.append("email", "jane.doe@example.com");
  form_data.append("postal-code", "1205");
  form_data.append("freetext", "J'aimerais faire réparer mon canapé en cuir");
  return form_data;
};

const text_parameters = (values: string[]) =>
  values.map((text) => ({ type: "text", text }));

const body_of = (call: call | undefined) =>
  JSON.parse(String(call?.init?.body));

const headers_of = (call: call | undefined) => new Headers(call?.init?.headers);

const parameters_of = (call: call | undefined) =>
  body_of(call).template.components[0].parameters;

beforeEach(() => {
  vi.stubEnv("WHATSAPP_ENABLED", "");
  vi.stubEnv("WHATSAPP_BUSINESS_TOKEN", "SECRET-TOKEN");
  vi.stubEnv("WHATSAPP_MODEL", "retouches_lead");
  vi.stubEnv("WHATSAPP_DISPATCH_NUMBER_1", gray);
  vi.stubEnv("WHATSAPP_DISPATCH_NUMBER_2", "");
  vi.stubEnv("WHATSAPP_LIVE_TEST", "1");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("dispatch_to_whatsapp", () => {
  it("posts one template message shaped like the curl, the token in the Authorization header, one text parameter per entry in order then the form id", async () => {
    const { calls, fetch } = posting([accepted("wamid.1")]);
    await expect(
      dispatch_to_whatsapp(reference_submission(), "retouches", { fetch }),
    ).resolves.toEqual({
      ok: true,
      sends: [{ ok: true, message_id: "wamid.1" }],
    });
    expect(calls).toHaveLength(1);
    expect(calls[0]?.url).toBe(endpoint);
    expect(calls[0]?.init?.method).toBe("POST");
    const headers = headers_of(calls[0]);
    expect(headers.get("authorization")).toBe("Bearer SECRET-TOKEN");
    expect(headers.get("content-type")).toBe("application/json");
    expect(body_of(calls[0])).toEqual({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: "41766359652",
      type: "template",
      template: {
        name: "retouches_lead",
        language: { code: "fr_CH" },
        components: [
          {
            type: "body",
            parameters: text_parameters([...reference_values, "retouches"]),
          },
        ],
      },
    });
    expect(calls[0]?.url).not.toContain("SECRET-TOKEN");
  });

  it("posts to both recipients at once, before the first answers, each with its own to and the same body", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("WHATSAPP_DISPATCH_NUMBER_2", another_number);
    const { calls, answers, fetch } = holding();
    const dispatch = dispatch_to_whatsapp(reference_submission(), "retouches", {
      fetch,
    });
    expect(calls).toHaveLength(2);
    expect(answers).toHaveLength(2);
    const { to: first_to, ...first_body } = body_of(calls[0]);
    const { to: second_to, ...second_body } = body_of(calls[1]);
    expect(first_to).toBe(gray);
    expect(second_to).toBe(another_number);
    expect(second_body).toEqual(first_body);
    answers[0]?.(accepted("wamid.1")());
    answers[1]?.(accepted("wamid.2")());
    await expect(dispatch).resolves.toEqual({
      ok: true,
      sends: [
        { ok: true, message_id: "wamid.1" },
        { ok: true, message_id: "wamid.2" },
      ],
    });
  });

  it("skips the $ACTION_ entries of Next and keeps the order of the other entries", async () => {
    const form_data = new FormData();
    form_data.append("given-name", "Jane");
    form_data.append("$ACTION_ID_x", "x");
    form_data.append("family-name", "Doe");
    const { calls, fetch } = posting([accepted("wamid.1")]);
    await dispatch_to_whatsapp(form_data, "retouches", { fetch });
    expect(parameters_of(calls[0])).toEqual(
      text_parameters(["Jane", "Doe", "retouches"]),
    );
  });

  it("trims each value and turns every run of line breaks into one space", async () => {
    const form_data = new FormData();
    form_data.append("freetext", "  a\n\nb  ");
    const { calls, fetch } = posting([accepted("wamid.1")]);
    await dispatch_to_whatsapp(form_data, "retouches", { fetch });
    expect(parameters_of(calls[0])).toEqual(
      text_parameters(["a b", "retouches"]),
    );
  });

  it("never throws nor rejects: misconfigured without any fetch, unreachable on a rejection, a timeout, a 429 and a 500, refused on a 400 with Meta's code", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv("WHATSAPP_BUSINESS_TOKEN", "");
    const { calls, fetch } = posting([]);
    await expect(
      dispatch_to_whatsapp(reference_submission(), "retouches", { fetch }),
    ).resolves.toMatchObject({ ok: false, code: "misconfigured" });
    expect(calls).toHaveLength(0);
    vi.stubEnv("WHATSAPP_BUSINESS_TOKEN", "SECRET-TOKEN");
    await expect(
      dispatch_to_whatsapp(reference_submission(), "retouches", {
        fetch: posting([network_failure]).fetch,
      }),
    ).resolves.toEqual({
      ok: true,
      sends: [{ ok: false, code: "unreachable", message: expect.any(String) }],
    });
    const timed_out = await dispatch_to_whatsapp(
      reference_submission(),
      "retouches",
      { fetch: hanging, attempt_timeout_ms: 10 },
    );
    expect(timed_out).toMatchObject({
      ok: true,
      sends: [{ ok: false, code: "unreachable" }],
    });
    expect(
      timed_out.ok &&
        timed_out.sends[0]?.ok === false &&
        timed_out.sends[0].message,
    ).toContain("timeout after 10 ms");
    const refused = await dispatch_to_whatsapp(
      reference_submission(),
      "retouches",
      { fetch: posting([meta_error(400, 132000)]).fetch },
    );
    expect(refused).toMatchObject({
      ok: true,
      sends: [{ ok: false, code: "refused" }],
    });
    expect(
      refused.ok && refused.sends[0]?.ok === false && refused.sends[0].message,
    ).toContain("132000");
    for (const status of [429, 500]) {
      await expect(
        dispatch_to_whatsapp(reference_submission(), "retouches", {
          fetch: posting([meta_error(status, 130429)]).fetch,
        }),
      ).resolves.toMatchObject({
        ok: true,
        sends: [{ ok: false, code: "unreachable" }],
      });
    }
  });

  it("outside production, fetches only with the gate open on the command line and 41766359652 as recipient", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv("WHATSAPP_LIVE_TEST", "");
    const closed_gate = posting([accepted("wamid.1")]);
    await expect(
      dispatch_to_whatsapp(reference_submission(), "retouches", {
        fetch: closed_gate.fetch,
      }),
    ).resolves.toMatchObject({
      ok: true,
      sends: [{ ok: false, code: "blocked" }],
    });
    expect(closed_gate.calls).toHaveLength(0);
    vi.stubEnv("WHATSAPP_LIVE_TEST", "1");
    vi.stubEnv("WHATSAPP_DISPATCH_NUMBER_1", another_number);
    const other_recipient = posting([accepted("wamid.1")]);
    await expect(
      dispatch_to_whatsapp(reference_submission(), "retouches", {
        fetch: other_recipient.fetch,
      }),
    ).resolves.toMatchObject({
      ok: true,
      sends: [{ ok: false, code: "blocked" }],
    });
    expect(other_recipient.calls).toHaveLength(0);
    vi.stubEnv("WHATSAPP_DISPATCH_NUMBER_1", gray);
    const open_gate = posting([accepted("wamid.1")]);
    await expect(
      dispatch_to_whatsapp(reference_submission(), "retouches", {
        fetch: open_gate.fetch,
      }),
    ).resolves.toEqual({
      ok: true,
      sends: [{ ok: true, message_id: "wamid.1" }],
    });
    expect(open_gate.calls).toHaveLength(1);
    expect(open_gate.calls[0]?.url).toBe(endpoint);
  });
});
