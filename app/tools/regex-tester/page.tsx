// app/tools/regex-tester/page.tsx
import RegexTesterClient from "./regex-tester-client";

export const metadata = {
  metadataBase: new URL("https://gearizen.com"),
  title: "Regex Tester",
  description:
    "Test and debug your regular expressions online with Gearizen’s free client-side Regex Tester. Enter pattern, flags and input to see all matches instantly—no signup required.",
  keywords: [
    "regex tester",
    "regular expression tester",
    "online regex tool",
    "test regex",
    "client-side regex",
    "free regex tester",
    "Gearizen regex",
  ],
  authors: [{ name: "Gearizen Team", url: "https://gearizen.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://gearizen.com/tools/regex-tester" },
  openGraph: {
    title: "Regex Tester | Gearizen",
    description:
      "Use Gearizen’s client-side Regex Tester to quickly test patterns and flags against any text. View matches in real time—100% free and no login needed.",
    url: "https://gearizen.com/tools/regex-tester",
    siteName: "Gearizen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gearizen Regex Tester",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Regex Tester | Gearizen",
    description:
      "Debug your regular expressions online with Gearizen’s free Regex Tester. Instant matches, no backend—just paste, test, and copy results.",
    creator: "@gearizen",
    images: ["/og-placeholder.svg"],
  },
};

export default function RegexTesterPage() {
  return <RegexTesterClient />;}