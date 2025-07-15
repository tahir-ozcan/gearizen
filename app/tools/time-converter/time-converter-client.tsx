// app/tools/time-converter/time-converter-client.tsx
"use client";

import {
  useState,
  ChangeEvent,
  useRef,
  useMemo,
} from "react";
import { ClipboardCopy } from "lucide-react";

/**
 * Time Converter Tool
 *
 * Convert between UNIX timestamps (sec/ms) and formatted dates,
 * and translate any date/time into another timezone instantly.
 * Copy formatted or raw timestamp with one click—all client-side.
 */
export default function TimeConverterClient() {
  // Common IANA zones
  const timeZones = useMemo(
    () => [
      "UTC",
      "Europe/London",
      "Europe/Paris",
      "America/New_York",
      "America/Chicago",
      "America/Los_Angeles",
      "Asia/Tokyo",
      "Australia/Sydney",
    ],
    []
  );

  // Build default local‐datetime value
  const now = new Date();
  const pad2 = (n: number) => n.toString().padStart(2, "0");
  const defaultLocal = `${now.getFullYear()}-${pad2(
    now.getMonth() + 1
  )}-${pad2(now.getDate())}T${pad2(now.getHours())}:${pad2(
    now.getMinutes()
  )}`;

  // States
  const [mode, setMode] = useState<"local" | "unix">("local");
  const [localInput, setLocalInput] = useState(defaultLocal);
  const [unixInput, setUnixInput] = useState(
    Math.floor(now.getTime() / 1000).toString()
  );
  const [targetZone, setTargetZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  );

  // Computed output
  const { formatted, asUnixSec, asUnixMs } = useMemo(() => {
    let dt: Date;

    if (mode === "local") {
      dt = new Date(localInput);
    } else {
      // Try parse as seconds or milliseconds
      const n = Number(unixInput.trim());
      if (isNaN(n)) {
        dt = new Date(NaN);
      } else if (unixInput.trim().length <= 10) {
        dt = new Date(n * 1000);
      } else {
        dt = new Date(n);
      }
    }

    // Prepare formatted string in target zone
    let formatted: string;
    if (isNaN(dt.getTime())) {
      formatted = "Invalid date/time";
    } else {
      formatted = new Intl.DateTimeFormat(undefined, {
        timeZone: targetZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(dt);
    }

    return {
      formatted,
      asUnixSec: isNaN(dt.getTime())
        ? ""
        : Math.floor(dt.getTime() / 1000).toString(),
      asUnixMs: isNaN(dt.getTime()) ? "" : dt.getTime().toString(),
    };
  }, [mode, localInput, unixInput, targetZone]);

  // Refs for copy
  const formattedRef = useRef<HTMLTextAreaElement>(null);
  const unixRef = useRef<HTMLTextAreaElement>(null);

  // Handlers
  const onLocalChange = (e: ChangeEvent<HTMLInputElement>) =>
    setLocalInput(e.target.value);
  const onUnixChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUnixInput(e.target.value);
  const onZoneChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setTargetZone(e.target.value);

  const copyText = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      alert("✅ Copied!");
    } catch {
      alert("❌ Copy failed.");
    }
  };

  return (
    <section
      id="time-converter"
      aria-labelledby="time-converter-heading"
      className="space-y-16 text-gray-900 antialiased px-4 sm:px-6 lg:px-8"
    >
      {/* Heading */}
      <div className="text-center space-y-6 sm:px-0">
        <h1
          id="time-converter-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          Time Converter: UNIX &amp; Timezone
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mx-auto max-w-2xl text-lg text-gray-700 leading-relaxed">
          Convert UNIX timestamps to human-readable dates and adjust across world time zones seamlessly.
        </p>
      </div>

      {/* Mode Switch */}
      <div className="max-w-3xl mx-auto flex justify-center gap-4">
        <button
          onClick={() => setMode("local")}
          className={`px-4 py-2 font-medium rounded ${
            mode === "local"
              ? "bg-indigo-600 text-white"
              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Local Date/Time
        </button>
        <button
          onClick={() => setMode("unix")}
          className={`px-4 py-2 font-medium rounded ${
            mode === "unix"
              ? "bg-indigo-600 text-white"
              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          UNIX Timestamp
        </button>
      </div>

      {/* Inputs */}
      <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        {mode === "local" ? (
          <div>
            <label
              htmlFor="dt-input"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Local Date &amp; Time
            </label>
            <input
              id="dt-input"
              type="datetime-local"
              value={localInput}
              onChange={onLocalChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7c3aed] transition"
            />
          </div>
        ) : (
          <div className="sm:col-span-3">
            <label
              htmlFor="unix-input"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              UNIX Timestamp (sec or ms)
            </label>
            <input
              id="unix-input"
              type="text"
              value={unixInput}
              onChange={onUnixChange}
              placeholder="e.g. 1633072800 or 1633072800000"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7c3aed] transition font-mono"
            />
          </div>
        )}

        <div className="sm:col-span-2">
          <label
            htmlFor="zone-select"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Convert to Time Zone
          </label>
          <select
            id="zone-select"
            value={targetZone}
            onChange={onZoneChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7c3aed] transition"
          >
            {timeZones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Outputs */}
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Formatted */}
        <div>
          <label
            htmlFor="converted-output"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Converted Time
          </label>
          <div className="relative">
            <textarea
              id="converted-output"
              ref={formattedRef}
              readOnly
              value={formatted}
              rows={2}
              className="
                w-full p-3 border border-gray-300 rounded-md bg-gray-50
                focus:ring-2 focus:ring-[#7c3aed] font-mono resize-none transition
              "
            />
            <button
              onClick={() => copyText(formatted)}
              aria-label="Copy formatted time"
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-[#7c3aed] transition"
            >
              <ClipboardCopy className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Raw UNIX */}
        <div>
          <label
            htmlFor="unix-out"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            UNIX Timestamp
          </label>
          <div className="relative">
            <textarea
              id="unix-out"
              ref={unixRef}
              readOnly
              value={`${asUnixSec} (sec)  |  ${asUnixMs} (ms)`}
              rows={1}
              className="
                w-full p-3 border border-gray-300 rounded-md bg-gray-50
                focus:ring-2 focus:ring-[#7c3aed] font-mono resize-none text-sm transition
              "
            />
            <button
              onClick={() => copyText(asUnixMs)}
              aria-label="Copy UNIX timestamp"
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-[#7c3aed] transition"
            >
              <ClipboardCopy className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}