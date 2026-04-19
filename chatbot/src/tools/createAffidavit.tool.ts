import * as z from "zod";
import { tool } from "langchain";

type AffidavitInput = {
  courtName?: string; // optional (for court affidavits)
  title: string; // e.g. "Affidavit of Evidence"
  date: string;
  place: string;

  deponentName: string;
  fatherOrSpouseName: string;
  age: string;
  address: string;

  statements: string[]; // numbered facts

  verificationDate: string;
  verificationPlace: string;
};

function generateAffidavitHTML(data: AffidavitInput): string {
  const statementsHTML = data.statements
    .map((s, i) => `<p>${i + 1}. ${s}</p>`)
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: "Times New Roman", serif;
      line-height: 1.7;
      margin: 50px;
    }
    h1, h2 {
      text-align: center;
      text-decoration: underline;
    }
    .section {
      margin-top: 20px;
    }
    .signature {
      margin-top: 80px;
      text-align: right;
    }
  </style>
</head>

<body>

  ${
    data.courtName
      ? `<h2>IN THE COURT OF ${data.courtName.toUpperCase()}</h2>`
      : ""
  }

  <h1>${data.title.toUpperCase()}</h1>

  <div class="section">
    <p>
      I, <strong>${data.deponentName}</strong>, 
      ${data.fatherOrSpouseName ? `S/o / D/o / W/o ${data.fatherOrSpouseName},` : ""}
      aged about ${data.age} years, 
      residing at ${data.address}, 
      do hereby solemnly affirm and state as follows:
    </p>
  </div>

  <div class="section">
    ${statementsHTML}
  </div>

  <div class="section">
    <p>
      That the contents of the above paragraphs are true and correct to my knowledge 
      and belief, and nothing material has been concealed therefrom.
    </p>
  </div>

  <div class="section">
    <h2>VERIFICATION</h2>
    <p>
      Verified at ${data.verificationPlace} on this ${data.verificationDate}, 
      that the contents of this affidavit are true and correct to my knowledge 
      and belief and nothing material has been concealed.
    </p>
  </div>

  <div class="signature">
    <p>DEPONENT</p>
  </div>

</body>
</html>
`;
}

const affidavitSchema = z.object({
  courtName: z.string().optional().describe("Name of the court (if applicable)"),
  title: z.string().describe("Title of the affidavit"),

  date: z.string().describe("Date of affidavit"),
  place: z.string().describe("Place where affidavit is executed"),

  deponentName: z.string(),
  fatherOrSpouseName: z.string(),
  age: z.string(),
  address: z.string(),

  statements: z.array(z.string()).describe("Numbered statements of facts"),

  verificationDate: z.string(),
  verificationPlace: z.string(),
});

export const createAffidavit = async (data: AffidavitInput) => {
  return generateAffidavitHTML(data);
};

export const CreateAffidavitTool = tool(createAffidavit, {
  name: "create_affidavit",
  description:
    "Generate a formal affidavit (India format) in HTML. Output must be only HTML with no extra text.",
  schema: affidavitSchema,
});