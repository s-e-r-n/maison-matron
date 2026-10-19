import { describe, expect, it, vi } from "vitest";
import { keep_playing } from "../keep_playing";

describe("keep_playing", () => {
  it("starts the video the moment the observer reports its edge crossing the viewport", () => {
    let reach_boundary = () => {};
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(report: (entries: { isIntersecting: boolean }[]) => void) {
          reach_boundary = () => report([{ isIntersecting: true }]);
        }
        observe = () => {};
        disconnect = () => {};
      },
    );
    const play = vi.fn(() => Promise.resolve());
    const listeners = {
      addEventListener: () => {},
      removeEventListener: () => {},
    };
    vi.stubGlobal("window", listeners);
    vi.stubGlobal("document", {
      ...listeners,
      visibilityState: "visible",
      createElement: () => ({ ...listeners, play, setAttribute: () => {} }),
    });

    keep_playing(document.createElement("video"), () => {});
    expect(play).not.toHaveBeenCalled();
    reach_boundary();
    expect(play).toHaveBeenCalledOnce();
  });
});
