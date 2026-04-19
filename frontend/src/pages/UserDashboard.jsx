import React, { useCallback, useEffect, useState } from "react";
import { CalendarClock, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access");
  const apiBase = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")
    : "";

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [lawyers, setLawyers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    lawyer: "",
    date: "",
    time_slot: "",
  });
  const [editDrafts, setEditDrafts] = useState({});

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
      const [lawyersRes, appointmentsRes] = await Promise.all([
        fetch(`${apiBase}/api/law/lawyers/`),
        authFetch("/api/client/client-appointments/"),
      ]);

      const [lawyersJson, appointmentsJson] = await Promise.all([
        lawyersRes.json().catch(() => []),
        appointmentsRes.json().catch(() => []),
      ]);

      if (!lawyersRes.ok || !appointmentsRes.ok) {
        throw new Error("Unable to load client dashboard.");
      }

      setLawyers(Array.isArray(lawyersJson) ? lawyersJson : []);
      setAppointments(Array.isArray(appointmentsJson) ? appointmentsJson : []);

      const drafts = {};
      (Array.isArray(appointmentsJson) ? appointmentsJson : []).forEach(
        (item) => {
          drafts[item.id] = {
            date: item.date || "",
            time_slot: item.time_slot || "",
          };
        },
      );
      setEditDrafts(drafts);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load client dashboard.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, apiBase, authFetch, navigate]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const fetchAvailableSlots = async () => {
    if (!bookingForm.lawyer || !bookingForm.date) {
      setAvailableSlots([]);
      return;
    }

    try {
      const response = await authFetch(
        `/api/client/available-slots/${bookingForm.lawyer}/${bookingForm.date}/`,
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.detail || "Unable to load available slots.");
      }

      setAvailableSlots(
        Array.isArray(data?.available_slots) ? data.available_slots : [],
      );
    } catch (slotError) {
      setError(
        slotError instanceof Error
          ? slotError.message
          : "Unable to load available slots.",
      );
    }
  };

  const bookAppointment = async (event) => {
    event.preventDefault();

    try {
      const response = await authFetch("/api/client/create-appointment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lawyer: Number(bookingForm.lawyer),
          date: bookingForm.date,
          time_slot: bookingForm.time_slot,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.detail || "Unable to book appointment.");
      }

      setFeedback("Appointment booked successfully.");
      setBookingForm({ lawyer: "", date: "", time_slot: "" });
      setAvailableSlots([]);
      loadDashboard();
    } catch (bookError) {
      setError(
        bookError instanceof Error
          ? bookError.message
          : "Unable to book appointment.",
      );
    }
  };

  const updateAppointment = async (appointmentId) => {
    const draft = editDrafts[appointmentId];

    try {
      const response = await authFetch(`/api/client/update/${appointmentId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: draft?.date,
          time_slot: draft?.time_slot,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.detail || "Unable to update appointment.");
      }

      setFeedback("Appointment updated successfully.");
      loadDashboard();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update appointment.",
      );
    }
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      const response = await authFetch(`/api/client/delete/${appointmentId}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete appointment.");
      }

      setFeedback("Appointment deleted.");
      loadDashboard();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete appointment.",
      );
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f2e8] px-4 pb-16 pt-28 text-stone-900 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(251,191,36,0.16),transparent_33%),radial-gradient(circle_at_84%_18%,rgba(251,146,60,0.12),transparent_28%),radial-gradient(circle_at_52%_86%,rgba(245,222,179,0.36),transparent_42%)]" />

      <section className="law-panel relative z-10 mx-auto max-w-7xl rounded-4xl border border-amber-200/70 bg-amber-50/90 p-5 shadow-[0_22px_50px_rgba(120,53,15,0.14)] sm:p-7 lg:p-9">
        <div className="border-b border-amber-200/80 pb-4">
          <h1 className="text-3xl font-black text-stone-900 sm:text-4xl">
            Client Dashboard
          </h1>
          <p className="mt-1 text-sm text-stone-600 sm:text-base">
            Book appointments and track meetings with your lawyers.
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
          <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <section className="rounded-3xl border border-amber-200/70 bg-[#fff8ec] p-5">
              <h2 className="inline-flex items-center gap-2 text-xl font-black text-stone-900">
                <Plus size={18} className="text-amber-700" />
                Book Appointment
              </h2>

              <form onSubmit={bookAppointment} className="mt-3 space-y-3">
                <select
                  value={bookingForm.lawyer}
                  onChange={(event) =>
                    setBookingForm((current) => ({
                      ...current,
                      lawyer: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2.5 text-sm"
                  required
                >
                  <option value="">Select lawyer</option>
                  {lawyers.map((item) => (
                    <option key={item.id} value={item.id}>
                      #{item.id} {item.user?.username || "Lawyer"}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  value={bookingForm.date}
                  onChange={(event) =>
                    setBookingForm((current) => ({
                      ...current,
                      date: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2.5 text-sm"
                  required
                />

                <button
                  type="button"
                  onClick={fetchAvailableSlots}
                  className="rounded-xl border border-amber-300 bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-900"
                >
                  Check Available Slots
                </button>

                <select
                  value={bookingForm.time_slot}
                  onChange={(event) =>
                    setBookingForm((current) => ({
                      ...current,
                      time_slot: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2.5 text-sm"
                  required
                >
                  <option value="">Select time slot</option>
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="rounded-xl bg-linear-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-semibold text-amber-50"
                >
                  Book
                </button>
              </form>
            </section>

            <section className="rounded-3xl border border-amber-200/70 bg-[#fff8ec] p-5">
              <h2 className="inline-flex items-center gap-2 text-xl font-black text-stone-900">
                <CalendarClock size={18} className="text-amber-700" />
                My Appointments
              </h2>

              <div className="mt-3 space-y-3">
                {appointments.length === 0 && (
                  <p className="text-sm text-stone-600">
                    No appointments booked yet.
                  </p>
                )}

                {appointments.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-xl border border-amber-200 bg-amber-50/70 p-3"
                  >
                    <p className="text-sm font-semibold text-stone-900">
                      Appointment #{item.id} | Lawyer #{item.lawyer}
                    </p>
                    <p className="mt-1 text-xs text-stone-700">
                      Current status: {item.status}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <input
                        type="date"
                        value={editDrafts[item.id]?.date || ""}
                        onChange={(event) =>
                          setEditDrafts((current) => ({
                            ...current,
                            [item.id]: {
                              ...current[item.id],
                              date: event.target.value,
                            },
                          }))
                        }
                        className="rounded-lg border border-amber-200 bg-white px-2 py-1 text-xs"
                      />
                      <input
                        value={editDrafts[item.id]?.time_slot || ""}
                        onChange={(event) =>
                          setEditDrafts((current) => ({
                            ...current,
                            [item.id]: {
                              ...current[item.id],
                              time_slot: event.target.value,
                            },
                          }))
                        }
                        className="rounded-lg border border-amber-200 bg-white px-2 py-1 text-xs"
                        placeholder="10:00 AM"
                      />
                      <button
                        type="button"
                        onClick={() => updateAppointment(item.id)}
                        className="rounded-lg bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteAppointment(item.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
};

export default UserDashboard;
