import { describe, expect, it } from "vitest";
import { build_server_event } from "../event_payload";

type event_input = Parameters<typeof build_server_event>[0];

const user_data = {
  em: "b".repeat(64),
  external_id: "6f1a2b3c-4d5e-4f60-8a71-92b3c4d5e6f7",
  client_ip_address: "203.0.113.7",
  client_user_agent: "Mozilla/5.0",
};

describe("build_server_event", () => {
  it("carries every field Meta requires and never an empty, null or undefined one", () => {
    const event = build_server_event({
      event_name: "Lead",
      event_time_ms: 1_757_700_000_123,
      event_source_url: "https://example.com/landing",
      referrer_url: "https://example.com/",
      user_data,
    });
    expect(event).toMatchObject({
      event_name: "Lead",
      event_time: 1_757_700_000,
      action_source: "website",
      event_source_url: "https://example.com/landing",
      referrer_url: "https://example.com/",
      user_data,
    });
    expect(event.event_id).toMatch(/^[a-f0-9]{64}$/);
    const bare = build_server_event({
      event_name: "PageView",
      event_time_ms: 1_000,
      user_data,
    });
    expect(Object.values(bare)).not.toContain(undefined);
    expect(Object.values(bare)).not.toContain(null);
    expect(Object.values(bare)).not.toContain("");
    expect(bare).not.toHaveProperty("event_source_url");
  });

  it("derives one event_id per call, another for a later click or another identity", () => {
    const input: event_input = {
      event_name: "Lead",
      event_time_ms: 1_757_700_000_123,
      event_source_url: "https://example.com/",
      user_data,
    };
    const first = build_server_event(input);
    expect(build_server_event(input).event_id).toBe(first.event_id);
    expect(
      build_server_event({ ...input, event_time_ms: 1_757_700_000_124 })
        .event_id,
    ).not.toBe(first.event_id);
    expect(
      build_server_event({
        ...input,
        user_data: {
          ...user_data,
          external_id: "0b7f2c1e-9a3d-4c5b-8e6f-1a2b3c4d5e6f",
        },
      }).event_id,
    ).not.toBe(first.event_id);
  });
});
