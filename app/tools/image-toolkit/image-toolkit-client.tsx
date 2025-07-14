// app/tools/image-toolkit/image-toolkit-client.tsx
"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import Image from "next/image";

/**
 * Image Toolkit Client
 *
 * Upload an image, preview it, convert to Base64, and resize while preserving aspect ratio.
 * Copy Base64 or download the (resized) image—100% client-side, no backend required.
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

  // When original src changes, load natural dimensions
  useEffect(() => {
    if (!src) return;
    // HTMLImageElement oluşturmak için document.createElement kullanıyoruz
    const img = document.createElement("img");
    img.src = src;
    img.onload = () => {
      setOriginalWidth(img.naturalWidth);
      setOriginalHeight(img.naturalHeight);
      setResizedWidth(img.naturalWidth);
      setResizedHeight(img.naturalHeight);
      setResizedSrc(src);
    };
  }, [src]);

  // When resized dimensions change, redraw into canvas
  useEffect(() => {
    if (!src || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = resizedWidth;
    canvas.height = resizedHeight;

    // Yine document.createElement ile img oluşturuyoruz
    const img = document.createElement("img");
    img.src = src;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, resizedWidth, resizedHeight);
      const dataUrl = canvas.toDataURL("image/png");
      setResizedSrc(dataUrl);
      setBase64(dataUrl);
    };
  }, [resizedWidth, resizedHeight, src]);

  // Copy Base64 to clipboard
  const copyBase64 = async () => {
    if (!base64) return;
    try {
      await navigator.clipboard.writeText(base64);
      alert("✅ Base64 kopyalandı!");
    } catch {
      alert("❌ Kopyalama başarısız");
    }
  };

  // Download resized image
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
      <div className="text-center space-y-4">
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
        <p className="mt-2 max-w-2xl mx-auto text-lg text-gray-700 leading-relaxed">
          Upload an image to preview, convert to Base64, resize with aspect ratio preserved, then
          copy or download the result—100% client-side.
        </p>
      </div>

      {/* Upload */}
      <div className="max-w-lg mx-auto space-y-4">
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

      {/* Preview & Info */}
      {src && (
        <div className="max-w-lg mx-auto space-y-4">
          <Image
            src={resizedSrc}
            alt="Preview"
            width={resizedWidth}
            height={resizedHeight}
            unoptimized
            className="border rounded-md mx-auto"
          />
          <p className="text-center text-gray-600">
            Original: {originalWidth}×{originalHeight}px, {(fileSize / 1024).toFixed(1)} KB
          </p>
        </div>
      )}

      {/* Resize Controls */}
      {src && (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="max-w-lg mx-auto grid grid-cols-2 gap-4"
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
              value={resizedWidth}
              onChange={(e) => {
                const w = Math.max(1, Number(e.target.value));
                setResizedWidth(w);
                const h = Math.round((w / originalWidth) * originalHeight);
                setResizedHeight(h);
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
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
              value={resizedHeight}
              onChange={(e) => {
                const h = Math.max(1, Number(e.target.value));
                setResizedHeight(h);
                const w = Math.round((h / originalHeight) * originalWidth);
                setResizedWidth(w);
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </form>
      )}

      {/* Base64 & Actions */}
      {base64 && (
        <div className="max-w-lg mx-auto space-y-4">
          <label htmlFor="base64-output" className="block text-sm font-medium text-gray-800">
            Base64 Data URL
          </label>
          <textarea
            id="base64-output"
            readOnly
            value={base64}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md font-mono text-sm resize-y focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex justify-center gap-4">
            <button
              onClick={copyBase64}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium"
            >
              Copy Base64
            </button>
            <button
              onClick={downloadImage}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition font-medium"
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