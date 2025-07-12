"use client";
import { useRef, useState } from "react";

export default function DropZone({ onFiles }: { onFiles: (files: FileList) => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (files && files.length) {
      onFiles(files);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Drag and drop images or browse"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer?.files ?? null);
      }}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 ${dragging ? "bg-indigo-50" : "bg-white"}`}
    >
      <p className="text-gray-700">
        Drag & drop images or <span className="text-indigo-600 underline">browse</span>
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  );
}
