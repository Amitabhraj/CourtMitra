import "dotenv/config";
import express from "express";
import cors from "cors";
import { body } from "express-validator";
import {
  ingestCaseDocumentsHandler,
  ingestLawDocumentsHandler,
  lawChatHandler,
} from "./controller/chat.controller";

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 6969;

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "CourtMitra LawBot",
    timestamp: new Date().toISOString(),
  });
});

app.post(
  "/chat",
  body("message").notEmpty().withMessage("Message is required"),
  lawChatHandler,
);

app.post("/ingestCase", ingestCaseDocumentsHandler);
app.post("/ingestLaw", ingestLawDocumentsHandler);

// JSON error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Chatbot service error:", err);
  res.status(500).json({
    error: err?.message || "Something went wrong in LawBot service!",
  });
});

app.listen(port, () => {
  console.log(`CourtMitra LawBot listening on port ${port}`);
});
