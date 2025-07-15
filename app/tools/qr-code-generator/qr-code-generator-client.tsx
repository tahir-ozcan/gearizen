// app/tools/qr-code-generator/qr-code-generator-client.tsx
"use client";

import { useState, useMemo, useRef, useEffect, ChangeEvent } from "react";
import QRCode from "qrcode";

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";
type DataType = "text" | "url" | "vcard" | "wifi";
type WifiAuthType = "WPA" | "WEP" | "nopass";

interface QrOptions {
  data: string;
  width: number;
  margin: number;
  darkColor: string;
  lightColor: string;
  errorCorrectionLevel: ErrorCorrectionLevel;
  logoDataUrl?: string;
}

/**
 * Build the raw payload string for the QR code,
 * based on the selected data type and inputs.
 */
function buildPayload(
  type: DataType,
  text: string,
  url: string,
  vcard: { name: string; org: string; email: string; phone: string },
  wifi: { ssid: string; auth: WifiAuthType; password: string }
): string {
  switch (type) {
    case "url":
      return url.trim();
    case "vcard":
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${vcard.name}`,
        `ORG:${vcard.org}`,
        `EMAIL:${vcard.email}`,
        `TEL:${vcard.phone}`,
        "END:VCARD",
      ].join("\n");
    case "wifi":
      return `WIFI:T:${wifi.auth};S:${wifi.ssid};P:${wifi.password};;`;
    case "text":
    default:
      return text.trim();
  }
}

/**
 * Draw the QR code onto the given canvas, apply logo if provided,
 * and return a PNG data URL.
 */
async function drawQrToCanvas(
  canvas: HTMLCanvasElement,
  opts: QrOptions
): Promise<string> {
  // Draw QR code
  await QRCode.toCanvas(canvas, opts.data, {
    errorCorrectionLevel: opts.errorCorrectionLevel,
    margin: opts.margin,
    width: opts.width,
    color: {
      dark: opts.darkColor,
      light: opts.lightColor,
    },
  });

  // Overlay logo if provided
  if (opts.logoDataUrl) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const img = new Image();
      img.src = opts.logoDataUrl;
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
      const logoSize = opts.width * 0.2;
      const x = (opts.width - logoSize) / 2;
      const y = (opts.width - logoSize) / 2;
      ctx.drawImage(img, x, y, logoSize, logoSize);
    }
  }

  // Export as PNG data URL
  return canvas.toDataURL("image/png");
}

export default function QrCodeGeneratorClient() {
  // --- Input State ---
  const [type, setType] = useState<DataType>("text");
  const [text, setText] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const [vcard, setVcard] = useState({ name: "", org: "", email: "", phone: "" });
  const [wifi, setWifi] = useState({ ssid: "", auth: "WPA" as WifiAuthType, password: "" });
  const [size, setSize] = useState(256);
  const [margin, setMargin] = useState(1);
  const [darkColor, setDarkColor] = useState("#000000");
  const [lightColor, setLightColor] = useState("#ffffff");
  const [ecLevel, setEcLevel] = useState<ErrorCorrectionLevel>("M");
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);

  // --- Result State ---
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Canvas ref for rendering
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sample QR content when inputs are empty
  const initialSample = "https://gearizen.com";

  // Build the payload string from inputs
  const payload = useMemo(
    () => buildPayload(type, text, urlValue, vcard, wifi),
    [type, text, urlValue, vcard, wifi]
  );

  // Automatically regenerate QR whenever any option changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setError("❌ Canvas not available.");
      setQrDataUrl(null);
      return;
    }

    const opts: QrOptions = {
      data: payload || initialSample,
      width: size,
      margin,
      darkColor,
      lightColor,
      errorCorrectionLevel: ecLevel,
      logoDataUrl: logoDataUrl || undefined,
    };

    setError(null);
    drawQrToCanvas(canvas, opts)
      .then((dataUrl) => setQrDataUrl(dataUrl))
      .catch((e) => {
        console.error(e);
        setError("❌ QR code generation failed. Please try again.");
        setQrDataUrl(null);
      });
  }, [payload, size, margin, darkColor, lightColor, ecLevel, logoDataUrl]);

  /** Handle logo file upload */
  const handleLogo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setLogoDataUrl(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  /** Download the current QR as PNG */
  const download = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `qr-code-${type}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="qr-code-generator" aria-labelledby="qr-heading" className="space-y-16 text-gray-900 antialiased">
      {/* Heading & Description */}
      <div className="text-center space-y-6 sm:px-0">
        <h1
          id="qr-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          QR Code Generator
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Generate high-resolution QR codes for text, URLs, vCards or Wi-Fi credentials. Adjust size, margin, colors, error correction, and optionally add your logo. The preview updates automatically.
        </p>
      </div>

      {/* Controls */}
      <div className="max-w-3xl mx-auto space-y-8 sm:px-0">
        {/* Type selector */}
        <div>
          <label className="block mb-1 font-medium text-gray-800">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as DataType)}
            className="input-base w-full"
          >
            <option value="text">Text</option>
            <option value="url">URL</option>
            <option value="vcard">vCard</option>
            <option value="wifi">Wi-Fi</option>
          </select>
        </div>

        {/* Conditional inputs */}
        {type === "text" && (
          <div>
            <label className="block mb-1 font-medium text-gray-800">Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="input-base w-full"
              placeholder="Enter any text…"
            />
          </div>
        )}
        {type === "url" && (
          <div>
            <label className="block mb-1 font-medium text-gray-800">URL</label>
            <input
              type="url"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              className="input-base w-full"
              placeholder="https://example.com"
            />
          </div>
        )}
        {type === "vcard" && (
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={vcard.name}
              onChange={(e) => setVcard({ ...vcard, name: e.target.value })}
              placeholder="Full Name"
              className="input-base"
            />
            <input
              type="text"
              value={vcard.org}
              onChange={(e) => setVcard({ ...vcard, org: e.target.value })}
              placeholder="Organization"
              className="input-base"
            />
            <input
              type="email"
              value={vcard.email}
              onChange={(e) => setVcard({ ...vcard, email: e.target.value })}
              placeholder="Email Address"
              className="input-base"
            />
            <input
              type="tel"
              value={vcard.phone}
              onChange={(e) => setVcard({ ...vcard, phone: e.target.value })}
              placeholder="Phone Number"
              className="input-base"
            />
          </div>
        )}
        {type === "wifi" && (
          <div className="grid sm:grid-cols-3 gap-4">
            <input
              type="text"
              value={wifi.ssid}
              onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
              placeholder="SSID"
              className="input-base"
            />
            <select
              value={wifi.auth}
              onChange={(e) => setWifi({ ...wifi, auth: e.target.value as WifiAuthType })}
              className="input-base w-full"
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None</option>
            </select>
            <input
              type="password"
              value={wifi.password}
              onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
              placeholder="Password"
              className="input-base"
            />
          </div>
        )}

        {/* Style controls */}
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            Size: <span className="font-semibold">{size}px</span>
            <input
              type="range"
              min={128}
              max={512}
              step={16}
              value={size}
              onChange={(e) => setSize(+e.target.value)}
              className="w-full"
            />
          </label>
          <label className="block">
            Margin: <span className="font-semibold">{margin}</span>
            <input
              type="number"
              min={0}
              max={20}
              value={margin}
              onChange={(e) => setMargin(+e.target.value)}
              className="input-base w-full"
            />
          </label>
          <label className="block">
            Foreground:
            <input
              type="color"
              value={darkColor}
              onChange={(e) => setDarkColor(e.target.value)}
              className="w-full h-10"
            />
          </label>
          <label className="block">
            Background:
            <input
              type="color"
              value={lightColor}
              onChange={(e) => setLightColor(e.target.value)}
              className="w-full h-10"
            />
          </label>
          <label className="block sm:col-span-2">
            Error Correction:
            <select
              value={ecLevel}
              onChange={(e) => setEcLevel(e.target.value as ErrorCorrectionLevel)}
              className="input-base w-full"
            >
              <option value="L">L – 7%</option>
              <option value="M">M – 15%</option>
              <option value="Q">Q – 25%</option>
              <option value="H">H – 30%</option>
            </select>
          </label>
          <label className="block sm:col-span-2">
            Logo (optional):
            <input
              type="file"
              accept="image/*"
              onChange={handleLogo}
              className="input-base w-full"
            />
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Canvas Preview & Actions */}
      <div className="mt-12 max-w-3xl mx-auto text-center space-y-6">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="mx-auto border rounded"
          aria-label="QR code preview"
        />
        <div className="flex justify-center gap-4">
          <button
            onClick={() => qrDataUrl && navigator.clipboard.writeText(qrDataUrl)}
            disabled={!qrDataUrl}
            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:opacity-50"
          >
            Copy URL
          </button>
          <button
            onClick={download}
            disabled={!qrDataUrl}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition disabled:opacity-50"
          >
            Download PNG
          </button>
        </div>
      </div>
    </section>
  );
}