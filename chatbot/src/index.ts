import express from "express";
import {
  ingestCaseDocumentsHandler,
  ingestLawDocumentsHandler,
  lawChatHandler,
} from "./controller/chat.controller";
import dotenv from "dotenv";
import { body } from "express-validator";
dotenv.config();
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
const port = 6969;

app.post(
  "/chat",
  body("message").notEmpty().withMessage("Message is required"),
  lawChatHandler,
);

app.post("/ingestCase", ingestCaseDocumentsHandler);
app.post("/ingestLaw", ingestLawDocumentsHandler);

// Error handling middleware
// app.use((err: any, req: express.Request, res: express.Response) => {
//   console.error(err.stack);
//   return res.json({ error: "Something went wrong!" });
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
