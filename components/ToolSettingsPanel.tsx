"use client";

import { useToolSettings } from "./ToolSettingsContext";
import { ChangeEvent } from "react";

export default function ToolSettingsPanel() {
  const { settings, updateSettings } = useToolSettings();

  const onFontSize = (e: ChangeEvent<HTMLInputElement>) => {
    updateSettings({ fontSize: Number(e.target.value) });
  };

  const onInputFormat = (e: ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ inputFormat: e.target.value });
  };

  const onOutputFormat = (e: ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ outputFormat: e.target.value });
  };

  return (
    <form className="space-y-4 p-4 bg-gray-50 border border-gray-200 rounded-lg max-w-sm" aria-label="Tool settings">
      <div>
        <label htmlFor="font-size" className="block text-sm font-medium text-gray-700">
          Font Size
        </label>
        <input
          id="font-size"
          type="number"
          min={12}
          max={24}
          value={settings.fontSize}
          onChange={onFontSize}
          className="input-base mt-1"
        />
      </div>
      <div>
        <label htmlFor="input-format" className="block text-sm font-medium text-gray-700">
          Input Format
        </label>
        <select
          id="input-format"
          value={settings.inputFormat}
          onChange={onInputFormat}
          className="input-base mt-1"
        >
          <option value="text">Text</option>
          <option value="json">JSON</option>
          <option value="base64">Base64</option>
        </select>
      </div>
      <div>
        <label htmlFor="output-format" className="block text-sm font-medium text-gray-700">
          Output Format
        </label>
        <select
          id="output-format"
          value={settings.outputFormat}
          onChange={onOutputFormat}
          className="input-base mt-1"
        >
          <option value="text">Text</option>
          <option value="json">JSON</option>
          <option value="base64">Base64</option>
        </select>
      </div>
    </form>
  );
}

