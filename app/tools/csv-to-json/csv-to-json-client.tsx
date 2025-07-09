// app/tools/csv-to-json/csv-to-json-client.tsx

"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Papa from "papaparse";

export default function CsvToJsonClient() {
  const [csvText, setCsvText] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCsvChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCsvText(e.target.value);
    setError(null);
    setJsonText("");
  };

  const convertCsv = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setJsonText("");
    if (!csvText.trim()) {
      setError("Please paste or type your CSV data above.");
      return;
    }
    try {
      const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
      });
      if (result.errors.length) {
        throw new Error(result.errors[0].message);
      }
      setJsonText(JSON.stringify(result.data, null, 2));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred during parsing."
      );
    }
  };

  const copyJson = async () => {
    if (!jsonText) return;
    try {
      await navigator.clipboard.writeText(jsonText);
      alert("✅ JSON copied to clipboard!");
    } catch {
      alert("❌ Failed to copy JSON.");
    }
  };

  const downloadJson = () => {
    if (!jsonText) return;
    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="csv-to-json"
      aria-labelledby="csv-to-json-heading"
      className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="csv-to-json-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        CSV to JSON Converter
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Paste your CSV data below to convert it into JSON. Supports headers,
        skips empty lines—100% client-side, no signup required.
      </p>

      <form
        onSubmit={convertCsv}
        className="max-w-4xl mx-auto space-y-6"
        aria-label="CSV to JSON form"
      >
        <div>
          <label htmlFor="csv-input" className="block mb-1 font-medium text-gray-800">
            CSV Input
          </label>
          <textarea
            id="csv-input"
            value={csvText}
            onChange={handleCsvChange}
            placeholder="column1,column2,column3\nvalue1,value2,value3\n…"
            rows={8}
            className="w-full p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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
          Convert to JSON
        </button>
      </form>

      {jsonText && (
        <div className="mt-12 max-w-4xl mx-auto space-y-6">
          <label htmlFor="json-output" className="block mb-1 font-medium text-gray-800">
            JSON Output
          </label>
          <textarea
            id="json-output"
            readOnly
            value={jsonText}
            rows={10}
            className="w-full p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <div className="flex justify-center gap-4">
            <button
              onClick={copyJson}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm font-medium"
            >
              Copy JSON
            </button>
            <button
              onClick={downloadJson}
              className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 transition text-sm font-medium"
            >
              Download JSON
            </button>
          </div>
        </div>
      )}
    </section>
  );
}