import React from "react";
import { Link } from "react-router-dom";
import {
  Scale,
  ShieldCheck,
  Bot,
  FileText,
  Users,
  GraduationCap,
  Briefcase,
  Calendar,
  Landmark,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Lock,
  Cpu,
  Layers,
  Globe,
  Award,
} from "lucide-react";

const corePillars = [
  {
    role: "For Citizens & Clients",
    badge: "Public Legal Access",
    icon: Users,
    tagline: "Empowering every individual with legal clarity, verified representation, and peace of mind.",
    features: [
      "Instant 24/7 legal guidance via AI LawBot with clear, jargon-free explanations",
      "Comprehensive verified advocate directory searchable by practice area, experience, and location",
      "Frictionless appointment booking with real-time calendar slot scheduling",
      "Automated drafting of standard legal documents (affidavits, rental agreements, notices)",
      "Dedicated Client Dashboard to monitor active consultations and case proceedings",
    ],
  },
  {
    role: "For Advocates & Law Firms",
    badge: "Practice Modernization",
    icon: Briefcase,
    tagline: "Streamlining practice management, talent acquisition, and client engagement.",
    features: [
      "Centralized practice dashboard to manage incoming appointments, client requests, and schedules",
      "Verified professional profile showcasing courtroom expertise, domain experience, and client reviews",
      "Exclusive legal internship portal to post openings, review candidate resumes, and recruit top talent",
      "AI-accelerated legal research tools for precedent lookup and rapid draft synthesis",
      "Secure and professional communication channels with prospective and active clients",
    ],
  },
  {
    role: "For Law Students & Aspiring Advocates",
    badge: "Career & Knowledge Bridge",
    icon: GraduationCap,
    tagline: "Bridging academic theory with practical courtroom exposure and mentorship.",
    features: [
      "Discover verified legal internships under practicing advocates and prestigious firms",
      "Single-click application workflow with resume submission and real-time status tracking",
      "AI-powered study and research assistant to explore legal statutes, case precedents, and drafts",
      "Dedicated Student Dashboard to monitor applied internships, responses, and upcoming opportunities",
      "Early career foundation with hands-on exposure to practical legal mechanics and paperwork",
    ],
  },
];

const platformCapabilities = [
  {
    icon: Bot,
    title: "AI Legal Assistant (LawBot)",
    description:
      "A domain-trained legal intelligence engine powered by Retrieval-Augmented Generation (RAG) and vector search over Indian statutes, penal codes, and case precedents. Delivers structured legal insights, rights breakdowns, and contextual next steps.",
  },
  {
    icon: FileText,
    title: "Intelligent Document Drafting",
    description:
      "Automated legal document engine that generates customized contracts, affidavits, and legal notices in real-time. Built with interactive preview capabilities and client-side high-resolution PDF exports.",
  },
  {
    icon: Calendar,
    title: "Advocate Discovery & Slot Booking",
    description:
      "A transparent, verified directory of legal practitioners categorized by jurisdiction, court hierarchy, and specialty domains. Clients can view verified credentials and book available consultation slots seamlessly.",
  },
  {
    icon: Briefcase,
    title: "Legal Internship & Talent Hub",
    description:
      "An integrated career gateway enabling law firms and advocates to post verified internship opportunities, while law students apply, upload resumes, and track their selection process in real time.",
  },
  {
    icon: Landmark,
    title: "Direct Judicial Gateway",
    description:
      "Centralized access to India's official judicial digital infrastructure, including the Supreme Court of India, High Courts across all states, eCourts India, the National Judicial Data Grid, and NALSA legal aid.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Secure Dashboards",
    description:
      "Customized, permissioned digital workspaces tailored specifically for Clients, Advocates, and Students. Features state-of-the-art authentication, complete workflow segregation, and data privacy safeguards.",
  },
];

const architecturalStrengths = [
  {
    icon: Cpu,
    title: "Retrieval-Augmented Generation (RAG)",
    description:
      "Combines vector database embeddings with high-throughput language models to ground AI legal responses strictly in factual statutory law and authentic precedents.",
  },
  {
    icon: Layers,
    title: "Full-Stack Enterprise Architecture",
    description:
      "Engineered with a high-performance React frontend, robust Django REST Framework backend services, and a dedicated asynchronous AI processing layer.",
  },
  {
    icon: Lock,
    title: "Privacy & Data Integrity",
    description:
      "Designed with role-based JWT security, strict session governance, and protected consultation channels to ensure privileged legal inquiries remain confidential.",
  },
  {
    icon: Globe,
    title: "Accessible & User-Centric",
    description:
      "Carefully crafted user experience with responsive design, accessible navigation, intuitive document exports, and rapid loading times across all devices.",
  },
];

const stats = [
  { label: "AI Guidance Availability", value: "24/7" },
  { label: "Target Ecosystem User Roles", value: "3 Roles" },
  { label: "Document Generation", value: "Instant PDF" },
  { label: "Judicial Resource Links", value: "30+ Portals" },
];

const About = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f2e8] px-4 pb-20 pt-28 text-stone-900 sm:px-6 lg:px-8">
      {/* Subtle Background Glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(251,191,36,0.18),transparent_36%),radial-gradient(circle_at_85%_18%,rgba(251,146,60,0.12),transparent_32%),radial-gradient(circle_at_50%_86%,rgba(245,222,179,0.45),transparent_42%)]" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-16">
        {/* Hero Section */}
        <section className="law-panel rounded-4xl border border-amber-200/70 bg-amber-50/90 p-6 shadow-[0_22px_50px_rgba(120,53,15,0.14)] sm:p-9 lg:p-12">
          <div className="law-enter-up flex items-center gap-2 text-amber-800">
            <span className="inline-flex rounded-full border border-amber-300/70 bg-amber-100/80 p-2">
              <Scale size={18} />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-900">
              About CourtMitra
            </p>
          </div>

          <h1 className="law-enter-up mt-5 max-w-4xl text-3xl font-black leading-tight text-stone-900 sm:text-5xl lg:text-[3.2rem]">
            Democratizing Legal Access Through{" "}
            <span className="bg-linear-to-r from-amber-700 via-orange-600 to-amber-500 bg-clip-text text-transparent">
              Intelligent Technology.
            </span>
          </h1>

          <p className="law-enter-up mt-6 max-w-3xl text-base leading-relaxed text-stone-600 sm:text-lg">
            CourtMitra is a unified, next-generation legal-tech platform built to
            bridge the gap between citizens, certified legal practitioners, and
            law students. By harmonizing artificial intelligence, streamlined
            case workflows, and verified legal discovery, CourtMitra transforms
            how legal assistance is understood, accessed, and delivered.
          </p>

          {/* Quick Metrics */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className="law-enter-up rounded-2xl border border-amber-200/80 bg-[#fff8ec] p-4 text-center sm:p-5"
                style={{ animationDelay: `${100 + idx * 60}ms` }}
              >
                <p className="text-2xl font-black text-amber-900 sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium text-stone-600 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="law-panel flex flex-col justify-between rounded-3xl border border-amber-200/70 bg-linear-to-br from-amber-50/90 to-[#fff8ed] p-7 shadow-[0_16px_36px_rgba(120,53,15,0.08)] sm:p-9">
            <div>
              <div className="inline-flex rounded-xl border border-amber-300/70 bg-amber-100/80 p-2.5 text-amber-900">
                <Award size={20} />
              </div>
              <h2 className="mt-4 text-2xl font-black text-stone-900 sm:text-3xl">
                Our Mission
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
                To eliminate the intimidation, opacity, and exorbitant barriers
                associated with legal proceedings. CourtMitra empowers every
                individual with instant, understandable legal clarity, connects
                them with verified legal advocates, and provides modern digital
                tools that accelerate the delivery of justice.
              </p>
            </div>
            <div className="mt-6 border-t border-amber-200/60 pt-4 text-xs font-semibold uppercase tracking-wider text-amber-800">
              Clear • Accessible • Reliable
            </div>
          </div>

          <div className="law-panel flex flex-col justify-between rounded-3xl border border-amber-200/70 bg-linear-to-br from-amber-50/90 to-[#fff8ed] p-7 shadow-[0_16px_36px_rgba(120,53,15,0.08)] sm:p-9">
            <div>
              <div className="inline-flex rounded-xl border border-amber-300/70 bg-amber-100/80 p-2.5 text-amber-900">
                <Sparkles size={20} />
              </div>
              <h2 className="mt-4 text-2xl font-black text-stone-900 sm:text-3xl">
                Our Vision
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
                To serve as the technological backbone of the modern legal
                ecosystem — where citizens confidently navigate their rights,
                practicing lawyers manage their workflow with digital precision,
                and law students receive authentic mentorship and real-world
                experience.
              </p>
            </div>
            <div className="mt-6 border-t border-amber-200/60 pt-4 text-xs font-semibold uppercase tracking-wider text-amber-800">
              Equitable • Intelligent • Transparent
            </div>
          </div>
        </section>

        {/* The 3-Pillar Ecosystem */}
        <section className="space-y-8">
          <div className="text-center">
            <span className="inline-flex rounded-full border border-amber-300/70 bg-amber-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
              The CourtMitra Ecosystem
            </span>
            <h2 className="mt-4 text-3xl font-black text-stone-900 sm:text-4xl">
              Tailored Experiences for Every Legal Stakeholder
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-stone-600 sm:text-base">
              CourtMitra is purposefully designed around the unique workflows of
              three vital groups in the justice landscape.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {corePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.role}
                  className="law-panel flex flex-col justify-between rounded-3xl border border-amber-200/80 bg-amber-50/85 p-6 shadow-[0_16px_36px_rgba(120,53,15,0.09)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(120,53,15,0.14)] sm:p-7"
                  style={{ animationDelay: `${120 + idx * 80}ms` }}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="inline-flex rounded-xl border border-amber-300/70 bg-amber-100/80 p-2.5 text-amber-900">
                        <Icon size={20} />
                      </div>
                      <span className="rounded-full border border-amber-300/70 bg-[#fff6e8] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-800">
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-black text-stone-900">
                      {pillar.role}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-stone-600 sm:text-sm">
                      {pillar.tagline}
                    </p>

                    <div className="mt-5 border-t border-amber-200/70 pt-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
                        Key Capabilities:
                      </p>
                      <ul className="mt-3 space-y-2.5">
                        {pillar.features.map((feature, fIdx) => (
                          <li
                            key={fIdx}
                            className="flex items-start gap-2.5 text-xs text-stone-700 sm:text-sm"
                          >
                            <CheckCircle2
                              size={15}
                              className="mt-0.5 shrink-0 text-amber-700"
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Core Platform Capabilities */}
        <section className="rounded-4xl border border-amber-200/70 bg-linear-to-br from-amber-50 via-[#fffaf2] to-orange-50/40 p-7 shadow-[0_20px_45px_rgba(120,53,15,0.1)] sm:p-10">
          <div className="mb-10 text-center">
            <span className="inline-flex rounded-full border border-amber-300/70 bg-amber-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
              Platform Features
            </span>
            <h2 className="mt-4 text-3xl font-black text-stone-900 sm:text-4xl">
              What Sets CourtMitra Apart
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-stone-600 sm:text-base">
              A rich suite of legal-grade tools designed to solve genuine
              challenges in legal comprehension, drafting, and practitioner
              coordination.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {platformCapabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="rounded-2xl border border-amber-200/80 bg-[#fff9ef] p-5 shadow-[0_8px_20px_rgba(120,53,15,0.06)] transition-all duration-300 hover:border-amber-300 hover:bg-white"
                  style={{ animationDelay: `${140 + idx * 50}ms` }}
                >
                  <div className="inline-flex rounded-xl border border-amber-300/70 bg-amber-100/80 p-2.5 text-amber-900">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-3.5 text-base font-bold text-stone-900">
                    {cap.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-stone-600 sm:text-sm">
                    {cap.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Technical Architecture & Engineering Standards */}
        <section className="space-y-8">
          <div className="text-center">
            <span className="inline-flex rounded-full border border-amber-300/70 bg-amber-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
              Engineering & Trust
            </span>
            <h2 className="mt-4 text-3xl font-black text-stone-900 sm:text-4xl">
              Architected for Accuracy, Speed & Security
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-stone-600 sm:text-base">
              CourtMitra combines modern software architecture with robust AI
              safety protocols to ensure dependability in sensitive legal
              contexts.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {architecturalStrengths.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-amber-200/80 bg-amber-50/90 p-5 shadow-[0_8px_22px_rgba(120,53,15,0.06)]"
                  style={{ animationDelay: `${100 + idx * 60}ms` }}
                >
                  <div className="inline-flex rounded-xl border border-amber-300/70 bg-amber-100/80 p-2 text-amber-900">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-3 text-base font-bold text-stone-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-stone-600 sm:text-sm">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* The Team Section */}
        <section className="law-panel rounded-4xl border border-amber-200/70 bg-amber-50/90 p-6 shadow-[0_20px_45px_rgba(120,53,15,0.1)] sm:p-9 lg:p-11">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-amber-300/70 bg-amber-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
                The Builders
              </span>
              <h2 className="mt-3 text-2xl font-black text-stone-900 sm:text-3xl lg:text-4xl">
                The Team Behind CourtMitra
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-stone-600 sm:text-base">
                A passionate group of software engineers, AI developers, and legal
                technologists committed to building accessible, ethical, and
                impactful tools for the Indian legal domain.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-amber-200/80 bg-[#fff8ec] px-3.5 py-2 text-xs font-bold text-amber-900">
              <Sparkles size={14} className="text-amber-600" />
              <span>Dedicated to Legal Innovation</span>
            </div>
          </div>

          <figure className="mt-8 overflow-hidden rounded-3xl border border-amber-200/80 bg-white shadow-[0_16px_36px_rgba(120,53,15,0.12)]">
            <div className="aspect-video w-full max-h-[520px] overflow-hidden bg-stone-100">
              <img
                src="/team.png"
                alt="The CourtMitra development team"
                className="h-full w-full object-cover object-center"
                loading="lazy"
              />
            </div>
            <figcaption className="border-t border-amber-200/60 bg-[#fffbf5] px-6 py-4 text-center text-xs text-stone-600 sm:text-sm">
              The CourtMitra Engineering & Design Team — Driven by the mission to make legal access transparent and equitable.
            </figcaption>
          </figure>
        </section>

        {/* Bottom Call to Action */}
        <section className="relative overflow-hidden rounded-4xl border border-amber-300/80 bg-linear-to-r from-amber-600 via-orange-600 to-amber-700 p-8 text-center text-amber-50 shadow-[0_24px_50px_rgba(217,119,6,0.3)] sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-black/10 blur-2xl" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/40 bg-amber-500/30 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-amber-100 backdrop-blur-md">
              <Scale size={14} />
              Step Into the Future of Legal Tech
            </span>
            <h2 className="mt-4 text-3xl font-black sm:text-4xl lg:text-5xl">
              Ready to Experience CourtMitra?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-amber-100 sm:text-base">
              Whether you need instant legal clarity, wish to consult a verified
              advocate, or want to advance your legal career through practical
              internships, CourtMitra is here for you.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/lawbot"
                className="inline-flex items-center gap-2 rounded-2xl bg-stone-900 px-6 py-3.5 text-sm font-bold text-amber-100 shadow-[0_10px_24px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-stone-800"
              >
                <Bot size={16} />
                Try LawBot Assistant
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/find-lawyer"
                className="inline-flex items-center gap-2 rounded-2xl border border-amber-200/50 bg-white/15 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/25"
              >
                <Users size={16} />
                Find a Verified Lawyer
              </Link>

              <Link
                to="/internships"
                className="inline-flex items-center gap-2 rounded-2xl border border-amber-200/50 bg-white/15 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/25"
              >
                <GraduationCap size={16} />
                Explore Internships
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default About;
