import * as z from "zod";
import { tool } from "langchain";
import { searchLawDocuments } from "../vector/vectorstore";

export const retrieveLawDocuments = async ({ query }: { query: string }) => {
  const results = await searchLawDocuments(query);
  const formatted = results.map((r: any) => r.pageContent).join("\n\n");
  console.log(formatted);
  return formatted;
};

export const RetrieveLawDocumentsTool = tool(retrieveLawDocuments, {
  name: "retrieve_law_documents",
  description:
    "Use this tool to retrieve relevant law documents like constitutional articles based on a query. Make sure to use queries specific to legal domains. Not for general questions as they are actual law documents and uses legal jargon.",
  schema: z.object({
    query: z.string().describe("The search query for retrieving law documents"),
  }),
});
