// app/tools/pdf-toolkit/pdf-toolkit-wrapper-client.tsx
"use client";

import dynamic from "next/dynamic";

// SSR kapalı, loading fallback
const PdfToolkitClient = dynamic(() => import("./pdf-toolkit-client"), {
  ssr: false,
  loading: () => (
    <div className="py-20 text-center text-gray-500">
      Loading PDF Toolkit…
    </div>
  ),
});

export default function PdfToolkitWrapper() {
  return <PdfToolkitClient />;
}