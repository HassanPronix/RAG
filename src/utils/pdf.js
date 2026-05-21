import fs from "fs";
import { PDFParse } from "pdf-parse";

export async function extractPdfText(filePath) {
  const buffer = fs.readFileSync(filePath);

  const uint8Array = new Uint8Array(buffer);

  const parser = new PDFParse({ data: uint8Array });

  const data = await parser.getText();

  return data.text;
}