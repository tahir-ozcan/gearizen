"use client";

import { useState, ChangeEvent } from "react";
import PreviewImage from "@/components/PreviewImage";

export default function ImageToBase64Client() {
  const [result, setResult] = useState("");
  const [preview, setPreview] = useState<{ src: string; w: number; h: number } | null>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setResult(result);
      const img = new window.Image();
      img.onload = () => {
        setPreview({ src: result, w: img.naturalWidth, h: img.naturalHeight });
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      alert("✅ Copied!");
    } catch {
      alert("❌ Failed to copy");
    }
  };

  return (
    <section className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-6">Image → Base64</h1>
      <p className="text-center text-gray-600">Upload an image and get its Base64 data URI.</p>
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-brand-600 file:text-white hover:file:bg-brand-700"
      />
      {preview && (
        <div className="max-w-md mx-auto space-y-4 text-center">
          <PreviewImage
            src={preview.src}
            alt="Selected image preview"
            width={preview.w}
            height={preview.h}
          />
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <textarea
            readOnly
            value={result}
            className="w-full h-40 p-3 border border-gray-300 rounded-lg font-mono text-xs bg-gray-50 resize-y focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="button"
            onClick={copy}
            className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            Copy
          </button>
        </div>
      )}
    </section>
  );
}
