// app/tools/qr-code-generator/qr-code-generator-client.tsx

"use client";

import { useState, useRef, FormEvent, useEffect } from "react";
import QRCode from "qrcode";

export default function QrCodeGeneratorClient() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [error, setError] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQr = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setQrUrl(null);
    if (!text.trim()) {
      setError("Please enter text or URL to encode.");
      return;
    }
    try {
      const opts = { width: size, margin: 1 };
      const dataUrl = await QRCode.toDataURL(text, opts);
      setQrUrl(dataUrl);
    } catch {
      setError("Failed to generate QR code. Try different input.");
    }
  };

  // Draw to canvas whenever qrUrl updates
  useEffect(() => {
    if (!qrUrl || !canvasRef.current) return;
    const opts = { width: size, margin: 1 };
    QRCode.toCanvas(canvasRef.current, text, opts).catch(() => {
      setError("Failed to render QR code");
    });
  }, [qrUrl, size, text]);

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
      className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900 flex flex-col items-center"
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

      <form
        onSubmit={generateQr}
        className="max-w-lg mx-auto space-y-6"
        aria-label="Generate QR code form"
      >
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

        {error && (
          <p role="alert" className="text-red-600 text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
        >
          Generate QR Code
        </button>
      </form>

      {qrUrl && (
        <div className="mt-12 flex flex-col items-center justify-center space-y-6 text-center w-full">
          <canvas
            ref={canvasRef}
            width={size}
            height={size}
            className="border rounded-md w-full h-auto max-w-xs sm:max-w-sm md:max-w-md"
            style={{ maxWidth: size }}
          />
          <div className="flex justify-center gap-4">
            <button
              onClick={copyQr}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm font-medium"
            >
              Copy URL
            </button>
            <button
              onClick={downloadQr}
              className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 transition text-sm font-medium"
            >
              Download PNG
            </button>
          </div>
        </div>
      )}
    </section>
  );
}