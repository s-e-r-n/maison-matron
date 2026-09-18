import { beforeEach, describe, expect, it, vi } from "vitest";
import type { send_result } from "../capture_result";
import type { capture_config } from "../config";
import type { server_event } from "../event_payload";

const cookie_store = { set: vi.fn(), get: vi.fn() };
const send_event =
  vi.fn<
    (event: server_event, config: capture_config) => Promise<send_result>
  >();
const read_config = vi.fn();
const deferred: Array<() => Promise<void>> = [];

vi.mock("next/headers", () => ({
  cookies: async () => cookie_store,
  headers: async () => new Headers(),
}));
vi.mock("next/server", async (import_original) => ({
  ...(await import_original<typeof import("next/server")>()),
  after: (task: () => Promise<void>) => {
    deferred.push(task);
  },
  connection: async () => {},
}));
vi.mock("../graph_api", () => ({
  send_event: (event: server_event, config: capture_config) =>
    send_event(event, config),
}));
vi.mock("../config", () => ({ read_config: () => read_config() }));

const { capture_in_context } = await import("../capture");

const config = {
  ok: true,
  config: { dataset_id: "1", access_token: "t", graph_version: "v25.0" },
};

const context = {
  now_ms: 1_700_000_000_000,
  stored_identity: {},
  client_ip_address: "203.0.113.7",
  client_user_agent: "Mozilla/5.0",
  event_source_url: "https://partner.example/",
};

const identified = {
  ...context,
  external_id: "6f1a2b3c-4d5e-4f60-8a71-92b3c4d5e6f7",
  fbp: "fb.1.1700000000000.42",
};

const submission = () => {
  const form_data = new FormData();
  form_data.set("email", "jane@example.com");
  return form_data;
};

const run_deferred = async () => {
  for (const task of deferred.splice(0)) await task();
};

beforeEach(() => {
  vi.clearAllMocks();
  deferred.length = 0;
  read_config.mockReturnValue(config);
  send_event.mockResolvedValue({
    ok: true,
    events_received: 1,
    fbtrace_id: "t",
  });
});

describe("capture_in_context", () => {
  it("crashes outside production when a conversion carries no matching identifier, lets a PageView go", async () => {
    await expect(
      capture_in_context({ event: "Schedule", context, form_data: undefined }),
    ).rejects.toThrow(/no matching identifier/);
    expect(deferred).toHaveLength(0);
    await expect(
      capture_in_context({ event: "PageView", context, form_data: undefined }),
    ).resolves.toEqual({ ok: true });
    expect(deferred).toHaveLength(1);
  });

  it("returns the config failure without deferring anything: disabled silently, misconfigured with a warn", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const disabled = {
      ok: false,
      code: "disabled",
      message: "META_CAPI_ENABLED is false",
    };
    read_config.mockReturnValue(disabled);
    await expect(
      capture_in_context({
        event: "Lead",
        context: identified,
        form_data: submission(),
      }),
    ).resolves.toEqual(disabled);
    expect(cookie_store.set).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
    const misconfigured = {
      ok: false,
      code: "misconfigured",
      message: "missing",
    };
    read_config.mockReturnValue(misconfigured);
    await expect(
      capture_in_context({
        event: "Lead",
        context: identified,
        form_data: submission(),
      }),
    ).resolves.toEqual(misconfigured);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(deferred).toHaveLength(0);
    warn.mockRestore();
  });

  it("writes meta_identity as an HttpOnly Lax 90 day cookie before returning when a submission enriches it, leaves it alone otherwise", async () => {
    await capture_in_context({
      event: "Lead",
      context: identified,
      form_data: submission(),
    });
    expect(cookie_store.set).toHaveBeenCalledTimes(1);
    const [name, value, options] = cookie_store.set.mock.calls[0] ?? [];
    expect(name).toBe("meta_identity");
    expect(value).toMatch(/^em=[a-f0-9]{64}$/);
    expect(options).toEqual({
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7_776_000,
      path: "/",
    });
    cookie_store.set.mockClear();
    await capture_in_context({
      event: "Schedule",
      context: identified,
      form_data: undefined,
    });
    expect(cookie_store.set).not.toHaveBeenCalled();
  });

  it("hands the send to after(), with the event built before returning, and warns when Meta refuses it", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(
      capture_in_context({
        event: "Lead",
        context: identified,
        form_data: submission(),
      }),
    ).resolves.toEqual({ ok: true });
    expect(send_event).not.toHaveBeenCalled();
    expect(deferred).toHaveLength(1);
    send_event.mockResolvedValue({
      ok: false,
      code: "refused",
      message: "Invalid parameter",
    });
    await expect(run_deferred()).resolves.toBeUndefined();
    expect(send_event).toHaveBeenCalledTimes(1);
    const [event, sent_config] = send_event.mock.calls[0] ?? [];
    expect(event).toMatchObject({
      event_name: "Lead",
      action_source: "website",
    });
    expect(event?.user_data.em).toMatch(/^[a-f0-9]{64}$/);
    expect(sent_config).toEqual(config.config);
    expect(warn).toHaveBeenCalledExactlyOnceWith(
      "meta_capi: Lead refused: Invalid parameter",
    );
    warn.mockRestore();
  });
});
