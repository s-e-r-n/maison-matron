import { beforeEach, describe, expect, it, vi } from "vitest";
import type { event_name } from "../event_dictionary";

const request = { headers: new Headers() };
const capture = vi.fn<(event: event_name) => Promise<unknown>>();

vi.mock("next/headers", () => ({ headers: async () => request.headers }));
vi.mock("../capture", () => ({
  capture: (event: event_name) => capture(event),
}));

const { PageView } = await import("@/components/page_view");

beforeEach(() => {
  capture.mockClear();
});

describe("PageView", () => {
  it("captures one PageView when a page loads", async () => {
    request.headers = new Headers();
    await PageView();
    expect(capture).toHaveBeenCalledExactlyOnceWith("PageView");
  });

  it("captures nothing on the render that follows a server action", async () => {
    request.headers = new Headers({ "next-action": "7f3a9c" });
    await PageView();
    expect(capture).not.toHaveBeenCalled();
  });
});
