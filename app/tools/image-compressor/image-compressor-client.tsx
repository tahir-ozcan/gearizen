// app/tools/image-compressor/image-compressor-client.tsx
"use client";

import { useState, useRef, ChangeEvent } from "react";
import PreviewImage from "@/components/PreviewImage";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import Input from "@/components/Input";
import Button from "@/components/Button";

interface Item {
  file: File;
  originalUrl: string;
  compressedUrl: string | null;
  originalSize: number;
  compressedSize: number | null;
  dimensions: { w: number; h: number };
}

export default function ImageCompressorClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [preset, setPreset] = useState<"low" | "medium" | "high" | "custom">(
    "high"
  );
  const [custom, setCustom] = useState(80);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const quality =
    preset === "custom"
      ? custom / 100
      : preset === "low"
      ? 0.3
      : preset === "medium"
      ? 0.6
      : 0.8;

  function handleFiles(list: FileList | File[]) {
    const files = Array.from(list).filter((f) => f.type.startsWith("image/"));
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        const img = new window.Image();
        img.onload = () => {
          const item: Item = {
            file,
            originalUrl: url,
            compressedUrl: null,
            originalSize: file.size,
            compressedSize: null,
            dimensions: { w: img.naturalWidth, h: img.naturalHeight },
          };
          setItems((prev) => [...prev, item]);
        };
        img.src = url;
      };
      reader.readAsDataURL(file);
    });
  }

  async function compressImages() {
    setProcessing(true);
    setError(null);
    for (const [idx, item] of items.entries()) {
      const img = new window.Image();
      img.src = item.originalUrl;
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej();
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, item.file.type || "image/jpeg", quality)
      );
      if (blob) {
        const url = URL.createObjectURL(blob);
        setItems((prev) =>
          prev.map((p, i) =>
            i === idx
              ? { ...p, compressedUrl: url, compressedSize: blob.size }
              : p
          )
        );
        await new Promise((r) => setTimeout(r, 0));
      }
    }
    setProcessing(false);
  }

  function download(idx: number) {
    const item = items[idx];
    if (!item.compressedUrl) return;
    const a = document.createElement("a");
    a.href = item.compressedUrl;
    a.download = `compressed-${item.file.name}`;
    a.click();
  }

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
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
        Drag & drop or select images, adjust quality, and download compressed
        versions. All in your browser.
      </p>

      <div
        aria-label="Upload images"
        tabIndex={0}
        role="button"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileInput.current?.click();
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="max-w-md mx-auto mb-6 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <p className="mb-2">Drag & drop images here or click to browse</p>
        <Input
          ref={fileInput}
          aria-label="Image files"
          type="file"
          accept="image/*"
          multiple
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) handleFiles(e.target.files);
          }}
          className="hidden"
        />
      </div>

      {items.length > 0 && (
        <div className="max-w-md mx-auto mb-8 space-y-4">
          <fieldset className="space-y-2">
            <legend className="font-medium text-gray-800">Quality</legend>
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="preset"
                  value="low"
                  checked={preset === "low"}
                  onChange={() => setPreset("low")}
                />
                <span>Low</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="preset"
                  value="medium"
                  checked={preset === "medium"}
                  onChange={() => setPreset("medium")}
                />
                <span>Medium</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="preset"
                  value="high"
                  checked={preset === "high"}
                  onChange={() => setPreset("high")}
                />
                <span>High</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="preset"
                  value="custom"
                  checked={preset === "custom"}
                  onChange={() => setPreset("custom")}
                />
                <span>Custom</span>
              </label>
            </div>
            {preset === "custom" && (
              <div className="pt-2">
                <Input
                  aria-label="Quality percent"
                  type="range"
                  min={10}
                  max={100}
                  value={custom}
                  onChange={(e) => setCustom(Number(e.target.value))}
                />
                <p className="text-sm text-gray-700 mt-1 text-center">
                  {custom}%
                </p>
              </div>
            )}
          </fieldset>
          <div className="text-center">
            <Button
              onClick={compressImages}
              disabled={processing}
              className={processing ? "opacity-60 cursor-not-allowed" : ""}
            >
              {processing ? "Compressing..." : "Compress Images"}
            </Button>
          </div>
          {error && (
            <div
              role="alert"
              className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md"
            >
              {error}
            </div>
          )}
        </div>
      )}

      {items.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {items.map((item, idx) => {
            const est = Math.round(item.originalSize * quality);
            return (
              <div key={idx} className="space-y-2 text-center">
                {item.compressedUrl ? (
                  <BeforeAfterSlider
                    before={item.originalUrl}
                    after={item.compressedUrl}
                    width={item.dimensions.w}
                    height={item.dimensions.h}
                    alt={item.file.name}
                  />
                ) : (
                  <PreviewImage
                    src={item.originalUrl}
                    alt={item.file.name}
                    width={item.dimensions.w}
                    height={item.dimensions.h}
                  />
                )}
                <p className="text-sm text-gray-700">
                  {(item.originalSize / 1024).toFixed(1)} KB →{' '}
                  {item.compressedSize
                    ? `${(item.compressedSize / 1024).toFixed(1)} KB`
                    : `${(est / 1024).toFixed(1)} KB est.`}
                </p>
                {item.compressedUrl && (
                  <Button
                    onClick={() => download(idx)}
                    className="bg-green-600 hover:bg-green-700 focus:ring-green-500 text-sm"
                  >
                    Download
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
