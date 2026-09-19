import * as z from "zod";
import { tool } from "langchain";
import { searchLawDocuments } from "../vector/vectorstore";

export const retrieveLawDocuments = async ({ query }: { query: string }) => {
  try {
    const results = await searchLawDocuments(query);
    if (!results || results.length === 0) {
      return "No relevant law documents found in the knowledge base.";
    }
    const formatted = results.map((r: any) => r.pageContent).filter(Boolean).join("\n\n");
    return formatted || "No relevant law documents found in the knowledge base.";
  } catch (error) {
    console.warn("retrieveLawDocuments error:", (error as Error).message);
    return "No relevant law documents found in the knowledge base.";
  }
};

export const RetrieveLawDocumentsTool = tool(retrieveLawDocuments, {
  name: "retrieve_law_documents",
  description:
    "Use this tool to retrieve relevant law documents like constitutional articles based on a query. Make sure to use queries specific to legal domains. Not for general questions as they are actual law documents and uses legal jargon.",
  schema: z.object({
    query: z.string().describe("The search query for retrieving law documents"),
  }),
});
