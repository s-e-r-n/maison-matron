import { describe, expect, it } from "vitest";
import type { ghl_config } from "../config";
import { create_opportunity, upsert_contact } from "../ghl_api";
import type { contact_payload, opportunity_payload } from "../payloads";

const config: ghl_config = {
  api_token: "SECRET-TOKEN",
  location_id: "loc_1",
  pipeline_id: "pipe_1",
  pipeline_stage_id: "stage_1",
};

const contact: contact_payload = {
  locationId: "loc_1",
  firstName: "Jane",
  email: "jane@example.com",
  customFields: [{ id: "field_1", fieldValue: "Hello" }],
};

const opportunity: opportunity_payload = {
  pipelineId: "pipe_1",
  locationId: "loc_1",
  name: "Jane Doe",
  status: "open",
  contactId: "contact_1",
  pipelineStageId: "stage_1",
};

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

const headers_of = (call: call | undefined) => new Headers(call?.init?.headers);

const body_of = (call: call | undefined) =>
  JSON.parse(String(call?.init?.body));

const ghl_error = (status: number, message: string | string[]) => () =>
  Response.json({ statusCode: status, message }, { status });

const network_failure = () => {
  throw new TypeError("fetch failed");
};

const hanging: typeof fetch = (_input, init) =>
  new Promise((_resolve, reject) => {
    init?.signal?.addEventListener("abort", () => reject(init.signal?.reason));
  });

describe("upsert_contact", () => {
  it("posts the upsert with the v3 headers, the token in the Authorization header only, and returns the contact id", async () => {
    const { calls, fetch } = posting([
      () => Response.json({ new: true, contact: { id: "contact_1" } }),
    ]);
    await expect(upsert_contact(contact, config, { fetch })).resolves.toEqual({
      ok: true,
      contact_id: "contact_1",
    });
    expect(calls).toHaveLength(1);
    expect(calls[0]?.url).toBe(
      "https://services.leadconnectorhq.com/contacts/upsert",
    );
    expect(calls[0]?.init?.method).toBe("POST");
    const headers = headers_of(calls[0]);
    expect(headers.get("authorization")).toBe("Bearer SECRET-TOKEN");
    expect(headers.get("version")).toBe("v3");
    expect(headers.get("content-type")).toBe("application/json");
    expect(headers.get("accept")).toBe("application/json");
    expect(body_of(calls[0])).toEqual(contact);
    expect(calls[0]?.url).not.toContain("SECRET-TOKEN");
  });

  it("refuses a 4xx with GHL's message, a string or a list, never quoting the token", async () => {
    const unauthorized = await upsert_contact(contact, config, {
      fetch: posting([ghl_error(401, "Invalid token: access token is invalid")])
        .fetch,
    });
    expect(unauthorized).toMatchObject({ ok: false, code: "refused" });
    expect(unauthorized.ok === false && unauthorized.message).toContain(
      "HTTP 401, Invalid token",
    );
    expect(unauthorized.ok === false && unauthorized.message).not.toContain(
      "SECRET-TOKEN",
    );
    const unprocessable = await upsert_contact(contact, config, {
      fetch: posting([
        ghl_error(422, ["Unprocessable Entity", "email must be an email"]),
      ]).fetch,
    });
    expect(unprocessable).toEqual({
      ok: false,
      code: "refused",
      message:
        "GHL refused the contact upsert: HTTP 422, Unprocessable Entity, email must be an email",
    });
  });

  it("reports 5xx, 429, a network failure and a timeout as unreachable, a 200 without id as refused", async () => {
    for (const step of [
      ghl_error(503, "Service Unavailable"),
      ghl_error(429, "Too Many Requests"),
      network_failure,
    ]) {
      await expect(
        upsert_contact(contact, config, { fetch: posting([step]).fetch }),
      ).resolves.toMatchObject({ ok: false, code: "unreachable" });
    }
    const timed_out = await upsert_contact(contact, config, {
      fetch: hanging,
      timeout_ms: 10,
    });
    expect(timed_out).toMatchObject({ ok: false, code: "unreachable" });
    expect(timed_out.ok === false && timed_out.message).toContain(
      "timeout after 10 ms",
    );
    await expect(
      upsert_contact(contact, config, {
        fetch: posting([() => Response.json({ traceId: "t" })]).fetch,
      }),
    ).resolves.toMatchObject({ ok: false, code: "refused" });
  });
});

describe("create_opportunity", () => {
  it("posts the opportunity to /opportunities/ and returns its id", async () => {
    const { calls, fetch } = posting([
      () => Response.json({ opportunity: { id: "opp_1" } }, { status: 201 }),
    ]);
    await expect(
      create_opportunity(opportunity, config, { fetch }),
    ).resolves.toEqual({ ok: true, opportunity_id: "opp_1" });
    expect(calls[0]?.url).toBe(
      "https://services.leadconnectorhq.com/opportunities/",
    );
    expect(body_of(calls[0])).toEqual(opportunity);
    expect(headers_of(calls[0]).get("version")).toBe("v3");
  });
});
