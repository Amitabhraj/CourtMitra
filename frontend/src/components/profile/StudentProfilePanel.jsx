import React, { useEffect, useMemo, useState } from "react";
import { GraduationCap, Save } from "lucide-react";

const StudentProfilePanel = ({
  apiBase,
  accessToken,
  profile,
  onProfileUpdated,
}) => {
  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "idle", message: "" });
  const [form, setForm] = useState({
    college_name: "",
    course: "",
    year: "",
    skills: "",
    interested_fields: [],
    resume: null,
  });

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await fetch(
          `${apiBase}/api/user/get-all-specializations/`,
        );
        const data = await response.json().catch(() => []);
        const options = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];
        setSpecializationOptions(options);
      } catch (_error) {
        setSpecializationOptions([]);
      }
    };

    fetchSpecializations();
  }, [apiBase]);

  useEffect(() => {
    setForm({
      college_name: profile?.college_name || "",
      course: profile?.course || "",
      year: String(profile?.year ?? ""),
      skills: profile?.skills || "",
      interested_fields: (profile?.interested_fields || []).map(
        (item) => item.id || item,
      ),
      resume: null,
    });
  }, [profile]);

  const resumeUrl = useMemo(() => {
    const value = profile?.resume;

    if (!value) {
      return "";
    }

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    return `${apiBase}${value.startsWith("/") ? "" : "/"}${value}`;
  }, [apiBase, profile?.resume]);

  const toggleField = (id) => {
    setForm((current) => ({
      ...current,
      interested_fields: current.interested_fields.includes(id)
        ? current.interested_fields.filter((item) => item !== id)
        : [...current.interested_fields, id],
    }));
  };

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    setIsSaving(true);
    setFeedback({ type: "idle", message: "" });

    const endpoint = profile?.id
      ? `${apiBase}/api/student/student/update/${profile.id}/`
      : `${apiBase}/api/student/student/create/`;
    const method = profile?.id ? "PUT" : "POST";

    try {
      const payload = new FormData();
      payload.append("college_name", form.college_name || "");
      payload.append("course", form.course || "");
      payload.append("year", String(Number(form.year || 0)));
      payload.append("skills", form.skills || "");

      form.interested_fields.forEach((id) => {
        payload.append("interested_fields", String(id));
      });

      if (form.resume) {
        payload.append("resume", form.resume);
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: payload,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.detail || "Unable to save student profile.");
      }

      setFeedback({ type: "success", message: "Profile saved successfully." });
      onProfileUpdated();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to save student profile.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={saveProfile}
      className="rounded-3xl border border-amber-200/70 bg-[#fff8ec] p-5 shadow-[0_14px_30px_rgba(120,53,15,0.09)]"
    >
      <h2 className="mb-4 inline-flex items-center gap-2 text-xl font-black text-stone-900">
        <GraduationCap size={18} className="text-amber-700" />
        Student Profile
      </h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
            College Name
          </span>
          <input
            value={form.college_name}
            onChange={(event) =>
              updateField("college_name", event.target.value)
            }
            className="w-full rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-2.5 text-sm text-stone-800"
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
            Course
          </span>
          <input
            value={form.course}
            onChange={(event) => updateField("course", event.target.value)}
            className="w-full rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-2.5 text-sm text-stone-800"
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
            Year
          </span>
          <input
            type="number"
            min="1"
            value={form.year}
            onChange={(event) => updateField("year", event.target.value)}
            className="w-full rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-2.5 text-sm text-stone-800"
            required
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
            Skills
          </span>
          <textarea
            value={form.skills}
            onChange={(event) => updateField("skills", event.target.value)}
            rows={3}
            className="w-full rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-2.5 text-sm text-stone-800"
          />
        </label>

        <div className="sm:col-span-2">
          <p className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
            Interested Fields
          </p>
          <div className="flex max-h-36 flex-wrap gap-2 overflow-y-auto rounded-xl border border-amber-200/80 bg-amber-50/70 p-2">
            {specializationOptions.map((item) => (
              <label
                key={item.id}
                className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-[#fff8ec] px-3 py-1.5 text-xs font-medium text-stone-700"
              >
                <input
                  type="checkbox"
                  checked={form.interested_fields.includes(item.id)}
                  onChange={() => toggleField(item.id)}
                  className="h-3.5 w-3.5"
                />
                {item.name}
              </label>
            ))}
          </div>
        </div>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
            Resume (file)
          </span>
          <input
            type="file"
            onChange={(event) =>
              updateField("resume", event.target.files?.[0] || null)
            }
            className="w-full rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-2.5 text-sm text-stone-800"
          />
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-xs font-semibold text-amber-800 underline"
            >
              View current resume
            </a>
          )}
        </label>
      </div>

      {feedback.message && (
        <div
          className={`mt-4 rounded-xl border px-3 py-2 text-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : feedback.type === "error"
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-amber-200 bg-amber-50 text-stone-600"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-semibold text-amber-50 shadow-[0_10px_22px_rgba(217,119,6,0.25)] disabled:opacity-60"
      >
        <Save size={15} />
        {isSaving
          ? "Saving..."
          : profile?.id
            ? "Update Profile"
            : "Create Profile"}
      </button>
    </form>
  );
};

export default StudentProfilePanel;
