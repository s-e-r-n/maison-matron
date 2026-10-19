const retry_budget = 3;
const retry_events = ["canplay", "loadeddata", "pause"] as const;
const gestures = ["pointerdown", "touchend", "keydown"] as const;
const gesture_options = { capture: true, passive: true };
const waiting = new Map<HTMLVideoElement, () => void>();

const disarm = () => {
  for (const gesture of gestures) {
    document.removeEventListener(gesture, unlock, gesture_options);
  }
};

const arm = () => {
  for (const gesture of gestures) {
    document.addEventListener(gesture, unlock, gesture_options);
  }
};

const unlock = () => {
  disarm();
  for (const resume of waiting.values()) resume();
};

const prepare = (video: HTMLVideoElement) => {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("webkit-playsinline", "");
  video.autoplay = true;
};

const is_hidden = () => document.visibilityState === "hidden";

export const keep_playing = (
  video: HTMLVideoElement,
  on_blocked_change: (blocked: boolean) => void,
) => {
  let retries_left = retry_budget;

  const block = () => {
    waiting.set(video, resume);
    arm();
    on_blocked_change(true);
  };

  const unblock = () => {
    retries_left = retry_budget;
    waiting.delete(video);
    on_blocked_change(false);
  };

  const refuse = (error: unknown) => {
    const name = error instanceof DOMException ? error.name : undefined;
    if (name === "AbortError") return;
    if (name === "NotAllowedError") return block();
    reportError(error);
  };

  const attempt = () => {
    if (is_hidden()) return;
    prepare(video);
    video.play().catch(refuse);
  };

  const resume = () => {
    retries_left = retry_budget;
    attempt();
  };

  const retry = () => {
    if (retries_left === 0) return;
    retries_left -= 1;
    attempt();
  };

  const start = () => {
    video.addEventListener("playing", unblock);
    for (const event of retry_events) video.addEventListener(event, retry);
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("pageshow", resume);
    attempt();
  };

  const viewport = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    viewport.disconnect();
    start();
  });
  viewport.observe(video);

  return () => {
    viewport.disconnect();
    video.removeEventListener("playing", unblock);
    for (const event of retry_events) video.removeEventListener(event, retry);
    document.removeEventListener("visibilitychange", resume);
    window.removeEventListener("pageshow", resume);
    waiting.delete(video);
    if (waiting.size === 0) disarm();
  };
};
