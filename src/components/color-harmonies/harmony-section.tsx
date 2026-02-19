"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { colord } from "colord";
import { Copy } from "lucide-react";

interface HarmonySectionProps {
  title: string;
  description: string;
  colors: string[];
  onCopy: (color: string) => void;
}

export function HarmonySection({
  title,
  description,
  colors,
  onCopy,
}: HarmonySectionProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-baseline justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <span className="text-sm text-muted-foreground">{description}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {colors.map((color, index) => {
            const textColor = colord(color).isDark() ? "#ffffff" : "#000000";
            return (
              <div
                key={`${color}-${index}`}
                className="group relative aspect-video rounded-xl transition-all hover:scale-105 hover:shadow-lg cursor-pointer flex flex-col items-center justify-center gap-1"
                style={{ backgroundColor: color, color: textColor }}
                onClick={() => onCopy(color)}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 bg-black/20 p-1.5 rounded-full backdrop-blur-sm">
                  <Copy className="h-3 w-3 text-white" />
                </div>
                <span className="font-mono text-sm font-bold tracking-wider">
                  {color}
                </span>
                <span className="text-[10px] opacity-80 uppercase tracking-widest">
                  {colord(color).toName({ closest: true }) || ""}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
