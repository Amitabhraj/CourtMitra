import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpenText,
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  FileText,
  Gavel,
  Newspaper,
  PlayCircle,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const hubSections = [
  {
    title: "Law Book Library",
    description: "Core legal textbooks in PDF format for quick revision.",
    icon: BookOpenText,
    items: [
      {
        name: "Constitutional Law Compendium",
        href: "https://cdnbbsr.s3waas.gov.in/s380537a945c7aaa788ccfcdf1b99b5d8f/uploads/2024/07/20240716890312078.pdf",
      },
      {
        name: "Indian Penal Code Handbook",
        href: "https://www.paralympic.org/sites/default/files/2020-03/Paralympic%20Games%20Principles%202020.pdf",
      },
      {
        name: "Law of Torts Reference",
        href: "https://msrlawbooks.in/file/LAW_OF_TORTS%20_F.pdf",
      },
    ],
  },
  {
    title: "Demo Case Files",
    description: "Practice-ready case files to build drafting and analysis skills.",
    icon: Gavel,
    items: [
      {
        name: "Civil Dispute Demo File",
        href: "https://example.com/case-files/civil-dispute-demo.pdf",
      },
      {
        name: "Criminal Appeal Demo File",
        href: "https://example.com/case-files/criminal-appeal-demo.pdf",
      },
      {
        name: "Writ Petition Demo File",
        href: "https://example.com/case-files/writ-petition-demo.pdf",
      },
    ],
  },
  {
    title: "Supreme Court Calendar",
    description: "Important hearings, vacations, and procedural timelines.",
    icon: CalendarDays,
    items: [
      {
        name: "Supreme Court Annual Calendar (PDF)",
        href: "https://cdnbbsr.s3waas.gov.in/s3ec0490f1f4972d133619a60c30f3559e/uploads/2025/08/2025082877.pdf",
      },
    ],
  },
  {
    title: "Internship Opportunities",
    description: "Direct links to Supreme Court and legal internship pages.",
    icon: BriefcaseBusiness,
    items: [
      {
        name: "Supreme Court Internship Portal",
        href: "https://cdnbbsr.s3waas.gov.in/s3ec0490f1f4972d133619a60c30f3559e/uploads/2025/08/2025082877.pdf",
      },
      {
        name: "Law Clerk Program Notifications",
        href: "https://www.sci.gov.in/judicial-clerkship/",
      },
    ],
  },
  {
    title: "Media & References",
    description: "Curated legal explainers, hearings, and reference channels.",
    icon: PlayCircle,
    items: [
      {
        name: "Supreme Court YouTube Channel",
        href: "https://www.youtube.com/@SupremeCourtofIndia-1950",
      },
      {
        name: "Bar and Bench Updates",
        href: "https://www.barandbench.com/",
      },
      {
        name: "Live Law Reports",
        href: "https://www.livelaw.in/",
      },
    ],
  },
];

const StudentDashboard = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access");
  const apiBase = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")
    : "";

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [coverLetters, setCoverLetters] = useState({});

  const authFetch = useCallback(
    (url, options = {}) => {
      return fetch(`${apiBase}${url}`, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
    [accessToken, apiBase],
  );

  const loadDashboard = useCallback(async () => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const [internshipsRes, applicationsRes] = await Promise.all([
        authFetch("/api/law/internships/"),
        authFetch("/api/law/student/applications/"),
      ]);

      const [internshipsJson, applicationsJson] = await Promise.all([
        internshipsRes.json().catch(() => []),
        applicationsRes.json().catch(() => []),
      ]);

      if (!internshipsRes.ok || !applicationsRes.ok) {
        throw new Error("Unable to load student dashboard.");
      }

      setInternships(Array.isArray(internshipsJson) ? internshipsJson : []);
      setApplications(Array.isArray(applicationsJson) ? applicationsJson : []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load student dashboard.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, authFetch, navigate]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const appliedInternshipIds = useMemo(
    () => new Set(applications.map((item) => item.internship)),
    [applications],
  );

  const applyToInternship = async (internshipId) => {
    const coverLetter = (coverLetters[internshipId] || "").trim();

    if (!coverLetter) {
      setError("Please add a cover letter before applying.");
      return;
    }

    try {
      setError("");
      setFeedback("");

      const response = await authFetch("/api/law/apply/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          internship: internshipId,
          cover_letter: coverLetter,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const detail =
          typeof data?.detail === "string"
            ? data.detail
            : Array.isArray(data?.non_field_errors)
              ? data.non_field_errors[0]
              : Array.isArray(data?.internship)
                ? data.internship[0]
                : "Unable to apply for internship";
        throw new Error(detail);
      }

      setFeedback(`Applied to internship #${internshipId} successfully.`);
      setCoverLetters((current) => ({ ...current, [internshipId]: "" }));
      loadDashboard();
    } catch (applyError) {
      setError(
        applyError instanceof Error
          ? applyError.message
          : "Unable to apply for internship",
      );
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f2e8] px-4 pb-16 pt-28 text-stone-900 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(251,191,36,0.16),transparent_33%),radial-gradient(circle_at_84%_18%,rgba(251,146,60,0.12),transparent_28%),radial-gradient(circle_at_52%_86%,rgba(245,222,179,0.36),transparent_42%)]" />

      <section className="law-panel relative z-10 mx-auto max-w-7xl rounded-4xl border border-amber-200/70 bg-amber-50/90 p-5 shadow-[0_22px_50px_rgba(120,53,15,0.14)] sm:p-7 lg:p-9">
        <div className="border-b border-amber-200/80 pb-4">
          <h1 className="text-3xl font-black text-stone-900 sm:text-4xl">
            Student Dashboard
          </h1>
          <p className="mt-1 text-sm text-stone-600 sm:text-base">
            Discover internships and track all your applications.
          </p>
        </div>

        {feedback && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {feedback}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="mt-5 rounded-2xl border border-amber-200/80 bg-[#fff8ec] px-4 py-5 text-sm text-stone-600">
            Loading dashboard...
          </div>
        ) : (
          <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-3xl border border-amber-200/70 bg-[#fff8ec] p-5">
              <h2 className="inline-flex items-center gap-2 text-xl font-black text-stone-900">
                <BriefcaseBusiness size={18} className="text-amber-700" />
                Available Internships
              </h2>
              <div className="mt-3 space-y-3">
                {internships.length === 0 && (
                  <p className="text-sm text-stone-600">
                    No internships available currently.
                  </p>
                )}
                {internships.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-xl border border-amber-200 bg-amber-50/70 p-3"
                  >
                    <h3 className="text-sm font-bold text-stone-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-stone-600">
                      {item.description}
                    </p>
                    <p className="mt-1 text-xs text-stone-700">
                      Location: {item.location} | Stipend: {item.stipend} |
                      Duration: {item.duration}
                    </p>
                    <textarea
                      rows={2}
                      value={coverLetters[item.id] || ""}
                      onChange={(event) =>
                        setCoverLetters((current) => ({
                          ...current,
                          [item.id]: event.target.value,
                        }))
                      }
                      placeholder="Write a short cover letter"
                      className="mt-2 w-full rounded-lg border border-amber-200 bg-white px-2.5 py-2 text-xs text-stone-800"
                    />
                    <button
                      type="button"
                      disabled={appliedInternshipIds.has(item.id)}
                      onClick={() => applyToInternship(item.id)}
                      className="mt-2 inline-flex items-center gap-1 rounded-lg bg-linear-to-r from-amber-400 to-orange-500 px-3 py-1.5 text-xs font-semibold text-amber-50 disabled:opacity-60"
                    >
                      <Send size={13} />
                      {appliedInternshipIds.has(item.id) ? "Applied" : "Apply"}
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-amber-200/70 bg-[#fff8ec] p-5">
              <h2 className="inline-flex items-center gap-2 text-xl font-black text-stone-900">
                <FileText size={18} className="text-amber-700" />
                My Applications
              </h2>
              <div className="mt-3 space-y-2">
                {applications.length === 0 && (
                  <p className="text-sm text-stone-600">
                    You have not applied to any internship yet.
                  </p>
                )}
                {applications.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2"
                  >
                    <p className="text-sm font-semibold text-stone-900">
                      Application #{item.id}
                    </p>
                    <p className="text-xs text-stone-700">
                      Internship #{item.internship} | Status: {item.status}
                    </p>
                    <p className="mt-1 text-xs text-stone-600">
                      {item.cover_letter}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}
      </section>

      <section className="relative z-10 mx-auto mt-8 max-w-7xl rounded-4xl border border-amber-200/70 bg-linear-to-br from-amber-50 via-[#fff9ef] to-orange-50 p-5 shadow-[0_22px_46px_rgba(120,53,15,0.1)] sm:p-7 lg:p-9">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-amber-200/80 pb-4">
          <div>
            <h2 className="text-2xl font-black text-stone-900 sm:text-3xl">
              Student Digital Hub
            </h2>
            <p className="mt-1 text-sm text-stone-600 sm:text-base">
              A central library for legal reading, case practice, and career
              resources.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
            <Newspaper size={14} />
            Updated Resources
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {hubSections.map((section) => {
            const SectionIcon = section.icon;

            return (
              <article
                key={section.title}
                className="group rounded-2xl border border-amber-200/80 bg-white/75 p-4 shadow-[0_10px_24px_rgba(120,53,15,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(120,53,15,0.14)]"
              >
                <div className="inline-flex items-center gap-2 text-stone-900">
                  <SectionIcon size={17} className="text-amber-700" />
                  <h3 className="text-base font-black">{section.title}</h3>
                </div>
                <p className="mt-2 text-xs text-stone-600">{section.description}</p>

                <div className="mt-3 space-y-2">
                  {section.items.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-2 text-xs font-medium text-stone-700 transition-colors hover:border-amber-300 hover:bg-amber-100"
                    >
                      <span>{item.name}</span>
                      <ExternalLink size={14} className="shrink-0 text-amber-700" />
                    </a>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

      </section>
    </main>
  );
};

export default StudentDashboard;