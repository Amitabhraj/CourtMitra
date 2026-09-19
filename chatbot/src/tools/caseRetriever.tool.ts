import * as z from "zod";
import { tool } from "langchain";
import { searchCaseDocuments } from "../vector/vectorstore";

export const retrieveCaseFiles = async ({ query }: { query: string }) => {
  try {
    const results = await searchCaseDocuments(query);
    if (!results || results.length === 0) {
      return "No relevant case files found in the knowledge base.";
    }
    const formatted = results.map((r: any) => r.pageContent).filter(Boolean).join("\n\n");
    return formatted || "No relevant case files found in the knowledge base.";
  } catch (error) {
    console.warn("retrieveCaseFiles error:", (error as Error).message);
    return "No relevant case files found in the knowledge base.";
  }
};

export const RetrieveCaseFilesTool = tool(retrieveCaseFiles, {
  name: "retrieve_case_files",
  description:
    "Use this tool to retrieve relevant case files based on a query. Make sure to use queries specific to legal domains. Not for general questions as they are actual case files and uses legal jargon.",
  schema: z.object({
    query: z.string().describe("The search query for retrieving case files"),
  }),
});
