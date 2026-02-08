import { TextToPdf } from "@/components/text-to-pdf/text-to-pdf"; // Adjust path as needed
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text to PDF",
  description: "Convert text and markdown to beautiful PDFs.",
};

export default function TextToPdfPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <TextToPdf />
    </main>
  );
}
