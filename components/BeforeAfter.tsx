import { useState } from "react";

export interface BeforeAfterProps {
  before: string;
  after: string;
  width: number;
  height: number;
  altBefore?: string;
  altAfter?: string;
}

export default function BeforeAfter({
  before,
  after,
  width,
  height,
  altBefore = "Before",
  altAfter = "After",
}: BeforeAfterProps) {
  const [pos, setPos] = useState(0.5);
  return (
    <div className="relative w-full" style={{ maxWidth: width, height }}>
      <img
        src={after}
        alt={altAfter}
        width={width}
        height={height}
        className="w-full h-full object-contain rounded-lg border border-gray-200 shadow-sm"
      />
      <img
        src={before}
        alt={altBefore}
        width={width}
        height={height}
        className="absolute top-0 left-0 w-full h-full object-contain rounded-lg pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - pos * 100}% 0 0)` }}
      />
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={pos}
        aria-label="Before after slider"
        onChange={(e) => setPos(parseFloat(e.target.value))}
        className="absolute bottom-1 left-0 w-full h-2 opacity-80"
      />
    </div>
  );
}
