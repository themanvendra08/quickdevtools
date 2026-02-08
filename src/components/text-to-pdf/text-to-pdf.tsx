"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Eye, X } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReactMarkdown from "react-markdown";
import { Checkbox } from "@/components/ui/checkbox";

type PageSize = "a4" | "letter" | "legal";
type Orientation = "portrait" | "landscape";
type PdfTheme = "light" | "dark" | "sepia";

export function TextToPdf() {
  const [content, setContent] = useState<string>(
    "# Hayalet Sevgilim\n\n**Irem**\n\n---\n\nCeza mı bu\nÇektiğim çile mi\nYıllardır tuttuğum nöbet bitmeyecek mi?\n\nBir küçük kar tanesi gibiyim\nAvucunda eriyen dön bebeğim\nGözyaşlarını görürsem\nErir kanatlarım\nUçamam rüyalarında yanına\n\nSonsuzluk senle başladı\nO küçük dünyamda\nUnutma gittiğinde yarım kaldım\n\nÇöllerdeyim yanıyorum\nKutuptayım üşüyorum\nCeza benim çekiyorum ne olur dön\n\nUzanıyorum tutamıyorum\nÖzlüyorum ağlıyorum\nYasak mısın anlamıyorum ne olur dön\n",
  );

  const [filename, setFilename] = useState("example-document");
  const [font, setFont] = useState("sans-serif");
  const [fontSize, setFontSize] = useState("medium");
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [theme, setTheme] = useState<PdfTheme>("light");
  const [headerText, setHeaderText] = useState("");
  const [isMarkdown, setIsMarkdown] = useState(true);
  const [showPageNumbers, setShowPageNumbers] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(false);

  const [showPreview, setShowPreview] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    const wasPreviewOpen = showPreview;
    if (!wasPreviewOpen) {
      setShowPreview(true);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const element = printRef.current;
    if (!element) {
      if (!wasPreviewOpen) setShowPreview(false);
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor:
          theme === "dark"
            ? "#1a1a1a"
            : theme === "sepia"
              ? "#f4ecd8"
              : "#ffffff",
      });

      const data = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: orientation,
        unit: "mm",
        format: pageSize,
      });

      const imgProperties = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

      pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${filename || "document"}.pdf`);
    } catch (e) {
      console.error("PDF generation failed", e);
    } finally {
      if (!wasPreviewOpen) setShowPreview(false);
    }
  };

  const cssTheme = {
    light: { bg: "bg-white", text: "text-black" },
    dark: { bg: "bg-neutral-900", text: "text-gray-100" },
    sepia: { bg: "bg-[#f4ecd8]", text: "text-[#433422]" },
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case "small":
        return "text-xs";
      case "large":
        return "text-lg";
      default:
        return "text-sm";
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1
          className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2"
          style={{ fontFamily: "var(--font-darker-grotesque)" }}
        >
          Text to PDF
        </h1>
        <p className="text-lg text-muted-foreground">
          Convert text & Markdown to beautiful PDFs
        </p>
      </div>

      {/* Tool Container */}
      <div className="mx-auto max-w-6xl h-[800px] flex rounded-3xl border shadow-2xl overflow-hidden bg-card ring-1 ring-border/50">
        {/* Sidebar Settings */}
        <div className="w-80 border-r bg-muted/30 p-6 space-y-6 overflow-y-auto scrollbar-thin backdrop-blur-sm">
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Settings
            </h2>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Filename
                </label>
                <input
                  className="w-full p-2.5 rounded-lg border bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Font
                </label>
                <select
                  className="w-full p-2.5 rounded-lg border bg-background/50 outline-none text-sm"
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                >
                  <option value="sans-serif">Sans-serif</option>
                  <option value="serif">Serif</option>
                  <option value="monospace">Monospace</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Size
                </label>
                <select
                  className="w-full p-2.5 rounded-lg border bg-background/50 outline-none text-sm"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Page Size
                </label>
                <select
                  className="w-full p-2.5 rounded-lg border bg-background/50 outline-none text-sm"
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as PageSize)}
                >
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                  <option value="legal">Legal</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Orientation
                </label>
                <select
                  className="w-full p-2.5 rounded-lg border bg-background/50 outline-none text-sm"
                  value={orientation}
                  onChange={(e) =>
                    setOrientation(e.target.value as Orientation)
                  }
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  PDF Theme
                </label>
                <div className="flex bg-muted rounded-lg p-1">
                  {(["light", "dark", "sepia"] as PdfTheme[]).map((t) => (
                    <button
                      key={t}
                      className={`flex-1 text-xs py-1.5 rounded-md capitalize transition-all ${theme === t ? "bg-background shadow-sm text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
                      onClick={() => setTheme(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Header Text
                </label>
                <input
                  className="w-full p-2.5 rounded-lg border bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                  value={headerText}
                  onChange={(e) => setHeaderText(e.target.value)}
                  placeholder="Optional header text..."
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="markdown"
                    checked={isMarkdown}
                    onCheckedChange={(c) => setIsMarkdown(!!c)}
                  />
                  <label
                    htmlFor="markdown"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Markdown
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="page-numbers"
                    checked={showPageNumbers}
                    onCheckedChange={(c) => setShowPageNumbers(!!c)}
                  />
                  <label
                    htmlFor="page-numbers"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Page numbers
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="line-numbers"
                    checked={showLineNumbers}
                    onCheckedChange={(c) => setShowLineNumbers(!!c)}
                  />
                  <label
                    htmlFor="line-numbers"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Line numbers
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              variant="outline"
              className="flex-1 h-10"
              onClick={() => setShowPreview(true)}
            >
              <Eye className="mr-2 h-4 w-4" /> Preview
            </Button>
            <Button
              className="flex-1 h-10 shadow-lg shadow-primary/25"
              onClick={handleDownloadPdf}
            >
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </div>
        </div>

        {/* Main Area */}
        <div className="flex-1 flex flex-col h-full bg-background relative">
          {/* Editor Toolbar */}
          <div className="border-b px-6 py-3 flex justify-between items-center bg-background/50 backdrop-blur-sm z-10">
            <div className="flex space-x-2">
              <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-full pointer-events-none">
                Editor
              </span>
            </div>
            <div className="text-xs font-medium text-muted-foreground flex gap-4">
              <span>{content.length} chars</span>
              <span>
                {content.split(/\s+/).filter((w) => w.length > 0).length} words
              </span>
              <span>{content.split("\n").length} lines</span>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 relative group">
            <textarea
              className="w-full h-full resize-none bg-transparent outline-none font-mono text-sm leading-relaxed p-8 scrollbar-thin"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="# Start typing..."
              spellCheck={false}
            />
          </div>

          {/* Preview Modal */}
          {showPreview && (
            <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-200">
              <div className="relative w-full h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    Preview
                    <span className="text-xs font-normal text-muted-foreground px-2 py-0.5 rounded-full border bg-muted">
                      {pageSize.toUpperCase()} &bull; {orientation}
                    </span>
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadPdf}
                    >
                      <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-muted"
                      onClick={() => setShowPreview(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div
                  className="flex-1 overflow-auto flex justify-center p-8 bg-muted/20 rounded-xl border border-dashed scrollbar-thin"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) setShowPreview(false);
                  }}
                >
                  {/* Paper Visualization */}
                  <div
                    ref={printRef}
                    className={`${cssTheme[theme].bg} ${cssTheme[theme].text} shadow-2xl p-[20mm] relative transition-all duration-300 transform-gpu`}
                    style={{
                      width: orientation === "portrait" ? "210mm" : "297mm",
                      minHeight: orientation === "portrait" ? "297mm" : "210mm",
                      fontFamily: font,
                    }}
                  >
                    {/* Header */}
                    {headerText && (
                      <div className="absolute top-8 left-[20mm] right-[20mm] text-center text-xs opacity-50 border-b pb-2 mb-8">
                        {headerText}
                      </div>
                    )}

                    {/* Content */}
                    <div
                      className={`prose max-w-none ${getFontSizeClass()} ${theme === "dark" ? "prose-invert" : ""}`}
                    >
                      {isMarkdown ? (
                        <ReactMarkdown
                          components={
                            {
                              // Custom renderers if needed
                            }
                          }
                        >
                          {content}
                        </ReactMarkdown>
                      ) : (
                        <pre className="whitespace-pre-wrap font-inherit font-normal">
                          {content}
                        </pre>
                      )}
                    </div>

                    {/* Line Numbers - rudimentary implementation */}
                    {showLineNumbers && (
                      <div className="absolute left-2 top-[20mm] bottom-[20mm] w-8 text-right text-[10px] opacity-30 select-none overflow-hidden">
                        {content.split("\n").map((_, i) => (
                          <div key={i} style={{ lineHeight: "1.6em" }}>
                            {i + 1}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Page Numbers - displayed at bottom */}
                    {showPageNumbers && (
                      <div className="absolute bottom-4 left-0 right-0 text-center text-xs opacity-50">
                        1 / 1
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
