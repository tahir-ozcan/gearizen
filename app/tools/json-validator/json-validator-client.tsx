// app/tools/json-validator/json-validator-client.tsx
"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import jsonlint from "jsonlint-mod";

export default function JsonValidatorClient() {
  const [input, setInput] = useState("");
  const [formatted, setFormatted] = useState("");
  const [error, setError] = useState<{
    message: string;
    line?: number;
    column?: number;
  } | null>(null);

  // Gutter genişliği state’i
  const [gutterWidth, setGutterWidth] = useState("3ch");

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lineNumRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);
  const outLineNumRef = useRef<HTMLTextAreaElement>(null);

  // Scroll sync: input → gutter
  useEffect(() => {
    const inp = inputRef.current;
    const gutter = lineNumRef.current;
    if (inp && gutter) {
      const sync = () => (gutter.scrollTop = inp.scrollTop);
      inp.addEventListener("scroll", sync);
      return () => inp.removeEventListener("scroll", sync);
    }
  }, []);

  // Scroll sync: output → gutter
  useEffect(() => {
    const out = outputRef.current;
    const gutter = outLineNumRef.current;
    if (out && gutter) {
      const sync = () => (gutter.scrollTop = out.scrollTop);
      out.addEventListener("scroll", sync);
      return () => out.removeEventListener("scroll", sync);
    }
  }, []);

  // Satır sayısına göre gutter genişliğini güncelle
  const updateGutter = (text: string) => {
    const lines = text.split("\n").length;
    const digits = String(lines).length;
    setGutterWidth(`${digits + 1}ch`);
  };

  // Input değişince
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setInput(v);
    setError(null);
    setFormatted("");
    updateGutter(v);
  };

  // JSON validate & format
  const validateJson = () => {
    if (!input.trim()) {
      setError({ message: "Input cannot be empty." });
      setFormatted("");
      return;
    }
    try {
      const obj = jsonlint.parse(input);
      const pretty = JSON.stringify(obj, null, 2);
      setFormatted(pretty);
      setError(null);
      updateGutter(pretty);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      const lineMatch = msg.match(/line (\d+)/i);
      const colMatch = msg.match(/column (\d+)/i);
      setError({
        message: msg.split("\n")[0],
        line: lineMatch ? Number(lineMatch[1]) : undefined,
        column: colMatch ? Number(colMatch[1]) : undefined,
      });
      setFormatted("");
      updateGutter(input);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!formatted) return;
    try {
      await navigator.clipboard.writeText(formatted);
      alert("✅ Formatted JSON copied!");
    } catch {
      alert("❌ Copy failed.");
    }
  };

  // Satır numaraları üretici
  const lineNumbers = (text: string) =>
    text.split("\n").map((_, i) => String(i + 1)).join("\n");

  const textareaBase =
    "font-mono text-sm leading-relaxed p-4 resize-none";

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 text-gray-900 antialiased">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6">
        Free JSON Validator &amp; Linter
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Paste your JSON and instantly see syntax errors (line/column) plus a
        prettified output—all client-side.
      </p>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* INPUT */}
        <div className="flex border border-gray-300 rounded-lg overflow-hidden min-h-[20vh] max-h-[60vh] resize-y bg-white">
          {/* Gutter */}
          <textarea
            ref={lineNumRef}
            readOnly
            aria-hidden="true"
            wrap="off"
            value={lineNumbers(input || " ")}
            className={`${textareaBase} bg-gray-100 text-gray-500 border-r border-gray-300`}
            style={{
              width: gutterWidth,
              boxSizing: "border-box",
              minWidth: "2ch",
              maxWidth: "5ch",
              overflow: "hidden",
              whiteSpace: "pre",
            }}
          />
          {/* Kod alanı */}
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleChange}
            placeholder="Paste or type your JSON here…"
            aria-invalid={!!error}
            aria-describedby={error ? "json-error" : undefined}
            className={`${textareaBase} flex-1 border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 overflow-auto`}
          />
        </div>

        {/* ERROR */}
        {error && (
          <div
            id="json-error"
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700 text-sm"
          >
            <p className="font-semibold">Error: {error.message}</p>
            {error.line != null && (
              <p className="mt-1">
                Line <span className="font-mono">{error.line}</span>
                {error.column != null && (
                  <>
                    , Column <span className="font-mono">{error.column}</span>
                  </>
                )}
              </p>
            )}
          </div>
        )}

        {/* BUTTON */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={validateJson}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            Validate &amp; Format
          </button>
          <button
            onClick={copyToClipboard}
            disabled={!formatted}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition disabled:opacity-50"
          >
            Copy Formatted
          </button>
        </div>

        {/* OUTPUT */}
        {formatted && (
          <div className="flex border border-gray-300 rounded-lg overflow-hidden min-h-[20vh] max-h-[60vh] resize-y bg-white">
            <textarea
              ref={outLineNumRef}
              readOnly
              aria-hidden="true"
              wrap="off"
              value={lineNumbers(formatted)}
              className={`${textareaBase} bg-gray-100 text-gray-500 border-r border-gray-300`}
              style={{
                width: gutterWidth,
                boxSizing: "border-box",
                minWidth: "2ch",
                maxWidth: "5ch",
                overflow: "hidden",
                whiteSpace: "pre",
              }}
            />
            <textarea
              ref={outputRef}
              readOnly
              value={formatted}
              className={`${textareaBase} flex-1 border-none bg-gray-50 focus:outline-none overflow-auto`}
            />
          </div>
        )}
      </div>
    </section>
  );
}