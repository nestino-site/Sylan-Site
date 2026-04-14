"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { HERO_VIDEO, LOCATION_IMAGE } from "../../lib/silyan-images";

type Props = {
  playLabel: string;
  imageAlt: string;
};

export default function LocationTeaserMedia({ playLabel, imageAlt }: Props) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!playing) return;
    const v = videoRef.current;
    if (!v) return;
    void v.play().catch(() => {
      /* autoplay may fail silently; user can use controls */
    });
  }, [playing]);

  return (
    <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-[var(--shadow-lg)]">
      {!playing ? (
        <>
          <Image
            src={LOCATION_IMAGE}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            loading="lazy"
          />
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors cursor-pointer group"
            aria-label={playLabel}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/45 text-white shadow-lg backdrop-blur-sm ring-2 ring-white/30 transition-transform group-hover:scale-105 group-active:scale-95">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        </>
      ) : (
        <video
          ref={videoRef}
          src={HERO_VIDEO}
          poster={LOCATION_IMAGE}
          controls
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
