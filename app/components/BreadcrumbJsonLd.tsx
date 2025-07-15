// app/components/BreadcrumbJsonLd.tsx

import React, { useMemo } from "react";
import JsonLd from "./JsonLd";

export interface BreadcrumbJsonLdProps {
  /** The title of the current page (last breadcrumb label) */
  pageTitle: string;
  /** The canonical URL of the current page (last breadcrumb link) */
  pageUrl: string;
}

/**
 * BreadcrumbJsonLd
 *
 * Renders a JSON-LD `<script>` in the document head describing a BreadcrumbList
 * according to schema.org. Improves SEO by letting search engines understand
 * your site’s hierarchy.
 *
 * Usage:
 * ```tsx
 * <BreadcrumbJsonLd
 *   pageTitle="URL Tools"
 *   pageUrl="https://gearizen.com/tools/url-tools"
 * />
 * ```
 */
const BreadcrumbJsonLd: React.FC<BreadcrumbJsonLdProps> = ({
  pageTitle,
  pageUrl,
}) => {
  const jsonLd = useMemo(
    () => ({
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
    }),
    [pageTitle, pageUrl]
  );

  return <JsonLd data={jsonLd} id="breadcrumb-jsonld" />;
};

export default BreadcrumbJsonLd;