import expressAsyncHandler from "express-async-handler";
import { RequestHandler } from "express-serve-static-core";
import { validationResult } from "express-validator";
import { lawAgent } from "../model";
import { ingestCaseDirectory, ingestLawDirectory } from "../vector/vectorstore";
import { iterateCaseFiles, iterateLawFiles } from "../utils/pdfLoader";

const readPositiveInt = (value: unknown): number | undefined => {
  if (typeof value !== "string" && typeof value !== "number") {
    return undefined;
  }

  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
};

const readIngestionOptions = (req: Parameters<RequestHandler>[0]) => {
  const options: {
    embeddingBatchSize?: number;
    chunkSize?: number;
    chunkOverlap?: number;
  } = {};

  const embeddingBatchSize =
    readPositiveInt(req.query.embeddingBatchSize) ??
    readPositiveInt(req.body?.embeddingBatchSize);
  if (embeddingBatchSize) {
    options.embeddingBatchSize = embeddingBatchSize;
  }

  const chunkSize =
    readPositiveInt(req.query.chunkSize) ??
    readPositiveInt(req.body?.chunkSize);
  if (chunkSize) {
    options.chunkSize = chunkSize;
  }

  const chunkOverlap =
    readPositiveInt(req.query.chunkOverlap) ??
    readPositiveInt(req.body?.chunkOverlap);
  if (chunkOverlap) {
    options.chunkOverlap = chunkOverlap;
  }

  return options;
};

export const lawChatHandler: RequestHandler = expressAsyncHandler(
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const { message } = req.body;
    const currentMessage =
      typeof message === "string" ? message : String(message ?? "");
    type ChatHistoryItem = {
      role?: unknown;
      content?: unknown;
    };

    const rawHistory: ChatHistoryItem[] = Array.isArray(req.body?.history)
      ? req.body.history
      : [];
    const historyMessages: Array<{
      role: "user" | "assistant";
      content: string;
    }> = rawHistory
      .filter(
        (item) =>
          item &&
          (item.role === "user" || item.role === "assistant") &&
          (typeof item.content === "string" ||
            typeof item.content === "number") &&
          String(item.content).trim().length > 0,
      )
      .slice(-6)
      .map((item) => ({
        role: item.role as "user" | "assistant",
        content: String(item.content),
      }));

    try {
      const agentResponse = await lawAgent.invoke({
        messages: [...historyMessages, { role: "user", content: currentMessage }],
      });

      const allMessages = agentResponse.messages;
      const lastMessage = allMessages[allMessages.length - 1];
      let agentReply = lastMessage?.content ? String(lastMessage.content) : "";

      // If a drafting tool produced an HTML document, ensure it is included
      for (const msg of allMessages) {
        const role = (msg as any).role || (msg as any)._getType?.();
        if (role === "tool" || msg.constructor.name === "ToolMessage") {
          const toolContent =
            typeof msg.content === "string" ? msg.content.trim() : "";
          if (
            (toolContent.includes("<!DOCTYPE") ||
              toolContent.includes("<html") ||
              toolContent.includes("<style>")) &&
            !agentReply.includes(toolContent)
          ) {
            agentReply = agentReply
              ? `${agentReply}\n\n${toolContent}`
              : toolContent;
          }
        }
      }

      res.json({ response: agentReply || "No response available." });
    } catch (agentError) {
      console.error("lawAgent invoke failed:", agentError);
      res.status(500).json({
        error: "Failed to process chat message with AI agent.",
        details: (agentError as Error).message,
      });
    }
  },
);

export const ingestCaseDocumentsHandler: RequestHandler = expressAsyncHandler(
  async (req, res) => {
    const stats = await ingestCaseDirectory(
      iterateCaseFiles(),
      readIngestionOptions(req),
    );
    res.json({ message: "Case documents ingested successfully", stats });
  },
);

export const ingestLawDocumentsHandler: RequestHandler = expressAsyncHandler(
  async (req, res) => {
    const stats = await ingestLawDirectory(
      iterateLawFiles(),
      readIngestionOptions(req),
    );
    res.json({ message: "Law documents ingested successfully", stats });
  },
);
