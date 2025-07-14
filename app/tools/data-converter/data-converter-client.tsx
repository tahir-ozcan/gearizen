// app/tools/data-converter/data-converter-client.tsx
"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { Trash2, ClipboardCopy } from "lucide-react";
import Papa from "papaparse";
import YAML from "js-yaml";

type Format = "csv" | "json" | "yaml" | "xml";

/**
 * Convert XML Document/Node to a JavaScript value
 */
function xmlToJson(node: Node): unknown {
  // Text node
  if (node.nodeType === Node.TEXT_NODE) {
    return node.nodeValue?.trim() || "";
  }
  const obj: Record<string, unknown> = {};
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as Element;
    if (el.attributes.length > 0) {
      const attrs: Record<string, string> = {};
      Array.from(el.attributes).forEach((attr) => {
        attrs[attr.name] = attr.value;
      });
      obj["@attributes"] = attrs;
    }
  }
  if (node.hasChildNodes()) {
    Array.from(node.childNodes).forEach((child) => {
      const key = child.nodeName;
      const value = xmlToJson(child);
      if (child.nodeType === Node.TEXT_NODE && value === "") {
        return; // skip whitespace-only
      }
      const existing = obj[key];
      if (existing !== undefined) {
        if (Array.isArray(existing)) {
          (existing as unknown[]).push(value);
        } else {
          obj[key] = [existing, value];
        }
      } else {
        obj[key] = value;
      }
    });
  }
  return obj;
}

/**
 * Convert a JavaScript value to simple XML string
 */
function jsonToXml(value: unknown, nodeName = "root"): string {
  if (typeof value !== "object" || value === null) {
    const escaped = String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<${nodeName}>${escaped}</${nodeName}>`;
  }
  if (Array.isArray(value)) {
    return value.map((item) => jsonToXml(item, nodeName)).join("");
  }
  let xml = `<${nodeName}>`;
  for (const [key, val] of Object.entries(value)) {
    if (key === "@attributes" && typeof val === "object" && val !== null) {
      // skip attributes in this simple converter
      continue;
    }
    xml += jsonToXml(val, key);
  }
  xml += `</${nodeName}>`;
  return xml;
}

export default function DataConverterClient() {
  const [from, setFrom] = useState<Format>("csv");
  const [to, setTo] = useState<Format>("json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  function clearAll() {
    setInput("");
    setOutput("");
    setError(null);
    inputRef.current?.focus();
  }

  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    setError(null);
    setOutput("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOutput("");

    try {
      let data: unknown;

      // parse input
      if (from === "json") {
        data = JSON.parse(input);
      } else if (from === "csv") {
        const parsed = Papa.parse<Record<string, unknown>>(input, {
          header: true,
          skipEmptyLines: true,
        });
        if (parsed.errors.length > 0) {
          throw new Error(parsed.errors[0].message);
        }
        data = parsed.data;
      } else if (from === "yaml") {
        data = YAML.load(input);
      } else {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(input, "application/xml");
        const parseError = xmlDoc.getElementsByTagName("parsererror")[0];
        if (parseError) {
          throw new Error(parseError.textContent || "Invalid XML");
        }
        data = xmlToJson(xmlDoc);
      }

      // convert to output format
      let result = "";
      if (to === "json") {
        result = JSON.stringify(data, null, 2);
      } else if (to === "csv") {
        const array = Array.isArray(data) ? data : [data];
        result = Papa.unparse(array);
      } else if (to === "yaml") {
        result = YAML.dump(data);
      } else {
        result = jsonToXml(data, "root");
      }

      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed");
    }
  }

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      alert("✅ Copied to clipboard!");
    } catch {
      alert("❌ Copy failed.");
    }
  }

  const inputCount = input.length.toLocaleString();
  const outputCount = output.length.toLocaleString();

  return (
    <section
      id="data-converter"
      aria-labelledby="data-converter-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center sm:px-0 space-y-4">
        <h1
          id="data-converter-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Data Converter: CSV, JSON, YAML &amp; XML
        </h1>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Transform data between CSV, JSON, YAML and XML formats in seconds—even large datasets—all client-side.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 sm:px-0">
        {/* Format Selectors */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="from-format" className="text-sm font-medium text-gray-800">
              From:
            </label>
            <select
              id="from-format"
              value={from}
              onChange={(e) => setFrom(e.target.value as Format)}
              className="py-1 px-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7c3aed] transition text-sm"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="yaml">YAML</option>
              <option value="xml">XML</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="to-format" className="text-sm font-medium text-gray-800">
              To:
            </label>
            <select
              id="to-format"
              value={to}
              onChange={(e) => setTo(e.target.value as Format)}
              className="py-1 px-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7c3aed] transition text-sm"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="yaml">YAML</option>
              <option value="xml">XML</option>
            </select>
          </div>
        </div>

        {/* Input & Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="flex flex-col">
            <label htmlFor="data-input" className="block text-sm font-medium text-gray-800 mb-1">
              Data Input ({from.toUpperCase()})
            </label>
            <textarea
              id="data-input"
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder={`Paste ${from.toUpperCase()} data here…`}
              className="
                w-full h-64 p-4 border border-gray-300 rounded-md bg-white
                focus:ring-2 focus:ring-[#7c3aed] font-mono resize-y transition
              "
            />
            <p className="mt-1 text-xs text-gray-500">{inputCount} characters</p>
          </div>

          {/* Output */}
          <div className="relative flex flex-col">
            <label htmlFor="data-output" className="block text-sm font-medium text-gray-800 mb-1">
              Result ({to.toUpperCase()})
            </label>
            <div className="relative">
              <textarea
                id="data-output"
                value={output}
                readOnly
                placeholder="Converted data appears here…"
                className="
                  w-full h-64 pl-4 pr-12 py-4 border border-gray-300 rounded-md bg-gray-50
                  focus:ring-2 focus:ring-[#7c3aed] font-mono resize-y transition
                "
              />
              <button
                type="button"
                onClick={copyOutput}
                disabled={!output}
                aria-label="Copy output"
                className="
                  absolute top-2 right-2 p-2 text-gray-500 hover:text-[#7c3aed]
                  disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none transition
                "
              >
                <ClipboardCopy className="w-6 h-6" />
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">{outputCount} characters</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition font-medium"
          >
            Convert →
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 transition text-sm"
          >
            <Trash2 className="w-5 h-5" />
            Clear All
          </button>
        </div>
      </form>
    </section>
  );
}