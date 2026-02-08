import { PDFDocument } from "pdf-lib";

export async function compressPDF(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  // Basic optimization: Remove unused objects
  // specific compression options in save() are limited in pdf-lib
  // but we can try to use standard object stream
  const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: true });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Blob([compressedPdfBytes as any], {
    type: "application/pdf",
  });
}
