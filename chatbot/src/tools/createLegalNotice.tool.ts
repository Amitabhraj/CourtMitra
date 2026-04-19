import * as z from "zod";
import { tool } from "langchain";

type LegalNoticeInput = {
  date: string;
  lawyerName: string;
  lawyerAddress: string;

  clientName: string;
  clientAddress: string;

  recipientName: string;
  recipientAddress: string;

  subject: string;

  facts: string[]; // key facts (numbered)
  legalBasis?: string[]; // optional legal grounds
  demand: string; // what client wants
  deadlineDays: number; // e.g. 15 days

  courtJurisdiction: string;
};

function generateLegalNoticeHTML(data: LegalNoticeInput): string {
  const factsHTML = data.facts
    .map((fact, i) => `<p>${i + 1}. ${fact}</p>`)
    .join("");

  const legalBasisHTML = data.legalBasis?.length
    ? `
      <p><strong>Legal Grounds:</strong></p>
      ${data.legalBasis.map((l, i) => `<p>${i + 1}. ${l}</p>`).join("")}
    `
    : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: "Times New Roman", serif;
      line-height: 1.6;
      margin: 40px;
    }
    h1 {
      text-align: center;
      text-decoration: underline;
    }
    .section {
      margin-top: 20px;
    }
    .signature {
      margin-top: 50px;
    }
  </style>
</head>

<body>

  <p><strong>Date:</strong> ${data.date}</p>

  <div class="section">
    <p><strong>From:</strong><br/>
    ${data.lawyerName}<br/>
    ${data.lawyerAddress}</p>
  </div>

  <div class="section">
    <p><strong>To:</strong><br/>
    ${data.recipientName}<br/>
    ${data.recipientAddress}</p>
  </div>

  <h1>LEGAL NOTICE</h1>

  <div class="section">
    <p><strong>Subject:</strong> ${data.subject}</p>
  </div>

  <div class="section">
    <p>Sir/Madam,</p>
    <p>
      Under instructions from my client <strong>${data.clientName}</strong>,
      residing at ${data.clientAddress}, I hereby serve you with the following notice:
    </p>
  </div>

  <div class="section">
    ${factsHTML}
  </div>

  ${legalBasisHTML}

  <div class="section">
    <p>
      Therefore, you are hereby called upon to
      <strong>${data.demand}</strong> within a period of
      <strong>${data.deadlineDays} days</strong> from the receipt of this notice.
    </p>

    <p>
      Failing which, my client shall be constrained to initiate appropriate
      legal proceedings against you before the competent court at
      <strong>${data.courtJurisdiction}</strong>, at your risk as to cost and consequences.
    </p>
  </div>

  <div class="signature">
    <p>Regards,</p>
    <p><strong>${data.lawyerName}</strong></p>
  </div>

</body>
</html>
`;
}

const legalNoticeSchema = z.object({
  date: z.string().describe("Date of the notice"),
  lawyerName: z.string().describe("Name of the lawyer sending the notice"),
  lawyerAddress: z.string().describe("Address of the lawyer"),

  clientName: z.string().describe("Name of the client on whose behalf the notice is sent"),
  clientAddress: z.string().describe("Address of the client"),

  recipientName: z.string().describe("Name of the recipient of the notice"),
  recipientAddress: z.string().describe("Address of the recipient"),

  subject: z.string().describe("Subject of the legal notice"),

  facts: z.array(z.string()).describe("Key facts of the case (numbered)"),
  legalBasis: z.array(z.string()).optional().describe("Optional legal grounds for the claim"),
  demand: z.string().describe("What the client wants from the recipient"),
  deadlineDays: z.number().describe("Deadline in days for compliance with the demand"),

  courtJurisdiction: z.string().describe("Jurisdiction of the court where proceedings will be initiated if demand is not met"),
});

export const createLegalNotice = async (data: LegalNoticeInput) => {
  return generateLegalNoticeHTML(data);
};

export const CreateLegalNoticeTool = tool(createLegalNotice, {
  name: "create_legal_notice",
  description:
    "Use this tool to generate a formal legal notice in HTML format based on the provided details. The input should include all necessary information about the case, parties involved, and the demand being made. The output should only be the HTML content of the legal notice, without any additional text or explanations. no \\n",
  schema: legalNoticeSchema,
}); 