// app/tools/qr-code-generator/qr-code-generator-client.tsx
"use client";

import { useState, useMemo, ChangeEvent } from "react";
import Image from "next/image";
import QRCodeStyling from "qr-code-styling";

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
  logo?: string;
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
 * Generate a QR code as a PNG blob URL using qr-code-styling.
 */
async function generateQrBlob(opts: QrOptions): Promise<string> {
  const qr = new QRCodeStyling({
    data: opts.data,
    width: opts.width,
    margin: opts.margin,
    dotsOptions: { color: opts.darkColor },
    backgroundOptions: { color: opts.lightColor },
    image: opts.logo,
    imageOptions: { crossOrigin: "anonymous" },
    qrOptions: { errorCorrectionLevel: opts.errorCorrectionLevel },
  });
  const rawData = await qr.getRawData("png");
  const blob = new Blob([rawData], { type: "image/png" });
  return URL.createObjectURL(blob);
}

export default function QrCodeGeneratorClient() {
  // --- State for all inputs ---
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
  const [logo, setLogo] = useState<string | null>(null);

  // State for generated result
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Memoize payload string and options object
  const payload = useMemo(
    () => buildPayload(type, text, urlValue, vcard, wifi),
    [type, text, urlValue, vcard, wifi]
  );

  const options = useMemo<QrOptions>(
    () => ({
      data: payload,
      width: size,
      margin,
      darkColor,
      lightColor,
      errorCorrectionLevel: ecLevel,
      logo: logo || undefined,
    }),
    [payload, size, margin, darkColor, lightColor, ecLevel, logo]
  );

  // Generate QR on button click
  const generateQr = async () => {
    if (!payload) {
      setQrUrl(null);
      setError("❌ Please enter some data to generate a QR code.");
      return;
    }
    setError(null);
    try {
      const url = await generateQrBlob(options);
      setQrUrl(url);
    } catch {
      setQrUrl(null);
      setError("❌ Failed to generate QR code. Please try again.");
    }
  };

  // Handle optional logo upload
  const handleLogo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setLogo(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Download the generated QR as a PNG
  const download = () => {
    if (!qrUrl) return;
    const link = document.createElement("a");
    link.href = qrUrl;
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
          Generate high-resolution QR codes for text, URLs, vCards, and Wi-Fi credentials—all in your browser. Customize size,
          colors, error correction, and optionally add your logo. Click “Generate” when you’re ready.
        </p>
      </div>

      {/* Controls */}
      <div className="max-w-3xl mx-auto space-y-8 sm:px-0">
        {/* Data Type Selector */}
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

        {/* Conditional Inputs */}
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

        {/* Style Controls */}
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
            Margin:
            <input
              type="number"
              min={0}
              max={10}
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

        {/* Generate Button */}
        <div className="text-center">
          <button
            onClick={generateQr}
            className="
              inline-block
              bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
              text-white font-medium
              px-6 py-3 rounded-full
              transition transform hover:scale-105
            "
          >
            Generate QR Code
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Preview & Actions */}
      {qrUrl && (
        <div className="mt-12 max-w-3xl mx-auto text-center space-y-6">
          <Image
            src={qrUrl}
            alt="QR code preview"
            width={size}
            height={size}
            unoptimized
            className="mx-auto border rounded"
          />
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigator.clipboard.writeText(qrUrl)}
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Copy URL
            </button>
            <button
              onClick={download}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            >
              Download PNG
            </button>
          </div>
        </div>
      )}
    </section>
  );
}