import { ToolsView } from "@/components/tools-view";

export default function Home() {
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

      <ToolsView />
    </div>
  );
}
