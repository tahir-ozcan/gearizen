"use client";
import { useState } from "react";
import Image from "next/image";

export interface BeforeAfterSliderProps {
  before: string;
  after: string;
  width: number;
  height: number;
  alt?: string;
}

export default function BeforeAfterSlider({
  before,
  after,
  width,
  height,
  alt = "image",
}: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative w-full" style={{ maxWidth: width }}>
      <div
        className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm"
        style={{ paddingTop: `${(height / width) * 100}%` }}
      >
        <Image
          src={before}
          alt={alt}
          fill
          unoptimized
          className="object-cover"
        />
        <Image
          src={after}
          alt={alt}
          fill
          unoptimized
          style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
          className="absolute top-0 left-0 object-cover"
        />
      </div>
      <input
        aria-label="Compare images"
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="w-full mt-2"
      />
    </div>
  );
}
