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
 * - Eğer JSON içinde geçersiz bir anahtar gelirse `Key` ikonu fallback olarak kullanılıyor
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
};

/**
 * getToolsData
 *
 * - Ham JSON verisini okuyup `Tool[]` tipine dönüştürür.
 * - `icon` alanındaki string'i, ICON_MAP üzerinden gerçek bileşene çevirir.
 * - Bilinmeyen bir ikon adı gelirse `Key` ikonu ile fallback sağlar.
 */
export function getToolsData(): { tools: Tool[] } {
  const tools: Tool[] = data.tools.map((t) => ({
    href: t.href,
    icon: ICON_MAP[t.icon] ?? Key,
    title: t.title,
    description: t.description,
  }));

  return { tools };
}