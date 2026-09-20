import React, { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  LogIn,
  Sparkles,
  Scale,
  ArrowUpRight,
  User,
  LayoutDashboard,
  ChevronDown,
  Gavel,
  Users,
  GraduationCap,
  ShieldCheck,
  Info,
  LogOut,
  Bot,
  Link2,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const [userRole, setUserRole] = useState("");

  // Dropdown states
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Refs for click outside
  const servicesDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const syncAuthState = () => {
      const token = localStorage.getItem("access");
      setHasAccessToken(Boolean(token));

      let role = localStorage.getItem("role") || "";
      if (!role) {
        try {
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const userObj = JSON.parse(userStr);
            if (userObj?.role) role = userObj.role;
          }
        } catch {
          // ignore parse error
        }
      }
      setUserRole(role ? role.toUpperCase() : "");
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  // Handle clicking outside of dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        servicesDropdownRef.current &&
        !servicesDropdownRef.current.contains(event.target)
      ) {
        setIsServicesOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    setIsOpen(false);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setHasAccessToken(false);
    setUserRole("");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  // Build main nav items strictly according to user type
  let navItems = [];
  let rightDropdownItems = [];

  if (hasAccessToken) {
    if (userRole === "STUDENT") {
      // 1. Student: Dashboard, LawBot, Internship, Quick Links
      navItems = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "LawBot", href: "/lawbot" },
        { name: "Internship", href: "/internships" },
        { name: "Quick Links", href: "/quick-links" },
      ];
      // Beside left of profile button: Find lawyers, Find Client
      rightDropdownItems = [
        { name: "Find Lawyers", href: "/find-lawyer", icon: Gavel },
        { name: "Find Client", href: "/find-client", icon: Users },
      ];
    } else if (userRole === "LAWYER") {
      // 2. Lawyer: Dashboard, Find Client, LawBot, Quick Links
      navItems = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Find Client", href: "/find-client" },
        { name: "LawBot", href: "/lawbot" },
        { name: "Quick Links", href: "/quick-links" },
      ];
      // Beside left of profile button: Find lawyers, Internships
      rightDropdownItems = [
        { name: "Find Lawyers", href: "/find-lawyer", icon: Gavel },
        { name: "Internships", href: "/internships", icon: GraduationCap },
      ];
    } else if (userRole === "CLIENT") {
      // 3. Client: Dashboard, Find Lawyer, LawBot, Quick Links
      navItems = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Find Lawyer", href: "/find-lawyer" },
        { name: "LawBot", href: "/lawbot" },
        { name: "Quick Links", href: "/quick-links" },
      ];
      // Beside left of profile button: do NOT add anything
      rightDropdownItems = [];
    } else {
      // Logged in without designated role: fallback
      navItems = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "LawBot", href: "/lawbot" },
        { name: "Find Lawyer", href: "/find-lawyer" },
        { name: "Quick Links", href: "/quick-links" },
      ];
      rightDropdownItems = [];
    }
  } else {
    // Visitor / Not Logged In
    navItems = [
      { name: "LawBot", href: "/lawbot" },
      { name: "Find Lawyer", href: "/find-lawyer" },
      { name: "Internships", href: "/internships" },
      { name: "About Us", href: "/about" },
      { name: "Quick Links", href: "/quick-links" },
    ];
    rightDropdownItems = [];
  }

  const navLinkClass = ({ isActive }) =>
    [
      "group relative px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-300 rounded-xl",
      "border border-transparent",
      isActive
        ? "text-amber-900 bg-amber-100/80 border-amber-300/70 shadow-[0_0_0_1px_rgba(251,191,36,0.25),0_8px_24px_rgba(120,53,15,0.12)]"
        : "text-stone-700 hover:text-stone-900 hover:bg-amber-50 hover:border-amber-200",
    ].join(" ");

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-3 sm:px-5 lg:px-7 pt-3">
      <div className="relative mx-auto max-w-7xl overflow-visible rounded-2xl border border-amber-200/70 bg-[#fffaf2]/88 backdrop-blur-xl shadow-[0_18px_40px_rgba(120,53,15,0.12)]">
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

          {/* Desktop Nav Links (Ordered based on user type) */}
          <div className="hidden md:flex items-center gap-1 rounded-2xl border border-amber-200/70 bg-amber-50/80 px-2 py-2.5">
            {navItems.map((item) => (
              <div key={item.name} className="law-enter-up">
                <NavLink to={item.href} className={navLinkClass}>
                  {item.name}
                  <span className="pointer-events-none absolute inset-x-2 -bottom-0.5 h-0.5 scale-x-0 rounded-full bg-linear-to-r from-amber-300 via-orange-200 to-amber-300 transition-transform duration-300 group-hover:scale-x-100" />
                </NavLink>
              </div>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {hasAccessToken ? (
              <div className="flex items-center gap-2">
                {/* Dropdown beside left side of profile button (for Student & Lawyer) */}
                {rightDropdownItems.length > 0 && (
                  <div className="relative" ref={servicesDropdownRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsServicesOpen((prev) => !prev);
                        setIsProfileOpen(false);
                      }}
                      className="group inline-flex items-center gap-1.5 rounded-xl border border-amber-200/80 bg-amber-50/85 px-3.5 py-2 text-sm font-semibold text-stone-700 transition-all duration-300 hover:border-amber-300 hover:bg-amber-100/70 hover:text-stone-900"
                    >
                      <span>Explore</span>
                      <ChevronDown
                        size={15}
                        className={`text-amber-800 transition-transform duration-200 ${
                          isServicesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Services Dropdown Menu */}
                    {isServicesOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-2xl border border-amber-200/80 bg-[#fffaf2]/95 p-1.5 shadow-[0_16px_36px_rgba(120,53,15,0.14)] backdrop-blur-xl z-50">
                        {rightDropdownItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.name}
                              to={item.href}
                              onClick={() => setIsServicesOpen(false)}
                              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 transition-colors hover:bg-amber-100/80 hover:text-stone-950"
                            >
                              <span className="rounded-lg border border-amber-200/80 bg-amber-100/70 p-1 text-amber-900">
                                <Icon size={14} />
                              </span>
                              <span>{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Profile Button (ONLY MAN ICON) with Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen((prev) => !prev);
                      setIsServicesOpen(false);
                    }}
                    title="Profile & Settings"
                    aria-label="Profile and Settings Menu"
                    className="relative grid h-10 w-10 place-items-center rounded-xl border border-amber-200/80 bg-amber-50/90 text-stone-700 shadow-sm transition-all duration-300 hover:border-amber-300 hover:bg-amber-100/80 hover:text-stone-950"
                  >
                    <User size={19} />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-amber-200/80 bg-[#fffaf2]/95 p-1.5 shadow-[0_18px_40px_rgba(120,53,15,0.16)] backdrop-blur-xl z-50">
                      {/* Manage Profile */}
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-700 transition-colors hover:bg-amber-100/80 hover:text-stone-950"
                      >
                        <span className="rounded-lg border border-amber-200/80 bg-amber-100/70 p-1 text-amber-900">
                          <User size={14} />
                        </span>
                        <span>Manage Profile</span>
                      </Link>

                      {/* Privacy Policy */}
                      <Link
                        to="/privacy-policy"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-700 transition-colors hover:bg-amber-100/80 hover:text-stone-950"
                      >
                        <span className="rounded-lg border border-amber-200/80 bg-amber-100/70 p-1 text-amber-900">
                          <ShieldCheck size={14} />
                        </span>
                        <span>Privacy Policy</span>
                      </Link>

                      {/* About Us */}
                      <Link
                        to="/about"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-700 transition-colors hover:bg-amber-100/80 hover:text-stone-950"
                      >
                        <span className="rounded-lg border border-amber-200/80 bg-amber-100/70 p-1 text-amber-900">
                          <Info size={14} />
                        </span>
                        <span>About Us</span>
                      </Link>

                      {/* Divider */}
                      <div className="my-1 border-t border-amber-200/60" />

                      {/* Logout */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-50"
                      >
                        <span className="rounded-lg border border-rose-200 bg-rose-100/60 p-1 text-rose-700">
                          <LogOut size={14} />
                        </span>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
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
                  Join Now
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
            maxHeight: isOpen ? "580px" : "0px",
            transform: isOpen ? "translateY(0px)" : "translateY(-8px)",
            transition:
              "opacity 220ms ease, max-height 240ms ease, transform 220ms ease",
          }}
        >
          <div className="space-y-2 border-t border-amber-200/70 bg-[#fffaf2]/95 px-3 pb-5 pt-3 backdrop-blur-xl">
            {/* Primary Nav Links */}
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

            {/* Extra items for Student/Lawyer on mobile */}
            {hasAccessToken && rightDropdownItems.length > 0 && (
              <div className="pt-2 border-t border-amber-200/60">
                <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-amber-900">
                  More Services
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {rightDropdownItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 rounded-xl border border-amber-200/70 bg-[#fffdfa] px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-amber-100"
                      >
                        <Icon size={14} className="text-amber-800" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Profile / Auth section on mobile */}
            <div className="pt-3 border-t border-amber-200/70">
              {hasAccessToken ? (
                <div className="space-y-1.5">
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-2.5 text-xs font-semibold text-stone-800"
                  >
                    <User size={15} className="text-amber-800" />
                    <span>Manage Profile</span>
                  </Link>
                  <Link
                    to="/privacy-policy"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-2.5 text-xs font-semibold text-stone-800"
                  >
                    <ShieldCheck size={15} className="text-amber-800" />
                    <span>Privacy Policy</span>
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-2.5 text-xs font-semibold text-stone-800"
                  >
                    <Info size={15} className="text-amber-800" />
                    <span>About Us</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/90 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
