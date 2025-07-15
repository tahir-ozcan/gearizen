// app/tools/qr-code-generator/qr-code-generator-client.tsx
"use client";

import {
  useState,
  useRef,
  useEffect,
  useMemo,
  ChangeEvent,
} from "react";
import QRCodeStyling from "qr-code-styling";

/**
 * QR Code Generator Client
 *
 * Generate high-resolution QR codes for URLs, text, vCards, and Wi-Fi credentials with color and size options.
 */

// Simple debounce hook
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

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

/** Build payload based on selected type */
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

/** Generate a blob URL for the QR code PNG */
async function generateQrDataUrl(opts: QrOptions): Promise<string> {
  const qr = new QRCodeStyling({
    data: opts.data,
    width: opts.width,
    margin: opts.margin,
    dotsOptions: { color: opts.darkColor },
    backgroundOptions: { color: opts.lightColor },
    image: opts.logoDataUrl,
    imageOptions: { crossOrigin: "anonymous" },
    qrOptions: { errorCorrectionLevel: opts.errorCorrectionLevel },
  });
  const buffer = await qr.getRawData("png");
  const blob = new Blob([buffer], { type: "image/png" });
  return URL.createObjectURL(blob);
}

/** Draw the QR onto our canvas for preview */
async function renderToCanvas(
  opts: QrOptions,
  canvas: HTMLCanvasElement
) {
  const url = await generateQrDataUrl(opts);
  const img = new Image();
  img.crossOrigin = "anonymous";
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = rej;
    img.src = url;
  });
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context failed");
  canvas.width = opts.width;
  canvas.height = opts.width;
  ctx.clearRect(0, 0, opts.width, opts.width);
  ctx.drawImage(img, 0, 0, opts.width, opts.width);
  URL.revokeObjectURL(url);
}

export default function QrCodeGeneratorClient() {
  const [type, setType] = useState<DataType>("text");
  const [text, setText] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const [vcardName, setVcardName] = useState("");
  const [vcardOrg, setVcardOrg] = useState("");
  const [vcardEmail, setVcardEmail] = useState("");
  const [vcardPhone, setVcardPhone] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiAuth, setWifiAuth] = useState<WifiAuthType>("WPA");
  const [wifiPassword, setWifiPassword] = useState("");
  const [size, setSize] = useState(256);
  const [margin, setMargin] = useState(1);
  const [darkColor, setDarkColor] = useState("#000000");
  const [lightColor, setLightColor] = useState("#ffffff");
  const [ecLevel, setEcLevel] = useState<ErrorCorrectionLevel>("M");
  const [logo, setLogo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const debouncedInputs = useDebounce(
    {
      type,
      text,
      urlValue,
      vcardName,
      vcardOrg,
      vcardEmail,
      vcardPhone,
      wifiSsid,
      wifiAuth,
      wifiPassword,
    },
    300
  );

  const payload = useMemo(
    () =>
      buildPayload(
        debouncedInputs.type,
        debouncedInputs.text,
        debouncedInputs.urlValue,
        {
          name: debouncedInputs.vcardName,
          org: debouncedInputs.vcardOrg,
          email: debouncedInputs.vcardEmail,
          phone: debouncedInputs.vcardPhone,
        },
        {
          ssid: debouncedInputs.wifiSsid,
          auth: debouncedInputs.wifiAuth,
          password: debouncedInputs.wifiPassword,
        }
      ),
    [debouncedInputs]
  );

  const options = useMemo<QrOptions>(
    () => ({
      data: payload,
      width: size,
      margin,
      darkColor,
      lightColor,
      errorCorrectionLevel: ecLevel,
      logoDataUrl: logo || undefined,
    }),
    [payload, size, margin, darkColor, lightColor, ecLevel, logo]
  );

  // Generate blob URL
  useEffect(() => {
    if (!payload) {
      setQrUrl(null);
      setError(null);
      return;
    }
    let canceled = false;
    generateQrDataUrl(options)
      .then((url) => {
        if (!canceled) {
          setQrUrl(url);
          setError(null);
        }
      })
      .catch(() => {
        if (!canceled) setError("❌ Failed to generate QR code.");
      });
    return () => {
      canceled = true;
    };
  }, [options, payload]);

  // Render canvas preview
  useEffect(() => {
    if (qrUrl && canvasRef.current) {
      renderToCanvas(options, canvasRef.current).catch(() =>
        setError("❌ Preview render failed.")
      );
    }
  }, [qrUrl, options]);

  const download = () => {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = "qr-code.png";
    a.click();
  };

  const handleLogo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return setLogo(null);
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <section
      id="qr-code-generator"
      aria-labelledby="qr-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
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
          Generate high-resolution QR codes for URLs, text, vCards and Wi-Fi credentials with color and size options.
        </p>
      </div>

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
              value={vcardName}
              onChange={(e) => setVcardName(e.target.value)}
              placeholder="Name"
              className="input-base"
            />
            <input
              type="text"
              value={vcardOrg}
              onChange={(e) => setVcardOrg(e.target.value)}
              placeholder="Organization"
              className="input-base"
            />
            <input
              type="email"
              value={vcardEmail}
              onChange={(e) => setVcardEmail(e.target.value)}
              placeholder="Email"
              className="input-base"
            />
            <input
              type="tel"
              value={vcardPhone}
              onChange={(e) => setVcardPhone(e.target.value)}
              placeholder="Phone"
              className="input-base"
            />
          </div>
        )}
        {type === "wifi" && (
          <div className="grid sm:grid-cols-3 gap-4">
            <input
              type="text"
              value={wifiSsid}
              onChange={(e) => setWifiSsid(e.target.value)}
              placeholder="SSID"
              className="input-base"
            />
            <select
              value={wifiAuth}
              onChange={(e) => setWifiAuth(e.target.value as WifiAuthType)}
              className="input-base"
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None</option>
            </select>
            <input
              type="password"
              value={wifiPassword}
              onChange={(e) => setWifiPassword(e.target.value)}
              placeholder="Password"
              className="input-base"
            />
          </div>
        )}

        {/* Common style controls */}
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

        {error && (
          <div className="p-4 bg-red-50 border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Preview & Actions */}
      {qrUrl && (
        <div className="
          mt-12 max-w-3xl mx-auto text-center space-y-6
        ">
          <canvas
            ref={canvasRef}
            width={size}
            height={size}
            className="mx-auto border rounded"
            aria-label="QR code preview"
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