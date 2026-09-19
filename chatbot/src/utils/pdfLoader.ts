import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import type { Document } from "@langchain/core/documents";
import { readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QP_DIR_PATH = path.resolve(__dirname, "../../rag_data/case_files");

const LAW_DIR_PATH = path.resolve(__dirname, "../../rag_data/laws");

export type LoadedPdfDocuments = {
  filePath: string;
  documents: Document[];
};

const listPdfFiles = async (rootDir: string): Promise<string[]> => {
  if (!existsSync(rootDir)) {
    return [];
  }
  const entries = await readdir(rootDir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(rootDir, entry.name);
      if (entry.isDirectory()) {
        return listPdfFiles(entryPath);
      }
      if (entry.isFile() && entry.name.toLowerCase().endsWith(".pdf")) {
        return [entryPath];
      }
      return [];
    }),
  );

  return nested.flat();
};

const loadPdf = async (pdfPath: string): Promise<Document[]> => {
  const loader = new PDFLoader(pdfPath, { splitPages: true });
  return loader.load();
};

const iteratePdfDirectory = async function* (
  rootDir: string,
): AsyncGenerator<LoadedPdfDocuments> {
  const pdfPaths = await listPdfFiles(rootDir);
  for (const pdfPath of pdfPaths) {
    const documents = await loadPdf(pdfPath);
    yield {
      filePath: pdfPath,
      documents,
    };
  }
};

export const iterateCaseFiles = (): AsyncGenerator<LoadedPdfDocuments> =>
  iteratePdfDirectory(QP_DIR_PATH);

export const iterateLawFiles = (): AsyncGenerator<LoadedPdfDocuments> =>
  iteratePdfDirectory(LAW_DIR_PATH);
