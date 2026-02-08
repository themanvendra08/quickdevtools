"use strict";
"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { compressPDF } from "@/utils/pdf-compression";

interface CompressedFile {
  id: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  status: "compressing" | "done" | "error";
  blob?: Blob;
}

export function PdfCompressor() {
  const [files, setFiles] = useState<CompressedFile[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsCompressing(true);

    // Process files sequentially or parallel
    for (const file of acceptedFiles) {
      const id = Math.random().toString(36).substr(2, 9);

      // Add optimistic UI entry
      setFiles((prev) => [
        ...prev,
        {
          id,
          name: file.name,
          originalSize: file.size,
          compressedSize: 0,
          status: "compressing",
        },
      ]);

      try {
        const compressedBlob = await compressPDF(file);

        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === id) {
              return {
                ...f,
                compressedSize: compressedBlob.size,
                status: "done",
                blob: compressedBlob,
              };
            }
            return f;
          }),
        );
      } catch (error) {
        console.error("Compression failed", error);
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === id) {
              return { ...f, status: "error" };
            }
            return f;
          }),
        );
      }
    }
    setIsCompressing(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
  });

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const calculateSavings = (original: number, compressed: number) => {
    if (original === 0) return "0%";
    const savings = ((original - compressed) / original) * 100;
    return `-${savings.toFixed(1)}%`;
  };

  const totalOriginal = files.reduce((acc, file) => acc + file.originalSize, 0);
  const totalCompressed = files.reduce(
    (acc, file) => acc + file.compressedSize,
    0,
  );
  const totalSaved = totalOriginal - totalCompressed;

  const handleDownload = (file: CompressedFile) => {
    if (!file.blob) return;
    const url = URL.createObjectURL(file.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compressed_${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    files.forEach((file) => {
      if (file.status === "done" && file.blob) {
        handleDownload(file);
      }
    });
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1
          className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2"
          style={{ fontFamily: "var(--font-darker-grotesque)" }}
        >
          SHRINK
        </h1>
        <p className="text-lg text-muted-foreground">
          Compress PDFs without losing clarity.
        </p>
      </div>

      <div className="w-full max-w-3xl">
        {files.length === 0 ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">
              Drag & drop PDFs here, or click to select files
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Your files never leave your device.
            </p>
          </div>
        ) : (
          <Card className="bg-card/50 backdrop-blur-sm border-white/10 p-6 rounded-3xl space-y-6 shadow-2xl">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-muted/30 p-4 rounded-2xl border border-white/5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/10 rounded-xl">
                    <FileText className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base truncate max-w-[200px] sm:max-w-xs">
                      {file.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-1">
                      <span>{formatSize(file.originalSize)}</span>
                      <span>→</span>
                      <span className="text-foreground font-medium">
                        {file.status === "done"
                          ? formatSize(file.compressedSize)
                          : "..."}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                  {file.status === "done" && (
                    <span className="bg-green-500/20 text-green-500 text-xs font-bold px-2 py-1 rounded-md ml-auto sm:ml-0">
                      {calculateSavings(file.originalSize, file.compressedSize)}
                    </span>
                  )}
                  {file.status === "compressing" && (
                    <span className="text-xs text-muted-foreground animate-pulse">
                      Compressing...
                    </span>
                  )}
                  {file.status === "error" && (
                    <span className="text-xs text-red-500">Error</span>
                  )}

                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="h-8">
                      Share
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8"
                      disabled={file.status !== "done"}
                      onClick={() => handleDownload(file)}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/30 p-4 rounded-2xl text-center border border-white/5">
                <div className="text-xs text-muted-foreground uppercase mb-1">
                  Total Before
                </div>
                <div className="text-lg font-bold">
                  {formatSize(totalOriginal)}
                </div>
              </div>
              <div className="bg-muted/30 p-4 rounded-2xl text-center border border-white/5">
                <div className="text-xs text-muted-foreground uppercase mb-1">
                  Total After
                </div>
                <div className="text-lg font-bold">
                  {formatSize(totalCompressed)}
                </div>
              </div>
              <div className="bg-green-500/10 p-4 rounded-2xl text-center border border-green-500/20">
                <div className="text-xs text-green-500/80 uppercase mb-1">
                  Saved
                </div>
                <div className="text-lg font-bold text-green-500">
                  {formatSize(totalSaved)}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Button
                className="w-full h-12 text-lg font-semibold bg-white text-black hover:bg-white/90 rounded-xl"
                size="lg"
                onClick={handleDownloadAll}
                disabled={
                  isCompressing || files.every((f) => f.status !== "done")
                }
              >
                Download All
              </Button>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={() => setFiles([])}
              >
                Compress more files
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground font-medium pt-2">
              Your files never leave your device.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
