// app/tools/pdf-toolkit/pdf-toolkit-client.tsx
"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { jsPDF } from "jspdf";
// PDF.js runtime
import {
  getDocument,
  GlobalWorkerOptions,
  type PDFDocumentProxy,
  type PDFPageProxy,
} from "pdfjs-dist/legacy/build/pdf";
// Docx
import {
  Document as DocxDocument,
  Packer,
  Paragraph,
  ImageRun,
} from "docx";

export default function PdfToolkitClient() {
  // --- State ---
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<"idle" | "compress" | "extract">("idle");
  const [error, setError] = useState<string | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [jpegQuality, setJpegQuality] = useState(0.8);
  const inputRef = useRef<HTMLInputElement>(null);

  // PDF.js worker
  useEffect(() => {
    GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
  }, []);

  // — Handlers —

  function handleSelectClick() {
    inputRef.current?.click();
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setError(null);
    setCompressedBlob(null);
    if (!f) {
      setFile(null);
      return;
    }
    if (f.type !== "application/pdf") {
      setError("❌ Lütfen geçerli bir PDF dosyası seçin.");
      setFile(null);
      return;
    }
    setFile(f);
  }

  /** Compress by rasterizing pages to JPEG & rebuilding PDF */
  async function handleCompress() {
    if (!file) return;
    setLoading("compress");
    setError(null);
    setCompressedBlob(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf: PDFDocumentProxy = await getDocument({ data: arrayBuffer }).promise;
      const doc = new jsPDF({ unit: "pt", format: "a4" });

      for (let i = 1; i <= pdf.numPages; i++) {
        const page: PDFPageProxy = await pdf.getPage(i);

        // @ts-expect-error getViewport is a runtime method
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // @ts-expect-error render is a runtime method
          const renderTask = page.render({ canvasContext: ctx, viewport });
          await renderTask.promise;
        }

        const imgData = canvas.toDataURL("image/jpeg", jpegQuality);
        const props = doc.getImageProperties(imgData);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = (props.height * pageWidth) / props.width;
        if (i > 1) doc.addPage();
        doc.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);
      }

      const blob = doc.output("blob");
      setCompressedBlob(blob);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "❌ Sıkıştırma başarısız.");
    } finally {
      setLoading("idle");
    }
  }

  /** Trigger download only, no new tab */
  function handleDownloadCompressed() {
    if (!compressedBlob || !file) return;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compressed-${file.name}`;
    a.rel = "noopener"; // kesinlikle yeni sekme açmasın
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /** Convert pages to images and embed in Word to preserve exact layout */
  async function handleExtractToWord() {
    if (!file) return;
    setLoading("extract");
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf: PDFDocumentProxy = await getDocument({ data: arrayBuffer }).promise;
      const children: Paragraph[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page: PDFPageProxy = await pdf.getPage(i);

        // @ts-expect-error getViewport is runtime
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // @ts-expect-error render is runtime
          const renderTask = page.render({ canvasContext: ctx, viewport });
          await renderTask.promise;
        }

        const dataUrl = canvas.toDataURL("image/png");
        const base64 = dataUrl.split(",")[1];
        const buffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

        children.push(
          new Paragraph({
            children: [
              new ImageRun({
                data: buffer,
                transformation: { width: viewport.width, height: viewport.height },
                type: "png",
              }),
            ],
            spacing: { after: 200 },
          })
        );
      }

      const doc = new DocxDocument({ sections: [{ children }] });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, ".docx");
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "❌ Word’e çevirme hatası.");
    } finally {
      setLoading("idle");
    }
  }

  return (
    <section id="pdf-toolkit" aria-labelledby="pdf-toolkit-heading" className="space-y-16 text-gray-900 antialiased">
      {/* Başlık */}
      <div className="text-center space-y-6 sm:px-0">
        <h1
          id="pdf-toolkit-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          PDF Toolkit: Compress &amp; True-Layout Convert
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-700">
          Ayarlanabilir JPEG kalitesiyle PDF’leri küçültün ve sayfa düzenini bozmadan Word’e aktarın.
        </p>
      </div>

      {/* Dosya Seçimi */}
      <div className="max-w-md mx-auto flex flex-col items-center space-y-4">
        <input ref={inputRef} type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
        <button
          onClick={handleSelectClick}
          disabled={loading !== "idle"}
          className="
            inline-block
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-white font-medium
            px-6 py-3 rounded-full
            transition transform hover:scale-105 disabled:opacity-50
          "
        >
          {file ? "PDF Değiştir…" : "PDF Seç…"}
        </button>
        {file && (
          <p className="text-sm text-gray-600 font-mono truncate w-full text-center">
            {file.name} — {(file.size / 1024).toFixed(1)} KB
          </p>
        )}
      </div>

      {/* JPEG Kalite Slider */}
      {file && (
        <div className="max-w-md mx-auto px-4">
          <label className="block text-gray-800">
            JPEG Kalite: <span className="font-semibold">{Math.round(jpegQuality * 100)}%</span>
          </label>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={jpegQuality * 100}
            onChange={(e) => setJpegQuality(Number(e.target.value) / 100)}
            className="w-full"
          />
        </div>
      )}

      {/* Hata */}
      {error && (
        <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-center">
          {error}
        </div>
      )}

      {/* İşlem Butonları */}
      {file && (
        <div className="max-w-md mx-auto flex flex-wrap justify-center gap-4">
          <button
            onClick={handleCompress}
            disabled={loading !== "idle"}
            className="
              inline-block
              bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
              text-white font-medium
              px-6 py-3 rounded-full
              transition transform hover:scale-105 disabled:opacity-50
            "
          >
            {loading === "compress" ? "Sıkıştırılıyor…" : "PDF Sıkıştır"}
          </button>

          {compressedBlob && (
            <button
              onClick={handleDownloadCompressed}
              className="
                inline-block
                border border-indigo-500 text-indigo-500 font-medium
                px-6 py-3 rounded-full
                transition hover:bg-indigo-50
              "
            >
              İndir (Sıkıştırıldı)
            </button>
          )}

          <button
            onClick={handleExtractToWord}
            disabled={loading !== "idle"}
            className="
              inline-block
              bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
              text-white font-medium
              px-6 py-3 rounded-full
              transition transform hover:scale-105 disabled:opacity-50
            "
          >
            {loading === "extract" ? "Dönüştürülüyor…" : "Word’e Aktar"}
          </button>
        </div>
      )}
    </section>
  );
}