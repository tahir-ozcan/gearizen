// app/tools/qr-code-generator/qr-code-generator-client.tsx

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import useDebounce from "@/lib/useDebounce";
import {
  generateQrWithMetadata,
  QrSettings,
  generateQrCanvas,
} from "@/lib/generate-qr";

export default function QrCodeGeneratorClient() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [margin, setMargin] = useState(1);
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [logo, setLogo] = useState<File | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const debouncedText = useDebounce(text);

  const generate = useCallback(async () => {
    if (!debouncedText.trim()) {
      setQrUrl(null);
      setError(null);
      return;
    }
    const settings: QrSettings = {
      text: debouncedText,
      size,
      margin,
      errorCorrectionLevel: errorCorrection,
      foreground,
      background,
    };
    try {
      const logoUrl = logo ? URL.createObjectURL(logo) : undefined;
      const url = await generateQrWithMetadata(settings, logoUrl);
      setQrUrl(url);
      if (logoUrl) URL.revokeObjectURL(logoUrl);
    } catch {
      setError('Failed to generate QR code. Try different input.');
    }
  }, [debouncedText, size, margin, errorCorrection, foreground, background, logo]);

  useEffect(() => {
    generate();
  }, [generate]);

  // Draw to canvas whenever qrUrl updates
  useEffect(() => {
    if (!qrUrl || !canvasRef.current) return;
    const settings: QrSettings = {
      text,
      size,
      margin,
      errorCorrectionLevel: errorCorrection,
      foreground,
      background,
    };
    const logoUrl = logo ? URL.createObjectURL(logo) : undefined;
    generateQrCanvas(settings, logoUrl)
      .then((cv) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) ctx.drawImage(cv, 0, 0);
        if (logoUrl) URL.revokeObjectURL(logoUrl);
      })
      .catch(() => setError('Failed to render QR code'));
  }, [qrUrl, size, text, margin, errorCorrection, foreground, background, logo]);

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
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = "qr-code.png";
    a.click();
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
          <label
            htmlFor="qr-size"
            className="block mb-1 font-medium text-gray-800"
          >
            Size: <span className="font-semibold">{size}×{size}px</span>
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

        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          aria-expanded={showAdvanced}
          className="btn-secondary w-full"
        >
          Advanced Options
        </button>

        {showAdvanced && (
          <div className="space-y-4">
            <div>
              <label htmlFor="margin" className="block mb-1 font-medium text-gray-800">
                Margin:
              </label>
              <input
                id="margin"
                type="range"
                min={0}
                max={10}
                value={margin}
                onChange={(e) => setMargin(parseInt(e.target.value, 10))}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="ecc" className="block mb-1 font-medium text-gray-800">
                Error Correction
              </label>
              <select
                id="ecc"
                value={errorCorrection}
                onChange={(e) => setErrorCorrection(e.target.value as any)}
                className="input-base"
              >
                <option value="L">L - 7%</option>
                <option value="M">M - 15%</option>
                <option value="Q">Q - 25%</option>
                <option value="H">H - 30%</option>
              </select>
            </div>
            <div className="flex gap-4">
              <label className="flex-1">
                <span className="block mb-1 font-medium text-gray-800">Foreground</span>
                <input
                  type="color"
                  value={foreground}
                  onChange={(e) => setForeground(e.target.value)}
                  className="w-full h-10 p-0 border border-gray-300 rounded"
                />
              </label>
              <label className="flex-1">
                <span className="block mb-1 font-medium text-gray-800">Background</span>
                <input
                  type="color"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="w-full h-10 p-0 border border-gray-300 rounded"
                />
              </label>
            </div>
            <div>
              <label htmlFor="logo" className="block mb-1 font-medium text-gray-800">
                Logo Overlay (optional)
              </label>
              <input
                id="logo"
                type="file"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-gray-700 file:border file:border-gray-300 file:rounded-lg file:px-4 file:py-2 file:bg-white file:text-gray-700 hover:file:bg-gray-50 transition"
              />
            </div>
          </div>
        )}

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
            role="img"
            aria-label="QR preview"
            className="border rounded-md w-full h-auto transition-all"
            style={{ maxWidth: size }}
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
              aria-label="Download QR code PNG"
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