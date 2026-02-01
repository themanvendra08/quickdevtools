import type { Metadata } from "next";
import { DiffChecker } from "@/components/diff-checker/DiffChecker";

export const metadata: Metadata = {
  title: "Diff Checker",
  description:
    "Compare two text or code snippets and highlight the differences.",
};

export default function DiffCheckerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-6 py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Diff Checker
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Compare two text or code snippets and highlight the differences.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-card rounded-2xl border border-border shadow-lg">
          <div className="p-8">
            <DiffChecker />
          </div>
        </div>
      </div>
    </div>
  );
}
