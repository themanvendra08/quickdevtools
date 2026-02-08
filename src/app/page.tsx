import { ToolCard } from "@/components/ui/tool-card";
import {
  FileJson,
  Key,
  FileDiff,
  FileText,
  FileArchive,
  Image,
} from "lucide-react";

export default function Home() {
  const tools = [
    {
      title: "JSON Formatter",
      description: "Format, view, and beautify your JSON data with ease.",
      href: "/json-formatter",
      icon: FileJson,
    },
    {
      title: "JWT Debugger",
      description: "Decode and debug JWT tokens.",
      href: "/jwt-debugger",
      icon: Key,
    },
    {
      title: "Diff Checker",
      description: "Compare text and find differences.",
      href: "/diff-checker",
      icon: FileDiff,
    },
    {
      title: "Text to PDF",
      description: "Convert basic text content to PDF document.",
      href: "/text-to-pdf",
      icon: FileText,
    },
    {
      title: "PDF Compressor",
      description: "Compress PDF files efficiently.",
      href: "/pdf-compressor",
      icon: FileArchive,
    },
    {
      title: "Image Compressor",
      description: "Compress images without losing quality.",
      href: "/image-compressor",
      icon: Image,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Developer Tools Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A collection of essential tools for developers, all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.href} {...tool} />
        ))}
      </div>
    </div>
  );
}
