"use client";

import { useState, useEffect } from "react";
import PreviewImage from "@/components/PreviewImage";
import DropZone from "@/components/DropZone";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import useDebounce from "@/lib/useDebounce";

const PRESETS = [
  { label: "Low (50%)", value: 0.5 },
  { label: "Medium (75%)", value: 0.75 },
  { label: "High (90%)", value: 0.9 },
];

export default function ImageCompressorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [dimensions, setDimensions] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const [sliderValue, setSliderValue] = useState(75);
  const debouncedSlider = useDebounce(sliderValue, 200);
  const [quality, setQuality] = useState(0.75);

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setQuality(debouncedSlider / 100);
  }, [debouncedSlider]);

  useEffect(() => {
    return () => {
      if (originalUrl && originalUrl.startsWith("blob:")) URL.revokeObjectURL(originalUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [originalUrl, compressedUrl]);

  const handleFiles = (files: FileList) => {
    const f = files[0];
    if (!f) return;
    if (!f.type.match(/image\/(jpeg|png)/)) {
      alert("Please upload a JPEG or PNG image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setOriginalUrl(url);
      setOriginalSize(f.size);
      setCompressedUrl(null);
      setCompressedSize(0);
      setFile(f);
      const img = new Image();
      img.onload = () => setDimensions({ w: img.naturalWidth, h: img.naturalHeight });
      img.src = url;
    };
    reader.readAsDataURL(f);
  };

  const compress = async () => {
    if (!file || !originalUrl) return;
    setProcessing(true);
    await new Promise(requestAnimationFrame);
    const img = new Image();
    img.src = originalUrl;
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error("load"));
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setProcessing(false);
      return;
    }
    ctx.drawImage(img, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );
    if (!blob) {
      setProcessing(false);
      return;
    }
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setCompressedUrl(URL.createObjectURL(blob));
    setCompressedSize(blob.size);
    setProcessing(false);
  };

  const download = () => {
    if (!compressedUrl || !file) return;
    const extMatch = file.name.match(/\.\w+$/);
    const ext = extMatch ? extMatch[0] : "";
    const a = document.createElement("a");
    a.href = compressedUrl;
    a.download = file.name.replace(ext, `-compressed${ext}`);
    a.click();
  };

  const reset = () => {
    if (originalUrl && originalUrl.startsWith("blob:")) URL.revokeObjectURL(originalUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setFile(null);
    setOriginalUrl(null);
    setCompressedUrl(null);
    setOriginalSize(0);
    setCompressedSize(0);
  };

  const percentReduction = compressedSize
    ? Math.max(0, (1 - compressedSize / originalSize) * 100)
    : 0;

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
        Upload an image, adjust quality and compress it entirely in your browser.
        No signup or server upload required.
      </p>

      {!file && (
        <div className="max-w-lg mx-auto mb-8">
          <DropZone onFiles={handleFiles} multiple={false} />
        </div>
      )}

      {file && (
        <div className="space-y-8">
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex justify-center gap-2">
              {PRESETS.map((p) => (
                <Button
                  key={p.label}
                  onClick={() => {
                    setSliderValue(Math.round(p.value * 100));
                    setQuality(p.value);
                  }}
                  className="px-4 py-2"
                >
                  {p.label}
                </Button>
              ))}
            </div>
            <label htmlFor="quality" className="block font-medium text-gray-800">
              Quality: <span className="font-semibold">{sliderValue}%</span>
            </label>
            <input
              id="quality"
              type="range"
              min={1}
              max={100}
              step={1}
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              aria-label="Image quality percentage"
              className="w-full cursor-pointer"
            />
          </div>

          <div className="text-center">
            <Button
              onClick={compress}
              disabled={processing}
              aria-label="Compress"
              className={processing ? "opacity-60 cursor-not-allowed" : ""}
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner className="h-5 w-5" /> Compressing...
                </span>
              ) : (
                "Compress"
              )}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center mt-8">
            {originalUrl && (
              <div className="flex-1 text-center">
                <PreviewImage
                  src={originalUrl}
                  alt="Original image preview"
                  width={dimensions.w}
                  height={dimensions.h}
                />
                <p className="mt-2 text-sm text-gray-600">
                  Original – {(originalSize / 1024).toFixed(1)} KB
                </p>
              </div>
            )}
            {compressedUrl && (
              <div className="flex-1 text-center">
                <PreviewImage
                  src={compressedUrl}
                  alt="Compressed image preview"
                  width={dimensions.w}
                  height={dimensions.h}
                />
                <p className="mt-2 text-sm text-gray-600">
                  Compressed – {(compressedSize / 1024).toFixed(1)} KB ({percentReduction.toFixed(1)}% reduction) @
                  {" "}
                  {Math.round(quality * 100)}% quality
                </p>
              </div>
            )}
          </div>

          {compressedUrl && (
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Button
                onClick={download}
                className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
                aria-label="Download compressed image"
              >
                Download Compressed
              </Button>
              <button
                onClick={reset}
                className="text-indigo-600 underline hover:text-indigo-800 focus:outline-none"
                aria-label="Reset"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
