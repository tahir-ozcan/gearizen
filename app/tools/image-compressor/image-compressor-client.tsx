// app/tools/image-compressor/image-compressor-client.tsx

"use client";

import { useState, useEffect, ChangeEvent } from "react";
import NextImage from "next/image"; // Next.js Image bileşeni

export default function ImageCompressorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);

  const [quality, setQuality] = useState(0.8);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // Dosya seçildiğinde orijinal preview ayarla
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    setOriginalSize(file.size);
    setCompressedUrl(null);
    setCompressedSize(null);
    setError(null);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const compressImage = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);

    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(bitmap, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setCompressedUrl(url);
            setCompressedSize(blob.size);
          } else {
            setError("Compression failed.");
          }
          setProcessing(false);
        },
        file.type || "image/jpeg",
        quality,
      );
    } catch {
      setError("An error occurred during compression.");
      setProcessing(false);
    }
  };

  const downloadCompressed = () => {
    if (!compressedUrl) return;
    const a = document.createElement("a");
    a.href = compressedUrl;
    a.download = `compressed-${file?.name ?? "image"}`;
    a.click();
  };

  return (
    <section
      id="image-compressor"
      aria-labelledby="image-compressor-heading"
      className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="image-compressor-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Image Compressor
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Upload an image, adjust quality, and download a smaller file. 100%
        client-side, no signup required.
      </p>

      <div className="max-w-md mx-auto mb-8">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition"
        />
      </div>

      {originalUrl && (
        <>
          <div className="max-w-md mx-auto mb-8">
            <label
              htmlFor="quality"
              className="block mb-2 font-medium text-gray-800"
            >
              Quality:{" "}
              <span className="font-semibold">
                {Math.round(quality * 100)}%
              </span>
            </label>
            <input
              id="quality"
              type="range"
              min={0.1}
              max={1}
              step={0.1}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="text-center mb-8">
            <button
              onClick={compressImage}
              disabled={processing}
              className={`px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium ${
                processing ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {processing ? "Compressing..." : "Compress Image"}
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="max-w-md mx-auto mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md"
            >
              {error}
            </div>
          )}

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto mb-8">
            <div className="text-center">
              <p className="font-medium mb-2">Original</p>
              <div className="relative w-full h-48 mx-auto">
                <NextImage
                  src={originalUrl}
                  alt="Original"
                  loader={({ src }) => src}
                  unoptimized
                  fill
                  className="object-contain rounded-lg border"
                />
              </div>
              {originalSize != null && (
                <p className="mt-2 text-sm text-gray-600">
                  {(originalSize / 1024).toFixed(1)} KB
                </p>
              )}
            </div>

            {compressedUrl && (
              <div className="text-center">
                <p className="font-medium mb-2">Compressed</p>
                <div className="relative w-full h-48 mx-auto">
                  <NextImage
                    src={compressedUrl}
                    alt="Compressed"
                    loader={({ src }) => src}
                    unoptimized
                    fill
                    className="object-contain rounded-lg border"
                  />
                </div>
                {compressedSize != null && (
                  <p className="mt-2 text-sm text-gray-600">
                    {(compressedSize / 1024).toFixed(1)} KB
                  </p>
                )}
              </div>
            )}
          </div>

          {compressedUrl && (
            <div className="text-center">
              <button
                onClick={downloadCompressed}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition font-medium"
              >
                Download Compressed Image
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );}
