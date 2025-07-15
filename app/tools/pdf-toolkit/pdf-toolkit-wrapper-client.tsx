// app/tools/pdf-toolkit/pdf-toolkit-wrapper-client.tsx
"use client";

import dynamic from "next/dynamic";

// SSR kapalı, loading fallback
const PdfToolkitClient = dynamic(() => import("./pdf-toolkit-client"), {
  ssr: false,
  loading: () => (
    // <div className="py-20 text-center text-gray-500">
    //   Loading PDF Toolkit…
    // </div>
    <div className="fixed inset-x-0 top-0 h-1 overflow-hidden z-[999]">
        <div className="gradient-bg h-full w-full animate-gradient-quick" />
    </div>
  ),
});

export default function PdfToolkitWrapper() {
  return <PdfToolkitClient />;
}