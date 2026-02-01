import JsonViewer from "@/components/json-viewer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter",
  description: "Format, view, and beautify your JSON data with ease.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold">JSON Formatter</h1>
        <p className="text-lg text-muted-foreground">
          Format, view, and beautify your JSON data with ease.
        </p>
      </div>
      <JsonViewer />
    </main>
  );
}
