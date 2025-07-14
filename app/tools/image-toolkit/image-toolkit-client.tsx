// app/tools/image-toolkit/image-toolkit-client.tsx
"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import NextImage from "next/image";

/**
 * Image Toolkit Client
 *
 * Upload an image, preview it, convert to Base64, and resize while preserving aspect ratio.
 * Copy Base64 or download the (resized) image—100% client-side.
 */
export default function ImageToolkitClient() {
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [src, setSrc] = useState<string>("");
  const [base64, setBase64] = useState<string>("");

  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [resizedWidth, setResizedWidth] = useState<number>(0);
  const [resizedHeight, setResizedHeight] = useState<number>(0);
  const [resizedSrc, setResizedSrc] = useState<string>("");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle image upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileSize(file.size);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSrc(dataUrl);
      setBase64(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // When src changes, capture natural dimensions
  useEffect(() => {
    if (!src) return;
    const imgEl = document.createElement("img");
    imgEl.src = src;
    imgEl.onload = () => {
      setOriginalWidth(imgEl.naturalWidth);
      setOriginalHeight(imgEl.naturalHeight);
      setResizedWidth(imgEl.naturalWidth);
      setResizedHeight(imgEl.naturalHeight);
      setResizedSrc(src);
    };
  }, [src]);

  // When resized dims change, redraw
  useEffect(() => {
    if (!src || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = resizedWidth;
    canvas.height = resizedHeight;
    const imgEl = document.createElement("img");
    imgEl.src = src;
    imgEl.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imgEl, 0, 0, resizedWidth, resizedHeight);
      const dataUrl = canvas.toDataURL("image/png");
      setResizedSrc(dataUrl);
      setBase64(dataUrl);
    };
  }, [resizedWidth, resizedHeight, src]);

  // Copy Base64
  const copyBase64 = async () => {
    if (!base64) return;
    try {
      await navigator.clipboard.writeText(base64);
      alert("✅ Base64 copied!");
    } catch {
      alert("❌ Copy failed.");
    }
  };

  // Download image
  const downloadImage = () => {
    if (!resizedSrc) return;
    const a = document.createElement("a");
    a.href = resizedSrc;
    a.download = fileName || "image.png";
    a.click();
  };

  return (
    <section
      id="image-toolkit"
      aria-labelledby="image-toolkit-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center space-y-4 sm:px-0">
        <h1
          id="image-toolkit-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Image Toolkit
        </h1>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-700 leading-relaxed">
          Upload, preview, convert to Base64, resize with aspect-ratio lock, then copy or download—100% client-side.
        </p>
      </div>

      {/* Upload Control */}
      <div className="max-w-lg mx-auto space-y-4 sm:px-0">
        <label htmlFor="image-upload" className="block text-sm font-medium text-gray-800">
          Choose Image
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700"
        />
      </div>

      {/* Preview & Original Info */}
      {src && (
        <div className="max-w-lg mx-auto space-y-4 sm:px-0">
          <NextImage
            src={resizedSrc}
            alt="Preview"
            width={resizedWidth}
            height={resizedHeight}
            unoptimized
            className="border rounded-md mx-auto"
          />
          <p className="text-center text-gray-600">
            Original: {originalWidth}×{originalHeight}px · {(fileSize / 1024).toFixed(1)} KB
          </p>
        </div>
      )}

      {/* Resize Inputs */}
      {src && (
        <form onSubmit={(e) => e.preventDefault()} className="max-w-lg mx-auto grid grid-cols-2 gap-4 sm:px-0">
          <div>
            <label htmlFor="width-input" className="block text-sm font-medium text-gray-800 mb-1">
              Width (px)
            </label>
            <input
              id="width-input"
              type="number"
              min={1}
              value={resizedWidth}
              onChange={(e) => {
                const w = Math.max(1, Number(e.target.value));
                setResizedWidth(w);
                setResizedHeight(Math.round((w / originalWidth) * originalHeight));
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
          <div>
            <label htmlFor="height-input" className="block text-sm font-medium text-gray-800 mb-1">
              Height (px)
            </label>
            <input
              id="height-input"
              type="number"
              min={1}
              value={resizedHeight}
              onChange={(e) => {
                const h = Math.max(1, Number(e.target.value));
                setResizedHeight(h);
                setResizedWidth(Math.round((h / originalHeight) * originalWidth));
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        </form>
      )}

      {/* Base64 & Action Buttons */}
      {base64 && (
        <div className="max-w-lg mx-auto space-y-4 sm:px-0">
          <label htmlFor="base64-output" className="block text-sm font-medium text-gray-800">
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
              Download PNG
            </button>
          </div>
        </div>
      )}

      {/* Hidden canvas for resizing */}
      <canvas ref={canvasRef} className="hidden" />
    </section>
  );
}