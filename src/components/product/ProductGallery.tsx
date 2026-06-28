"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/types/database";

interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = sorted[activeIndex];

  if (!sorted.length) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center bg-stone-100 text-muted">
        No images available
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
        <Image
          src={active.url}
          alt={active.alt_text ?? title}
          fill
          priority={activeIndex === 0}
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      {sorted.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {sorted.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square overflow-hidden border-2 ${
                index === activeIndex ? "border-accent" : "border-transparent"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt_text ?? `${title} ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
