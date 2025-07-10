// app/tools/code-minifier/code-minifier-client.tsx

"use client";

import { useState, ChangeEvent } from "react";

export default function CodeMinifierClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setOutput("");
    setError(null);
  };


  const minifyCode = () => {
    try {
      let code = input;
      // Remove comments
      code = code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
      // Collapse whitespace
      code = code
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join(" ");
      setOutput(code);
      setError(null);
    } catch {
      setError("Minification failed.");
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

  const downloadOutput = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "minified.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="code-minifier"
      aria-labelledby="code-minifier-heading"
      className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="code-minifier-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Code Minifier
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Minify your JavaScript, CSS, or HTML code instantly. 100% client-side,
        no signup required.
      </p>

      <textarea
        id="code-input"
        aria-label="Code input"
        value={input}
        onChange={handleInput}
        placeholder="Paste your code here..."
        className="w-full h-48 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />

      {/* Controls */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4">
        <button
          type="button"
          onClick={minifyCode}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm font-medium"
        >
          Minify
        </button>
        <button
          type="button"
          onClick={copyOutput}
          disabled={!output}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm font-medium disabled:opacity-60"
        >
          Copy
        </button>
        <button
          type="button"
          onClick={downloadOutput}
          disabled={!output}
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 transition text-sm font-medium disabled:opacity-60"
        >
          Download
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md"
        >
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Output */}
      {output && !error && (
        <textarea
          id="code-output"
          aria-label="Minified code output"
          value={output}
          readOnly
          className="mt-6 w-full h-48 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      )}
    </section>
  );
}