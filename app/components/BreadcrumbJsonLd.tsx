// app/components/BreadcrumbJsonLd.tsx
"use client";

import React from "react";
import JsonLd from "./JsonLd";

export interface BreadcrumbJsonLdProps {
  /** The title of the current page, used as the last breadcrumb item’s name */
  pageTitle: string;
  /** The canonical URL of the current page, used as the last breadcrumb item’s link */
  pageUrl: string;
}

/**
 * BreadcrumbJsonLd
 *
 * Renders a JSON-LD `<script>` tag describing a breadcrumb trail for search engines,
 * following schema.org’s BreadcrumbList specification.
 *
 * Usage:
 * ```tsx
 * <BreadcrumbJsonLd
 *   pageTitle="URL Tools"
 *   pageUrl="https://gearizen.com/tools/url-tools"
 * />
 * ```
 */
export default function BreadcrumbJsonLd({
  pageTitle,
  pageUrl,
}: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://gearizen.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: "https://gearizen.com/tools",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: pageTitle,
        item: pageUrl,
      },
    ],
  };

  return <JsonLd data={jsonLd} />;
}