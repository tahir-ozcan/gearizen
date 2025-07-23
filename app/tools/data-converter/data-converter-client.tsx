// app/tools/data-converter/data-converter-client.tsx
"use client";

import React, {
  FC,
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  useCallback,
} from "react";
import { Trash2, ClipboardCopy, Check } from "lucide-react";
import Papa from "papaparse";
import YAML from "js-yaml";

type Format = "csv" | "json" | "yaml" | "xml";

export interface DataConverterClientProps {
  /** Main heading text */
  heading?: string;
  /** Subtitle/description text */
  description?: string;
  /** Gradient classes for headings */
  gradientClasses?: string;
  /** Focus‑ring Tailwind class */
  focusRingClass?: string;
  /** Override CSS class for primary buttons (copy) */
  primaryButtonClassName?: string;
  /** Override CSS class for secondary buttons (clear) */
  secondaryButtonClassName?: string;
  /** Override CSS class for textareas */
  textareaClassName?: string;
  /** Extra classes for the root section */
  rootClassName?: string;
}

const xmlToJson = (node: Node): any => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.nodeValue?.trim() || "";
  }
  const obj: any = {};
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as Element;
    if (el.attributes.length) {
      obj["@attributes"] = {};
      for (const { name, value } of Array.from(el.attributes)) {
        obj["@attributes"][name] = value;
      }
    }
  }
  for (const child of Array.from(node.childNodes)) {
    const val = xmlToJson(child);
    if (child.nodeType === Node.TEXT_NODE && val === "") continue;
    const key = child.nodeName;
    if (obj[key] !== undefined) {
      obj[key] = Array.isArray(obj[key]) ? [...obj[key], val] : [obj[key], val];
    } else {
      obj[key] = val;
    }
  }
  return obj;
};

const jsonToXml = (val: any, tag = "root"): string => {
  if (val == null || typeof val !== "object") {
    const esc = String(val)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<${tag}>${esc}</${tag}>`;
  }
  if (Array.isArray(val)) {
    return val.map((v) => jsonToXml(v, tag)).join("");
  }
  let xml = `<${tag}>`;
  for (const [k, v] of Object.entries(val)) {
    if (k === "@attributes") continue;
    xml += jsonToXml(v, k);
  }
  xml += `</${tag}>`;
  return xml;
};

export const DataConverterClient: FC<DataConverterClientProps> = ({
  heading = "Data Converter: CSV, JSON, YAML & XML",
  description =
    "Transform data between CSV, JSON, YAML and XML formats instantly—100% client‑side, no signup required.",
  gradientClasses = "from-purple-500 via-pink-500 to-yellow-400",
  focusRingClass = "focus:ring-purple-500",
  primaryButtonClassName,
  secondaryButtonClassName,
  textareaClassName,
  rootClassName = "",
}) => {
  const [from, setFrom] = useState<Format>("csv");
  const [to, setTo] = useState<Format>("json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // perform conversion whenever input/from/to changes
  const convert = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      let data: any;
      if (from === "json") {
        data = JSON.parse(input);
      } else if (from === "csv") {
        const parsed = Papa.parse<Record<string, unknown>>(input, {
          header: true,
          skipEmptyLines: true,
        });
        if (parsed.errors.length) throw new Error(parsed.errors[0].message);
        data = parsed.data;
      } else if (from === "yaml") {
        data = YAML.load(input);
      } else {
        const doc = new DOMParser().parseFromString(input, "application/xml");
        const errNode = doc.querySelector("parsererror");
        if (errNode) throw new Error(errNode.textContent || "Invalid XML");
        data = xmlToJson(doc);
      }

      let result: string;
      if (to === "json") {
        result = JSON.stringify(data, null, 2);
      } else if (to === "csv") {
        const arr = Array.isArray(data) ? data : [data];
        result = Papa.unparse(arr);
      } else if (to === "yaml") {
        result = YAML.dump(data);
      } else {
        result = jsonToXml(data);
      }

      setOutput(result);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
      setOutput("");
    }
  }, [input, from, to]);

  useEffect(() => {
    convert();
  }, [input, from, to, convert]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const copyOutput = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* silent */
    }
  }, [output]);

  const clearAll = useCallback(() => {
    setInput("");
    setOutput("");
    setError(null);
    inputRef.current?.focus();
  }, []);

  const baseTextareaClasses = textareaClassName ??
    `w-full h-64 p-4 bg-white border border-gray-300 rounded-md font-mono resize-y focus:outline-none ${focusRingClass}`;

  const primaryBtnClasses = primaryButtonClassName ??
    `inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md font-semibold focus:ring-2 focus:ring-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed`;

  const secondaryBtnClasses = secondaryButtonClassName ??
    `inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 transition`;

  return (
    <section
      id="data-converter"
      aria-labelledby="data-converter-heading"
      className={`space-y-16 text-gray-900 antialiased ${rootClassName}`}
    >
      {/* Header */}
      <div className="text-center space-y-6">
        <h1
          id="data-converter-heading"
          className={`bg-clip-text text-transparent bg-gradient-to-r ${gradientClasses} text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight`}
        >
          {heading}
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-xl mx-auto">
          {description}
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Format Selectors */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <label htmlFor="from-format" className="text-sm font-medium text-gray-800">
              From:
            </label>
            <select
              id="from-format"
              value={from}
              onChange={(e) => setFrom(e.target.value as Format)}
              className={`py-1 px-3 border border-gray-300 rounded-md focus:outline-none ${focusRingClass}`}
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
              className={`py-1 px-3 border border-gray-300 rounded-md focus:outline-none ${focusRingClass}`}
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="yaml">YAML</option>
              <option value="xml">XML</option>
            </select>
          </div>
        </div>

        {/* Input Block */}
        <div>
          <label htmlFor="data-input" className="block text-sm font-medium text-gray-800 mb-1">
            Input ({from.toUpperCase()})
          </label>
          <textarea
            id="data-input"
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder={`Paste ${from.toUpperCase()} data here…`}
            className={baseTextareaClasses}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Output Block */}
        <div>
          <label htmlFor="data-output" className="block text-sm font-medium text-gray-800 mb-1">
            Output ({to.toUpperCase()})
          </label>
          <textarea
            id="data-output"
            value={output}
            readOnly
            placeholder="Converted data appears here…"
            className={`${baseTextareaClasses} bg-gray-50`}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4 justify-center">
          <button
            type="button"
            onClick={copyOutput}
            disabled={!output}
            aria-label="Copy output"
            className={primaryBtnClasses}
          >
            {copied ? (
              <Check className="w-5 h-5" aria-hidden="true" />
            ) : (
              <ClipboardCopy className="w-5 h-5" aria-hidden="true" />
            )}
            Copy
          </button>
          <button
            type="button"
            onClick={clearAll}
            className={secondaryBtnClasses}
          >
            <Trash2 className="w-5 h-5" aria-hidden="true" />
            Clear All
          </button>
        </div>
      </div>
    </section>
  );
};

export default DataConverterClient;