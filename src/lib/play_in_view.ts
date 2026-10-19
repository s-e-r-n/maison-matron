import { keep_playing } from "./keep_playing";

export type play_in_view_settings = {
  start_margin?: number;
  pause_off_screen?: boolean;
};

export const play_in_view = (
  video: HTMLVideoElement,
  { start_margin = 0, pause_off_screen = true }: play_in_view_settings,
  on_blocked_change: (blocked: boolean) => void,
) => {
  const player = keep_playing(video, on_blocked_change);

  const viewport = new IntersectionObserver(
    (entries) => {
      if (!entries[entries.length - 1]?.isIntersecting) return player.pause();
      if (!pause_off_screen) viewport.disconnect();
      player.play();
    },
    { rootMargin: `${start_margin}px` },
  );
  viewport.observe(video);

  return () => {
    viewport.disconnect();
    player.release();
  };
};
