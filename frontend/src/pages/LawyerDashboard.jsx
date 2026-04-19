import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarClock,
  FileSpreadsheet,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LawyerDashboard = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access");
  const apiBase = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")
    : "";

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [statusDrafts, setStatusDrafts] = useState({});
  const [feedback, setFeedback] = useState("");
  const [internshipForm, setInternshipForm] = useState({
    title: "",
    description: "",
    stipend: "",
    duration: "",
    location: "",
    is_remote: false,
    required_skills: "",
    deadline: "",
  });

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
      const [userRes, appointmentsRes, internshipsRes, applicationsRes] =
        await Promise.all([
          authFetch("/api/user/user-detail/"),
          authFetch("/api/client/lawyer-appointments/"),
          authFetch("/api/law/internships/"),
          authFetch("/api/law/lawyer/applications/"),
        ]);

      const [userJson, appointmentsJson, internshipsJson, applicationsJson] =
        await Promise.all([
          userRes.json().catch(() => ({})),
          appointmentsRes.json().catch(() => []),
          internshipsRes.json().catch(() => []),
          applicationsRes.json().catch(() => []),
        ]);

      if (!userRes.ok) {
        throw new Error(userJson?.detail || "Unable to load dashboard");
      }

      setUserData(userJson);
      setAppointments(Array.isArray(appointmentsJson) ? appointmentsJson : []);
      setInternships(Array.isArray(internshipsJson) ? internshipsJson : []);
      setApplications(Array.isArray(applicationsJson) ? applicationsJson : []);

      const draftMap = {};
      (Array.isArray(appointmentsJson) ? appointmentsJson : []).forEach(
        (item) => {
          draftMap[item.id] = item.status || "SCHEDULED";
        },
      );
      setStatusDrafts(draftMap);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load dashboard",
      );
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, authFetch, navigate]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const lawyerProfileId = userData?.profile?.id;
  const myInternships = useMemo(() => {
    return internships.filter(
      (item) =>
        item?.lawyer === lawyerProfileId ||
        item?.lawyer?.id === lawyerProfileId,
    );
  }, [internships, lawyerProfileId]);

  const stats = useMemo(
    () => ({
      appointments: appointments.length,
      internships: myInternships.length,
      applications: applications.length,
    }),
    [appointments.length, applications.length, myInternships.length],
  );

  const updateAppointmentStatus = async (appointmentId) => {
    const nextStatus = statusDrafts[appointmentId] || "SCHEDULED";

    try {
      const response = await authFetch(
        `/api/client/update-status/${appointmentId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: nextStatus }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.detail || "Unable to update status");
      }

      setFeedback("Appointment status updated.");
      loadDashboard();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update status",
      );
    }
  };

  const createInternship = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setFeedback("");

      const response = await authFetch("/api/law/internship/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...internshipForm,
          stipend: Number(internshipForm.stipend || 0),
          deadline: internshipForm.deadline
            ? new Date(internshipForm.deadline).toISOString()
            : null,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const detail =
          typeof data?.detail === "string"
            ? data.detail
            : Array.isArray(data?.non_field_errors)
              ? data.non_field_errors[0]
              : "Unable to create internship";
        throw new Error(detail);
      }

      setFeedback("Internship created successfully.");
      setInternshipForm({
        title: "",
        description: "",
        stipend: "",
        duration: "",
        location: "",
        is_remote: false,
        required_skills: "",
        deadline: "",
      });
      loadDashboard();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Unable to create internship",
      );
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const response = await authFetch(
        `/api/law/application/update/${applicationId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.detail || "Unable to update application");
      }

      setFeedback(`Application marked as ${status}.`);
      loadDashboard();
    } catch (appError) {
      setError(
        appError instanceof Error
          ? appError.message
          : "Unable to update application",
      );
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f2e8] px-4 pb-16 pt-28 text-stone-900 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(251,191,36,0.16),transparent_33%),radial-gradient(circle_at_84%_18%,rgba(251,146,60,0.12),transparent_28%),radial-gradient(circle_at_52%_86%,rgba(245,222,179,0.36),transparent_42%)]" />

      <section className="law-panel relative z-10 mx-auto max-w-7xl rounded-4xl border border-amber-200/70 bg-amber-50/90 p-5 shadow-[0_22px_50px_rgba(120,53,15,0.14)] sm:p-7 lg:p-9">
        <div className="border-b border-amber-200/80 pb-4">
          <h1 className="text-3xl font-black text-stone-900 sm:text-4xl">
            Lawyer Dashboard
          </h1>
          <p className="mt-1 text-sm text-stone-600 sm:text-base">
            Manage appointments, internships, and applications in one place.
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
          <div className="mt-6 space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <article className="rounded-2xl border border-amber-200/70 bg-[#fff8ec] p-4">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  <CalendarClock size={14} />
                  Appointments
                </p>
                <p className="mt-2 text-3xl font-black text-stone-900">
                  {stats.appointments}
                </p>
              </article>
              <article className="rounded-2xl border border-amber-200/70 bg-[#fff8ec] p-4">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  <BriefcaseBusiness size={14} />
                  Internships
                </p>
                <p className="mt-2 text-3xl font-black text-stone-900">
                  {stats.internships}
                </p>
              </article>
              <article className="rounded-2xl border border-amber-200/70 bg-[#fff8ec] p-4">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  <FileSpreadsheet size={14} />
                  Applications
                </p>
                <p className="mt-2 text-3xl font-black text-stone-900">
                  {stats.applications}
                </p>
              </article>
            </div>

            <section className="rounded-3xl border border-amber-200/70 bg-[#fff8ec] p-5">
              <h2 className="text-xl font-black text-stone-900">
                Appointment Management
              </h2>
              <div className="mt-3 space-y-2">
                {appointments.length === 0 && (
                  <p className="text-sm text-stone-600">No appointments yet.</p>
                )}
                {appointments.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2"
                  >
                    <p className="text-sm text-stone-800">
                      #{item.id} | Lawyer: {item.lawyer} | Client: {item.client}{" "}
                      | {item.date} {item.time_slot}
                    </p>
                    <select
                      value={statusDrafts[item.id] || "SCHEDULED"}
                      onChange={(event) =>
                        setStatusDrafts((current) => ({
                          ...current,
                          [item.id]: event.target.value,
                        }))
                      }
                      className="rounded-lg border border-amber-200 bg-white px-2 py-1 text-xs"
                    >
                      <option value="SCHEDULED">SCHEDULED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => updateAppointmentStatus(item.id)}
                      className="rounded-lg bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white"
                    >
                      Update
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-amber-200/70 bg-[#fff8ec] p-5">
              <h2 className="text-xl font-black text-stone-900">
                Internship Creation
              </h2>
              <form
                onSubmit={createInternship}
                className="mt-3 grid gap-3 sm:grid-cols-2"
              >
                <input
                  value={internshipForm.title}
                  onChange={(event) =>
                    setInternshipForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Title"
                  className="rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2.5 text-sm"
                  required
                />
                <input
                  value={internshipForm.location}
                  onChange={(event) =>
                    setInternshipForm((current) => ({
                      ...current,
                      location: event.target.value,
                    }))
                  }
                  placeholder="Location"
                  className="rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2.5 text-sm"
                  required
                />
                <input
                  value={internshipForm.duration}
                  onChange={(event) =>
                    setInternshipForm((current) => ({
                      ...current,
                      duration: event.target.value,
                    }))
                  }
                  placeholder="Duration"
                  className="rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2.5 text-sm"
                  required
                />
                <input
                  type="number"
                  value={internshipForm.stipend}
                  onChange={(event) =>
                    setInternshipForm((current) => ({
                      ...current,
                      stipend: event.target.value,
                    }))
                  }
                  placeholder="Stipend"
                  className="rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2.5 text-sm"
                  required
                />
                <input
                  type="datetime-local"
                  value={internshipForm.deadline}
                  onChange={(event) =>
                    setInternshipForm((current) => ({
                      ...current,
                      deadline: event.target.value,
                    }))
                  }
                  className="rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2.5 text-sm"
                  required
                />
                <label className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={internshipForm.is_remote}
                    onChange={(event) =>
                      setInternshipForm((current) => ({
                        ...current,
                        is_remote: event.target.checked,
                      }))
                    }
                  />
                  Remote Internship
                </label>
                <textarea
                  value={internshipForm.description}
                  onChange={(event) =>
                    setInternshipForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Description"
                  rows={3}
                  className="sm:col-span-2 rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2.5 text-sm"
                  required
                />
                <textarea
                  value={internshipForm.required_skills}
                  onChange={(event) =>
                    setInternshipForm((current) => ({
                      ...current,
                      required_skills: event.target.value,
                    }))
                  }
                  placeholder="Required skills"
                  rows={3}
                  className="sm:col-span-2 rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2.5 text-sm"
                  required
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-semibold text-amber-50"
                >
                  <Save size={15} />
                  Create Internship
                </button>
              </form>

              <div className="mt-4 space-y-2">
                {myInternships.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2 text-sm text-stone-800"
                  >
                    #{item.id} {item.title} | {item.location} | stipend:{" "}
                    {item.stipend}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-amber-200/70 bg-[#fff8ec] p-5">
              <h2 className="text-xl font-black text-stone-900">
                Student Applications
              </h2>
              <div className="mt-3 space-y-2">
                {applications.length === 0 && (
                  <p className="text-sm text-stone-600">
                    No applications received yet.
                  </p>
                )}
                {applications.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2"
                  >
                    <p className="text-sm text-stone-800">
                      App #{item.id} | Internship #{item.internship} | Student #
                      {item.student} | Status: {item.status}
                    </p>
                    <p className="mt-1 text-xs text-stone-600">
                      {item.cover_letter}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateApplicationStatus(item.id, "ACCEPTED")
                        }
                        className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateApplicationStatus(item.id, "REJECTED")
                        }
                        className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
};

export default LawyerDashboard;
