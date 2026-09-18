import { describe, expect, it } from "vitest";
import { parse_config } from "../config";
import { build_server_event } from "../event_payload";
import { send_event } from "../graph_api";

const config = parse_config(process.env);

describe.skipIf(!config.ok)("Meta Graph API, live", () => {
  it("accepts a PageView on the dataset", async () => {
    if (!config.ok) return;
    const now_ms = Date.now();
    const event = build_server_event({
      event_name: "PageView",
      event_time_ms: now_ms,
      event_source_url: "https://example.com/live-test",
      user_data: {
        client_ip_address: "203.0.113.7",
        client_user_agent: "Mozilla/5.0 (meta-capi live test)",
        external_id: crypto.randomUUID(),
        fbp: `fb.1.${now_ms}.1234567890`,
      },
    });
    const result = await send_event(event, config.config);
    expect(result).toMatchObject({ ok: true, events_received: 1 });
  }, 20_000);
});
