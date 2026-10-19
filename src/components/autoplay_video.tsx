"use client";

import type { StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { play_in_view, type play_in_view_settings } from "@/lib/play_in_view";

type autoplay_video_props = play_in_view_settings & {
  src: string;
  poster: StaticImageData;
  label: string;
};

export const AutoplayVideo = ({
  src,
  poster,
  label,
  start_margin,
  pause_off_screen,
}: autoplay_video_props) => {
  const video = useRef<HTMLVideoElement>(null);
  const [blocked, set_blocked] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    return play_in_view(
      element,
      { start_margin, pause_off_screen },
      set_blocked,
    );
  }, [start_margin, pause_off_screen]);

  return (
    <div className="relative">
      <video
        ref={video}
        src={src}
        poster={poster.src}
        width={poster.width}
        height={poster.height}
        preload="none"
        muted
        loop
        playsInline
        aria-label={label}
        className="block h-auto w-full"
      />
      {blocked && (
        <button
          type="button"
          className="absolute inset-0 grid cursor-pointer place-items-center"
        >
          <span className="border border-paper/50 bg-ink/50 px-4 py-2 text-paper backdrop-blur-xs">
            Lire la vidéo
          </span>
        </button>
      )}
    </div>
  );
};
