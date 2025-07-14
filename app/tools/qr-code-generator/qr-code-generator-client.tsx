"use client";

import {
  useState,
  useRef,
  useEffect,
  useMemo,
  ChangeEvent,
} from "react";
import QRCodeStyling from "qr-code-styling"; // statik import ile doğru tip alıyoruz

/**
 * QR Code Generator Client
 *
 * Create custom QR codes instantly in the browser.
 */

// Basit bir debounce hook'u
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

interface QrOptions {
  text: string;
  width: number;
  margin: number;
  darkColor: string;
  lightColor: string;
  errorCorrectionLevel: ErrorCorrectionLevel;
  logoDataUrl?: string;
}

/**
 * Generate a Data URL (PNG) for the QR code image
 */
async function generateQrDataUrl(opts: QrOptions): Promise<string> {
  // Statik import ettiğimiz sınıfı doğrudan kullanıyoruz
  const qr = new QRCodeStyling({
    data: opts.text,
    width: opts.width,
    margin: opts.margin,
    dotsOptions: { color: opts.darkColor },
    backgroundOptions: { color: opts.lightColor },
    image: opts.logoDataUrl,
    imageOptions: { crossOrigin: "anonymous" },
    qrOptions: { errorCorrectionLevel: opts.errorCorrectionLevel },
  });

  // getRawData, PNG olarak ham ArrayBuffer döndürüyor
  const arrayBuffer = await qr.getRawData("png");
  // ArrayBuffer'ı blob'a sarıyoruz
  const blob = new Blob([arrayBuffer], { type: "image/png" });
  return URL.createObjectURL(blob);
}

/**
 * Render the QR code to an off-screen canvas
 */
async function generateQrCanvas(opts: QrOptions): Promise<HTMLCanvasElement> {
  const dataUrl = await generateQrDataUrl(opts);
  const img = new Image();
  img.crossOrigin = "anonymous";

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = opts.width;
      canvas.height = opts.width;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context failed"));
        return;
      }
      ctx.drawImage(img, 0, 0, opts.width, opts.width);
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/**
 * Stub for embedding metadata; brevity için orijinal URL'i döndürüyoruz
 */
function embedPngMetadata(dataUrl: string): string {
  return dataUrl;
}

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

  const debouncedText = useDebounce(text, 300);

  const options = useMemo<QrOptions>(
    () => ({
      text: debouncedText,
      width: size,
      margin,
      darkColor,
      lightColor,
      errorCorrectionLevel: ecLevel,
      logoDataUrl: logo || undefined,
    }),
    [debouncedText, size, margin, darkColor, lightColor, ecLevel, logo]
  );

  // Data URL üretimi
  useEffect(() => {
    if (!debouncedText.trim()) {
      setQrUrl(null);
      setError(null);
      return;
    }
    let cancelled = false;
    generateQrDataUrl(options)
      .then((url) => {
        if (!cancelled) {
          setQrUrl(url);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setError("❌ Failed to generate QR code.");
      });
    return () => {
      cancelled = true;
    };
  }, [options, debouncedText]);

  // Canvas'a render
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
      .catch(() => setError("❌ Failed to render QR code."));
  }, [qrUrl, options]);

  const copyQr = async () => {
    if (!qrUrl) return;
    try {
      await navigator.clipboard.writeText(qrUrl);
      alert("✅ QR code URL copied!");
    } catch {
      alert("❌ Failed to copy URL.");
    }
  };

  const downloadQr = () => {
    if (!qrUrl) return;
    const dataWithMeta = embedPngMetadata(qrUrl);
    const a = document.createElement("a");
    a.href = dataWithMeta;
    a.download = "qr-code.png";
    a.click();
  };

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

  return (
    <section
      id="qr-code-generator"
      aria-labelledby="qr-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Başlık & Açıklama */}
      <div className="text-center sm:px-0 space-y-4">
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
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Create custom QR codes—enter any text or URL, adjust size, colors, add a
          logo, and download instantly, all in your browser.
        </p>
      </div>

      {/* Kontroller */}
      <div className="max-w-3xl mx-auto space-y-8 sm:px-0">
        <div className="space-y-6">
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
              placeholder="Enter text or link…"
              className="
                w-full p-3 border border-gray-300 rounded-md bg-white
                focus:outline-none focus:ring-2 focus:ring-[#7c3aed]
                transition
              "
            />
          </div>

          <div>
            <label
              htmlFor="qr-size"
              className="block mb-1 font-medium text-gray-800"
            >
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
              <label
                htmlFor="qr-margin"
                className="block mb-1 font-medium text-gray-800"
              >
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
              <label
                htmlFor="qr-ec"
                className="block mb-1 font-medium text-gray-800"
              >
                Error Correction
              </label>
              <select
                id="qr-ec"
                value={ecLevel}
                onChange={(e) =>
                  setEcLevel(e.target.value as ErrorCorrectionLevel)
                }
                className="input-base w-full"
              >
                <option value="L">L - 7%</option>
                <option value="M">M - 15%</option>
                <option value="Q">Q - 25%</option>
                <option value="H">H - 30%</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="qr-dark"
                className="block mb-1 font-medium text-gray-800"
              >
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
              <label
                htmlFor="qr-light"
                className="block mb-1 font-medium text-gray-800"
              >
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
              <label
                htmlFor="qr-logo"
                className="block mb-1 font-medium text-gray-800"
              >
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
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Önizleme & Butonlar */}
      {qrUrl && (
        <div className="mt-12 max-w-3xl mx-auto text-center space-y-6">
          <canvas
            ref={canvasRef}
            width={size}
            height={size}
            aria-label="QR code preview"
            className="border rounded-md mx-auto"
          />
          <div className="flex justify-center gap-4">
            <button
              onClick={copyQr}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
            >
              Copy URL
            </button>
            <button
              onClick={downloadQr}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition font-medium"
            >
              Download PNG
            </button>
          </div>
        </div>
      )}
    </section>
  );
}