function buildDummyResponse(message) {
  const normalized = message.toLowerCase();

  if (normalized.includes("internship")) {
    return {
      response:
        "For internship matters, start by checking role expectations, stipend terms, and duration. I can also help you draft an application summary for a law internship.",
      references: ["Internship guidelines", "Offer letter checklist"],
    };
  }

  if (normalized.includes("notice") || normalized.includes("draft")) {
    return {
      response:
        "For drafting, share the document type and key facts. A safe structure is: party details, factual background, legal basis, demand/relief, and timeline.",
      references: ["Drafting structure", "Legal notice components"],
    };
  }

  if (
    normalized.includes("appointment") ||
    normalized.includes("consultation")
  ) {
    return {
      response:
        "Before booking a consultation, prepare a short issue brief: timeline, key documents, and your specific questions. This helps lawyers respond faster.",
      references: ["Consultation prep checklist"],
    };
  }

  return {
    response:
      "I can help with legal guidance, finding lawyers, document drafting structure, and internship-related questions. Tell me your situation in 2-3 lines.",
    references: ["Legal triage flow", "General guidance"],
  };
}

export async function sendLawbotMessage(message, history = []) {
  if (import.meta.env.VITE_CHATBOT) {
    try {
      const res = await fetch(`${import.meta.env.VITE_CHATBOT}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          history: history.slice(-1),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          response: data.response || "No response available.",
        };
      }
    } catch (_error) {
      // Falls back to dummy response when backend is unavailable.
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 700));
  return buildDummyResponse(message);
}
