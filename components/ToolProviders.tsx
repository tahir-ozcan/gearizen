"use client";

import { ReactNode } from "react";
import { ToolSettingsProvider } from "./ToolSettingsContext";
import ToolSettingsPanel from "./ToolSettingsPanel";
import { useState } from "react";

export default function ToolProviders({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <ToolSettingsProvider>
      {children}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-50 px-3 py-2 bg-indigo-600 text-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Toggle tool settings"
      >
        ⚙️
      </button>
      {open && (
        <div className="fixed bottom-16 right-4 z-50">
          <ToolSettingsPanel />
        </div>
      )}
    </ToolSettingsProvider>
  );
}

