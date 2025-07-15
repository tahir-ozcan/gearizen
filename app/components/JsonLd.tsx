// app/components/JsonLd.tsx

import React from "react";
import Head from "next/head";

export type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

/**
 * JsonLdProps
 *
 * @param data A JSON-LD object or array of objects following schema.org vocab.
 * @param id   Optional. The id attribute for the <script> tag. Defaults to "jsonld".
 */
export interface JsonLdProps {
  data: JsonLdData;
  id?: string;
}

/**
 * JsonLd
 *
 * Renders a <script type="application/ld+json"> tag inside the document <head>,
 * injecting your structured data for SEO. Use for breadcrumbs, FAQs, events, etc.
 *
 * This component is a server component by default, so JSON-LD is rendered
 * into the initial HTML <head> for optimal SEO.
 */
const JsonLd: React.FC<JsonLdProps> = ({ data, id = "jsonld" }) => {
  // Serialize once per render; no pretty-printing in production for compactness
  const json = React.useMemo(
    () => JSON.stringify(data),
    [data]
  );

  return (
    <Head>
      <script
        id={id}
        type="application/ld+json"
        // dangerouslySetInnerHTML is necessary to inject raw JSON-LD
        dangerouslySetInnerHTML={{ __html: json }}
      />
    </Head>
  );
};

export default JsonLd;