import React, { useEffect, useMemo, useState } from "react";
import { Filter, Search, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

const normalizeDay = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const imageUrlFromPath = (apiBase, imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  if (!apiBase) return imagePath;
  return `${apiBase}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

const parseSpecializations = (specializationValue) => {
  if (!specializationValue) return [];

  if (Array.isArray(specializationValue)) {
    return specializationValue
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object")
          return item.name || item.label || "";
        return "";
      })
      .filter(Boolean);
  }

  if (typeof specializationValue === "string") {
    return specializationValue
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const parseWorkingDays = (workingDays) => {
  if (!workingDays) return [];
  if (Array.isArray(workingDays))
    return workingDays.map(normalizeDay).filter(Boolean);
  if (typeof workingDays === "object") {
    if (Array.isArray(workingDays.day)) {
      return workingDays.day.map(normalizeDay).filter(Boolean);
    }
    return Object.values(workingDays).map(normalizeDay).filter(Boolean);
  }
  return [];
};

const FindLawyer = () => {
  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")
    : "";
  const accessToken = localStorage.getItem("access");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [lawyers, setLawyers] = useState([]);
  const [bookingDrafts, setBookingDrafts] = useState({});
  const [availableSlotsByLawyer, setAvailableSlotsByLawyer] = useState({});
  const [bookingBusyByLawyer, setBookingBusyByLawyer] = useState({});
  const [filters, setFilters] = useState({
    search: "",
    specialization: "ALL",
    workMode: "ALL",
    minExperience: 0,
    availableDay: "ALL",
  });

  useEffect(() => {
    let isMounted = true;

    const loadLawyers = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`${apiBase}/api/law/lawyers/`);
        const data = await response.json().catch(() => []);

        if (!response.ok) {
          throw new Error("Unable to fetch lawyers list.");
        }

        if (isMounted) {
          setLawyers(Array.isArray(data) ? data : []);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to fetch lawyers list.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadLawyers();

    return () => {
      isMounted = false;
    };
  }, [apiBase]);

  const specializationOptions = useMemo(() => {
    const found = new Set();
    lawyers.forEach((lawyer) => {
      parseSpecializations(lawyer.specialization).forEach((item) =>
        found.add(item),
      );
    });
    return ["ALL", ...Array.from(found).sort((a, b) => a.localeCompare(b))];
  }, [lawyers]);

  const dayOptions = useMemo(() => {
    const found = new Set();
    lawyers.forEach((lawyer) => {
      parseWorkingDays(lawyer.working_days).forEach((day) => {
        if (day) {
          found.add(day.charAt(0).toUpperCase() + day.slice(1));
        }
      });
    });
    return ["ALL", ...Array.from(found).sort((a, b) => a.localeCompare(b))];
  }, [lawyers]);

  const filteredLawyers = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    return lawyers.filter((lawyer) => {
      const name = lawyer?.user?.username || "";
      const about = lawyer?.about || "";
      const address = lawyer?.address || "";
      const workingPlace = lawyer?.working_place || "";
      const experience = Number(lawyer?.experience_years || 0);
      const specializations = parseSpecializations(lawyer?.specialization);
      const days = parseWorkingDays(lawyer?.working_days);

      const matchesSearch =
        !query ||
        [name, about, address, workingPlace]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesSpecialization =
        filters.specialization === "ALL" ||
        specializations.some(
          (item) => item.toLowerCase() === filters.specialization.toLowerCase(),
        );

      const isRemote = String(workingPlace).toLowerCase().includes("remote");
      const matchesWorkMode =
        filters.workMode === "ALL" ||
        (filters.workMode === "REMOTE" && isRemote) ||
        (filters.workMode === "ON_SITE" && !isRemote);

      const matchesExperience =
        experience >= Number(filters.minExperience || 0);

      const selectedDay = filters.availableDay.toLowerCase();
      const matchesDay = selectedDay === "all" || days.includes(selectedDay);

      return (
        matchesSearch &&
        matchesSpecialization &&
        matchesWorkMode &&
        matchesExperience &&
        matchesDay
      );
    });
  }, [filters, lawyers]);

  const clearFilters = () => {
    setFilters({
      search: "",
      specialization: "ALL",
      workMode: "ALL",
      minExperience: 0,
      availableDay: "ALL",
    });
  };

  const setBookingField = (lawyerId, field, value) => {
    setBookingDrafts((current) => ({
      ...current,
      [lawyerId]: {
        ...(current[lawyerId] || { date: "", time_slot: "" }),
        [field]: value,
      },
    }));
  };

  const fetchAvailableSlots = async (lawyerId) => {
    const draft = bookingDrafts[lawyerId] || { date: "", time_slot: "" };

    if (!draft.date) {
      setError("Please select a date first to view available slots.");
      return;
    }

    setError("");
    setFeedback("");
    setBookingBusyByLawyer((current) => ({ ...current, [lawyerId]: true }));

    try {
      const response = await fetch(
        `${apiBase}/api/client/available-slots/${lawyerId}/${draft.date}/`,
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.detail || "Unable to fetch available slots.");
      }

      const slots = Array.isArray(data?.available_slots)
        ? data.available_slots
        : [];

      setAvailableSlotsByLawyer((current) => ({
        ...current,
        [lawyerId]: slots,
      }));

      const stillValid = slots.includes(draft.time_slot);
      if (!stillValid) {
        setBookingField(lawyerId, "time_slot", "");
      }

      setFeedback(
        slots.length > 0
          ? `Found ${slots.length} open slot(s).`
          : "No slots left on this date.",
      );
    } catch (slotError) {
      setError(
        slotError instanceof Error
          ? slotError.message
          : "Unable to fetch available slots.",
      );
    } finally {
      setBookingBusyByLawyer((current) => ({ ...current, [lawyerId]: false }));
    }
  };

  const bookAppointment = async (lawyerId) => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    const draft = bookingDrafts[lawyerId] || { date: "", time_slot: "" };

    if (!draft.date || !draft.time_slot) {
      setError("Please select a date and available time slot before booking.");
      return;
    }

    setError("");
    setFeedback("");
    setBookingBusyByLawyer((current) => ({ ...current, [lawyerId]: true }));

    try {
      const response = await fetch(
        `${apiBase}/api/client/create-appointment/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            lawyer: Number(lawyerId),
            date: draft.date,
            time_slot: draft.time_slot,
          }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const detail =
          typeof data?.detail === "string"
            ? data.detail
            : Array.isArray(data?.non_field_errors)
              ? data.non_field_errors[0]
              : "Unable to book appointment.";
        throw new Error(detail);
      }

      setFeedback("Appointment booked successfully.");
      setBookingField(lawyerId, "time_slot", "");
      await fetchAvailableSlots(lawyerId);
    } catch (bookError) {
      setError(
        bookError instanceof Error
          ? bookError.message
          : "Unable to book appointment.",
      );

      // Keep the UI in sync if someone else booked the slot first.
      await fetchAvailableSlots(lawyerId);
    } finally {
      setBookingBusyByLawyer((current) => ({ ...current, [lawyerId]: false }));
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f2e8] px-4 pb-16 pt-28 text-stone-900 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(251,191,36,0.16),transparent_33%),radial-gradient(circle_at_84%_18%,rgba(251,146,60,0.12),transparent_28%),radial-gradient(circle_at_52%_86%,rgba(245,222,179,0.36),transparent_42%)]" />

      <section className="law-panel relative z-10 mx-auto max-w-7xl rounded-4xl border border-amber-200/70 bg-amber-50/90 p-5 shadow-[0_22px_50px_rgba(120,53,15,0.14)] sm:p-7 lg:p-9">
        <div className="border-b border-amber-200/80 pb-4">
          <h1 className="text-3xl font-black text-stone-900 sm:text-4xl">
            Find Lawyer
          </h1>
          <p className="mt-1 text-sm text-stone-600 sm:text-base">
            Search legal experts and narrow down results with practical filters.
          </p>
        </div>

        <section className="mt-5 rounded-3xl border border-amber-200/70 bg-[#fff8ec] p-4 sm:p-5">
          <h2 className="inline-flex items-center gap-2 text-lg font-black text-stone-900">
            <Filter size={18} className="text-amber-700" />
            Filter Lawyers
          </h2>

          <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            <label className="lg:col-span-2">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-stone-600">
                Search
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-3 py-2.5">
                <Search size={15} className="text-stone-500" />
                <input
                  value={filters.search}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      search: event.target.value,
                    }))
                  }
                  placeholder="Name, location, about"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </label>

            <label>
              <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-stone-600">
                Specialization
              </span>
              <select
                value={filters.specialization}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    specialization: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm"
              >
                {specializationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "ALL" ? "All" : option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-stone-600">
                Work Mode
              </span>
              <select
                value={filters.workMode}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    workMode: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm"
              >
                <option value="ALL">All</option>
                <option value="REMOTE">Remote</option>
                <option value="ON_SITE">On site</option>
              </select>
            </label>

            <label>
              <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-stone-600">
                Available Day
              </span>
              <select
                value={filters.availableDay}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    availableDay: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm"
              >
                {dayOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "ALL" ? "All" : option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <label className="flex min-w-60 items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-stone-600">
                Min Experience
              </span>
              <input
                type="range"
                min={0}
                max={25}
                value={filters.minExperience}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    minExperience: Number(event.target.value),
                  }))
                }
                className="h-2 w-full accent-amber-500"
              />
              <span className="w-12 text-sm font-semibold text-stone-700">
                {filters.minExperience}y
              </span>
            </label>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl border border-amber-300 bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-900"
            >
              Clear Filters
            </button>
          </div>
        </section>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {feedback && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {feedback}
          </div>
        )}

        <section className="mt-5">
          <p className="text-sm font-semibold text-stone-700">
            {isLoading
              ? "Loading lawyers..."
              : `${filteredLawyers.length} lawyer(s) found`}
          </p>

          {!isLoading && filteredLawyers.length === 0 && !error && (
            <div className="mt-3 rounded-2xl border border-amber-200/80 bg-[#fff8ec] px-4 py-5 text-sm text-stone-600">
              No lawyers match your current filters.
            </div>
          )}

          <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredLawyers.map((lawyer) => {
              const specializations = parseSpecializations(
                lawyer.specialization,
              );
              const photoUrl = imageUrlFromPath(apiBase, lawyer.profile_image);

              return (
                <article
                  key={lawyer.id}
                  className="rounded-3xl border border-amber-200/80 bg-[#fff8ec] p-4 shadow-[0_10px_26px_rgba(120,53,15,0.08)]"
                >
                  <div className="flex items-start gap-3">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={lawyer?.user?.username || "Lawyer"}
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="grid h-14 w-14 place-items-center rounded-xl bg-amber-100 text-amber-700">
                        <UserRound size={22} />
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-black text-stone-900">
                        {lawyer?.user?.username || `Lawyer #${lawyer.id}`}
                      </h3>
                      <p className="text-xs font-medium uppercase tracking-widest text-stone-500">
                        {Number(lawyer?.experience_years || 0)} years experience
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-stone-700">
                    {lawyer?.about || "No bio shared yet."}
                  </p>

                  <div className="mt-3 space-y-1 text-xs text-stone-600">
                    <p>
                      <span className="font-semibold text-stone-700">
                        Location:
                      </span>{" "}
                      {lawyer?.working_place ||
                        lawyer?.address ||
                        "Not specified"}
                    </p>
                    <p>
                      <span className="font-semibold text-stone-700">
                        Mobile:
                      </span>{" "}
                      {lawyer?.mobile || "Not shared"}
                    </p>
                    <p>
                      <span className="font-semibold text-stone-700">
                        Hours:
                      </span>{" "}
                      {lawyer?.start_time || "--"} - {lawyer?.end_time || "--"}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {specializations.length > 0 ? (
                      specializations.map((item) => (
                        <span
                          key={`${lawyer.id}-${item}`}
                          className="rounded-full border border-amber-200 bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-900"
                        >
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-stone-600">
                        General Practice
                      </span>
                    )}
                  </div>

                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-stone-600">
                      Book Appointment
                    </p>

                    <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
                      <input
                        type="date"
                        value={bookingDrafts[lawyer.id]?.date || ""}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(event) => {
                          setBookingField(
                            lawyer.id,
                            "date",
                            event.target.value,
                          );
                          setBookingField(lawyer.id, "time_slot", "");
                          setAvailableSlotsByLawyer((current) => ({
                            ...current,
                            [lawyer.id]: [],
                          }));
                        }}
                        className="w-full rounded-lg border border-amber-200 bg-white px-2.5 py-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => fetchAvailableSlots(lawyer.id)}
                        disabled={Boolean(bookingBusyByLawyer[lawyer.id])}
                        className="rounded-lg border border-amber-300 bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-900 disabled:opacity-60"
                      >
                        {bookingBusyByLawyer[lawyer.id]
                          ? "Checking..."
                          : "Check Slots"}
                      </button>
                    </div>

                    <select
                      value={bookingDrafts[lawyer.id]?.time_slot || ""}
                      onChange={(event) =>
                        setBookingField(
                          lawyer.id,
                          "time_slot",
                          event.target.value,
                        )
                      }
                      className="mt-2 w-full rounded-lg border border-amber-200 bg-white px-2.5 py-2 text-xs"
                    >
                      <option value="">Select available slot</option>
                      {(availableSlotsByLawyer[lawyer.id] || []).map((slot) => (
                        <option key={`${lawyer.id}-${slot}`} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => bookAppointment(lawyer.id)}
                      disabled={Boolean(bookingBusyByLawyer[lawyer.id])}
                      className="mt-2 w-full rounded-lg bg-linear-to-r from-amber-400 to-orange-500 px-3 py-2 text-xs font-semibold text-amber-50 disabled:opacity-60"
                    >
                      {bookingBusyByLawyer[lawyer.id]
                        ? "Booking..."
                        : "Book Appointment"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
};

export default FindLawyer;
