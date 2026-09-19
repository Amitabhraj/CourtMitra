import * as z from "zod";
import { tool } from "langchain";

type LawyerApiRecord = {
  id: number;
  user?: {
    username?: string;
    email?: string;
  };
  mobile?: string;
  specialization_details?: string[];
  experience_years?: number;
  address?: string;
  working_place?: string;
  about?: string;
  status?: string;
};

type RankedLawyer = {
  id: number;
  name: string;
  mobile: string;
  score: number;
  experienceYears: number;
  specializations: string[];
  workingPlace: string;
  about: string;
  reasons: string[];
};

const recommendationSchema = z.object({
  query: z
    .string()
    .min(3)
    .describe("User legal issue or requirement used to rank lawyers"),
  topK: z
    .number()
    .int()
    .min(1)
    .max(10)
    .default(3)
    .describe("How many recommendations to return"),
});

const tokenize = (value: string): string[] => {
  const stopWords = new Set([
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "for",
    "from",
    "i",
    "in",
    "is",
    "it",
    "me",
    "my",
    "of",
    "on",
    "or",
    "that",
    "the",
    "to",
    "with",
    "want",
    "need",
    "looking",
    "lawyer",
    "help",
  ]);

  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !stopWords.has(token));
};

const scoreLawyer = (lawyer: LawyerApiRecord, query: string): RankedLawyer => {
  const queryTokens = tokenize(query);
  const aboutText = lawyer.about ?? "";
  const placeText = `${lawyer.working_place ?? ""} ${lawyer.address ?? ""}`;
  const specializations = lawyer.specialization_details ?? [];

  const specializationCorpus = specializations.join(" ").toLowerCase();
  const aboutCorpus = aboutText.toLowerCase();
  const placeCorpus = placeText.toLowerCase();

  let score = 0;
  const reasons: string[] = [];

  for (const token of queryTokens) {
    if (specializationCorpus.includes(token)) {
      score += 14;
      reasons.push(`Matches specialization for \"${token}\"`);
      continue;
    }

    if (aboutCorpus.includes(token)) {
      score += 8;
      reasons.push(`Profile summary is relevant to \"${token}\"`);
      continue;
    }

    if (placeCorpus.includes(token)) {
      score += 5;
      reasons.push(`Location/place is relevant to \"${token}\"`);
    }
  }

  const experienceYears = Math.max(0, Number(lawyer.experience_years ?? 0));
  score += Math.min(experienceYears, 20);

  if (experienceYears >= 8) {
    reasons.push(`Strong experience: ${experienceYears} years`);
  }

  if (specializations.length > 0) {
    score += Math.min(specializations.length * 2, 8);
  }

  return {
    id: lawyer.id,
    name: lawyer.user?.username ?? "",
    mobile: lawyer.mobile ?? "",
    score,
    experienceYears,
    specializations,
    workingPlace: lawyer.working_place ?? lawyer.address ?? "Not specified",
    about: aboutText,
    reasons: Array.from(new Set(reasons)).slice(0, 4),
  };
};

const fetchLawyers = async (): Promise<LawyerApiRecord[]> => {
  const rawBaseUrl =
    process.env.LEGAL_BACKEND_BASE_URL ?? process.env.BACKEND_BASE_URL;
  const baseUrl = (rawBaseUrl ?? "http://127.0.0.1:8000").replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/api/law/lawyers/`, {
    signal: AbortSignal.timeout(4000),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch lawyers from backend (${response.status} ${response.statusText})`,
    );
  }

  const json = await response.json();
  if (!Array.isArray(json)) {
    throw new Error("Unexpected response shape while fetching lawyers");
  }

  return json;
};

export const recommendLawyer = async ({
  query,
  topK,
}: {
  query: string;
  topK: number;
}) => {
  let allLawyers: LawyerApiRecord[] = [];
  try {
    allLawyers = await fetchLawyers();
  } catch (error) {
    console.warn("fetchLawyers warning:", (error as Error).message);
    return JSON.stringify(
      {
        query,
        message: "Lawyer data is currently unavailable from the backend service.",
        recommendations: [],
      },
      null,
      2,
    );
  }

  const lawyers = allLawyers.filter((lawyer) => {
    const isActive = (lawyer.status ?? "").toUpperCase() === "ACTIVE";
    const hasName = Boolean(lawyer.user?.username?.trim());
    const hasMobile = Boolean(lawyer.mobile?.trim());
    return isActive && hasName && hasMobile;
  });

  if (lawyers.length === 0) {
    return JSON.stringify(
      {
        query,
        message: "No active lawyers found in backend.",
        recommendations: [],
      },
      null,
      2,
    );
  }

  const ranked = lawyers
    .map((lawyer) => scoreLawyer(lawyer, query))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((lawyer) => ({
      id: lawyer.id,
      name: lawyer.name,
      mobile: lawyer.mobile,
      score: lawyer.score,
      experienceYears: lawyer.experienceYears,
      specializations: lawyer.specializations,
      workingPlace: lawyer.workingPlace,
      about: lawyer.about,
      reasons:
        lawyer.reasons.length > 0
          ? lawyer.reasons
          : ["Selected because of overall profile strength"],
    }));

  return JSON.stringify(
    {
      query,
      totalLawyersScanned: lawyers.length,
      recommendations: ranked,
    },
    null,
    2,
  );
};

export const RecommendLawyerTool = tool(recommendLawyer, {
  name: "recommend_lawyer",
  description:
    "Fetch only backend-registered active lawyers and recommend best matches. Return exact backend username and mobile number for each recommendation. Never invent names or phone numbers.",
  schema: recommendationSchema,
});
