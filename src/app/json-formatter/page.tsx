import JsonViewer from "@/components/json-viewer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter - QuickDevTools",
  description: "Format, view, and beautify your JSON data with ease.",
};

export default function JsonFormatterPage() {
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold">JSON Formatter</h1>
        <p className="text-muted-foreground">
          Format, view, and beautify your JSON data with ease.
        </p>
      </div>
      <JsonViewer />
    </div>
  );
}
