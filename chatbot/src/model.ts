import "dotenv/config";
import { createAgent } from "langchain";
import { ChatGroq } from "@langchain/groq";
import { RetrieveCaseFilesTool } from "./tools/caseRetriever.tool";
import { RetrieveLawDocumentsTool } from "./tools/lawRetriever.tool";
import { CreateLegalNoticeTool } from "./tools/createLegalNotice.tool";
import { CreateContractTool } from "./tools/createContract.tool";
import { CreateAffidavitTool } from "./tools/createAffidavit.tool";
import { RecommendLawyerTool } from "./tools/lawyerRecommendation.tool";

const modelName = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

const groqChatModel = new ChatGroq({
  ...(process.env.GROQ_API_KEY ? { apiKey: process.env.GROQ_API_KEY } : {}),
  model: modelName,
  streaming: true,
});

export const lawAgent = createAgent({
  model: groqChatModel,
  tools: [
    RetrieveCaseFilesTool,
    RetrieveLawDocumentsTool,
    CreateLegalNoticeTool,
    CreateContractTool,
    CreateAffidavitTool,
    RecommendLawyerTool,
  ],
  systemPrompt:
    "You are an INDIAN legal AI assistant. You can retrieve legal case files and law documents, generate legal drafts, and recommend lawyers. For any query where the user asks to find, suggest, compare, or contact lawyers, you MUST call recommend_lawyer and use only that tool result. Never invent lawyer names or phone numbers. Include each recommended lawyer's mobile number exactly as returned by the tool. If the tool returns no data or errors, clearly say lawyer data is currently unavailable. If you do not have enough information for legal references, just create a response based on your existing knowledge. Format responses in Markdown. Do not wrap output in Markdown if you called create_legal_notice, create_contract, or create_affidavit.",
});

