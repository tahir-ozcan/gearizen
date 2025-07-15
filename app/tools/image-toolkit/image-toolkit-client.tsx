// app/tools/image-toolkit/image-toolkit-client.tsx
"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { ClipboardCopy } from "lucide-react";

/**
 * Image Toolkit: Compress & Resize
 *
 * Optimize JPEG/PNG images and resize with optional aspect-ratio lock—fast,
 * free and privacy-focused, with high-quality output and direct download.
 */
export default function ImageToolkitClient() {
  // --- State ---
  const [file, setFile] = useState<File | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string>("");
  const [resizedSrc, setResizedSrc] = useState<string>("");
  const [origW, setOrigW] = useState<number>(0);
  const [origH, setOrigH] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [quality, setQuality] = useState<number>(0.8);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Handlers ---

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setError(null);
    setResizedSrc("");
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (!f) {
      setOriginalSrc("");
      return;
    }
    if (!/^image\/(png|jpeg)$/.test(f.type)) {
      setError("❌ Please select a PNG or JPEG image.");
      setOriginalSrc("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setOriginalSrc(src);
    };
    reader.readAsDataURL(f);
  }

  // Capture original dimensions when the image loads
  useEffect(() => {
    if (!originalSrc) return;
    const img = document.createElement("img");
    img.src = originalSrc;
    img.onload = () => {
      setOrigW(img.naturalWidth);
      setOrigH(img.naturalHeight);
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    };
  }, [originalSrc]);

  // Redraw canvas whenever source, dimensions, or quality change
  useEffect(() => {
    if (!originalSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const img = document.createElement("img");
    img.src = originalSrc;
    img.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Choose MIME based on original file type
      const mime = file?.type === "image/jpeg" ? "image/jpeg" : "image/png";
      // Export with quality for JPEG
      const dataUrl =
        mime === "image/jpeg"
          ? canvas.toDataURL(mime, quality)
          : canvas.toDataURL(mime);
      setResizedSrc(dataUrl);
    };
  }, [originalSrc, width, height, quality, file]);

  function handleWidthChange(e: ChangeEvent<HTMLInputElement>) {
    const w = Math.max(1, Number(e.target.value) || 1);
    if (lockAspect && origW) {
      setHeight(Math.round((w / origW) * origH));
    }
    setWidth(w);
  }

  function handleHeightChange(e: ChangeEvent<HTMLInputElement>) {
    const h = Math.max(1, Number(e.target.value) || 1);
    if (lockAspect && origH) {
      setWidth(Math.round((h / origH) * origW));
    }
    setHeight(h);
  }

  async function copyBase64() {
    if (!resizedSrc) return;
    await navigator.clipboard.writeText(resizedSrc);
    alert("✅ Base64 copied to clipboard!");
  }

  function downloadImage() {
    if (!canvasRef.current || !file) return;
    const mime = file.type === "image/jpeg" ? "image/jpeg" : "image/png";
    canvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      mime,
      mime === "image/jpeg" ? quality : undefined
    );
  }

  function resetAll() {
    setFile(null);
    setOriginalSrc("");
    setResizedSrc("");
    setError(null);
  }

  // --- Render ---
  return (
    <section
      id="image-toolkit"
      aria-labelledby="image-toolkit-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center space-y-6 sm:px-0">
        <h1
          id="image-toolkit-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Image Toolkit: Compress &amp; Resize
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mx-auto max-w-3xl text-lg sm:text-xl text-gray-700 leading-relaxed">
          Optimize PNG/JPEG images with adjustable quality, resize by pixels,
          lock aspect ratio, and download high-quality results entirely client-side.
        </p>
      </div>

      {/* File Upload */}
      <div className="max-w-lg mx-auto sm:px-0 flex flex-col items-center space-y-4">
        <input
          id="image-upload"
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => document.getElementById("image-upload")?.click()}
          className="
            px-6 py-2
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-white rounded-md
            hover:opacity-80 transition-opacity
            focus:outline-none focus:ring-2 focus:ring-[#7c3aed]
          "
        >
          {file ? "Change Image…" : "Select Image…"}
        </button>
        {file && (
          <p className="text-sm text-gray-500 font-mono truncate w-full text-center">
            {file.name} · {(file.size / 1024).toFixed(1)} KB
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-lg mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-center">
          {error}
        </div>
      )}

      {/* Preview */}
      {resizedSrc && (
        <div className="max-w-lg mx-auto sm:px-0">
          <Image
            src={resizedSrc}
            alt="Resized preview"
            width={width}
            height={height}
            unoptimized
            className="border rounded-md mx-auto"
          />
          <p className="mt-2 text-center text-gray-600">
            Original: {origW} × {origH}px → Resized: {width} × {height}px
          </p>
        </div>
      )}

      {/* Controls */}
      {originalSrc && (
        <div className="max-w-lg mx-auto sm:px-0 space-y-6">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label
                htmlFor="width-input"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                Width (px)
              </label>
              <input
                id="width-input"
                type="number"
                min={1}
                value={width}
                onChange={handleWidthChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="height-input"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                Height (px)
              </label>
              <input
                id="height-input"
                type="number"
                min={1}
                value={height}
                onChange={handleHeightChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="lock-aspect"
                type="checkbox"
                checked={lockAspect}
                onChange={() => setLockAspect((v) => !v)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="lock-aspect" className="text-sm text-gray-800">
                Lock Aspect Ratio
              </label>
            </div>
            {file?.type === "image/jpeg" && (
              <div>
                <label
                  htmlFor="quality"
                  className="block text-sm font-medium text-gray-800 mb-1"
                >
                  JPEG Quality: {Math.round(quality * 100)}%
                </label>
                <input
                  id="quality"
                  type="range"
                  min={10}
                  max={100}
                  step={1}
                  value={quality * 100}
                  onChange={(e) => setQuality(Number(e.target.value) / 100)}
                  className="w-full"
                />
              </div>
            )}
          </form>
          <div className="flex justify-center gap-4">
            <button
              onClick={resetAll}
              className="
                px-6 py-2
                bg-gray-100 text-gray-700 rounded-md
                hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300
                transition font-medium
              "
            >
              Reset
            </button>
            <button
              onClick={copyBase64}
              disabled={!resizedSrc}
              className="
                inline-flex items-center gap-2 px-6 py-2
                bg-indigo-600 text-white rounded-md
                hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-indigo-500
                transition font-medium disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <ClipboardCopy className="w-5 h-5" />
              Copy Base64
            </button>
            <button
              onClick={downloadImage}
              disabled={!resizedSrc}
              className="
                px-6 py-2
                bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
                text-white rounded-md
                hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]
                transition font-medium disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Download Image
            </button>
          </div>
        </div>
      )}

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </section>
  );
}