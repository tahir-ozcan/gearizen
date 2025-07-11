"use client";

import { useState, ChangeEvent, useEffect } from "react";
import useDebounce from "@/lib/useDebounce";

type Mode = "yaml2json" | "json2yaml";

export default function YamlJsonConverterClient() {
  const [yamlInput, setYamlInput] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [mode, setMode] = useState<Mode>("yaml2json");
  const [error, setError] = useState<string | null>(null);
  const debouncedYaml = useDebounce(yamlInput);
  const debouncedJson = useDebounce(jsonInput);

  useEffect(() => {
    if (mode === "yaml2json" && debouncedYaml.trim()) {
      convertYamlToJson(debouncedYaml);
    } else if (mode === "json2yaml" && debouncedJson.trim()) {
      convertJsonToYaml(debouncedJson);
    } else {
      if (mode === "yaml2json") setJsonInput("");
      else setYamlInput("");
    }
  }, [debouncedYaml, debouncedJson, mode]);

  async function convertYamlToJson(src: string) {
    try {
      const yaml = await import("js-yaml");
      const obj = yaml.load(src);
      setJsonInput(JSON.stringify(obj, null, 2));
      setError(null);
    } catch {
      setError("Invalid YAML input.");
      setJsonInput("");
    }
  }

  async function convertJsonToYaml(src: string) {
    try {
      const yaml = await import("js-yaml");
      const obj = JSON.parse(src);
      setYamlInput(yaml.dump(obj));
      setError(null);
    } catch {
      setError("Invalid JSON input.");
      setYamlInput("");
    }
  }

  const handleYamlChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setYamlInput(e.target.value);
    setError(null);
  };

  const handleJsonChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
    setError(null);
  };

  const copyYaml = async () => {
    if (!yamlInput) return;
    try {
      await navigator.clipboard.writeText(yamlInput);
      alert("✅ YAML copied to clipboard!");
    } catch {
      alert("❌ Failed to copy YAML.");
    }
  };

  const copyJson = async () => {
    if (!jsonInput) return;
    try {
      await navigator.clipboard.writeText(jsonInput);
      alert("✅ JSON copied to clipboard!");
    } catch {
      alert("❌ Failed to copy JSON.");
    }
  };

  return (
    <section
      id="yaml-json-converter"
      aria-labelledby="yaml-json-converter-heading"
      className="container-responsive py-16 text-gray-900 antialiased"
    >
      <h1
        id="yaml-json-converter-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        YAML ⇄ JSON Converter
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Convert YAML to JSON or JSON to YAML entirely in your browser—no data
        ever leaves your device.
      </p>

      <div
        className="max-w-4xl mx-auto space-y-6"
        aria-label="YAML JSON converter form"
      >
        <div className="flex justify-center gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={mode === "yaml2json"}
              onChange={() => setMode("yaml2json")}
            />
            <span className="text-sm">YAML → JSON</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={mode === "json2yaml"}
              onChange={() => setMode("json2yaml")}
            />
            <span className="text-sm">JSON → YAML</span>
          </label>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <label
              htmlFor="yaml-input"
              className="block mb-1 font-medium text-gray-800"
            >
              YAML
            </label>
            <textarea
              id="yaml-input"
              value={yamlInput}
              onChange={handleYamlChange}
              placeholder="key: value"
              rows={10}
              className="w-full p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            />
            <button
              type="button"
              onClick={copyYaml}
              disabled={!yamlInput}
              className="mt-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 transition text-sm font-medium disabled:opacity-60"
            >
              Copy YAML
            </button>
          </div>

          <div>
            <label
              htmlFor="json-input"
              className="block mb-1 font-medium text-gray-800"
            >
              JSON
            </label>
            <textarea
              id="json-input"
              value={jsonInput}
              onChange={handleJsonChange}
              placeholder={`{\n  "key": "value"\n}`}
              rows={10}
              className="w-full p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            />
            <button
              type="button"
              onClick={copyJson}
              disabled={!jsonInput}
              className="mt-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 transition text-sm font-medium disabled:opacity-60"
            >
              Copy JSON
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="text-red-600 text-sm">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
