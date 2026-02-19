"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { colord, extend } from "colord";
import harmonies from "colord/plugins/harmonies";
import mix from "colord/plugins/mix";
import names from "colord/plugins/names";
import { History, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ColorWheel } from "./color-wheel";
import { HarmonySection } from "./harmony-section";

extend([harmonies, names, mix]);

export function ColorHarmoniesTool() {
  const [baseColor, setBaseColor] = useState("#6366f1");
  const [recentColors, setRecentColors] = useState<string[]>(["#6366f1"]);

  const color = colord(baseColor);
  const isValid = color.isValid();

  const handleColorChange = (newColor: string) => {
    setBaseColor(newColor);
    if (colord(newColor).isValid()) {
      addToRecent(newColor);
    }
  };

  const addToRecent = (color: string) => {
    setRecentColors((prev) => {
      const filtered = prev.filter((c) => c !== color);
      return [color, ...filtered].slice(0, 10);
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${text} to clipboard`);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Color Wheel Visualization */}
            <div className="flex justify-center">
              <ColorWheel
                baseColor={isValid ? baseColor : "#000000"}
                onChange={handleColorChange}
              />
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="base-color">Base Color</Label>
                <div className="flex gap-2">
                  <div
                    className="w-12 h-12 rounded-lg border shadow-sm shrink-0"
                    style={{
                      backgroundColor: isValid ? baseColor : "transparent",
                    }}
                  />
                  <Input
                    id="base-color"
                    value={baseColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="font-mono"
                    placeholder="#RRGGBB"
                  />
                  <input
                    type="color"
                    value={isValid ? colord(baseColor).toHex() : "#000000"}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-12 h-12 p-1 rounded cursor-pointer opacity-0 absolute"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 relative"
                  >
                    <div
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      style={{ overflow: "hidden" }}
                    >
                      <input
                        type="color"
                        value={isValid ? colord(baseColor).toHex() : "#000000"}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-full h-full cursor-pointer"
                      />
                    </div>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground font-mono">
                  <span>{isValid ? color.toRgbString() : "Invalid Color"}</span>
                  <span>{isValid ? color.toHslString() : ""}</span>
                </div>
              </div>

              {/* Recent Colors */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <History className="h-4 w-4" />
                  <span>Recent</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentColors.map((c, i) => (
                    <button
                      key={i}
                      className="w-8 h-8 rounded-full border shadow-sm focus:outline-none focus:ring-2 ring-primary/50 transition-transform hover:scale-110"
                      style={{ backgroundColor: c }}
                      onClick={() => handleColorChange(c)}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Harmony Sections */}
      {isValid && (
        <div className="grid grid-cols-1 gap-6">
          <HarmonySection
            title="Complementary"
            description="180° opposite"
            colors={color.harmonies("complementary").map((c) => c.toHex())}
            onCopy={copyToClipboard}
          />
          <HarmonySection
            title="Analogous"
            description="30° adjacent"
            colors={color.harmonies("analogous").map((c) => c.toHex())}
            onCopy={copyToClipboard}
          />
          <HarmonySection
            title="Triadic"
            description="120° separation"
            colors={color.harmonies("triadic").map((c) => c.toHex())}
            onCopy={copyToClipboard}
          />
          <HarmonySection
            title="Split-Complementary"
            description="150° & 210° separation"
            colors={color
              .harmonies("split-complementary")
              .map((c) => c.toHex())}
            onCopy={copyToClipboard}
          />
          <HarmonySection
            title="Tetradic (Double Complementary)"
            description="90° separation"
            colors={color.harmonies("tetradic").map((c) => c.toHex())}
            onCopy={copyToClipboard}
          />
          <HarmonySection
            title="Monochromatic"
            description="Lightness variants"
            colors={[
              color.lighten(0.2).toHex(),
              color.lighten(0.1).toHex(),
              baseColor,
              color.darken(0.1).toHex(),
              color.darken(0.2).toHex(),
            ]}
            onCopy={copyToClipboard}
          />
          <HarmonySection
            title="Shades"
            description="Darkness variants"
            colors={color.shades(5).map((c) => c.toHex())}
            onCopy={copyToClipboard}
          />
          <HarmonySection
            title="Tints"
            description="Lightness variants"
            colors={color.tints(5).map((c) => c.toHex())}
            onCopy={copyToClipboard}
          />
        </div>
      )}
    </div>
  );
}
