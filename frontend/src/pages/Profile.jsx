import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, LayoutDashboard, LogOut, Scale, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LawyerProfilePanel from "../components/profile/LawyerProfilePanel";
import StudentProfilePanel from "../components/profile/StudentProfilePanel";
import ClientProfilePanel from "../components/profile/ClientProfilePanel";

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);

  const accessToken = localStorage.getItem("access");
  const apiBase = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")
    : "";

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  const fetchUserDetail = useCallback(async () => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiBase}/api/user/user-detail/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.detail || "Unable to load profile details.");
      }

      setUserData(data);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to load profile details.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, apiBase, navigate]);

  useEffect(() => {
    fetchUserDetail();
  }, [fetchUserDetail]);

  const profile = userData?.profile || null;
  const role = (userData?.role || profile?.user?.role || "").toUpperCase();

  const dashboardPath = useMemo(() => {
    if (role === "LAWYER") return "/lawyer_dash";
    if (role === "STUDENT") return "/student_dash";
    return "/user_dash";
  }, [role]);

  const roleTitle = role || "USER";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f2e8] px-4 pb-16 pt-28 text-stone-900 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_16%,rgba(251,191,36,0.18),transparent_34%),radial-gradient(circle_at_84%_14%,rgba(251,146,60,0.12),transparent_30%),radial-gradient(circle_at_52%_82%,rgba(245,222,179,0.4),transparent_44%)]" />

      <section className="law-panel relative z-10 mx-auto max-w-7xl rounded-4xl border border-amber-200/70 bg-amber-50/90 p-5 shadow-[0_22px_50px_rgba(120,53,15,0.14)] sm:p-7 lg:p-9">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-amber-200/80 pb-5">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-amber-300/70 bg-amber-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
              <ShieldCheck size={13} />
              User Profile
            </p>
            <h1 className="mt-3 text-3xl font-black text-stone-900 sm:text-4xl">
              Your CourtMitra Profile
            </h1>
            <p className="mt-1 text-sm text-stone-600 sm:text-base">
              Manage your {roleTitle} profile and keep details updated.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={dashboardPath}
              className="group inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-amber-400 to-orange-500 px-5 py-3 text-sm font-semibold text-amber-50 shadow-[0_12px_24px_rgba(217,119,6,0.26)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(217,119,6,0.32)]"
            >
              <LayoutDashboard size={16} />
              Go to Dashboard
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-2xl border border-rose-200/80 bg-rose-50/90 px-5 py-3 text-sm font-semibold text-rose-700 shadow-sm transition-all duration-300 hover:border-rose-300 hover:bg-rose-100 hover:text-rose-900 cursor-pointer"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="mt-5 rounded-2xl border border-amber-200/80 bg-[#fff8ec] px-4 py-5 text-sm text-stone-600">
            Loading your profile...
          </div>
        )}

        {!isLoading && error && (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-5 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!isLoading && !error && userData && (
          <div className="mt-6 space-y-5">
            <div className="rounded-2xl border border-amber-200/80 bg-[#fff8ec] px-4 py-3 text-sm text-stone-700 sm:flex sm:items-center sm:justify-between">
              <p>
                <span className="font-semibold text-stone-900">Username:</span>{" "}
                {userData?.username}
              </p>
              <p>
                <span className="font-semibold text-stone-900">Email:</span>{" "}
                {userData?.email || "Not provided"}
              </p>
              <p className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-900">
                <Scale size={12} />
                {roleTitle}
              </p>
            </div>

            {role === "LAWYER" && (
              <LawyerProfilePanel
                apiBase={apiBase}
                accessToken={accessToken}
                profile={profile}
                onProfileUpdated={fetchUserDetail}
              />
            )}

            {role === "STUDENT" && (
              <StudentProfilePanel
                apiBase={apiBase}
                accessToken={accessToken}
                profile={profile}
                onProfileUpdated={fetchUserDetail}
              />
            )}

            {role === "CLIENT" && (
              <ClientProfilePanel
                apiBase={apiBase}
                accessToken={accessToken}
                profile={profile}
                onProfileUpdated={fetchUserDetail}
              />
            )}

            {!["LAWYER", "STUDENT", "CLIENT"].includes(role) && (
              <div className="rounded-2xl border border-amber-200/80 bg-[#fff8ec] px-4 py-5 text-sm text-stone-700">
                Profile editor is available for Lawyer, Student, and Client
                roles.
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default Profile;
