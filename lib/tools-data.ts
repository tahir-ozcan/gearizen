// lib/tools-data.ts
import raw from "../data/tools.json";
import type { LucideProps } from "lucide-react";
import {
  AlignLeft,
  Ampersand,
  ArrowRightLeft,
  BookOpen,
  Braces,
  Calculator,
  CalendarCheck2,
  Code,
  Cpu,
  Droplet,
  Eye,
  File,
  FileArchive,
  FileCode,
  FileDown,
  FileKey,
  FilePlus,
  FileText,
  Globe,
  Hash,
  ImageIcon,
  ImagePlus,
  Key,
  ListOrdered,
  Link2,
  MessageSquare,
  Palette,
  Paperclip,
  Paintbrush,
  QrCode,
  Radio,
  RotateCcw,
  Scissors,
  Search,
  Shield,
  Tag,
  Type,
  Fingerprint,
} from "lucide-react";

/**
 * Tool
 * - Site genelinde kullanacağımız araç tanımı
 */
export interface Tool {
  href: string;
  icon: React.ComponentType<LucideProps>;
  title: string;
  description: string;
  category: string;
}

/**
 * RawTool
 * - tools.json içindeki ham verinin tipi
 */
interface RawTool {
  href: string;
  icon: string;
  title: string;
  description: string;
}

/**
 * RawTools
 * - tools.json'un tüm içeriği
 */
interface RawTools {
  tools: RawTool[];
}

// JSON dosyasından gelen ham veriyi uygun tipe dönüştür
const data = raw as RawTools;

/**
 * ICON_MAP
 * - JSON'daki `icon` string'lerini gerçek Lucide bileşenlerine eşliyoruz
 */
const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  AlignLeft,
  Ampersand,
  ArrowRightLeft,
  BookOpen,
  Braces,
  Calculator,
  CalendarCheck2,
  Code,
  Cpu,
  Droplet,
  Eye,
  File,
  FileArchive,
  FileCode,
  FileDown,
  FileKey,
  FilePlus,
  FileText,
  Globe,
  Hash,
  ImageIcon,
  ImagePlus,
  Key,
  ListOrdered,
  Link2,
  MessageSquare,
  Palette,
  Paperclip,
  Paintbrush,
  QrCode,
  Radio,
  RotateCcw,
  Scissors,
  Search,
  Shield,
  Tag,
  Type,
  Fingerprint,
};

/**
 * CATEGORY_MAP
 * - Her aracın ait olduğu kategoriyi burada belirtiyoruz.
 * - Yeni araç eklediğinizde, buraya da uygun bir kategori koymayı unutmayın.
 */
const CATEGORY_MAP: Record<string, string> = {
  "/tools/password-generator": "Generators",
  "/tools/uuid-generator": "Generators",
  "/tools/lorem-ipsum-generator": "Generators",
  "/tools/text-counter": "Analytics",
  "/tools/text-case-converter": "Transformers",
  "/tools/markdown-converter": "Transformers",
  "/tools/text-diff": "Compare",
  "/tools/regex-tester": "Testers",
  "/tools/json-formatter": "Transformers",
  "/tools/data-converter": "Converters",
  "/tools/code-formatter-minifier": "Formatters",
  "/tools/seo-meta-tag-generator": "SEO",
  "/tools/sitemap-generator": "SEO",
  "/tools/url-tools": "Transformers",
  "/tools/base64-encoder-decoder": "Encoders",
  "/tools/jwt-hash-generator": "Security",
  "/tools/html-to-pdf": "Converters",
  "/tools/pdf-toolkit": "Converters",
  "/tools/image-toolkit": "Optimizers",
  "/tools/qr-code-generator": "Generators",
  "/tools/unit-converter": "Converters",
  "/tools/color-toolkit": "Design",
  "/tools/time-converter": "Converters",
};

/**
 * getToolsData
 *
 * - Ham JSON verisini okuyup `Tool[]` tipine dönüştürür.
 * - `icon` alanındaki string'i ICON_MAP üzerinden gerçek bileşene çevirir.
 * - Bilinmeyen ikonlar ve kategoriler için fallback sağlar.
 */
export function getToolsData(): { tools: Tool[] } {
  const tools: Tool[] = data.tools.map((t) => {
    const category = CATEGORY_MAP[t.href] ?? "Other";
    const IconComponent = ICON_MAP[t.icon] ?? Key;

    return {
      href: t.href,
      icon: IconComponent,
      title: t.title,
      description: t.description,
      category,
    };
  });

  return { tools };
}