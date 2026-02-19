import ColorExtractor from "@/components/color-extractor/color-extractor";

export const metadata = {
  title: "Color Palette Extractor | QuickDevTools",
  description: "Extract beautiful color palettes from any image instantly.",
};

export default function ColorExtractorPage() {
  return (
    <div className="container py-8 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <ColorExtractor />
    </div>
  );
}
