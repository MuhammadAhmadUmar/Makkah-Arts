"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { ProductImage } from "@/types/database";

interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const sorted = useMemo(
    () => [...images].sort((a, b) => a.sort_order - b.sort_order),
    [images],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const active = sorted[activeIndex];

  useEffect(() => {
    if (sorted.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % sorted.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [sorted.length]);

  useEffect(() => {
    if (!isZoomOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsZoomOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomOpen]);

  if (!sorted.length) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center bg-stone-100 text-muted">
        No images available
      </div>
    );
  }

  const showPrevious = () => {
    setActiveIndex((current) => (current === 0 ? sorted.length - 1 : current - 1));
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % sorted.length);
  };

  return (
    <div>
      <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] border border-border bg-stone-100 shadow-[0_18px_50px_rgba(26,26,26,0.06)]">
        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          className="absolute inset-0 h-full w-full"
          aria-label={`Zoom ${title} image`}
        >
          <Image
            src={active.url}
            alt={active.alt_text ?? title}
            fill
            priority={activeIndex === 0}
            className="object-contain object-center transition duration-300 hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </button>

        {sorted.length > 1 && (
          <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-3 px-4">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              className="rounded-full border border-white/70 bg-black/50 px-3 py-2 text-xs uppercase tracking-[0.2em] text-white backdrop-blur"
            >
              Prev
            </button>
            <span className="rounded-full bg-black/50 px-3 py-2 text-xs uppercase tracking-[0.2em] text-white backdrop-blur">
              {activeIndex + 1}/{sorted.length}
            </span>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              className="rounded-full border border-white/70 bg-black/50 px-3 py-2 text-xs uppercase tracking-[0.2em] text-white backdrop-blur"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <p className="mt-3 text-[11px] uppercase tracking-[0.35em] text-muted">
        Click image to zoom
      </p>

      {sorted.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {sorted.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-xl border-2 ${
                index === activeIndex ? "border-accent" : "border-transparent"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt_text ?? `${title} ${index + 1}`}
                fill
                className="object-cover object-center"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}

      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="relative w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 z-10 rounded-full bg-white/90 px-3 py-2 text-sm font-medium text-foreground"
            >
              Close
            </button>
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone-100">
              <Image
                src={active.url}
                alt={active.alt_text ?? title}
                fill
                className="object-contain object-center"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
