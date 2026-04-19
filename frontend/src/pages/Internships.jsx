import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Internships = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access");
  const apiBase = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")
    : "";

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [userRole, setUserRole] = useState("");
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [coverLetters, setCoverLetters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);

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

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const internshipsRes = await fetch(`${apiBase}/api/law/internships/`);
      const internshipsJson = await internshipsRes.json().catch(() => []);

      if (!internshipsRes.ok) {
        throw new Error("Unable to load internships.");
      }

      setInternships(Array.isArray(internshipsJson) ? internshipsJson : []);

      if (!accessToken) {
        setUserRole("");
        setApplications([]);
        return;
      }

      const userRes = await authFetch("/api/user/user-detail/");
      const userJson = await userRes.json().catch(() => ({}));

      if (userRes.ok) {
        setUserRole(userJson?.role || "");
      } else {
        setUserRole("");
      }

      if ((userJson?.role || "") === "STUDENT") {
        const applicationsRes = await authFetch(
          "/api/law/student/applications/",
        );
        const applicationsJson = await applicationsRes.json().catch(() => []);
        setApplications(
          Array.isArray(applicationsJson) ? applicationsJson : [],
        );
      } else {
        setApplications([]);
      }
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load internships.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, apiBase, authFetch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredInternships = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return internships.filter((item) => {
      const searchable = [
        item?.title || "",
        item?.description || "",
        item?.location || "",
        item?.required_skills || "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchable.includes(query);
      const matchesRemote = !remoteOnly || Boolean(item?.is_remote);
      return matchesSearch && matchesRemote;
    });
  }, [internships, remoteOnly, searchQuery]);

  const appliedInternshipIds = useMemo(
    () => new Set(applications.map((item) => item.internship)),
    [applications],
  );

  const applyToInternship = async (internshipId) => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

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
      loadData();
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
            Internships
          </h1>
          <p className="mt-1 text-sm text-stone-600 sm:text-base">
            Discover openings and apply as a student.
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

        {userRole === "LAWYER" && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-100/70 px-4 py-3 text-sm text-amber-900">
            Internship creation is available in the Lawyer Dashboard.
          </div>
        )}

        <section className="mt-5 rounded-3xl border border-amber-200/70 bg-[#fff8ec] p-5">
          <h2 className="text-xl font-black text-stone-900">All Internships</h2>

          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-3 py-2.5">
              <Search size={15} className="text-stone-500" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by title, location, skills"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>

            <label className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(event) => setRemoteOnly(event.target.checked)}
              />
              Remote only
            </label>
          </div>

          {isLoading ? (
            <div className="mt-4 rounded-2xl border border-amber-200/80 bg-[#fff8ec] px-4 py-5 text-sm text-stone-600">
              Loading internships...
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {filteredInternships.length === 0 && (
                <p className="text-sm text-stone-600">No internships found.</p>
              )}

              {filteredInternships.map((item) => {
                const isApplied = appliedInternshipIds.has(item.id);
                const isExpired = item.deadline
                  ? new Date(item.deadline) < new Date()
                  : false;

                return (
                  <article
                    key={item.id}
                    className="rounded-xl border border-amber-200 bg-amber-50/70 p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-stone-900">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {item.is_remote && (
                          <span className="rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900">
                            Remote
                          </span>
                        )}
                        {isExpired && (
                          <span className="rounded-full border border-rose-300 bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
                            Expired
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="mt-1 text-xs text-stone-600">
                      {item.description}
                    </p>
                    <p className="mt-1 text-xs text-stone-700">
                      Location: {item.location} | Stipend: {item.stipend} |
                      Duration: {item.duration}
                    </p>
                    <p className="mt-1 text-xs text-stone-700">
                      Skills: {item.required_skills}
                    </p>

                    <p className="mt-1 text-[11px] font-semibold text-stone-500">
                      Deadline:{" "}
                      {item.deadline
                        ? new Date(item.deadline).toLocaleString()
                        : "Not specified"}
                    </p>

                    {userRole === "STUDENT" && (
                      <div className="mt-2">
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
                          className="w-full rounded-lg border border-amber-200 bg-white px-2.5 py-2 text-xs text-stone-800"
                          disabled={isApplied || isExpired}
                        />

                        <button
                          type="button"
                          disabled={isApplied || isExpired}
                          onClick={() => applyToInternship(item.id)}
                          className="mt-2 inline-flex items-center gap-1 rounded-lg bg-linear-to-r from-amber-400 to-orange-500 px-3 py-1.5 text-xs font-semibold text-amber-50 disabled:opacity-60"
                        >
                          <Send size={13} />
                          {isApplied
                            ? "Applied"
                            : isExpired
                              ? "Expired"
                              : "Apply"}
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default Internships;
