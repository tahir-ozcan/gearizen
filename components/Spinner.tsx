"use client";
export default function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent ${className}`} role="status" aria-label="Loading" />
  );
}

