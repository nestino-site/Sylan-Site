"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import type { VillaImageSet } from "../lib/silyan-images";

type Props = {
  images: VillaImageSet;
  villaName: string;
  galleryLabel: string;
};

export default function GallerySection({ images, villaName, galleryLabel }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const gallery = images.gallery;

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prev = useCallback(() => {
    setLightboxIdx((i) => (i !== null && i > 0 ? i - 1 : gallery.length - 1));
  }, [gallery.length]);
  const next = useCallback(() => {
    setLightboxIdx((i) => (i !== null && i < gallery.length - 1 ? i + 1 : 0));
  }, [gallery.length]);

  useEffect(() => {
    if (lightboxIdx === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIdx, closeLightbox, prev, next]);

  return (
    <>
      <div className="mb-10" id="gallery">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--accent-500)" }}>
          {galleryLabel}
        </p>

        {/* Mobile: swipeable carousel */}
        <div className="snap-carousel sm:hidden -mx-4 px-4">
          {gallery.slice(0, 12).map((src, i) => (
            <button
              key={i}
              onClick={() => setLightboxIdx(i)}
              className="relative aspect-[4/3] w-[80vw] rounded-lg overflow-hidden bg-[var(--color-border)] shrink-0 active:scale-[0.98] transition-transform"
            >
              <Image
                src={src}
                alt={`${villaName} — photo ${i + 1}`}
                fill
                sizes="80vw"
                className="object-cover"
                loading="lazy"
              />
              {/* Photo count badge on first image */}
              {i === 0 && (
                <span className="absolute bottom-2 end-2 px-2 py-1 rounded-md text-xs font-medium text-white backdrop-blur-md" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                  1/{gallery.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-2">
          {gallery.slice(0, 8).map((src, i) => (
            <button
              key={i}
              onClick={() => setLightboxIdx(i)}
              className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[var(--color-border)] cursor-pointer group"
            >
              <Image
                src={src}
                alt={`${villaName} — photo ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
                loading="lazy"
              />
              {i === 7 && gallery.length > 8 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">+{gallery.length - 8}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center safe-bottom"
          style={{ zIndex: "var(--z-lightbox)" }}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
        >
          <button
            className="absolute top-4 end-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors z-10"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4l12 12M16 4L4 16" />
            </svg>
          </button>

          {/* Nav arrows — hidden on mobile (swipe instead) */}
          <button
            className="hidden sm:flex absolute start-4 top-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="rtl:rotate-180"><path d="M12 4l-6 6 6 6" /></svg>
          </button>
          <button
            className="hidden sm:flex absolute end-4 top-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="rtl:rotate-180"><path d="M8 4l6 6-6 6" /></svg>
          </button>

          <div className="relative max-w-5xl w-full aspect-video mx-4" onClick={(e) => e.stopPropagation()}>
            <Image
              src={gallery[lightboxIdx]!}
              alt={`${villaName} — photo ${lightboxIdx + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm tabular-nums">
            {lightboxIdx + 1} / {gallery.length}
          </p>
        </div>
      )}
    </>
  );
}
