import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Scale,
  Briefcase,
  GraduationCap,
  Users,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  Lock,
  Mail,
  User,
  Phone,
  Building2,
  BookOpen,
  MapPin,
  Award,
} from "lucide-react";

const roleOptions = [
  {
    role: "LAWYER",
    title: "Become Lawyer",
    badge: "Advocate & Law Firm",
    icon: Briefcase,
    description:
      "Join verified legal practitioners. Manage client consultations, schedule appointments, post internships, and recruit top law students.",
    perks: [
      "Dedicated Practice Management Dashboard",
      "Client appointment booking & status controls",
      "Post verified legal internships & review resumes",
      "Enhanced courtroom visibility and client reach",
    ],
    buttonText: "Continue as Lawyer",
  },
  {
    role: "CLIENT",
    title: "Become Client",
    badge: "Citizen & Business",
    icon: Users,
    description:
      "Get instant legal guidance, consult verified advocates across practice areas, generate legal drafts, and manage case appointments.",
    perks: [
      "24/7 AI LawBot for instant legal answers",
      "Verified advocate search & direct slot booking",
      "Automated legal notice & agreement generator",
      "Dedicated client dashboard for tracking consultations",
    ],
    buttonText: "Continue as Client",
  },
  {
    role: "STUDENT",
    title: "Become Student",
    badge: "Law Student & Intern",
    icon: GraduationCap,
    description:
      "Kickstart your legal career. Discover internship opportunities under certified advocates, track applications, and study with AI.",
    perks: [
      "Discover verified advocate and firm internships",
      "Single-click application submission with resume",
      "Real-time application status tracking",
      "Law library, demo case files, and precedent companion",
    ],
    buttonText: "Continue as Student",
  },
];

const Signup = () => {
  const navigate = useNavigate();

  // Step 1: Role Selection (null initially)
  const [selectedRole, setSelectedRole] = useState(null);

  const apiBase = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")
    : "";

  // Only specializations actually present in the database
  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [isLoadingSpecializations, setIsLoadingSpecializations] =
    useState(false);

  // Fetch actual specialization choices directly from database
  useEffect(() => {
    const fetchSpecializationsFromDatabase = async () => {
      setIsLoadingSpecializations(true);
      try {
        const response = await fetch(
          `${apiBase}/api/user/get-all-specializations/`,
        );
        const data = await response.json().catch(() => []);
        const dbChoices = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];
        setSpecializationOptions(dbChoices);
        // Automatically select the first specialization choice fetched from database
        if (dbChoices.length > 0) {
          const firstChoiceName =
            typeof dbChoices[0] === "string"
              ? dbChoices[0]
              : dbChoices[0]?.name || "";
          setForm((prev) => ({
            ...prev,
            specialization: prev.specialization || firstChoiceName,
          }));
        }
      } catch (err) {
        console.error("Error loading specializations from database:", err);
      } finally {
        setIsLoadingSpecializations(false);
      }
    };

    fetchSpecializationsFromDatabase();
  }, [apiBase]);

  // Form State
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    // Lawyer specific fields
    specialization: "", // ID or Name depending on backend serializer
    experienceYears: "0",
    cityOrCourt: "", // maps to working_place
    homeAddress: "", // maps to address
    startTime: "09:00", // maps to start_time
    endTime: "17:00", // maps to end_time
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], // maps to working_days
    about: "", // maps to about
    profileImage: null, // maps to profile_image File
    chatFree: true, // default True
    consultationFee: "0.00", // default 0.00
    // Student specific
    collegeName: "",
    course: "5-Year B.A. LL.B.",
    yearOfStudy: "1",
    // Client specific
    city: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "idle", message: "" });


  const daysList = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox" && name === "chatFree") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFeedback({ type: "idle", message: "" });
  };

  const handleWorkingDaysToggle = (day) => {
    setForm((prev) => {
      const exists = prev.workingDays.includes(day);
      const updatedDays = exists
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day];
      return { ...prev, workingDays: updatedDays };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Validation
    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
      setFeedback({
        type: "error",
        message: "Please fill in all required fields (Username, Email, Password).",
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setFeedback({
        type: "error",
        message: "Passwords do not match. Please re-enter your password.",
      });
      return;
    }

    if (form.password.length < 6) {
      setFeedback({
        type: "error",
        message: "Password must be at least 6 characters long.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: "idle", message: "" });

   try {
      // Use FormData if profile_image is uploaded, otherwise standard JSON payload
      let bodyData;
      let headers = {};

      if (selectedRole === "LAWYER" && form.profileImage) {
        // Multipart Form Payload for File Uploads
        const formData = new FormData();
        formData.append("username", form.username.trim());
        formData.append("email", form.email.trim());
        formData.append("password", form.password);
        formData.append("role", selectedRole);
        formData.append("full_name", form.fullName.trim() || form.username.trim());
        formData.append("phone_number", form.phoneNumber.trim());
        formData.append("specialization", form.specialization);
        formData.append("experience_years", parseInt(form.experienceYears, 10) || 0);
        formData.append("working_place", form.cityOrCourt.trim());
        formData.append("address", form.homeAddress.trim());
        formData.append("start_time", form.startTime);
        formData.append("end_time", form.endTime);
        formData.append("working_days", form.workingDays.join(","));
        formData.append("about", form.about.trim());
        formData.append("chat_free", form.chatFree);
        formData.append("consultation_fee", parseFloat(form.consultationFee) || 0.0);
        if (form.profileImage) {
          formData.append("profile_image", form.profileImage);
        }

        bodyData = formData;
      } else {
        // Standard JSON Payload
        headers["Content-Type"] = "application/json";
        const payload = {
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
          role: selectedRole,
          full_name: form.fullName.trim() || form.username.trim(),
          phone_number: form.phoneNumber.trim(),
          ...(selectedRole === "LAWYER"
            ? {
                specialization: form.specialization,
                experience_years: parseInt(form.experienceYears, 10) || 0,
                working_place: form.cityOrCourt.trim(),
                address: form.homeAddress.trim(),
                start_time: form.startTime,
                end_time: form.endTime,
                working_days: form.workingDays.join(","),
                about: form.about.trim(),
                chat_free: form.chatFree,
                consultation_fee: parseFloat(form.consultationFee) || 0.0,
              }
            : {}),
          ...(selectedRole === "STUDENT"
            ? {
                college_name: form.collegeName.trim(),
                course: form.course.trim(),
                year: parseInt(form.yearOfStudy, 10) || 1,
              }
            : {}),
          ...(selectedRole === "CLIENT"
            ? {
                address: form.city.trim(),
              }
            : {}),
        };
        bodyData = JSON.stringify(payload);
      }

      const response = await fetch(`${apiBase}/api/user/register/`, {
        method: "POST",
        headers,
        body: bodyData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        let errorMsg = "Registration failed. Please check your details.";
        if (data && typeof data === "object") {
          const firstKey = Object.keys(data)[0];
          if (firstKey && Array.isArray(data[firstKey])) {
            errorMsg = `${firstKey}: ${data[firstKey].join(" ")}`;
          } else if (data.detail || data.message || data.error) {
            errorMsg = data.detail || data.message || data.error;
          }
        }
        throw new Error(errorMsg);
      }

      // Save tokens and user info
      if (data?.access) {
        localStorage.setItem("access", data.access);
      }
      if (data?.refresh) {
        localStorage.setItem("refresh", data.refresh);
      }
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", (data.user.role || selectedRole).toUpperCase());
      } else {
        localStorage.setItem("role", selectedRole);
      }

      // Sync navbar in same window
      window.dispatchEvent(new Event("storage"));

      setFeedback({
        type: "success",
        message: `Account created successfully as ${selectedRole}! Redirecting to your dashboard...`,
      });

      // Redirect to role's dashboard
      setTimeout(() => {
        if (selectedRole === "LAWYER") {
          navigate("/lawyer_dash");
        } else if (selectedRole === "STUDENT") {
          navigate("/student_dash");
        } else {
          navigate("/user_dash");
        }
      }, 1000);
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Registration failed.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f2e8] px-4 pb-20 pt-28 text-stone-900 sm:px-6 lg:px-8">
      {/* Background Glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(251,191,36,0.18),transparent_36%),radial-gradient(circle_at_85%_18%,rgba(251,146,60,0.12),transparent_32%),radial-gradient(circle_at_50%_86%,rgba(245,222,179,0.45),transparent_42%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* ========================================================= */}
        {/* STEP 1: THREE ROLE SELECTION SCREEN                       */}
        {/* ========================================================= */}
        {!selectedRole ? (
          <div className="space-y-10">
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/70 bg-amber-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
                <Scale size={15} />
                Join CourtMitra
              </div>
              <h1 className="mt-4 text-3xl font-black text-stone-900 sm:text-5xl">
                Choose Your Role to Get Started
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-base">
                CourtMitra is tailored for three distinct legal roles. Select how
                you want to use the platform:
              </p>
            </div>

            {/* Three Options Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              {roleOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <div
                    key={opt.role}
                    className="law-panel group relative flex flex-col justify-between rounded-3xl border border-amber-200/80 bg-amber-50/90 p-6 shadow-[0_16px_36px_rgba(120,53,15,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400 hover:shadow-[0_24px_50px_rgba(120,53,15,0.16)] sm:p-7"
                  >
                    <div>
                      {/* Badge & Icon */}
                      <div className="flex items-center justify-between">
                        <div className="inline-flex rounded-2xl border border-amber-300/80 bg-amber-100/90 p-3 text-amber-900 transition-transform duration-300 group-hover:scale-105">
                          <Icon size={24} />
                        </div>
                        <span className="rounded-full border border-amber-300/70 bg-[#fff6e8] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-800">
                          {opt.badge}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h2 className="mt-5 text-2xl font-black text-stone-900">
                        {opt.title}
                      </h2>
                      <p className="mt-2 text-xs leading-relaxed text-stone-600 sm:text-sm">
                        {opt.description}
                      </p>

                      {/* Perks */}
                      <div className="mt-5 border-t border-amber-200/70 pt-4">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                          Included With Account:
                        </p>
                        <ul className="mt-2.5 space-y-2">
                          {opt.perks.map((perk, pIdx) => (
                            <li
                              key={pIdx}
                              className="flex items-start gap-2 text-xs text-stone-700"
                            >
                              <CheckCircle2
                                size={14}
                                className="mt-0.5 shrink-0 text-amber-700"
                              />
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-8 pt-2">
                      <button
                        type="button"
                        onClick={() => handleRoleSelect(opt.role)}
                        className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-amber-400 to-orange-500 py-3.5 text-sm font-bold text-amber-50 shadow-[0_10px_22px_rgba(217,119,6,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(217,119,6,0.35)] cursor-pointer"
                      >
                        <span>{opt.buttonText}</span>
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-300 group-hover/btn:translate-x-1"
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Already have account */}
            <div className="text-center pt-2">
              <p className="text-sm text-stone-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-amber-900 underline underline-offset-4 hover:text-orange-700 transition-colors"
                >
                  Log In here
                </Link>
              </p>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* STEP 2: REGISTRATION FORM FOR CHOSEN ROLE                 */
          /* ========================================================= */
          <div className="mx-auto max-w-2xl">
            <div className="law-panel rounded-4xl border border-amber-200/80 bg-amber-50/95 p-6 shadow-[0_22px_50px_rgba(120,53,15,0.12)] sm:p-9">
              {/* Back to Role Selection Button */}
              <div className="flex items-center justify-between border-b border-amber-200/70 pb-4">
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 transition-colors hover:text-orange-700 cursor-pointer"
                >
                  <ArrowLeft size={15} />
                  Change User Role
                </button>

                <span className="rounded-full border border-amber-300/80 bg-amber-200/80 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-amber-950">
                  {selectedRole === "LAWYER" && "Role: Lawyer / Advocate"}
                  {selectedRole === "CLIENT" && "Role: Client / Citizen"}
                  {selectedRole === "STUDENT" && "Role: Law Student"}
                </span>
              </div>

              {/* Form Header */}
              <div className="mt-5">
                <h1 className="text-2xl font-black text-stone-900 sm:text-3xl">
                  {selectedRole === "LAWYER" && "Create Your Lawyer Account"}
                  {selectedRole === "CLIENT" && "Create Your Client Account"}
                  {selectedRole === "STUDENT" && "Create Your Student Account"}
                </h1>
                <p className="mt-1 text-xs text-stone-600 sm:text-sm">
                  Fill in your details below to set up your CourtMitra workspace.
                </p>
              </div>

              {/* Feedback Alerts */}
              {feedback.type === "error" && (
                <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800">
                  {feedback.message}
                </div>
              )}
              {feedback.type === "success" && (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
                  {feedback.message}
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Account Credentials Group */}
                <div className="rounded-2xl border border-amber-200/70 bg-[#fffdfa] p-4 space-y-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                    Account Credentials
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-stone-700">
                      Username <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative mt-1">
                      <User
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                      />
                      <input
                        type="text"
                        name="username"
                        required
                        value={form.username}
                        onChange={handleChange}
                        placeholder="e.g. adv_sharma or priya_legal"
                        className="w-full rounded-xl border border-amber-200/80 bg-white py-2.5 pl-10 pr-4 text-xs text-stone-800 placeholder-stone-400 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-300/30 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative mt-1">
                      <Mail
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                      />
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="name@domain.com"
                        className="w-full rounded-xl border border-amber-200/80 bg-white py-2.5 pl-10 pr-4 text-xs text-stone-800 placeholder-stone-400 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-300/30 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-stone-700">
                        Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative mt-1">
                        <Lock
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                        />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          required
                          value={form.password}
                          onChange={handleChange}
                          placeholder="Min. 6 characters"
                          className="w-full rounded-xl border border-amber-200/80 bg-white py-2.5 pl-10 pr-10 text-xs text-stone-800 placeholder-stone-400 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-300/30 sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700">
                        Confirm Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative mt-1">
                        <Lock
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                        />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          required
                          value={form.confirmPassword}
                          onChange={handleChange}
                          placeholder="Re-enter password"
                          className="w-full rounded-xl border border-amber-200/80 bg-white py-2.5 pl-10 pr-10 text-xs text-stone-800 placeholder-stone-400 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-300/30 sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={15} />
                          ) : (
                            <Eye size={15} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal & Contact Details */}
                <div className="rounded-2xl border border-amber-200/70 bg-[#fffdfa] p-4 space-y-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                    Profile & Contact Information
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-stone-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder={
                          selectedRole === "LAWYER"
                            ? "Adv. Ramesh Saxena"
                            : "Your Full Name"
                        }
                        className="mt-1 w-full rounded-xl border border-amber-200/80 bg-white py-2.5 px-3.5 text-xs text-stone-800 placeholder-stone-400 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-300/30 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700">
                        Phone Number
                      </label>
                      <div className="relative mt-1">
                        <Phone
                          size={15}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                        />
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={form.phoneNumber}
                          onChange={handleChange}
                          placeholder="+91 9876543210"
                          className="w-full rounded-xl border border-amber-200/80 bg-white py-2.5 pl-10 pr-4 text-xs text-stone-800 placeholder-stone-400 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-300/30 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Role Specific Fields: LAWYER */}
                  {selectedRole === "LAWYER" && (
                    <div className="space-y-4 pt-2 border-t border-amber-200/60">
                      {/* Specialization & Experience */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-bold text-stone-700">
                            Primary Practice Area / Specialization
                          </label>
                          <select
                            name="specialization"
                            value={form.specialization}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-xl border border-amber-200/80 bg-white py-2.5 px-3.5 text-xs text-stone-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300/30 sm:text-sm"
                          >
                            <option value="">Select Specialization</option>
                            <option value="1">Criminal Law</option>
                            <option value="2">Civil Law</option>
                            <option value="3">Corporate Law</option>
                            <option value="4">Family & Matrimonial</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-700">
                            Years of Experience
                          </label>
                          <input
                            type="number"
                            name="experienceYears"
                            min="0"
                            max="60"
                            value={form.experienceYears}
                            onChange={handleChange}
                            placeholder="e.g. 5"
                            className="mt-1 w-full rounded-xl border border-amber-200/80 bg-white py-2.5 px-3.5 text-xs text-stone-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300/30 sm:text-sm"
                          />
                        </div>
                      </div>

                      {/* Home Address & Working Place */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-bold text-stone-700">
                            Office / Chamber Address
                          </label>
                          <input
                            type="text"
                            name="homeAddress"
                            value={form.homeAddress}
                            onChange={handleChange}
                            placeholder="e.g. 123 Chambers Block, City"
                            className="mt-1 w-full rounded-xl border border-amber-200/80 bg-white py-2.5 px-3.5 text-xs text-stone-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300/30 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-700">
                            Working Place / Court Jurisdiction
                          </label>
                          <input
                            type="text"
                            name="cityOrCourt"
                            value={form.cityOrCourt}
                            onChange={handleChange}
                            placeholder="e.g. High Court of Delhi"
                            className="mt-1 w-full rounded-xl border border-amber-200/80 bg-white py-2.5 px-3.5 text-xs text-stone-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300/30 sm:text-sm"
                          />
                        </div>
                      </div>

                      {/* Working Hours */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-bold text-stone-700">
                            Start Time
                          </label>
                          <input
                            type="time"
                            name="startTime"
                            value={form.startTime}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-xl border border-amber-200/80 bg-white py-2.5 px-3.5 text-xs text-stone-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300/30 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-700">
                            End Time
                          </label>
                          <input
                            type="time"
                            name="endTime"
                            value={form.endTime}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-xl border border-amber-200/80 bg-white py-2.5 px-3.5 text-xs text-stone-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300/30 sm:text-sm"
                          />
                        </div>
                      </div>

                      {/* Working Days Selector */}
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1.5">
                          Working Days
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {daysList.map((day) => {
                            const selected = form.workingDays.includes(day);
                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => handleWorkingDaysToggle(day)}
                                className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                                  selected
                                    ? "border-amber-500 bg-amber-500 text-white shadow-xs"
                                    : "border-amber-200 bg-white text-stone-600 hover:border-amber-300"
                                }`}
                              >
                                {day.slice(0, 3)}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Profile Image & About */}
                      <div>
                        <label className="block text-xs font-bold text-stone-700">
                          Profile Image
                        </label>
                        <input
                          type="file"
                          name="profileImage"
                          accept="image/*"
                          onChange={handleChange}
                          className="mt-1 w-full text-xs text-stone-600 file:mr-4 file:rounded-xl file:border-0 file:bg-amber-100 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-amber-900 hover:file:bg-amber-200"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700">
                          About / Professional Bio
                        </label>
                        <textarea
                          name="about"
                          rows="3"
                          value={form.about}
                          onChange={handleChange}
                          placeholder="Brief description of legal experience..."
                          className="mt-1 w-full rounded-xl border border-amber-200/80 bg-white py-2.5 px-3.5 text-xs text-stone-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300/30 sm:text-sm"
                        />
                      </div>

                      <div className="rounded-xl border border-amber-200/80 bg-amber-100/40 p-3.5 space-y-3">
                          <p className="text-xs font-bold text-amber-950">
                            Consultation & Chat Settings
                          </p>
  
                          <div className="grid gap-3 sm:grid-cols-2 items-center">
                            {/* Consultation Fee Input */}
                            <div>
                              <label className="block text-xs font-bold text-stone-700">
                                Consultation Fee (₹)
                              </label>
                              <div className="relative mt-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                                  ₹
                                </span>
                                <input
                                  type="number"
                                  name="consultationFee"
                                  min="0"
                                  step="0.01"
                                  value={form.consultationFee}
                                  onChange={handleChange}
                                  placeholder="0.00"
                                  className="w-full rounded-xl border border-amber-200/80 bg-white py-2 pl-7 pr-3 text-xs text-stone-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300/30 sm:text-sm"
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-start sm:gap-3 pt-2 sm:pt-4">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  name="chatFree"
                                  checked={form.chatFree}
                                  onChange={handleChange}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                              </label>
                              <span className="text-xs font-semibold text-stone-700">
                                Enable Free Initial Chat
                              </span>
                            </div>
                          </div>
                        </div>   
                      </div>
                  )}

                  {/* Role Specific Fields: STUDENT */}
                  {selectedRole === "STUDENT" && (
                    <div className="grid gap-3 pt-1 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-stone-700">
                          Law College / University Name
                        </label>
                        <input
                          type="text"
                          name="collegeName"
                          value={form.collegeName}
                          onChange={handleChange}
                          placeholder="e.g. National Law University / Faculty of Law"
                          className="mt-1 w-full rounded-xl border border-amber-200/80 bg-white py-2.5 px-3.5 text-xs text-stone-800 placeholder-stone-400 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-300/30 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700">
                          Course
                        </label>
                        <input
                          type="text"
                          name="course"
                          value={form.course}
                          onChange={handleChange}
                          placeholder="e.g. 5-Year B.A. LL.B. / 3-Year LL.B."
                          className="mt-1 w-full rounded-xl border border-amber-200/80 bg-white py-2.5 px-3.5 text-xs text-stone-800 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-300/30 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700">
                          Year of Study
                        </label>
                        <select
                          name="yearOfStudy"
                          value={form.yearOfStudy}
                          onChange={handleChange}
                          className="mt-1 w-full rounded-xl border border-amber-200/80 bg-white py-2.5 px-3.5 text-xs text-stone-800 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-300/30 sm:text-sm"
                        >
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                          <option value="5">5th Year</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Role Specific Fields: CLIENT */}
                  {selectedRole === "CLIENT" && (
                    <div className="pt-1">
                      <label className="block text-xs font-bold text-stone-700">
                        City / State
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="e.g. Mumbai, Maharashtra"
                        className="mt-1 w-full rounded-xl border border-amber-200/80 bg-white py-2.5 px-3.5 text-xs text-stone-800 placeholder-stone-400 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-300/30 sm:text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Privacy agreement */}
                <div className="pt-1">
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    By clicking Register, you agree to CourtMitra's{" "}
                    <Link
                      to="/privacy-policy"
                      className="underline text-amber-900 hover:text-orange-700"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and professional code of conduct.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-amber-400 to-orange-500 py-3.5 text-sm font-bold text-amber-50 shadow-[0_12px_26px_rgba(217,119,6,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(217,119,6,0.35)] disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Creating Account...</span>
                    ) : (
                      <>
                        <span>
                          {selectedRole === "LAWYER" && "Complete Lawyer Registration"}
                          {selectedRole === "CLIENT" && "Complete Client Registration"}
                          {selectedRole === "STUDENT" && "Complete Student Registration"}
                        </span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Back to Login */}
              <div className="mt-6 border-t border-amber-200/70 pt-4 text-center">
                <p className="text-xs text-stone-600 sm:text-sm">
                  Already registered on CourtMitra?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-amber-900 underline underline-offset-4 hover:text-orange-700 transition-colors"
                  >
                    Log In to Your Account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Signup;
