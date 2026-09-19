import "dotenv/config";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { Document } from "@langchain/core/documents";
import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import type { LoadedPdfDocuments } from "../utils/pdfLoader";

const CASE_COLLECTION_NAME = process.env.QDRANT_CASE_COLLECTION ?? "shivalik-law-casefiles";
const LAW_COLLECTION_NAME = process.env.QDRANT_LAW_COLLECTION ?? "shivalik-law-laws";
const VECTOR_SIZE = 384;

let embeddingModelInstance: HuggingFaceTransformersEmbeddings | null = null;

export const getEmbeddingModel = (): HuggingFaceTransformersEmbeddings => {
  if (!embeddingModelInstance) {
    embeddingModelInstance = new HuggingFaceTransformersEmbeddings({
      model: process.env.EMBEDDING_MODEL ?? "Xenova/all-MiniLM-L6-v2",
    });
  }
  return embeddingModelInstance;
};

let qdrantClientInstance: QdrantClient | null = null;

export const getQdrantClient = (): QdrantClient => {
  if (!qdrantClientInstance) {
    const clientParams = {
      url: process.env.QDRANT_URL || "http://localhost:6333",
      checkCompatibility: false,
      ...(process.env.QDRANT_API_KEY ? { apiKey: process.env.QDRANT_API_KEY } : {}),
    };
    qdrantClientInstance = new QdrantClient(clientParams);
  }
  return qdrantClientInstance;
};

const ensureCollectionExists = async (collectionName: string): Promise<void> => {
  try {
    const client = getQdrantClient();
    const result = await client.collectionExists(collectionName);
    if (!result.exists) {
      console.log(`Creating Qdrant collection: ${collectionName}`);
      await client.createCollection(collectionName, {
        vectors: {
          size: VECTOR_SIZE,
          distance: "Cosine",
        },
      });
    }
  } catch (error) {
    console.warn(`Could not verify/create collection "${collectionName}":`, (error as Error).message);
  }
};

let caseVectorStorePromise: Promise<QdrantVectorStore> | null = null;
let lawVectorStorePromise: Promise<QdrantVectorStore> | null = null;

export const getCaseVectorStore = async (): Promise<QdrantVectorStore> => {
  if (!caseVectorStorePromise) {
    caseVectorStorePromise = (async () => {
      await ensureCollectionExists(CASE_COLLECTION_NAME);
      return QdrantVectorStore.fromExistingCollection(getEmbeddingModel(), {
        url: process.env.QDRANT_URL || "http://localhost:6333",
        collectionName: CASE_COLLECTION_NAME,
        ...(process.env.QDRANT_API_KEY ? { apiKey: process.env.QDRANT_API_KEY } : {}),
      });
    })();
  }
  return caseVectorStorePromise;
};

export const getLawVectorStore = async (): Promise<QdrantVectorStore> => {
  if (!lawVectorStorePromise) {
    lawVectorStorePromise = (async () => {
      await ensureCollectionExists(LAW_COLLECTION_NAME);
      return QdrantVectorStore.fromExistingCollection(getEmbeddingModel(), {
        url: process.env.QDRANT_URL || "http://localhost:6333",
        collectionName: LAW_COLLECTION_NAME,
        ...(process.env.QDRANT_API_KEY ? { apiKey: process.env.QDRANT_API_KEY } : {}),
      });
    })();
  }
  return lawVectorStorePromise;
};

type IngestionOptions = {
  embeddingBatchSize?: number | undefined;
  chunkSize?: number | undefined;
  chunkOverlap?: number | undefined;
};

type IngestionStats = {
  processedFiles: number;
  processedPages: number;
  insertedChunks: number;
};

const DEFAULT_EMBEDDING_BATCH_SIZE = Number.parseInt(
  process.env.EMBEDDING_BATCH_SIZE ?? "16",
  10,
);
const DEFAULT_CHUNK_SIZE = Number.parseInt(process.env.CHUNK_SIZE ?? "900", 10);
const DEFAULT_CHUNK_OVERLAP = Number.parseInt(
  process.env.CHUNK_OVERLAP ?? "150",
  10,
);

const sanitizeInt = (value: number | undefined, fallback: number): number => {
  if (!value || !Number.isFinite(value) || value <= 0) {
    return fallback;
  }
  return Math.floor(value);
};

const splitDocuments = (
  documents: Document[],
  chunkSize: number,
  chunkOverlap: number,
): Document[] => {
  const chunks: Document[] = [];

  for (const doc of documents) {
    const text = doc.pageContent;
    if (!text) {
      continue;
    }

    if (text.length <= chunkSize) {
      chunks.push(doc);
      continue;
    }

    const step = Math.max(chunkSize - chunkOverlap, 1);
    for (let start = 0; start < text.length; start += step) {
      const end = Math.min(start + chunkSize, text.length);
      chunks.push(
        new Document({
          pageContent: text.slice(start, end),
          metadata: {
            ...doc.metadata,
            chunkStart: start,
            chunkEnd: end,
          },
        }),
      );
      if (end >= text.length) {
        break;
      }
    }
  }

  return chunks;
};

const chunkAndEmbed = async (
  vectorStorePromise: Promise<QdrantVectorStore>,
  documents: AsyncGenerator<LoadedPdfDocuments>,
  options: IngestionOptions = {},
): Promise<IngestionStats> => {
  const embeddingBatchSize = sanitizeInt(
    options.embeddingBatchSize,
    DEFAULT_EMBEDDING_BATCH_SIZE,
  );
  const chunkSize = sanitizeInt(options.chunkSize, DEFAULT_CHUNK_SIZE);
  const chunkOverlap = Math.min(
    sanitizeInt(options.chunkOverlap, DEFAULT_CHUNK_OVERLAP),
    chunkSize - 1,
  );

  const vectorStore = await vectorStorePromise;
  const stats: IngestionStats = {
    processedFiles: 0,
    processedPages: 0,
    insertedChunks: 0,
  };

  for await (const { filePath, documents: pdfPages } of documents) {
    stats.processedFiles += 1;
    stats.processedPages += pdfPages.length;

    const chunks = splitDocuments(pdfPages, chunkSize, chunkOverlap);

    for (let i = 0; i < chunks.length; i += embeddingBatchSize) {
      const batch = chunks.slice(i, i + embeddingBatchSize);
      if (batch.length === 0) {
        continue;
      }
      await vectorStore.addDocuments(batch);
      stats.insertedChunks += batch.length;
    }

    console.log(
      `Ingested ${pdfPages.length} pages from ${filePath} -> ${chunks.length} chunks`,
    );
  }

  return stats;
};

export const ingestCaseDirectory = async (
  documents: AsyncGenerator<LoadedPdfDocuments>,
  options: IngestionOptions = {},
): Promise<IngestionStats> => {
  return chunkAndEmbed(getCaseVectorStore(), documents, options);
};

export const ingestLawDirectory = async (
  documents: AsyncGenerator<LoadedPdfDocuments>,
  options: IngestionOptions = {},
): Promise<IngestionStats> => {
  return chunkAndEmbed(getLawVectorStore(), documents, options);
};

export const ingestCaseDocuments = async (documents: Document[]) => {
  const store = await getCaseVectorStore();
  await store.addDocuments(documents);
};

export const searchCaseDocuments = async (query: string): Promise<Document[]> => {
  try {
    const topK = sanitizeInt(
      Number.parseInt(process.env.SEARCH_TOP_K ?? "3", 10),
      3,
    );
    const store = await getCaseVectorStore();
    const results = await store.similaritySearch(query, topK);
    return results;
  } catch (error) {
    console.warn("searchCaseDocuments fallback (vector DB unavailable or empty):", (error as Error).message);
    return [];
  }
};

export const ingestLawDocuments = async (documents: Document[]) => {
  const store = await getLawVectorStore();
  await store.addDocuments(documents);
};

export const searchLawDocuments = async (query: string): Promise<Document[]> => {
  try {
    const topK = sanitizeInt(
      Number.parseInt(process.env.SEARCH_TOP_K ?? "3", 10),
      3,
    );
    const store = await getLawVectorStore();
    const results = await store.similaritySearch(query, topK);
    return results;
  } catch (error) {
    console.warn("searchLawDocuments fallback (vector DB unavailable or empty):", (error as Error).message);
    return [];
  }
};
