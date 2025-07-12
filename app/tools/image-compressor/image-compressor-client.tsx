// app/tools/image-compressor/image-compressor-client.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import BeforeAfter from "@/components/BeforeAfter";
import Input from "@/components/Input";
import Button from "@/components/Button";

interface Item {
  file: File;
  originalUrl: string;
  compressedUrl: string | null;
  originalSize: number;
  compressedSize: number | null;
  width: number;
  height: number;
}

export default function ImageCompressorClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [quality, setQuality] = useState(0.8);
  const fileInput = useRef<HTMLInputElement>(null);
  const processingRef = useRef(false);

  // cleanup urls
  useEffect(() => {
    return () => {
      items.forEach((it) => {
        URL.revokeObjectURL(it.originalUrl);
        if (it.compressedUrl) URL.revokeObjectURL(it.compressedUrl);
      });
    };
  }, [items]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    list.forEach((file) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setItems((prev) => [
          ...prev,
          {
            file,
            originalUrl: url,
            compressedUrl: null,
            originalSize: file.size,
            compressedSize: null,
            width: img.naturalWidth,
            height: img.naturalHeight,
          },
        ]);
      };
      img.src = url;
    });
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const runCompression = async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    for (const it of items) {
      await new Promise((res) => setTimeout(res));
      await compress(it);
    }
    processingRef.current = false;
  };

  useEffect(() => {
    if (items.length === 0) return;
    const t = setTimeout(runCompression, 200);
    return () => clearTimeout(t);
  }, [quality, items]);

  const compress = async (item: Item) => {
    const img = new Image();
    img.src = item.originalUrl;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject();
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, item.file.type || "image/jpeg", quality)
    );
    if (!blob) return;
    setItems((prev) =>
      prev.map((it) =>
        it.originalUrl === item.originalUrl
          ? {
              ...it,
              compressedUrl: it.compressedUrl
                ? (URL.revokeObjectURL(it.compressedUrl),
                  URL.createObjectURL(blob))
                : URL.createObjectURL(blob),
              compressedSize: blob.size,
            }
          : it
      )
    );
  };

  const download = (item: Item) => {
    if (!item.compressedUrl) return;
    const a = document.createElement("a");
    a.href = item.compressedUrl;
    a.download = `compressed-${item.file.name}`;
    a.click();
  };

  const preset = (q: number) => setQuality(q);

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
        Drag & drop images or browse to compress them directly in your browser.
      </p>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        tabIndex={0}
        role="button"
        aria-label="Upload images"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            fileInput.current?.click();
          }
        }}
        onClick={() => fileInput.current?.click()}
        className="mb-8 max-w-xl mx-auto p-8 border-2 border-dashed rounded-lg text-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <p className="text-gray-700">Drag & drop images here or click to browse.</p>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {items.length > 0 && (
        <div className="max-w-xl mx-auto mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-x-2">
              <Button type="button" onClick={() => preset(0.3)} className="text-sm">
                Low
              </Button>
              <Button type="button" onClick={() => preset(0.6)} className="text-sm">
                Medium
              </Button>
              <Button type="button" onClick={() => preset(0.8)} className="text-sm">
                High
              </Button>
            </div>
            <label htmlFor="quality" className="font-medium text-gray-800">
              Quality: {Math.round(quality * 100)}%
            </label>
          </div>
          <Input
            id="quality"
            type="range"
            min={0.1}
            max={1}
            step={0.01}
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            aria-label="Custom quality"
            className="w-full"
          />
        </div>
      )}

      {items.length > 0 && (
        <ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {items.map((it, idx) => (
            <li key={idx} className="list-none space-y-2 text-center">
              {it.compressedUrl ? (
                <BeforeAfter
                  before={it.originalUrl}
                  after={it.compressedUrl}
                  width={it.width}
                  height={it.height}
                  altBefore="Original"
                  altAfter="Compressed"
                />
              ) : (
                <img
                  src={it.originalUrl}
                  alt="Original"
                  width={it.width}
                  height={it.height}
                  className="w-full h-auto object-contain rounded-lg border border-gray-200 shadow-sm"
                />
              )}
              <p className="text-sm text-gray-600">
                {it.compressedSize != null
                  ? `${(it.compressedSize / 1024).toFixed(1)} KB`
                  : `${((it.originalSize * quality) / 1024).toFixed(1)} KB (est.)`} /{' '}
                {(it.originalSize / 1024).toFixed(1)} KB
              </p>
              {it.compressedUrl && (
                <Button onClick={() => download(it)} className="w-full text-sm">
                  Download
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
