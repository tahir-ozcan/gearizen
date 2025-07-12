"use client";
import { useState } from "react";
import PreviewImage from "./PreviewImage";

interface Props {
  original: string;
  compressed: string;
  width: number;
  height: number;
  alt: string;
}

export default function BeforeAfterSlider({
  original,
  compressed,
  width,
  height,
  alt,
}: Props) {
  const [ratio, setRatio] = useState(0.5);
  return (
    <div className="relative w-full">
      <PreviewImage src={original} alt={alt} width={width} height={height} />
      <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
        <img
          src={compressed}
          alt=""
          className="absolute inset-0 w-full h-full object-contain"
          style={{ clipPath: `inset(0 0 0 ${ratio * 100}% )` }}
        />
      </div>
      <input
        aria-label="Before After slider"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={ratio}
        onChange={(e) => setRatio(parseFloat(e.target.value))}
        className="absolute bottom-2 left-0 right-0 w-full pointer-events-auto"
      />
    </div>
  );
}
