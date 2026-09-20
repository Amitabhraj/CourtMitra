import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CircleUserRound,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  Scale,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "idle", message: "" });

  const accessRoles = useMemo(
    () => ["LAWYER", "STUDENT", "CLIENT", "ADMIN"],
    [],
  );

  const loginEndpoint = import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")}/api/user/login/`
    : "/api/user/login/";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.username.trim() || !form.password.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: "idle", message: "" });

    try {
      const response = await fetch(loginEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Login failed. Check your credentials.",
        );
      }

      if (data?.access) {
        localStorage.setItem("access", data.access);
      }
      if (data?.refresh) {
        localStorage.setItem("refresh", data.refresh);
      }
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.user.role) {
          localStorage.setItem("role", data.user.role.toUpperCase());
        }
      }

      // Dispatch custom storage event so Navbar updates immediately in the same window
      window.dispatchEvent(new Event("storage"));

      const userRole = (data?.user?.role || "").toUpperCase();
      let targetDashboard = "/dashboard";
      if (userRole === "LAWYER") {
        targetDashboard = "/lawyer_dash";
      } else if (userRole === "STUDENT") {
        targetDashboard = "/student_dash";
      } else if (userRole === "CLIENT") {
        targetDashboard = "/user_dash";
      }

      setFeedback({
        type: "success",
        message: data?.message || `Login successful as ${userRole || "user"}. Redirecting to your dashboard...`,
      });

      setTimeout(() => {
        navigate(targetDashboard);
      }, 700);
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to log in.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f2e8] px-4 pb-16 pt-28 text-stone-900 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(251,191,36,0.20),transparent_34%),radial-gradient(circle_at_84%_16%,rgba(251,146,60,0.12),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(245,222,179,0.44),transparent_42%)]" />
      <div className="pointer-events-none absolute -left-24 top-36 h-72 w-72 rounded-full bg-amber-300/18 blur-[110px]" />
      <div className="pointer-events-none absolute -right-20 top-72 h-80 w-80 rounded-full bg-orange-200/18 blur-[120px]" />

      <section className="law-panel relative z-10 mx-auto grid w-full max-w-7xl overflow-hidden rounded-4xl border border-amber-200/70 bg-amber-50/90 shadow-[0_22px_50px_rgba(120,53,15,0.14)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative overflow-hidden px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,251,235,0.92),rgba(254,243,199,0.54)_42%,rgba(255,251,235,0.92))]" />
          <div className="absolute -left-20 top-10 h-44 w-44 rounded-full bg-amber-300/20 blur-3xl" />
          <div className="absolute bottom-2 right-0 h-52 w-52 rounded-full bg-orange-200/20 blur-3xl" />

          <div className="relative z-10 flex h-full flex-col justify-between gap-10">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-amber-300/70 bg-amber-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
                <Sparkles size={13} />
                Secure access
              </p>

              <div className="max-w-2xl space-y-4">
                <h1 className="text-4xl font-black leading-[1.02] text-stone-900 sm:text-5xl lg:text-6xl">
                  Sign in to your legal workspace.
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
                  Access your dashboard as a lawyer, student, client, or admin.
                  Keep appointments, case notes, and legal tools in one calm,
                  focused place.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-amber-200/70 bg-amber-50/85 p-4 shadow-[0_10px_24px_rgba(120,53,15,0.06)]">
                  <ShieldCheck className="text-amber-700" size={20} />
                  <h2 className="mt-3 text-sm font-bold text-stone-900">
                    Protected login
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-stone-600">
                    Designed for authenticated access across every role.
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-200/70 bg-amber-50/85 p-4 shadow-[0_10px_24px_rgba(120,53,15,0.06)]">
                  <Scale className="text-amber-700" size={20} />
                  <h2 className="mt-3 text-sm font-bold text-stone-900">
                    Role aware
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-stone-600">
                    Built for LAWYER, STUDENT, CLIENT, and ADMIN accounts.
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-200/70 bg-amber-50/85 p-4 shadow-[0_10px_24px_rgba(120,53,15,0.06)]">
                  <BadgeCheck className="text-amber-700" size={20} />
                  <h2 className="mt-3 text-sm font-bold text-stone-900">
                    Fast handoff
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-stone-600">
                    Route into the right workflow after sign in.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {accessRoles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-2 rounded-full border border-amber-200/70 bg-[#fff8ec] px-4 py-2 text-xs font-semibold tracking-[0.14em] text-stone-700"
                >
                  <UserRound size={12} />
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative border-t border-amber-200/70 bg-[#fff8ed] px-6 py-10 sm:px-8 sm:py-12 lg:border-l lg:border-t-0 lg:px-10 lg:py-14">
          <div className="mx-auto max-w-lg">
            <div className="mb-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-amber-300/70 bg-amber-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
                <CircleUserRound size={13} />
                User Login
              </p>
              <h2 className="mt-4 text-3xl font-black text-stone-900 sm:text-4xl">
                Welcome back.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
                Enter your username and password to continue to the platform.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="law-card space-y-4 rounded-3xl border border-amber-200/70 bg-amber-50/90 p-5 shadow-[0_16px_32px_rgba(120,53,15,0.1)] sm:p-6"
            >
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-stone-700">
                  Username
                </span>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                  placeholder="Enter your username"
                  className="w-full rounded-2xl border border-amber-200/80 bg-[#fff8ec] px-4 py-3.5 text-sm text-stone-800 outline-none ring-0 placeholder:text-stone-500 focus:border-amber-400"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-stone-700">
                  Password
                </span>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-amber-200/80 bg-[#fff8ec] px-4 py-3.5 pr-12 text-sm text-stone-800 outline-none ring-0 placeholder:text-stone-500 focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-stone-500 transition-colors hover:text-stone-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between gap-3 text-sm">
                <label className="inline-flex items-center gap-2 text-stone-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-amber-300 text-amber-500 focus:ring-amber-400"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="font-semibold text-amber-800 transition-colors hover:text-amber-900"
                >
                  Forgot password?
                </button>
              </div>

              {feedback.message && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${
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
                disabled={isSubmitting}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-amber-400 to-orange-500 px-5 py-3.5 text-sm font-semibold text-amber-50 shadow-[0_14px_28px_rgba(217,119,6,0.26)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(217,119,6,0.34)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </button>

              <p className="text-center text-xs leading-relaxed text-stone-500">
                By signing in, you access CourtMitra’s legal workspace and
                role-based tools.
              </p>

              <div className="pt-3 text-center border-t border-amber-200/70">
                <p className="text-xs text-stone-600 sm:text-sm">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-bold text-amber-900 underline underline-offset-4 hover:text-orange-700 transition-colors"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
