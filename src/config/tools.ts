import {
  FileJson,
  Key,
  FileDiff,
  FileText,
  FileArchive,
  Image,
  Palette,
  LucideIcon,
} from "lucide-react";

export interface Tool {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  tags: string[];
}

export const tools: Tool[] = [
  {
    title: "JSON Formatter",
    description: "Format, view, and beautify your JSON data with ease.",
    href: "/json-formatter",
    icon: FileJson,
    tags: ["backend", "utils", "json"],
  },
  {
    title: "JWT Debugger",
    description: "Decode and debug JWT tokens.",
    href: "/jwt-debugger",
    icon: Key,
    tags: ["backend", "security", "jwt"],
  },
  {
    title: "Diff Checker",
    description: "Compare text and find differences.",
    href: "/diff-checker",
    icon: FileDiff,
    tags: ["utils", "text", "diff"],
  },
  {
    title: "Text to PDF",
    description: "Convert basic text content to PDF document.",
    href: "/text-to-pdf",
    icon: FileText,
    tags: ["pdf", "utils", "frontend"],
  },
  {
    title: "PDF Compressor",
    description: "Compress PDF files efficiently.",
    href: "/pdf-compressor",
    icon: FileArchive,
    tags: ["pdf", "compress", "utils"],
  },
  {
    title: "Image Compressor",
    description: "Compress images without losing quality.",
    href: "/image-compressor",
    icon: Image,
    tags: ["image", "compress", "frontend"],
  },
  {
    title: "Color Extractor",
    description: "Extract colors from images.",
    href: "/color-extractor",
    icon: Palette,
    tags: ["color", "ui", "frontend"],
  },
  {
    title: "Color Harmonies",
    description: "Create perfect color palettes and harmonies.",
    href: "/color-harmonies",
    icon: Palette,
    tags: ["color", "ui", "frontend"],
  },
];
