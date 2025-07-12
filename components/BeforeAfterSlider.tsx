import { useState } from 'react';

export interface BeforeAfterSliderProps {
  original: string;
  compressed: string;
  width: number;
  height: number;
  alt?: string;
}

export default function BeforeAfterSlider({
  original,
  compressed,
  width,
  height,
  alt = 'preview',
}: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50);

  return (
    <div className="relative w-full">
      <img
        src={original}
        alt={`${alt} original`}
        width={width}
        height={height}
        className="block w-full h-auto rounded-lg"
      />
      <img
        src={compressed}
        alt={`${alt} compressed`}
        width={width}
        height={height}
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        className="absolute top-0 left-0 w-full h-auto rounded-lg pointer-events-none"
      />
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        aria-label="Compare original and compressed"
        onChange={e => setPos(e.currentTarget.valueAsNumber)}
        className="absolute bottom-1 left-0 right-0 w-full opacity-70"/>
    </div>
  );
}
