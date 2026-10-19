import { describe, expect, it, vi } from "vitest";
import { play_in_view } from "../play_in_view";

describe("play_in_view", () => {
  it("starts the video when its edge crosses into the viewport and pauses it when it crosses out", () => {
    let report = (_entries: { isIntersecting: boolean }[]) => {};
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: typeof report) {
          report = callback;
        }
        observe = () => {};
        disconnect = () => {};
      },
    );
    const play = vi.fn(() => Promise.resolve());
    const pause = vi.fn();
    const listeners = {
      addEventListener: () => {},
      removeEventListener: () => {},
    };
    vi.stubGlobal("window", listeners);
    vi.stubGlobal("document", {
      ...listeners,
      visibilityState: "visible",
      createElement: () => ({
        ...listeners,
        play,
        pause,
        setAttribute: () => {},
      }),
    });

    play_in_view(document.createElement("video"), {}, () => {});
    expect(play).not.toHaveBeenCalled();
    report([{ isIntersecting: true }]);
    expect(play).toHaveBeenCalledOnce();
    report([{ isIntersecting: false }]);
    expect(pause).toHaveBeenCalledOnce();
  });
});
