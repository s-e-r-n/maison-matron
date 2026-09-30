import { describe, expect, it } from "vitest";
import { send_template } from "../cloud_api";

const gate_open = process.env.WHATSAPP_LIVE_TEST === "1";

const recipient = "41766359652";

const example_values = [
  "Jane",
  "Doe",
  "+41 76 666 69 69",
  "jane.doe@example.com",
  "1205",
  "J'aimerais faire réparer mon canapé en cuir",
  "Retouches",
];

describe.skipIf(!gate_open)("WhatsApp Cloud API, live", () => {
  it("sends one maisonmatron message to 41766359652 with the 7 example values and gets a message id back", async () => {
    const result = await send_template(recipient, example_values, {
      access_token: process.env.WHATSAPP_BUSINESS_TOKEN ?? "",
      template_name: "maisonmatron",
      recipients: [recipient],
    });
    expect(result).toEqual({ ok: true, message_id: expect.any(String) });
  }, 20_000);
});
