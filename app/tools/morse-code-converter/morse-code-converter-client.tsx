"use client";
import { useState } from "react";
import Textarea from "@/components/Textarea";
import { textToMorse, morseToText } from "@/lib/morse";

export default function MorseCodeConverterClient() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const convert = () => {
    try {
      const result =
        mode === "encode" ? textToMorse(input) : morseToText(input);
      setOutput(result);
    } catch {
      setOutput("");
      alert("❌ Invalid Morse code.");
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
      id="morse-code-converter"
      aria-labelledby="morse-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="morse-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Morse Code Converter
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Convert text to Morse code or decode Morse back to text instantly. 100% client-side.
      </p>

      <div className="space-y-6 max-w-3xl mx-auto">
        <Textarea
          id="morse-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          placeholder={mode === "encode" ? "Enter text..." : "Enter Morse code..."}
        />

        <div className="flex flex-wrap items-center justify-center gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="mode"
              value="encode"
              checked={mode === "encode"}
              onChange={() => setMode("encode")}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <span className="text-sm select-none">Text → Morse</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="mode"
              value="decode"
              checked={mode === "decode"}
              onChange={() => setMode("decode")}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <span className="text-sm select-none">Morse → Text</span>
          </label>
          <button
            type="button"
            onClick={convert}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm font-medium"
          >
            Convert
          </button>
          <button
            type="button"
            onClick={copyOutput}
            disabled={!output}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm font-medium disabled:opacity-60"
          >
            Copy Result
          </button>
        </div>

        {output && (
          <Textarea
            id="morse-output"
            readOnly
            value={output}
            rows={6}
            className="bg-gray-50"
          />
        )}
      </div>
    </section>
  );
}
