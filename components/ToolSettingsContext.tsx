"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface ToolSettings {
  theme: string;
  fontSize: number;
  inputFormat: string;
  outputFormat: string;
}

const defaultSettings: ToolSettings = {
  theme: "light",
  fontSize: 16,
  inputFormat: "text",
  outputFormat: "text",
};

interface ToolSettingsContextValue {
  settings: ToolSettings;
  updateSettings: (updates: Partial<ToolSettings>) => void;
}

const ToolSettingsContext = createContext<ToolSettingsContextValue>({
  settings: defaultSettings,
  updateSettings: () => {},
});

export function ToolSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ToolSettings>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("tool-settings");
        if (stored) return { ...defaultSettings, ...JSON.parse(stored) };
      } catch {
        // ignore
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("tool-settings", JSON.stringify(settings));
    document.documentElement.style.setProperty(
      "--tool-font-size",
      `${settings.fontSize}px`
    );
  }, [settings]);

  const updateSettings = (updates: Partial<ToolSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  return (
    <ToolSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </ToolSettingsContext.Provider>
  );
}

export function useToolSettings() {
  return useContext(ToolSettingsContext);
}

