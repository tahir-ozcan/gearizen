import JsonLd from "./JsonLd";

interface Props {
  pageTitle: string;
  pageUrl: string;
}

export default function BreadcrumbJsonLd({ pageTitle, pageUrl }: Props) {
  const data = {
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

  return <JsonLd data={data} />;
}
