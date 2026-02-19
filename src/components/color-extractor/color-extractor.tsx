"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import ColorThief from "colorthief";
import { Copy, RefreshCw, Upload, FileImage, Palette } from "lucide-react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

type ColorFormat = "HEX" | "RGB" | "HSL";

interface ExtractedColor {
  rgb: [number, number, number];
  hex: string;
  hsl: string;
}

const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
      .toUpperCase()
  );
};

const rgbToHsl = (r: number, g: number, b: number): string => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

export default function ColorExtractor() {
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<ExtractedColor[]>([]);
  const [colorCount, setColorCount] = useState<number>(6);
  const [format, setFormat] = useState<ColorFormat>("HEX");
  const [isExtracting, setIsExtracting] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const extractColors = useCallback(() => {
    if (imgRef.current) {
      setIsExtracting(true);
      try {
        const colorThief = new ColorThief();
        // Use getPalette to extract multiple colors.
        // Note: colorthief returns an array of arrays [[r,g,b], [r,g,b], ...]
        const extracted = colorThief.getPalette(imgRef.current, colorCount);

        const formattedColors = extracted.map(
          (rgb: [number, number, number]) => ({
            rgb: rgb,
            hex: rgbToHex(rgb[0], rgb[1], rgb[2]),
            hsl: rgbToHsl(rgb[0], rgb[1], rgb[2]),
          }),
        );
        setColors(formattedColors);
      } catch (error) {
        console.error("Error extracting colors:", error);
        toast.error("Failed to extract colors. Please try another image.");
      } finally {
        setIsExtracting(false);
      }
    }
  }, [colorCount]);

  useEffect(() => {
    if (image && imgRef.current) {
      // Need to wait for image to load before extracting
      if (imgRef.current.complete) {
        extractColors();
      } else {
        imgRef.current.onload = extractColors;
      }
    }
  }, [image, extractColors]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${text} to clipboard!`);
  };

  const getColorValue = (color: ExtractedColor) => {
    switch (format) {
      case "HEX":
        return color.hex;
      case "RGB":
        return `rgb(${color.rgb.join(", ")})`;
      case "HSL":
        return color.hsl;
      default:
        return color.hex;
    }
  };

  // Determine text color based on brightness
  const getContrastYIQ = (rgb: [number, number, number]) => {
    const yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return yiq >= 128 ? "black" : "white";
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Color Palette Extractor
        </h1>
        <p className="text-muted-foreground">
          Extract beautiful color palettes from any image instantly.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-primary bg-primary/10"
                    : "border-muted-foreground/25 hover:border-primary/50"
                }`}
              >
                <input {...getInputProps()} />
                {image ? (
                  <div className="relative group">
                    <img
                      ref={imgRef}
                      src={image}
                      alt="Uploaded preview"
                      className="max-h-[300px] mx-auto rounded-md shadow-sm object-contain"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                      <p className="text-white font-medium flex items-center gap-2">
                        <Upload className="w-4 h-4" /> Change Image
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 space-y-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                      <FileImage className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">
                        Click or drag image to upload
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supports JPG, PNG, WEBP
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Number of colors: {colorCount}</Label>
                  </div>
                  <Slider
                    value={[colorCount]}
                    onValueChange={(val) => setColorCount(val[0])}
                    min={2}
                    max={20}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Color format</Label>
                  <Tabs
                    defaultValue="HEX"
                    onValueChange={(v) => setFormat(v as ColorFormat)}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="HEX">HEX</TabsTrigger>
                      <TabsTrigger value="RGB">RGB</TabsTrigger>
                      <TabsTrigger value="HSL">HSL</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <Button
                  onClick={extractColors}
                  disabled={!image || isExtracting}
                  className="w-full"
                  // style={{
                  //     background: colors.length > 0 ? `linear-gradient(to right, ${colors[0].hex}, ${colors[1].hex})` : undefined
                  // }}
                >
                  {isExtracting ? (
                    <>Extracting...</>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" /> Re-extract Colors
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Palette className="w-5 h-5" /> Palette
                </h3>
                {colors.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setColors([])}
                  >
                    Clear
                  </Button>
                )}
              </div>

              {colors.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => copyToClipboard(getColorValue(color))}
                      className="group relative h-24 rounded-lg shadow-sm transition-all hover:scale-[1.02] hover:shadow-md text-left p-4 flex flex-col justify-end"
                      style={{ backgroundColor: `rgb(${color.rgb.join(",")})` }}
                    >
                      <div
                        className={`text-xs uppercase font-bold opacity-90`}
                        style={{ color: getContrastYIQ(color.rgb) }}
                      >
                        {getColorValue(color)}
                      </div>
                      <div
                        className={`text-[10px] opacity-75`}
                        style={{ color: getContrastYIQ(color.rgb) }}
                      >
                        {format === "HEX" && `rgb(${color.rgb.join(", ")})`}
                        {format === "RGB" && color.hex}
                        {format === "HSL" && color.hex}
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Copy
                          className="w-4 h-4"
                          style={{ color: getContrastYIQ(color.rgb) }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="h-[400px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                  <Palette className="w-12 h-12 mb-4 opacity-20" />
                  <p>Upload an image to generate a color palette</p>
                </div>
              )}

              {colors.length > 0 && (
                <div className="mt-8">
                  <div className="h-12 w-full rounded-lg flex overflow-hidden shadow-sm">
                    {colors.map((color, index) => (
                      <div
                        key={index}
                        className="h-full flex-1"
                        style={{
                          backgroundColor: `rgb(${color.rgb.join(",")})`,
                        }}
                        title={getColorValue(color)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
