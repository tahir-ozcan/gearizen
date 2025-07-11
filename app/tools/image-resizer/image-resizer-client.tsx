// app/tools/image-resizer/image-resizer-client.tsx

"use client";

import { useState, useRef, useEffect, useCallback, ChangeEvent } from "react";
import PreviewImage from "@/components/PreviewImage";

export default function ImageResizerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainAspect, setMaintainAspect] = useState<boolean>(true);

  // Orijinal boyutları tutmak için ref
  const naturalSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    if (!file) {
      setOriginalUrl(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setOriginalUrl(reader.result as string);
      setResizedUrl(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  }, [file]);

  // Görsel yeniden boyutlandırma işlevi
  const resizeImage = useCallback(async () => {
    if (!file || !originalUrl) return;
    setError(null);

    try {
      // TS hatasını atlatmak için document.createElement ile img oluşturuyoruz
      const img = document.createElement("img") as HTMLImageElement;
      img.src = originalUrl;
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej(new Error("Failed to load image"));
      });

      // Hedef genişlik/yükseklik hesapla
      const targetW = width;
      const targetH = maintainAspect
        ? Math.round((naturalSize.current.h / naturalSize.current.w) * width)
        : height;

      // Canvas’a çiz
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Cannot get canvas context");
      ctx.drawImage(img, 0, 0, targetW, targetH);

      // Blob oluştur
      const blob = await new Promise<Blob | null>(resolve =>
        canvas.toBlob(resolve, file.type)
      );
      if (!blob) throw new Error("Image conversion failed");

      setResizedUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unexpected error occurred");
    } finally {
      // no-op
    }
  }, [file, originalUrl, width, height, maintainAspect]);

  // Yeniden boyutlanmış resmi indir
  const downloadImage = () => {
    if (!resizedUrl || !file) return;
    const a = document.createElement("a");
    a.href = resizedUrl;
    a.download = file.name.replace(/\.(\w+)$/, `.resized.$1`);
    a.click();
  };

  useEffect(() => {
    return () => {
      if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    };
  }, [resizedUrl]);

  // Auto-resize whenever dimensions change
  useEffect(() => {
    if (!file || !originalUrl) return;
    const t = setTimeout(() => {
      resizeImage();
    }, 200);
    return () => clearTimeout(t);
  }, [file, originalUrl, width, height, maintainAspect, resizeImage]);



  return (
    <section
      id="image-resizer"
      aria-labelledby="image-resizer-heading"
      className="container-responsive py-20 text-gray-900 antialiased"
    >
      <h1
        id="image-resizer-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Image Resizer
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Upload an image, set the target width and height (optionally maintain
        aspect ratio), preview and download your resized image — 100% client-side, no signup required.
      </p>

      {/* Dosya Seçimi */}
      <div className="max-w-lg mx-auto mb-8">
        <label
          htmlFor="image-upload"
          className="block mb-2 font-medium text-gray-800"
        >
          Choose Image
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (resizedUrl) URL.revokeObjectURL(resizedUrl);
            if (originalUrl && originalUrl.startsWith("blob:")) {
              URL.revokeObjectURL(originalUrl);
            }
            setResizedUrl(null);
            setError(null);
            setFile(e.target.files?.[0] ?? null);
          }}
          className="block w-full text-sm text-gray-700
                     file:border file:border-gray-300 file:rounded-lg
                     file:px-4 file:py-2 file:bg-white file:text-gray-700
                     hover:file:bg-gray-50 transition"
        />
      </div>

      {/* Orijinal Önizleme */}
      {originalUrl && (
        <div className="max-w-md mx-auto mb-8">
          <p className="font-medium mb-2">Original Image Preview:</p>
          <PreviewImage
            src={originalUrl}
            alt="Original upload preview"
            width={naturalSize.current.w || 1}
            height={naturalSize.current.h || 1}
            onLoadingComplete={({ naturalWidth, naturalHeight }) => {
              naturalSize.current = { w: naturalWidth, h: naturalHeight };
              setWidth(naturalWidth);
              setHeight(naturalHeight);
            }}
          />
        </div>
      )}

      {/* Boyut Kontrolleri */}
      {originalUrl && (
        <div className="max-w-md mx-auto mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="width" className="font-medium text-gray-800">
              Width:
            </label>
            <input
              id="width"
              type="number"
              min={1}
              value={width}
              onChange={e => setWidth(Number(e.target.value))}
              className="w-24 p-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-1 focus:ring-brand-500 transition"
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="height" className="font-medium text-gray-800">
              Height:
            </label>
            <input
              id="height"
              type="number"
              min={1}
              value={height}
              onChange={e => setHeight(Number(e.target.value))}
              disabled={maintainAspect}
              className="w-24 p-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-1 focus:ring-brand-500 transition disabled:opacity-50"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="maintain-aspect"
              type="checkbox"
              checked={maintainAspect}
              onChange={() => setMaintainAspect(a => !a)}
              className="h-4 w-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
            />
            <label htmlFor="maintain-aspect" className="text-gray-700">
              Maintain aspect ratio
            </label>
          </div>
          {error && (
            <p role="alert" className="text-red-600 text-sm">{error}</p>
          )}
        </div>
      )}

      {/* Yeniden Boyutlanmış Önizleme & İndir */}
      {resizedUrl && (
        <div className="max-w-md mx-auto mt-8 space-y-4 text-center">
          <p className="font-medium">Resized Image Preview:</p>
          <PreviewImage
            src={resizedUrl}
            alt="Resized result preview"
            width={width}
            height={
              maintainAspect
                ? Math.round((naturalSize.current.h / naturalSize.current.w) * width)
                : height
            }
          />
          <button
            onClick={downloadImage}
            className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg
                       hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500
                       transition font-medium"
          >
            Download Image
          </button>
        </div>
      )}
    </section>
  );
}