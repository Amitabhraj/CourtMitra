import React, { useCallback, useEffect, useState } from "react";
import { CalendarClock, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("access");

  const apiBase = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")
    : "";

  const API_PREFIX = "/api/consultant";

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const [lawyers, setLawyers] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    lawyer: "",
    date: "",
    time_slot: "",
  });

  const [editDrafts, setEditDrafts] = useState({});

  /* =========================================================
     AUTHENTICATED FETCH
  ========================================================= */

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
    [accessToken, apiBase]
  );

  /* =========================================================
     LOAD DASHBOARD
  ========================================================= */

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

        authFetch(
          `${API_PREFIX}/client-appointments/`
        ),
      ]);

      const [lawyersJson, appointmentsJson] =
        await Promise.all([
          lawyersRes.json().catch(() => []),
          appointmentsRes.json().catch(() => []),
        ]);

      if (!lawyersRes.ok) {
        throw new Error(
          lawyersJson?.detail ||
            "Unable to load lawyers."
        );
      }

      if (!appointmentsRes.ok) {
        throw new Error(
          appointmentsJson?.detail ||
            "Unable to load appointments."
        );
      }

      setLawyers(
        Array.isArray(lawyersJson)
          ? lawyersJson
          : []
      );

      setAppointments(
        Array.isArray(appointmentsJson)
          ? appointmentsJson
          : []
      );

      const drafts = {};

      (
        Array.isArray(appointmentsJson)
          ? appointmentsJson
          : []
      ).forEach((item) => {
        drafts[item.id] = {
          date: item.date || "",
          time_slot: item.time_slot || "",
        };
      });

      setEditDrafts(drafts);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load client dashboard."
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    accessToken,
    apiBase,
    authFetch,
    navigate,
  ]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  /* =========================================================
     FETCH AVAILABLE SLOTS
     
     Django:
     /api/Consultant/available-slots/<lawyer_id>/<date>/
  ========================================================= */

  const fetchAvailableSlots = useCallback(
    async (lawyerId, date) => {
      if (!lawyerId || !date) {
        setAvailableSlots([]);
        return;
      }

      setIsLoadingSlots(true);
      setError("");
      setAvailableSlots([]);

      try {
        const response = await authFetch(
          `${API_PREFIX}/available-slots/${lawyerId}/${date}/`
        );

        const data = await response
          .json()
          .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              data?.error ||
              "Unable to load available slots."
          );
        }

        const slots = Array.isArray(
          data?.available_slots
        )
          ? data.available_slots
          : [];

        setAvailableSlots(slots);

        /*
         * Clear previously selected time slot
         * whenever slots are refreshed.
         */
        setBookingForm((current) => ({
          ...current,
          time_slot: "",
        }));

        if (slots.length === 0) {
          setFeedback(
            "No available time slots for this date."
          );
        } else {
          setFeedback(
            `${slots.length} available time slot${
              slots.length > 1 ? "s" : ""
            } found.`
          );
        }
      } catch (slotError) {
        setAvailableSlots([]);

        setError(
          slotError instanceof Error
            ? slotError.message
            : "Unable to load available slots."
        );
      } finally {
        setIsLoadingSlots(false);
      }
    },
    [authFetch]
  );

  /* =========================================================
     LAWYER CHANGE
  ========================================================= */

  const handleLawyerChange = (event) => {
    const lawyerId = event.target.value;

    setBookingForm({
      lawyer: lawyerId,
      date: "",
      time_slot: "",
    });

    setAvailableSlots([]);
    setError("");
    setFeedback("");
  };

  /* =========================================================
     DATE CHANGE
     
     IMPORTANT:
     Slots are fetched automatically.
  ========================================================= */

  const handleDateChange = (event) => {
    const date = event.target.value;

    setBookingForm((current) => ({
      ...current,
      date,
      time_slot: "",
    }));

    setAvailableSlots([]);
    setError("");
    setFeedback("");

    if (bookingForm.lawyer && date) {
      fetchAvailableSlots(
        bookingForm.lawyer,
        date
      );
    }
  };

  /* =========================================================
     BOOK APPOINTMENT
     
     Django:
     /api/Consultant/create-appointment/
  ========================================================= */

  const bookAppointment = async (event) => {
    event.preventDefault();

    if (!bookingForm.lawyer) {
      setError("Please select a lawyer.");
      return;
    }

    if (!bookingForm.date) {
      setError("Please select a date.");
      return;
    }

    if (!bookingForm.time_slot) {
      setError(
        "Please select an available time slot."
      );
      return;
    }

    setError("");
    setFeedback("");

    try {
      const response = await authFetch(
        `${API_PREFIX}/create-appointment/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lawyer: Number(bookingForm.lawyer),
            date: bookingForm.date,
            time_slot: bookingForm.time_slot,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.error ||
            "Unable to book appointment."
        );
      }

      setFeedback(
        "Appointment booked successfully."
      );

      setBookingForm({
        lawyer: "",
        date: "",
        time_slot: "",
      });

      setAvailableSlots([]);

      await loadDashboard();
    } catch (bookError) {
      setError(
        bookError instanceof Error
          ? bookError.message
          : "Unable to book appointment."
      );
    }
  };

  /* =========================================================
     UPDATE APPOINTMENT
     
     Django:
     /api/Consultant/update/<id>/
  ========================================================= */

  const updateAppointment = async (
    appointmentId
  ) => {
    const draft = editDrafts[appointmentId];

    if (!draft?.date || !draft?.time_slot) {
      setError(
        "Please provide both date and time slot."
      );
      return;
    }

    setError("");
    setFeedback("");

    try {
      const response = await authFetch(
        `${API_PREFIX}/update/${appointmentId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: draft.date,
            time_slot: draft.time_slot,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.error ||
            "Unable to update appointment."
        );
      }

      setFeedback(
        "Appointment updated successfully."
      );

      await loadDashboard();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update appointment."
      );
    }
  };

  /* =========================================================
     DELETE APPOINTMENT
     
     Django:
     /api/Consultant/delete/<id>/
  ========================================================= */

  const deleteAppointment = async (
    appointmentId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmed) return;

    setError("");
    setFeedback("");

    try {
      const response = await authFetch(
        `${API_PREFIX}/delete/${appointmentId}/`,
        {
          method: "DELETE",
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.error ||
            "Unable to delete appointment."
        );
      }

      setFeedback(
        "Appointment deleted successfully."
      );

      await loadDashboard();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete appointment."
      );
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f2e8] px-4 pb-16 pt-28 text-stone-900 sm:px-6 lg:px-8">

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(251,191,36,0.16),transparent_33%),radial-gradient(circle_at_84%_18%,rgba(251,146,60,0.12),transparent_28%),radial-gradient(circle_at_52%_86%,rgba(245,222,179,0.36),transparent_42%)]" />

      <section className="law-panel relative z-10 mx-auto max-w-7xl rounded-4xl border border-amber-200/70 bg-amber-50/90 p-5 shadow-[0_22px_50px_rgba(120,53,15,0.14)] sm:p-7 lg:p-9">

        {/* HEADER */}

        <div className="border-b border-amber-200/80 pb-4">

          <h1 className="text-3xl font-black text-stone-900 sm:text-4xl">
            Client Dashboard
          </h1>

          <p className="mt-1 text-sm text-stone-600 sm:text-base">
            Book appointments and track meetings
            with your lawyers.
          </p>

        </div>

        {/* SUCCESS */}

        {feedback && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {feedback}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* CONTENT */}

        {isLoading ? (
          <div className="mt-5 rounded-2xl border border-amber-200/80 bg-[#fff8ec] px-4 py-5 text-sm text-stone-600">
            Loading dashboard...
          </div>
        ) : (
          <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">

            {/* =================================================
                BOOK APPOINTMENT
            ================================================= */}

            {/* <section className="rounded-3xl border border-amber-200/70 bg-[#fff8ec] p-5">

              <h2 className="inline-flex items-center gap-2 text-xl font-black text-stone-900">
                <Plus
                  size={18}
                  className="text-amber-700"
                />
                Book Appointment
              </h2>

              <form
                onSubmit={bookAppointment}
                className="mt-3 space-y-3"
              >

                <select
                  value={bookingForm.lawyer}
                  onChange={handleLawyerChange}
                  className="w-full rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2.5 text-sm"
                  required
                >
                  <option value="">
                    Select lawyer
                  </option>

                  {lawyers.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      #{item.id}{" "}
                      {item.user?.username ||
                        "Lawyer"}
                    </option>
                  ))}
                </select>


                <input
                  type="date"
                  value={bookingForm.date}
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={handleDateChange}
                  disabled={!bookingForm.lawyer}
                  className="w-full rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />


                {bookingForm.date && (
                  <div className="space-y-2">

                    {isLoadingSlots ? (
                      <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2.5 text-sm text-stone-600">
                        Loading available time
                        slots...
                      </div>
                    ) : availableSlots.length >
                      0 ? (
                      <select
                        value={
                          bookingForm.time_slot
                        }
                        onChange={(event) =>
                          setBookingForm(
                            (current) => ({
                              ...current,
                              time_slot:
                                event.target.value,
                            })
                          )
                        }
                        className="w-full rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2.5 text-sm"
                        required
                      >
                        <option value="">
                          Select available time slot
                        </option>

                        {availableSlots.map(
                          (slot) => (
                            <option
                              key={slot}
                              value={slot}
                            >
                              {slot}
                            </option>
                          )
                        )}
                      </select>
                    ) : (
                      <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-600">
                        No available time slots
                        for this date.
                      </div>
                    )}

                  </div>
                )}


                <button
                  type="submit"
                  disabled={
                    isLoadingSlots ||
                    !bookingForm.lawyer ||
                    !bookingForm.date ||
                    !bookingForm.time_slot
                  }
                  className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoadingSlots
                    ? "Loading slots..."
                    : "Book Appointment"}
                </button>

              </form>
            </section> */}

            {/* =================================================
                MY APPOINTMENTS
            ================================================= */}

            <section className="rounded-3xl border border-amber-200/70 bg-[#fff8ec] p-5">

              <h2 className="inline-flex items-center gap-2 text-xl font-black text-stone-900">
                <CalendarClock
                  size={18}
                  className="text-amber-700"
                />
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
                      Appointment #{item.id}
                      {" | "}
                      Lawyer #
                      {item.lawyer}
                    </p>

                    <p className="mt-1 text-xs text-stone-700">
                      Current status:{" "}
                      {item.status}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">

                      {/* DATE */}

                      <input
                        type="date"
                        value={
                          editDrafts[item.id]
                            ?.date || ""
                        }
                        min={
                          new Date()
                            .toISOString()
                            .split("T")[0]
                        }
                        onChange={(event) =>
                          setEditDrafts(
                            (current) => ({
                              ...current,
                              [item.id]: {
                                ...current[
                                  item.id
                                ],
                                date: event.target
                                  .value,
                              },
                            })
                          )
                        }
                        className="rounded-lg border border-amber-200 bg-white px-2 py-1 text-xs"
                      />

                      {/* TIME */}

                      <input
                        value={
                          editDrafts[item.id]
                            ?.time_slot || ""
                        }
                        onChange={(event) =>
                          setEditDrafts(
                            (current) => ({
                              ...current,
                              [item.id]: {
                                ...current[
                                  item.id
                                ],
                                time_slot:
                                  event.target
                                    .value,
                              },
                            })
                          )
                        }
                        className="rounded-lg border border-amber-200 bg-white px-2 py-1 text-xs"
                        placeholder="10:00 AM"
                      />

                      {/* UPDATE */}

                      <button
                        type="button"
                        onClick={() =>
                          updateAppointment(
                            item.id
                          )
                        }
                        className="rounded-lg bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white"
                      >
                        Update
                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() =>
                          deleteAppointment(
                            item.id
                          )
                        }
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