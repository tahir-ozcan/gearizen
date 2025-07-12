// app/tools/qr-code-generator/qr-code-generator-client.tsx

"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import useDebounce from "@/lib/useDebounce";
import {
  generateQrCanvas,
  generateQrDataUrl,
  embedPngMetadata,
  ErrorCorrectionLevel,
} from "@/lib/generate-qr";

export default function QrCodeGeneratorClient() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [margin, setMargin] = useState(1);
  const [darkColor, setDarkColor] = useState("#000000");
  const [lightColor, setLightColor] = useState("#ffffff");
  const [ecLevel, setEcLevel] = useState<ErrorCorrectionLevel>("M");
  const [logo, setLogo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const debouncedText = useDebounce(text);

  const options = useMemo(
    () => ({
      text: debouncedText,
      width: size,
      margin,
      darkColor,
      lightColor,
      errorCorrectionLevel: ecLevel,
      logoDataUrl: logo || undefined,
    }),
    [debouncedText, size, margin, darkColor, lightColor, ecLevel, logo],
  );

  useEffect(() => {
    if (!debouncedText.trim()) {
      setQrUrl(null);
      setError(null);
      return;
    }
    let cancelled = false;
    generateQrDataUrl(options)
      .then((url) => {
        if (!cancelled) setQrUrl(url);
      })
      .catch(() => setError("Failed to generate QR code. Try different input."));
    return () => {
      cancelled = true;
    };
  }, [options, debouncedText]);

  // Draw to canvas whenever qrUrl updates
  useEffect(() => {
    if (!qrUrl || !canvasRef.current) return;
    generateQrCanvas(options)
      .then((canvas) => {
        const ctx = canvasRef.current!.getContext("2d");
        if (!ctx) return;
        canvasRef.current!.width = canvas.width;
        canvasRef.current!.height = canvas.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(canvas, 0, 0);
      })
      .catch(() => setError("Failed to render QR code"));
  }, [qrUrl, options]);

  const copyQr = async () => {
    if (!qrUrl) return;
    try {
      await navigator.clipboard.writeText(qrUrl);
      alert("✅ QR code image URL copied!");
    } catch {
      alert("❌ Failed to copy.");
    }
  };

  const downloadQr = () => {
    if (!qrUrl) return;
    const dataWithMeta = embedPngMetadata(qrUrl, {
      url: text,
      ecLevel,
      margin: String(margin),
      darkColor,
      lightColor,
    });
    const a = document.createElement("a");
    a.href = dataWithMeta;
    a.download = "qr-code.png";
    a.click();
  };

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setLogo(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <section
      id="qr-code-generator"
      aria-labelledby="qr-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="qr-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        QR Code Generator
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Create custom QR codes instantly. Enter any text or URL, adjust size, and download your code—100% client-side, no signup required.
      </p>

      <div className="max-w-lg mx-auto space-y-6" aria-label="Generate QR code form">
        <div>
          <label
            htmlFor="qr-text"
            className="block mb-1 font-medium text-gray-800"
          >
            Text or URL
          </label>
          <input
            id="qr-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text or link..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label htmlFor="qr-size" className="block mb-1 font-medium text-gray-800">
            Size: <span className="font-semibold">{size}px</span>
          </label>
          <input
            id="qr-size"
            type="range"
            min={128}
            max={512}
            step={16}
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value, 10))}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="qr-margin" className="block mb-1 font-medium text-gray-800">
              Margin
            </label>
            <input
              id="qr-margin"
              type="number"
              min={0}
              max={10}
              value={margin}
              onChange={(e) => setMargin(parseInt(e.target.value, 10))}
              className="input-base w-full"
            />
          </div>
          <div>
            <label htmlFor="qr-ec" className="block mb-1 font-medium text-gray-800">
              Error Correction
            </label>
            <select
              id="qr-ec"
              value={ecLevel}
              onChange={(e) => setEcLevel(e.target.value as ErrorCorrectionLevel)}
              className="input-base w-full"
            >
              <option value="L">L - 7%</option>
              <option value="M">M - 15%</option>
              <option value="Q">Q - 25%</option>
              <option value="H">H - 30%</option>
            </select>
          </div>
          <div>
            <label htmlFor="qr-dark" className="block mb-1 font-medium text-gray-800">
              Foreground
            </label>
            <input
              id="qr-dark"
              type="color"
              value={darkColor}
              onChange={(e) => setDarkColor(e.target.value)}
              className="h-10 w-full rounded"
            />
          </div>
          <div>
            <label htmlFor="qr-light" className="block mb-1 font-medium text-gray-800">
              Background
            </label>
            <input
              id="qr-light"
              type="color"
              value={lightColor}
              onChange={(e) => setLightColor(e.target.value)}
              className="h-10 w-full rounded"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="qr-logo" className="block mb-1 font-medium text-gray-800">
              Logo (optional)
            </label>
            <input
              id="qr-logo"
              type="file"
              accept="image/*"
              onChange={handleLogo}
              className="input-base w-full"
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="text-red-600 text-sm">
            {error}
          </p>
        )}

      </div>

      {qrUrl && (
        <div
          className="mt-12 flex flex-col items-center justify-center space-y-6 text-center min-h-[50vh]"
        >
          <canvas
            ref={canvasRef}
            width={size}
            height={size}
            aria-label="QR code preview"
            className="border rounded-md w-full h-auto"
            style={{ maxWidth: size, transition: 'width 0.2s,height 0.2s' }}
          />
          <div className="flex justify-center gap-4">
            <button
              onClick={copyQr}
              aria-label="Copy QR code image URL"
              className="btn-primary"
            >
              Copy URL
            </button>
            <button
              onClick={downloadQr}
              aria-label="Download QR code as PNG"
              className="btn-secondary"
            >
              Download PNG
            </button>
          </div>
        </div>
      )}
    </section>
  );
}