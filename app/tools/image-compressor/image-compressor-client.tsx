// app/tools/image-compressor/image-compressor-client.tsx
"use client";

import { useState, useEffect } from "react";
import DropZone from "@/components/DropZone";
import Button from "@/components/Button";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { estimateCompressedSize } from "./compress-utils";

interface Item {
  file: File;
  url: string;
  width: number;
  height: number;
  originalSize: number;
  compressedUrl?: string;
  compressedSize?: number;
}

const presets = [
  { label: "Low", value: 0.3 },
  { label: "Medium", value: 0.6 },
  { label: "High", value: 0.8 },
];

export default function ImageCompressorClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [quality, setQuality] = useState(0.8);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      items.forEach(i => {
        URL.revokeObjectURL(i.url);
        if (i.compressedUrl) URL.revokeObjectURL(i.compressedUrl);
      });
    };
  }, [items]);

  const loadFiles = async (files: FileList) => {
    const list: Item[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const url = URL.createObjectURL(file);
      const img = document.createElement("img");
      img.src = url;
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej();
      });
      list.push({
        file,
        url,
        width: img.naturalWidth,
        height: img.naturalHeight,
        originalSize: file.size,
      });
    }
    setItems(prev => [...prev, ...list]);
  };

  const compressOne = async (item: Item) => {
    const img = document.createElement("img");
    img.src = item.url;
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej();
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    ctx.drawImage(img, 0, 0);
    const blob = await new Promise<Blob | null>(resolve =>
      canvas.toBlob(resolve, item.file.type || "image/jpeg", quality)
    );
    if (!blob) throw new Error("Compression failed");
    item.compressedUrl = URL.createObjectURL(blob);
    item.compressedSize = blob.size;
  };

  const compressImages = async () => {
    setProcessing(true);
    setError(null);
    const newItems = [...items];
    for (const item of newItems) {
      try {
        await compressOne(item);
      } catch {
        setError("An error occurred during compression.");
        break;
      }
      await new Promise(r => setTimeout(r, 0));
    }
    setItems(newItems);
    setProcessing(false);
  };

  return (
    <section
      id="image-compressor"
      aria-labelledby="image-compressor-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="image-compressor-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Image Compressor
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Upload images, adjust quality, and download smaller files. 100% client-side, no signup required.
      </p>

      <div className="max-w-lg mx-auto mb-8">
        <DropZone onFiles={loadFiles} />
      </div>

      {items.length > 0 && (
        <div className="max-w-lg mx-auto mb-8 space-y-4">
          <div className="flex items-center space-x-2 justify-center flex-wrap">
            {presets.map(p => (
              <button
                key={p.label}
                onClick={() => setQuality(p.value)}
                className="btn-secondary text-sm"
              >
                {p.label}
              </button>
            ))}
          </div>
          <label htmlFor="quality" className="block mb-2 font-medium text-gray-800 text-center">
            Quality: <span className="font-semibold">{Math.round(quality * 100)}%</span>
          </label>
          <input
            id="quality"
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={quality}
            onChange={e => setQuality(e.currentTarget.valueAsNumber)}
            className="w-full"
          />
        </div>
      )}

      {items.length > 0 && (
        <div className="text-center mb-8">
          <Button
            onClick={compressImages}
            disabled={processing}
            className={processing ? "opacity-60 cursor-not-allowed" : ""}
          >
            {processing ? "Compressing..." : "Compress Images"}
          </Button>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="max-w-md mx-auto mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md"
        >
          {error}
        </div>
      )}

      {items.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {items.map((item, idx) => (
            <div key={idx} className="space-y-2 text-center">
              <p className="font-medium">Original</p>
              <img
                src={item.url}
                alt="Original"
                width={item.width}
                height={item.height}
                className="w-full h-auto rounded-lg border border-gray-200 shadow-sm"
              />
              <p className="text-sm text-gray-600">
                {(item.originalSize / 1024).toFixed(1)} KB → ~{(estimateCompressedSize(item.originalSize, quality) / 1024).toFixed(1)} KB
              </p>
              {item.compressedUrl && (
                <>
                  <BeforeAfterSlider
                    original={item.url}
                    compressed={item.compressedUrl}
                    width={item.width}
                    height={item.height}
                    alt="preview"
                  />
                  {item.compressedSize != null && (
                    <button
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = item.compressedUrl!;
                        a.download = `compressed-${item.file.name}`;
                        a.click();
                      }}
                      className="btn-primary text-sm w-full mt-2"
                    >
                      Download ({(item.compressedSize / 1024).toFixed(1)} KB)
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
