"use client";

import { useState, ChangeEvent } from "react";
import { csvToJson, jsonToCsv } from "../../../lib/csv-json";
import Textarea from "@/components/Textarea";

export default function CsvJsonConverterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"csv-to-json" | "json-to-csv">("csv-to-json");
  const [error, setError] = useState<string | null>(null);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setError(null);
    setOutput("");
  };

  const convert = () => {
    try {
      if (mode === "csv-to-json") {
        const json = csvToJson(input);
        setOutput(JSON.stringify(json, null, 2));
      } else {
        const data = JSON.parse(input);
        const csv = jsonToCsv(data);
        setOutput(csv);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed");
      setOutput("");
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      alert("✅ Copied to clipboard!");
    } catch {
      alert("❌ Copy failed.");
    }
  };

  return (
    <section
      id="csv-json-converter"
      aria-labelledby="csv-json-converter-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="csv-json-converter-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        CSV ⇄ JSON Converter
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Paste data below, choose conversion direction and get results instantly—100% client-side.
      </p>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              value="csv-to-json"
              checked={mode === "csv-to-json"}
              onChange={() => setMode("csv-to-json")}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <span className="select-none">CSV → JSON</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              value="json-to-csv"
              checked={mode === "json-to-csv"}
              onChange={() => setMode("json-to-csv")}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <span className="select-none">JSON → CSV</span>
          </label>
        </div>
        <Textarea
          value={input}
          onChange={handleInput}
          placeholder={mode === "csv-to-json" ? "name,age\nAlice,30" : '[{"name":"Alice","age":30}]'}
          className="h-40 font-mono text-sm resize-y"
        />
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={convert}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm font-medium"
          >
            Convert
          </button>
          <button
            type="button"
            onClick={copyOutput}
            disabled={!output}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm font-medium disabled:opacity-60"
          >
            Copy Result
          </button>
        </div>
        {error && (
          <p role="alert" className="text-red-600 text-sm">
            {error}
          </p>
        )}
        {output && !error && (
          <Textarea
            value={output}
            readOnly
            className="h-40 font-mono text-sm bg-gray-50 resize-y"
          />
        )}
      </div>
    </section>
  );
}
