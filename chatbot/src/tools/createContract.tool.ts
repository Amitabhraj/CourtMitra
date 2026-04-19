import * as z from "zod";
import { tool } from "langchain";

type ContractInput = {
  title: string;
  date: string;

  partyAName: string;
  partyAAddress: string;

  partyBName: string;
  partyBAddress: string;

  recitals?: string[]; // background context

  services?: string; // what is being agreed
  paymentTerms?: string;
  duration?: string;

  confidentiality?: boolean;
  termination?: string;
  disputeResolution?: string;

  governingLaw: string;

  additionalClauses?: string[];
};

function generateContractHTML(data: ContractInput): string {
  const recitalsHTML = data.recitals?.length
    ? `
    <div class="section">
      <p><strong>Recitals:</strong></p>
      ${data.recitals.map((r, i) => `<p>${String.fromCharCode(65 + i)}. ${r}</p>`).join("")}
    </div>
  `
    : "";

  const additionalClausesHTML = data.additionalClauses?.length
    ? `
    <div class="section">
      <p><strong>Additional Clauses:</strong></p>
      ${data.additionalClauses.map((c, i) => `<p>${i + 1}. ${c}</p>`).join("")}
    </div>
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
      margin-top: 60px;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>

<body>

  <h1>${data.title.toUpperCase()}</h1>

  <p><strong>Date:</strong> ${data.date}</p>

  <div class="section">
    <p>
      This Agreement is made between:
    </p>

    <p>
      <strong>${data.partyAName}</strong>, residing at ${data.partyAAddress}
      (hereinafter referred to as "Party A")
    </p>

    <p>
      AND
    </p>

    <p>
      <strong>${data.partyBName}</strong>, residing at ${data.partyBAddress}
      (hereinafter referred to as "Party B")
    </p>
  </div>

  ${recitalsHTML}

  ${
    data.services
      ? `
    <div class="section">
      <p><strong>Scope of Work:</strong></p>
      <p>${data.services}</p>
    </div>
  `
      : ""
  }

  ${
    data.paymentTerms
      ? `
    <div class="section">
      <p><strong>Payment Terms:</strong></p>
      <p>${data.paymentTerms}</p>
    </div>
  `
      : ""
  }

  ${
    data.duration
      ? `
    <div class="section">
      <p><strong>Duration:</strong></p>
      <p>${data.duration}</p>
    </div>
  `
      : ""
  }

  ${
    data.confidentiality
      ? `
    <div class="section">
      <p><strong>Confidentiality:</strong></p>
      <p>
        Both parties agree to maintain strict confidentiality regarding any
        proprietary or sensitive information shared during the term of this Agreement.
      </p>
    </div>
  `
      : ""
  }

  ${
    data.termination
      ? `
    <div class="section">
      <p><strong>Termination:</strong></p>
      <p>${data.termination}</p>
    </div>
  `
      : ""
  }

  ${
    data.disputeResolution
      ? `
    <div class="section">
      <p><strong>Dispute Resolution:</strong></p>
      <p>${data.disputeResolution}</p>
    </div>
  `
      : ""
  }

  <div class="section">
    <p><strong>Governing Law:</strong></p>
    <p>This Agreement shall be governed by the laws of ${data.governingLaw}.</p>
  </div>

  ${additionalClausesHTML}

  <div class="signature">
    <div>
      <p>_________________________</p>
      <p><strong>${data.partyAName}</strong></p>
    </div>

    <div>
      <p>_________________________</p>
      <p><strong>${data.partyBName}</strong></p>
    </div>
  </div>

</body>
</html>
`;
}

const contractSchema = z.object({
  title: z.string().describe("Title of the contract"),
  date: z.string().describe("Date of agreement"),

  partyAName: z.string(),
  partyAAddress: z.string(),

  partyBName: z.string(),
  partyBAddress: z.string(),

  recitals: z.array(z.string()).optional(),

  services: z.string().optional(),
  paymentTerms: z.string().optional(),
  duration: z.string().optional(),

  confidentiality: z.boolean().optional(),

  termination: z.string().optional(),
  disputeResolution: z.string().optional(),

  governingLaw: z.string(),

  additionalClauses: z.array(z.string()).optional(),
});

export const createContract = async (data: ContractInput) => {
  return generateContractHTML(data);
};

export const CreateContractTool = tool(createContract, {
  name: "create_contract",
  description:
    "Generate a formal legal contract in HTML format. The output must strictly be HTML with no extra text or newline characters.",
  schema: contractSchema,
});