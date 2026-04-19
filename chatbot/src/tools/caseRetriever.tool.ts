import * as z from "zod";
import { tool } from "langchain";
import { searchCaseDocuments } from "../vector/vectorstore";

export const retrieveCaseFiles = async ({ query }: { query: string }) => {
  const results = await searchCaseDocuments(query);
  const formatted = results.map((r: any) => r.pageContent).join("\n\n");
  console.log(formatted);
  return formatted;
};

export const RetrieveCaseFilesTool = tool(retrieveCaseFiles, {
  name: "retrieve_case_files",
  description:
    "Use this tool to retrieve relevant case files based on a query. Make sure to use queries specific to legal domains. Not for general questions as they are actual case files and uses legal jargon.",
  schema: z.object({
    query: z.string().describe("The search query for retrieving case files"),
  }),
});
