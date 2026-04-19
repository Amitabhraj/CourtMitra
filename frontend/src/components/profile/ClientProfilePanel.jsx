import React, { useEffect, useMemo, useState } from "react";
import { Save, UserRound } from "lucide-react";

const ClientProfilePanel = ({
  apiBase,
  accessToken,
  profile,
  onProfileUpdated,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "idle", message: "" });
  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    address: "",
    profile_image: null,
  });

  useEffect(() => {
    setForm({
      full_name: profile?.full_name || "",
      phone_number: profile?.phone_number || "",
      address: profile?.address || "",
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

  const saveProfile = async (event) => {
    event.preventDefault();

    setIsSaving(true);
    setFeedback({ type: "idle", message: "" });

    const endpoint = profile?.id
      ? `${apiBase}/api/client/client/update-profile/${profile.id}/`
      : `${apiBase}/api/client/client/create-profile/`;
    const method = profile?.id ? "PUT" : "POST";

    try {
      const payload = new FormData();
      payload.append("full_name", form.full_name || "");
      payload.append("phone_number", form.phone_number || "");
      payload.append("address", form.address || "");

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
        throw new Error(data?.detail || "Unable to save client profile.");
      }

      setFeedback({ type: "success", message: "Profile saved successfully." });
      onProfileUpdated();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to save client profile.",
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
        <UserRound size={18} className="text-amber-700" />
        Client Profile
      </h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
            Full Name
          </span>
          <input
            value={form.full_name}
            onChange={(event) => updateField("full_name", event.target.value)}
            className="w-full rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-2.5 text-sm text-stone-800"
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
            Phone Number
          </span>
          <input
            value={form.phone_number}
            onChange={(event) =>
              updateField("phone_number", event.target.value)
            }
            className="w-full rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-2.5 text-sm text-stone-800"
            required
          />
        </label>

        <label className="block">
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
              alt="Client profile"
              className="mt-3 h-20 w-20 rounded-xl border border-amber-200/80 object-cover"
            />
          )}
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
            Address
          </span>
          <textarea
            value={form.address}
            onChange={(event) => updateField("address", event.target.value)}
            rows={3}
            className="w-full rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-2.5 text-sm text-stone-800"
          />
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

export default ClientProfilePanel;
