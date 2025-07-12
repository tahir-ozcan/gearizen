import { useRef } from 'react';

export interface DropZoneProps {
  /** Callback when files are chosen via dialog or drag-drop */
  onFiles(files: FileList): void;
  className?: string;
}

export default function DropZone({ onFiles, className = '' }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (files && files.length) {
      onFiles(files);
    }
  };

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label="File upload drop zone"
      onClick={() => inputRef.current?.click()}
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
      }}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      className={`border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
    >
      <p className="text-gray-700">Drag & drop images or click to browse</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />
    </div>
  );
}
