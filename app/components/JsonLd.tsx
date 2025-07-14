// app/components/JsonLd.tsx
"use client";

import React from "react";

export interface JsonLdProps {
  /**
   * A JSON-LD object or array of objects conforming to schema.org vocabulary.
   * This will be serialized and injected into the page as structured data.
   */
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * JsonLd
 *
 * Inserts a `<script type="application/ld+json">` tag into the document head
 * containing your JSON-LD data for SEO. Use this for breadcrumbs, FAQs, events, etc.
 */
const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  // Pretty-print with 2-space indent in development tools
  const json = JSON.stringify(data, null, 2);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
};

export default JsonLd;