import React, { useEffect, useState } from "react";
import {
  Menu,
  X,
  LogIn,
  Sparkles,
  Scale,
  ArrowUpRight,
  CircleUserRound,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAccessToken, setHasAccessToken] = useState(false);

  useEffect(() => {
    const syncAuthState = () => {
      setHasAccessToken(Boolean(localStorage.getItem("access")));
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  const navItems = [
    { name: "LawBot", href: "/lawbot" },
    { name: "Find Lawyer", href: "/find-lawyer" },
    { name: "Internships", href: "/internships" },
    { name: "About Us", href: "/about" },
    { name: "Quick Links", href: "/quick-links" },
  ];

  const navLinkClass = ({ isActive }) =>
    [
      "group relative px-4 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 rounded-xl",
      "border border-transparent",
      isActive
        ? "text-amber-900 bg-amber-100/80 border-amber-300/70 shadow-[0_0_0_1px_rgba(251,191,36,0.25),0_8px_24px_rgba(120,53,15,0.12)]"
        : "text-stone-700 hover:text-stone-900 hover:bg-amber-50 hover:border-amber-200",
    ].join(" ");

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-3 sm:px-5 lg:px-7 pt-3">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-amber-200/70 bg-[#fffaf2]/88 backdrop-blur-xl shadow-[0_18px_40px_rgba(120,53,15,0.12)]">
        <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-amber-200/35 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-orange-100/35 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-300/70 to-transparent" />

        <div className="relative flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="group flex items-center gap-3">
              <div className="relative grid h-11 w-11 place-items-center rounded-2xl border border-amber-300/70 bg-linear-to-br from-amber-300 to-orange-400 text-amber-950 shadow-[0_10px_22px_rgba(217,119,6,0.25)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_12px_26px_rgba(217,119,6,0.33)]">
                <Scale size={20} strokeWidth={2.3} />
                <span className="absolute -right-1 -top-1 rounded-full border border-amber-200 bg-amber-50 p-0.5 text-[10px] text-amber-700">
                  <Sparkles size={10} />
                </span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[11px] uppercase tracking-[0.24em] text-amber-700/90">
                  Legal Intelligence
                </span>
                <span className="bg-linear-to-r from-amber-700 via-amber-600 to-orange-500 bg-clip-text text-2xl font-black text-transparent">
                  CourtMitra
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1 rounded-2xl border border-amber-200/70 bg-amber-50/80 px-2 py-3.5">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="law-enter-up"
                style={{ animationDelay: "120ms" }}
              >
                <NavLink to={item.href} className={navLinkClass}>
                  {item.name}
                  <span className="pointer-events-none absolute inset-x-2 -bottom-0.5 h-0.5 scale-x-0 rounded-full bg-linear-to-r from-amber-300 via-orange-200 to-amber-300 transition-transform duration-300 group-hover:scale-x-100" />
                </NavLink>
              </div>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {hasAccessToken ? (
              <Link
                to="/profile"
                className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-semibold text-amber-50 shadow-[0_10px_22px_rgba(217,119,6,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(217,119,6,0.35)]"
              >
                <CircleUserRound size={16} />
                Profile
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="group inline-flex items-center gap-2 rounded-xl border border-amber-200/70 bg-amber-50/85 px-5 py-2.5 text-sm font-semibold text-stone-700 transition-all duration-300 hover:border-amber-300 hover:bg-amber-50 hover:text-stone-900"
                >
                  <LogIn size={16} />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-semibold text-amber-50 shadow-[0_10px_22px_rgba(217,119,6,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(217,119,6,0.35)]"
                >
                  Sign Up
                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden rounded-xl border border-amber-200/70 bg-amber-50/90 p-2.5 text-stone-700 transition-colors hover:bg-amber-50"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-stone-700" />
            ) : (
              <Menu className="w-6 h-6 text-stone-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className="md:hidden overflow-hidden"
          style={{
            opacity: isOpen ? 1 : 0,
            maxHeight: isOpen ? "420px" : "0px",
            transform: isOpen ? "translateY(0px)" : "translateY(-8px)",
            transition:
              "opacity 220ms ease, max-height 240ms ease, transform 220ms ease",
          }}
        >
          <div className="space-y-2 border-t border-amber-200/70 bg-[#fffaf2]/95 px-3 pb-4 pt-3 backdrop-blur-xl">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  [
                    "block rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-300",
                    isActive
                      ? "border-amber-300 bg-amber-100/90 text-amber-900"
                      : "border-amber-200/70 text-stone-700 hover:border-amber-300 hover:bg-amber-50 hover:text-stone-900",
                  ].join(" ")
                }
              >
                {item.name}
              </NavLink>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {hasAccessToken ? (
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-center text-sm font-semibold text-amber-50"
                >
                  <CircleUserRound size={15} />
                  Profile
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-2.5 text-center text-sm font-semibold text-stone-700 transition-colors hover:bg-amber-50"
                  >
                    <LogIn size={15} />
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-center text-sm font-semibold text-amber-50"
                  >
                    Sign Up
                    <ArrowUpRight size={14} />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
