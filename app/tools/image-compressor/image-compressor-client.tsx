// app/tools/image-compressor/image-compressor-client.tsx

"use client";

import { useState, useEffect } from "react";
import PreviewImage from "@/components/PreviewImage";
import Button from "@/components/Button";
import DropZone from "@/components/DropZone";
import Spinner from "@/components/Spinner";
import useDebounce from "@/lib/useDebounce";

interface LoadedImage {
  file: File;
  url: string;
  width: number;
  height: number;
}

export default function ImageCompressorClient() {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [quality, setQuality] = useState(75);
  const debouncedQuality = useDebounce(quality, 100);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // cleanup blob urls on unmount or reset
  useEffect(() => {
    return () => {
      if (image?.url.startsWith("blob:")) URL.revokeObjectURL(image.url);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [image, compressedUrl]);

  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (!file) return;
    if (!/(png|jpe?g)/i.test(file.type)) {
      setError("Please upload a JPEG or PNG image");
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setImage({ file, url, width: img.naturalWidth, height: img.naturalHeight });
      setCompressedUrl(null);
      setCompressedSize(null);
      setError(null);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError("Failed to load image");
    };
    img.src = url;
  };

  const compress = async () => {
    if (!image) return;
    setProcessing(true);
    try {
      const img = new window.Image();
      img.src = image.url;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("load"));
      });
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(
          resolve,
          image.file.type.includes("png") ? "image/png" : "image/jpeg",
          debouncedQuality / 100,
        ),
      );
      if (!blob) throw new Error("Compression failed");
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
      setCompressedUrl(URL.createObjectURL(blob));
      setCompressedSize(blob.size);
    } catch {
      setError("Failed to compress image");
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!compressedUrl || !image) return;
    const a = document.createElement("a");
    a.href = compressedUrl;
    const ext = image.file.name.split(".").pop() || "jpg";
    a.download = `compressed.${ext}`;
    a.click();
  };

  const reset = () => {
    if (image?.url.startsWith("blob:")) URL.revokeObjectURL(image.url);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setImage(null);
    setCompressedUrl(null);
    setCompressedSize(null);
    setError(null);
  };

  const originalSizeKb = image ? (image.file.size / 1024).toFixed(1) : "0";
  const compressedSizeKb =
    compressedSize != null ? (compressedSize / 1024).toFixed(1) : null;
  const reduction =
    compressedSize != null
      ? (((1 - compressedSize / image!.file.size) * 100).toFixed(1))
      : null;

  const presets = [
    { label: "Low (50%)", value: 50 },
    { label: "Medium (75%)", value: 75 },
    { label: "High (90%)", value: 90 },
  ];

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
        Upload a JPEG or PNG, choose quality and compress it directly in your browser.
      </p>

      {!image && (
        <div className="max-w-md mx-auto mb-8">
          <DropZone onFiles={handleFiles} multiple={false} />
        </div>
      )}

      {image && (
        <div className="space-y-6">
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex justify-center gap-2">
              {presets.map((p) => (
                <Button key={p.label} onClick={() => setQuality(p.value)} className="px-4 py-2">
                  {p.label}
                </Button>
              ))}
            </div>
            <label htmlFor="quality" className="block font-medium text-gray-800">
              Quality: <span className="font-semibold">{quality}%</span>
            </label>
            <input
              id="quality"
              type="range"
              min={0}
              max={100}
              step={1}
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className="w-full"
              aria-label="Quality"
            />
          </div>

          <div className="text-center">
            <Button
              onClick={compress}
              disabled={processing}
              aria-label="Compress image"
              className={processing ? "opacity-60 cursor-not-allowed" : ""}
            >
              {processing ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner className="h-5 w-5" /> Compressing...
                </span>
              ) : (
                "Compress"
              )}
            </Button>
            <button
              onClick={reset}
              className="ml-4 text-sm text-indigo-600 underline hover:text-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Reset
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-start">
            <div className="text-center">
              <PreviewImage
                src={image.url}
                alt="Original image"
                width={image.width}
                height={image.height}
              />
              <p className="text-sm text-gray-600 mt-2">Original – {originalSizeKb} KB</p>
            </div>

            {compressedUrl && (
              <div className="text-center">
                <PreviewImage
                  src={compressedUrl}
                  alt="Compressed image"
                  width={image.width}
                  height={image.height}
                />
                {compressedSizeKb && (
                  <p className="text-sm text-gray-600 mt-2">
                    Compressed – {compressedSizeKb} KB ({reduction}% reduction) @ {debouncedQuality}% quality
                  </p>
                )}
                <div className="mt-2">
                  <Button onClick={download} aria-label="Download compressed image">
                    Download Compressed
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div role="alert" className="max-w-md mx-auto mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </section>
  );
}

