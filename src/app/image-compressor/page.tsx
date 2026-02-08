import ImageCompressor from "@/components/image-compressor/image-compressor";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Compressor",
  description: "Fast, ad-free image compression directly in your browser.",
};

export default function ImageCompressorPage() {
  return (
    <main className="min-h-screen bg-background text-foreground py-10">
      <ImageCompressor />
    </main>
  );
}
