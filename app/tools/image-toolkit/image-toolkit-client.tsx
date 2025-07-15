// app/tools/image-toolkit/image-toolkit-client.tsx
"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import Image from "next/image";

/**
 * Image Toolkit: Compress & Resize
 *
 * Optimize JPEG/PNG images and resize with optional aspect-ratio lock—fast, free and privacy-focused.
 */
export default function ImageToolkitClient() {
  // Uploaded file info
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("image/png");
  const [fileSizeKB, setFileSizeKB] = useState<number>(0);

  // Original and working data URLs
  const [originalSrc, setOriginalSrc] = useState<string>("");
  const [resizedSrc, setResizedSrc] = useState<string>("");

  // Dimensions
  const [origW, setOrigW] = useState<number>(0);
  const [origH, setOrigH] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  // JPEG quality for compression (PNG ignored)
  const [quality, setQuality] = useState<number>(0.8);

  // Base64 output
  const [base64, setBase64] = useState<string>("");

  // Canvas for resize/compress
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileType(file.type);
    setFileSizeKB(Math.round(file.size / 1024));

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setOriginalSrc(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // On originalSrc load, capture natural dimensions
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

  // Redraw canvas when dims, quality, or source change
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

      // export to chosen format
      const mime = fileType === "image/jpeg" ? "image/jpeg" : "image/png";
      const dataUrl =
        mime === "image/jpeg"
          ? canvas.toDataURL(mime, quality)
          : canvas.toDataURL(mime);
      setResizedSrc(dataUrl);
      setBase64(dataUrl);
    };
  }, [originalSrc, width, height, quality, fileType]);

  // Copy Base64
  const copyBase64 = async () => {
    if (!base64) return;
    await navigator.clipboard.writeText(base64);
    alert("✅ Base64 copied!");
  };

  // Download the resized/compressed image
  const downloadImage = () => {
    if (!canvasRef.current) return;
    const mime = fileType === "image/jpeg" ? "image/jpeg" : "image/png";
    canvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      },
      mime,
      mime === "image/jpeg" ? quality : undefined
    );
  };

  return (
    <section
      id="image-toolkit"
      aria-labelledby="image-toolkit-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading */}
      <div className="text-center space-y-6 sm:px-0">
        <h1
          id="image-toolkit-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Image Toolkit: Compress & Resize
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-700 leading-relaxed">
          Optimize JPEG/PNG images and resize with optional aspect-ratio lock—fast,
          free and privacy-focused.
        </p>
      </div>

      {/* Upload */}
      <div className="max-w-lg mx-auto space-y-4 sm:px-0">
        <label
          htmlFor="image-upload"
          className="block text-sm font-medium text-gray-800"
        >
          Choose Image (JPEG/PNG)
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700"
        />
      </div>

      {/* Preview + Info */}
      {resizedSrc && (
        <div className="max-w-lg mx-auto space-y-2 sm:px-0">
          <Image
            src={resizedSrc}
            alt="Preview"
            width={width}
            height={height}
            unoptimized
            className="border rounded-md mx-auto"
          />
          <p className="text-center text-gray-600">
            Original: {origW}×{origH}px · {fileSizeKB} KB
          </p>
        </div>
      )}

      {/* Resize Controls */}
      {originalSrc && (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="max-w-lg mx-auto grid grid-cols-2 gap-4 sm:px-0"
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
              onChange={(e) => {
                const w = Math.max(1, Number(e.target.value));
                setWidth(w);
                setHeight(Math.round((w / origW) * origH));
              }}
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
              onChange={(e) => {
                const h = Math.max(1, Number(e.target.value));
                setHeight(h);
                setWidth(Math.round((h / origH) * origW));
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        </form>
      )}

      {/* JPEG Quality */}
      {fileType === "image/jpeg" && originalSrc && (
        <div className="max-w-lg mx-auto sm:px-0 space-y-2">
          <label className="block text-sm font-medium text-gray-800">
            JPEG Quality: {Math.round(quality * 100)}%
          </label>
          <input
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

      {/* Base64 + Actions */}
      {resizedSrc && (
        <div className="max-w-lg mx-auto space-y-4 sm:px-0">
          <label
            htmlFor="base64-output"
            className="block text-sm font-medium text-gray-800"
          >
            Base64 Data URL
          </label>
          <textarea
            id="base64-output"
            readOnly
            value={base64}
            rows={4}
            className="
              w-full p-2 border border-gray-300 rounded-md bg-gray-50
              font-mono text-sm resize-y focus:ring-2 focus:ring-indigo-500 transition
            "
          />
          <div className="flex justify-center gap-4">
            <button
              onClick={copyBase64}
              className="
                px-6 py-2 bg-indigo-600 text-white rounded-md
                hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
                transition font-medium
              "
            >
              Copy Base64
            </button>
            <button
              onClick={downloadImage}
              className="
                px-6 py-2 bg-gray-100 text-gray-700 rounded-md
                hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300
                transition font-medium
              "
            >
              Download Image
            </button>
          </div>
        </div>
      )}

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </section>
  );
}