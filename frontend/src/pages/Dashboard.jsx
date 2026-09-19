import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LawyerDashboard from "./LawyerDashboard";
import StudentDashboard from "./StudentDashboard";
import UserDashboard from "./UserDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access");
  const storedRole = (localStorage.getItem("role") || "").toUpperCase();

  const [role, setRole] = useState(storedRole);
  const [isLoading, setIsLoading] = useState(!storedRole);

  const apiBase = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")
    : "";

  const resolveRole = useCallback(async () => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${apiBase}/api/user/user-detail/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        const resolved = (data?.role || data?.profile?.user?.role || "").toUpperCase();
        if (resolved) {
          setRole(resolved);
          localStorage.setItem("role", resolved);
          if (data) {
            localStorage.setItem("user", JSON.stringify(data));
          }
        }
      } else if (response.status === 401) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("storage"));
        navigate("/login");
      }
    } catch {
      // Fall back to storedRole if network or backend is unreachable
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, apiBase, navigate]);

  useEffect(() => {
    resolveRole();
  }, [resolveRole]);

  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#f8f2e8] px-4 pb-16 pt-28 text-stone-900 sm:px-6 lg:px-8">
        <section className="law-panel relative z-10 mx-auto max-w-4xl rounded-4xl border border-amber-200/70 bg-amber-50/90 p-8 text-center shadow-[0_22px_50px_rgba(120,53,15,0.14)]">
          <p className="text-lg font-bold text-stone-800">
            Routing to your dashboard...
          </p>
          <p className="mt-1 text-sm text-stone-600">
            Checking your CourtMitra account role.
          </p>
        </section>
      </main>
    );
  }

  // Render role-specific dashboard
  if (role === "LAWYER") {
    return <LawyerDashboard />;
  }

  if (role === "STUDENT") {
    return <StudentDashboard />;
  }

  // Default to Client Dashboard (UserDashboard) for CLIENT or general users
  return <UserDashboard />;
};

export default Dashboard;
