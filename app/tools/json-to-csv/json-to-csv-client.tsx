// app/tools/json-to-csv/json-to-csv-client.tsx
"use client";

import { useState, ChangeEvent, useEffect } from "react";
import useDebounce from "@/lib/useDebounce";
import { jsonToCsv } from "@/lib/jsonToCsv";

export default function JsonToCsvClient() {
  const [jsonText, setJsonText] = useState("");
  const [csvText, setCsvText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const debouncedJson = useDebounce(jsonText);

  useEffect(() => {
    if (!debouncedJson.trim()) {
      setCsvText("");
      return;
    }
    try {
      const parsed = JSON.parse(debouncedJson);
      if (!Array.isArray(parsed)) {
        throw new Error("JSON must be an array of objects");
      }
      setCsvText(jsonToCsv(parsed));
      setError(null);
    } catch (err) {
      setCsvText("");
      setError(err instanceof Error ? err.message : "Invalid JSON data");
    }
  }, [debouncedJson]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setJsonText(e.target.value);
    setError(null);
  };

  const copyCsv = async () => {
    if (!csvText) return;
    try {
      await navigator.clipboard.writeText(csvText);
      alert("✅ CSV copied to clipboard!");
    } catch {
      alert("❌ Failed to copy CSV.");
    }
  };

  const downloadCsv = () => {
    if (!csvText) return;
    const blob = new Blob([csvText], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="json-to-csv"
      aria-labelledby="json-to-csv-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1 id="json-to-csv-heading" className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight">
        JSON to CSV Converter
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Paste your JSON array to convert it into CSV format. 100% client-side, no signup required.
      </p>

      <div className="max-w-4xl mx-auto space-y-6" aria-label="JSON to CSV form">
        <div>
          <label htmlFor="json-input" className="block mb-1 font-medium text-gray-800">
            JSON Input
          </label>
          <textarea
            id="json-input"
            value={jsonText}
            onChange={handleChange}
            placeholder='[{"name":"Alice","age":30},{"name":"Bob","age":25}]'
            rows={8}
            className="w-full p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        {error && (
          <p role="alert" className="text-red-600 text-sm">
            {error}
          </p>
        )}
      </div>

      {csvText && (
        <div className="mt-12 max-w-4xl mx-auto space-y-6">
          <label htmlFor="csv-output" className="block mb-1 font-medium text-gray-800">
            CSV Output
          </label>
          <textarea
            id="csv-output"
            readOnly
            value={csvText}
            rows={10}
            className="w-full p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <div className="flex justify-center gap-4">
            <button
              onClick={copyCsv}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm font-medium"
            >
              Copy CSV
            </button>
            <button
              onClick={downloadCsv}
              className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 transition text-sm font-medium"
            >
              Download CSV
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
