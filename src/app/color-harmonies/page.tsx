import { ColorHarmoniesTool } from "@/components/color-harmonies/color-harmonies-tool";

export default function ColorHarmoniesPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Color Harmonies</h1>
        <p className="text-xl text-muted-foreground">
          Generate perfect color combinations and harmonies instantly.
        </p>
      </div>
      <ColorHarmoniesTool />
    </div>
  );
}
