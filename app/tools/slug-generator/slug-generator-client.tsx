"use client";
import { useState } from "react";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import { slugify } from "@/lib/slugify";

export default function SlugGeneratorClient() {
  const [text, setText] = useState("");
  const [delimiter, setDelimiter] = useState("-");
  const [lowercase, setLowercase] = useState(true);
  const [removeStop, setRemoveStop] = useState(false);
  const [slug, setSlug] = useState("");

  const generate = () => {
    const result = slugify(text, {
      delimiter,
      lowercase,
      removeStopWords: removeStop,
    });
    setSlug(result);
  };

  const copySlug = async () => {
    if (!slug) return;
    try {
      await navigator.clipboard.writeText(slug);
      alert("✅ Copied to clipboard!");
    } catch {
      alert("❌ Copy failed.");
    }
  };

  return (
    <section
      id="slug-generator"
      aria-labelledby="slug-generator-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="slug-generator-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        URL Slug Generator
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Enter text and customize options to generate a clean, SEO-friendly slug.
      </p>

      <div className="space-y-6 max-w-xl mx-auto">
        <div>
          <label htmlFor="slug-input" className="block mb-2 font-medium text-gray-800">
            Text to Slugify
          </label>
          <Textarea
            id="slug-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Type your title or phrase..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={() => setLowercase((v) => !v)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-gray-700 select-none">Lowercase</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={removeStop}
              onChange={() => setRemoveStop((v) => !v)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-gray-700 select-none">Remove Stop Words</span>
          </label>
        </div>

        <div>
          <label htmlFor="delimiter" className="block mb-2 font-medium text-gray-800">
            Delimiter
          </label>
          <Input
            id="delimiter"
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="w-24"
          />
        </div>

        <button
          type="button"
          onClick={generate}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
        >
          Generate Slug
        </button>

        {slug && (
          <div className="space-y-4">
            <label htmlFor="slug-output" className="block mb-2 font-medium text-gray-800">
              Generated Slug
            </label>
            <Input id="slug-output" readOnly value={slug} className="w-full" />
            <div className="flex justify-end gap-4">
              <button
                onClick={copySlug}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm font-medium"
              >
                Copy Slug
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
