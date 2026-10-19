"use client";

import type { StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { keep_playing } from "@/lib/keep_playing";

type autoplay_video_props = {
  src: string;
  poster: StaticImageData;
  label: string;
};

export const AutoplayVideo = ({ src, poster, label }: autoplay_video_props) => {
  const video = useRef<HTMLVideoElement>(null);
  const [blocked, set_blocked] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    return keep_playing(element, set_blocked);
  }, []);

  return (
    <div className="relative">
      <video
        ref={video}
        src={src}
        poster={poster.src}
        width={poster.width}
        height={poster.height}
        autoPlay
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
