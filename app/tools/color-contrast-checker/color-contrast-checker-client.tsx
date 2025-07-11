// app/tools/color-contrast-checker/color-contrast-checker-client.tsx
"use client";

import { useState, useMemo, ChangeEvent } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { calculateContrast } from "@/lib/contrast-ratio";

export default function ColorContrastCheckerClient() {
  const [fgInput, setFgInput] = useState("#000000");
  const [bgInput, setBgInput] = useState("#ffffff");

  const { ratio, fgHex, bgHex } = useMemo(
    () => calculateContrast(fgInput, bgInput),
    [fgInput, bgInput],
  );

  const passes = useMemo(() => {
    return {
      aaNormal: ratio >= 4.5,
      aaLarge: ratio >= 3,
      aaaNormal: ratio >= 7,
      aaaLarge: ratio >= 4.5,
    };
  }, [ratio]);

  const handlePicker =
    (setter: (v: string) => void) => (e: ChangeEvent<HTMLInputElement>) =>
      setter(e.target.value);

  const handleInput =
    (setter: (v: string) => void) => (e: ChangeEvent<HTMLInputElement>) =>
      setter(e.target.value);

  const copyCss = async () => {
    const comment = `/* Contrast ratio ${ratio}: AA ${passes.aaNormal ? "PASS" : "FAIL"}, AAA ${passes.aaaNormal ? "PASS" : "FAIL"} */`;
    const css = `color: ${fgHex};\nbackground-color: ${bgHex};\n${comment}`;
    try {
      await navigator.clipboard.writeText(css);
      alert("✅ CSS copied to clipboard!");
    } catch {
      alert("❌ Failed to copy CSS.");
    }
  };

  return (
    <section
      id="color-contrast-checker"
      aria-labelledby="contrast-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="contrast-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        Color Contrast Checker
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Verify WCAG compliance by checking contrast ratio between foreground and
        background colors. 100% client-side, no signup required.
      </p>
      <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-8 space-y-6 sm:space-y-0 mb-10">
        <div className="space-y-2 text-center sm:text-left">
          <label
            htmlFor="fg-input"
            className="block text-sm font-medium text-gray-700"
          >
            Text Color
          </label>
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <Input
              id="fg-picker"
              type="color"
              value={fgHex}
              onChange={handlePicker(setFgInput)}
              aria-label="Choose text color"
              className="h-10 w-10 p-0 border-0 bg-transparent cursor-pointer"
            />
            <Input
              id="fg-input"
              aria-label="Text color value"
              value={fgInput}
              onChange={handleInput(setFgInput)}
              className="font-mono w-32"
            />
          </div>
        </div>
        <div className="space-y-2 text-center sm:text-left">
          <label
            htmlFor="bg-input"
            className="block text-sm font-medium text-gray-700"
          >
            Background Color
          </label>
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <Input
              id="bg-picker"
              type="color"
              value={bgHex}
              onChange={handlePicker(setBgInput)}
              aria-label="Choose background color"
              className="h-10 w-10 p-0 border-0 bg-transparent cursor-pointer"
            />
            <Input
              id="bg-input"
              aria-label="Background color value"
              value={bgInput}
              onChange={handleInput(setBgInput)}
              className="font-mono w-32"
            />
          </div>
        </div>
      </div>
      <div
        aria-label="Sample text panel"
        className="p-8 rounded-lg border border-gray-200 text-center mb-10 space-y-2"
        style={{ color: fgHex, backgroundColor: bgHex }}
      >
        <p className="text-base">The quick brown fox jumps over the lazy dog</p>
        <p className="text-xl font-semibold">
          The quick brown fox jumps over the lazy dog
        </p>
        <p className="text-3xl font-bold">
          The quick brown fox jumps over the lazy dog
        </p>
      </div>
      <div className="max-w-md mx-auto space-y-4 mb-10 text-center">
        <p className="text-xl font-semibold">
          Contrast Ratio:{" "}
          <span className="text-indigo-600">
            {isNaN(ratio) ? "--" : `${ratio}:1`}
          </span>
        </p>
        {!isNaN(ratio) && (
          <ul className="space-y-1 text-gray-700" aria-live="polite">
            <li>
              WCAG AA Normal:{" "}
              <span
                className={`px-2 py-0.5 rounded text-white ${passes.aaNormal ? "bg-green-600" : "bg-red-600"}`}
              >
                {passes.aaNormal ? "Pass" : "Fail"}
              </span>
            </li>
            <li>
              WCAG AA Large:{" "}
              <span
                className={`px-2 py-0.5 rounded text-white ${passes.aaLarge ? "bg-green-600" : "bg-red-600"}`}
              >
                {passes.aaLarge ? "Pass" : "Fail"}
              </span>
            </li>
            <li>
              WCAG AAA Normal:{" "}
              <span
                className={`px-2 py-0.5 rounded text-white ${passes.aaaNormal ? "bg-green-600" : "bg-red-600"}`}
              >
                {passes.aaaNormal ? "Pass" : "Fail"}
              </span>
            </li>
            <li>
              WCAG AAA Large:{" "}
              <span
                className={`px-2 py-0.5 rounded text-white ${passes.aaaLarge ? "bg-green-600" : "bg-red-600"}`}
              >
                {passes.aaaLarge ? "Pass" : "Fail"}
              </span>
            </li>
          </ul>
        )}
      </div>
      <div className="text-center">
        <Button onClick={copyCss}>Copy CSS</Button>
      </div>
    </section>
  );
}
