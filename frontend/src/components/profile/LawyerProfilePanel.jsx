import React, { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, Save, Trash2 } from "lucide-react";

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const normalizeWorkingDays = (value) => {
  if (!value) return [];

  // Case 1: Array format (e.g., ['Monday,Tuesday,Wednesday'] or ['Monday', 'Tuesday'])
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => (typeof item === "string" ? item.split(",") : item))
      .map((day) => (typeof day === "string" ? day.trim() : day))
      .filter(Boolean);
  }

  // Case 2: Object with 'day' property (e.g., { day: ['Monday', 'Tuesday'] } or { day: "Monday,Tuesday" })
  if (typeof value === "object" && value.day) {
    return normalizeWorkingDays(value.day);
  }

  // Case 3: Comma-separated string format (e.g., "Monday, Tuesday, Wednesday")
  if (typeof value === "string") {
    return value
      .split(",")
      .map((day) => day.trim())
      .filter(Boolean);
  }

  return [];
};

const LawyerProfilePanel = ({
  apiBase,
  accessToken,
  profile,
  onProfileUpdated,
}) => {
  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "idle", message: "" });
  const [form, setForm] = useState({
    experience_years: "0",
    address: "",
    mobile: "",
    status: "ACTIVE",
    start_time: "",
    end_time: "",
    working_days: [],
    working_place: "",
    about: "",
    chat_free: false,
    consultation_fee: "0",
    specialization: [],
    profile_image: null,
  });

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await fetch(
          `${apiBase}/api/user/get-all-specializations/`,
        );
        const data = await response.json().catch(() => []);
        const rawOptions = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : Array.isArray(data?.specializations)
              ? data.specializations
              : [];

        // Normalize options into { id, name } format
        const formattedOptions = rawOptions.map((item, index) => {
          if (typeof item === "string") {
            return { id: item, name: item };
          }
          if (Array.isArray(item)) {
            return { id: item[0], name: item[1] || item[0] };
          }
          return {
            id: item.id || item.value || item.name || index,
            name:
              item.name ||
              item.specialization_name ||
              item.label ||
              String(item.id),
          };
        });

        setSpecializationOptions(formattedOptions);
      } catch (_error) {
        setSpecializationOptions([]);
      }
    };

    fetchSpecializations();
  }, [apiBase]);

  useEffect(() => {
    setForm({
      experience_years: String(profile?.experience_years ?? 0),
      address: profile?.address || "",
      mobile: profile?.mobile || "",
      status: profile?.status || "ACTIVE",
      start_time: profile?.start_time || "",
      end_time: profile?.end_time || "",
      working_days: normalizeWorkingDays(profile?.working_days),
      working_place: profile?.working_place || "",
      about: profile?.about || "",
      chat_free: profile?.chat_free || false,
      consultation_fee: String(profile?.consultation_fee ?? 0),
      specialization: (profile?.specialization || []).map(
        (item) => item.id || item,
      ),
      profile_image: null,
    });
  }, [profile]);

  const profileImageUrl = useMemo(() => {
    const value = profile?.profile_image;

    if (!value) {
      return "";
    }

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    return `${apiBase}${value.startsWith("/") ? "" : "/"}${value}`;
  }, [apiBase, profile?.profile_image]);

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const toggleWorkingDay = (day) => {
    setForm((current) => ({
      ...current,
      working_days: current.working_days.includes(day)
        ? current.working_days.filter((item) => item !== day)
        : [...current.working_days, day],
    }));
  };

  const toggleSpecialization = (id) => {
    setForm((current) => ({
      ...current,
      specialization: current.specialization.includes(id)
        ? current.specialization.filter((item) => item !== id)
        : [...current.specialization, id],
    }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    setIsSaving(true);
    setFeedback({ type: "idle", message: "" });

    const endpoint = profile?.id
      ? `${apiBase}/api/law/lawyer/update/${profile.id}/`
      : `${apiBase}/api/law/lawyer/create/`;
    const method = profile?.id ? "PUT" : "POST";

    try {
      const payload = new FormData();
      payload.append(
        "experience_years",
        String(Number(form.experience_years || 0)),
      );
      payload.append("address", form.address || "");
      payload.append("mobile", form.mobile || "");
      payload.append("status", form.status || "ACTIVE");
      payload.append("start_time", form.start_time || "00:00:00");
      payload.append("end_time", form.end_time || "00:00:00");

      // Appends working_days as a valid JSON array string
      payload.append("working_days", JSON.stringify(form.working_days));

      payload.append("working_place", form.working_place || "");
      payload.append("about", form.about || "");
      payload.append("chat_free", String(form.chat_free));
      payload.append("consultation_fee", form.consultation_fee);

      form.specialization.forEach((id) => {
        payload.append("specialization", String(id));
      });

      if (form.profile_image) {
        payload.append("profile_image", form.profile_image);
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
        throw new Error(data?.detail || "Unable to save lawyer profile.");
      }

      setFeedback({ type: "success", message: "Profile saved successfully." });
      onProfileUpdated();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to save lawyer profile.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProfile = async () => {
    if (!profile?.id || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setFeedback({ type: "idle", message: "" });

    try {
      const response = await fetch(
        `${apiBase}/api/law/lawyer/delete/${profile.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Unable to delete lawyer profile.");
      }

      setFeedback({ type: "success", message: "Profile deleted." });
      onProfileUpdated();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete lawyer profile.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form
      onSubmit={saveProfile}
      className="rounded-3xl border border-amber-200/70 bg-[#fff8ec] p-5 shadow-[0_14px_30px_rgba(120,53,15,0.09)]"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-xl font-black text-stone-900">
          <BriefcaseBusiness size={18} className="text-amber-700" />
          Lawyer Profile
        </h2>
        {profile?.id && (
          <button
            type="button"
            onClick={deleteProfile}
            disabled={isDeleting}
            className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 disabled:opacity-60"
          >
            <Trash2 size={14} />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
            Experience (years)
          </span>
          <input
            type="number"
            min="0"
            value={form.experience_years}
            onChange={(event) =>
              updateField("experience_years", event.target.value)
            }
            className="w-full rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-2.5 text-sm text-stone-800"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
            Mobile
          </span>
          <input
            value={form.mobile}
            onChange={(event) => updateField("mobile", event.target.value)}
            className="w-full rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-2.5 text-sm text-stone-800"
            required
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
            Address
          </span>
          <input
            value={form.address}
            onChange={(event) => updateField("address", event.target.value)}
            className="w-full rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-2.5 text-sm text-stone-800"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
            Status
          </span>
          <select
            value={form.status}
            onChange={(event) => updateField("status", event.target.value)}
            className="w-full rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-2.5 text-sm text-stone-800"
          >
            <option value="PENDING">PENDING</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
            Working Place
          </span>
          <input
            value={form.working_place}
            onChange={(event) =>
              updateField("working_place", event.target.value)
            }
            className="w-full rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-2.5 text-sm text-stone-800"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
            Start Time
          </span>
          <input
            type="time"
            value={form.start_time}
            onChange={(event) => updateField("start_time", event.target.value)}
            className="w-full rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-2.5 text-sm text-stone-800"
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
            End Time
          </span>
          <input
            type="time"
            value={form.end_time}
            onChange={(event) => updateField("end_time", event.target.value)}
            className="w-full rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-2.5 text-sm text-stone-800"
            required
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
            About
          </span>
          <textarea
            value={form.about}
            onChange={(event) => updateField("about", event.target.value)}
            rows={3}
            className="w-full rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-2.5 text-sm text-stone-800"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
            Chat Free
          </span>
          <input
            type="checkbox"
            checked={form.chat_free}
            onChange={(event) =>
              updateField("chat_free", event.target.checked)
            }
            className="h-4 w-4 rounded border-amber-300 text-amber-600"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
            Consultation Fee (in INR , including taxes like GST or corporate Tax)
          </span>
          <input
            type="number"
            value={form.consultation_fee}
            onChange={(event) =>
              updateField("consultation_fee", event.target.value)
            }
            className="w-full rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-2.5 text-sm text-stone-800"
            required
          />
        </label>

        <div className="sm:col-span-2">
          <p className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
            Working Days
          </p>
          <div className="flex flex-wrap gap-2">
            {WEEK_DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleWorkingDay(day)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  form.working_days.includes(day)
                    ? "border-amber-300 bg-amber-100 text-amber-900"
                    : "border-amber-200 bg-amber-50 text-stone-700"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <p className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
            Specializations
          </p>
          <div className="flex max-h-36 flex-wrap gap-2 overflow-y-auto rounded-xl border border-amber-200/80 bg-amber-50/70 p-2">
            {specializationOptions.map((item) => (
              <label
                key={item.id}
                className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-[#fff8ec] px-3 py-1.5 text-xs font-medium text-stone-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form.specialization.includes(item.id)}
                  onChange={() => toggleSpecialization(item.id)}
                  className="h-3.5 w-3.5 accent-amber-600"
                />
                {item.name}
              </label>
            ))}
          </div>
        </div>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
            Profile Image
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) =>
              updateField("profile_image", event.target.files?.[0] || null)
            }
            className="w-full rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-2.5 text-sm text-stone-800"
          />
          {profileImageUrl && (
            <img
              src={profileImageUrl}
              alt="Lawyer profile"
              className="mt-3 h-24 w-24 rounded-xl border border-amber-200/80 object-cover"
            />
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
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-semibold text-amber-50 shadow-[0_10px_22px_rgba(217,119,6,0.25)] disabled:opacity-60 cursor-pointer"
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

export default LawyerProfilePanel;