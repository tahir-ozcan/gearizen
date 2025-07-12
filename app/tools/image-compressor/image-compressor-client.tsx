// app/tools/image-compressor/image-compressor-client.tsx

"use client";

import { useState, useEffect } from "react";
import PreviewImage from "@/components/PreviewImage";
import Button from "@/components/Button";
import DropZone from "@/components/DropZone";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";

interface Item {
  file: File;
  originalUrl: string;
  originalSize: number;
  width: number;
  height: number;
  compressedUrl: string | null;
  compressedSize: number | null;
}

const PRESETS = [
  { label: "Low", value: 0.4 },
  { label: "Medium", value: 0.7 },
  { label: "High", value: 0.9 },
];

export default function ImageCompressorClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [quality, setQuality] = useState(0.8);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (files: FileList) => {
    const loadPromises = Array.from(files).map(
      (file) =>
        new Promise<Item>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const url = reader.result as string;
            const img = new window.Image();
            img.onload = () =>
              resolve({
                file,
                originalUrl: url,
                originalSize: file.size,
                width: img.naturalWidth,
                height: img.naturalHeight,
                compressedUrl: null,
                compressedSize: null,
              });
            img.onerror = () => reject(new Error("load"));
            img.src = url;
          };
          reader.onerror = () => reject(new Error("read"));
          reader.readAsDataURL(file);
        })
    );

    Promise.all(loadPromises)
      .then((list) => {
        setItems(list);
        setError(null);
      })
      .catch(() => setError("Failed to load image"));
  };

  useEffect(() => {
    return () => {
      items.forEach((it) => {
        if (it.compressedUrl) URL.revokeObjectURL(it.compressedUrl);
        if (it.originalUrl.startsWith("blob:")) URL.revokeObjectURL(it.originalUrl);
      });
    };
  }, [items]);

  const compressImages = async (previewOnly = false) => {
    setProcessing(true);
    const updated: Item[] = [];
    for (const item of items) {
      const img = new window.Image();
      img.src = item.originalUrl;
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej(new Error("load"));
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, item.file.type || "image/jpeg", quality)
      );
      if (!blob) throw new Error("Compression failed");
      const copy: Item = { ...item };
      copy.compressedSize = blob.size;
      if (!previewOnly) {
        if (copy.compressedUrl) URL.revokeObjectURL(copy.compressedUrl);
        copy.compressedUrl = URL.createObjectURL(blob);
      }
      updated.push(copy);
      await new Promise((r) => setTimeout(r, 0));
    }
    setItems(updated);
    setProcessing(false);
  };

  useEffect(() => {
    if (items.length) compressImages(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quality]);

  const download = (item: Item) => {
    if (!item.compressedUrl) return;
    const a = document.createElement("a");
    a.href = item.compressedUrl;
    a.download = `compressed-${item.file.name}`;
    a.click();
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
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
        Upload images, adjust quality and download smaller files. 100% client-side, no signup required.
      </p>

      <div className="max-w-xl mx-auto mb-8">
        <DropZone onFiles={handleFiles} />
      </div>

      {items.length > 0 && (
        <>
          <div className="max-w-xl mx-auto mb-8 space-y-4">
            <div className="flex justify-center gap-2">
              {PRESETS.map((p) => (
                <Button
                  key={p.label}
                  onClick={() => setQuality(p.value)}
                  className="px-4 py-2"
                >
                  {p.label}
                </Button>
              ))}
            </div>
            <label htmlFor="quality" className="block font-medium text-gray-800">
              Quality: <span className="font-semibold">{Math.round(quality * 100)}%</span>
            </label>
            <input
              id="quality"
              type="range"
              min={0.1}
              max={1}
              step={0.01}
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="text-center mb-8">
            <Button
              onClick={() => compressImages(false)}
              disabled={processing}
              className={processing ? "opacity-60 cursor-not-allowed" : ""}
            >
              {processing ? "Compressing..." : "Compress Images"}
            </Button>
          </div>

          {error && (
            <div
              role="alert"
              className="max-w-md mx-auto mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md"
            >
              {error}
            </div>
          )}

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto mb-8">
            {items.map((item, idx) => (
              <div key={idx} className="text-center space-y-2">
                {item.compressedUrl ? (
                  <BeforeAfterSlider
                    original={item.originalUrl}
                    compressed={item.compressedUrl}
                    width={item.width}
                    height={item.height}
                    alt={`Compressed image ${idx + 1}`}
                  />
                ) : (
                  <PreviewImage
                    src={item.originalUrl}
                    alt={`Original image ${idx + 1}`}
                    width={item.width}
                    height={item.height}
                  />
                )}
                <p className="text-sm text-gray-600">
                  {(item.originalSize / 1024).toFixed(1)} KB
                  {item.compressedSize != null && ` → ${(item.compressedSize / 1024).toFixed(1)} KB`}
                </p>
                {item.compressedUrl && (
                  <Button onClick={() => download(item)} className="bg-green-600 hover:bg-green-700 focus:ring-green-500">
                    Download
                  </Button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
