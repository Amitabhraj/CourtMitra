import React from "react";
import {
  Bot,
  Briefcase,
  Calendar,
  ClipboardList,
  FilePenLine,
  Gavel,
  GraduationCap,
  Search,
  ShieldCheck,
  UserRoundSearch,
} from "lucide-react";

const roleTracks = [
  {
    role: "Client Track",
    intro:
      "Turn legal confusion into action with AI guidance and trusted lawyer access.",
    steps: [
      { icon: Bot, label: "Ask chatbot for legal clarity" },
      { icon: UserRoundSearch, label: "Find matching lawyers quickly" },
      { icon: Calendar, label: "Book consultation slots" },
      { icon: ShieldCheck, label: "Proceed with informed decisions" },
    ],
  },
  {
    role: "Lawyer Track",
    intro:
      "Streamline legal operations, speed up drafting, and handle more clients with structure.",
    steps: [
      { icon: ClipboardList, label: "Manage office workflow" },
      { icon: Search, label: "Retrieve legal references" },
      { icon: FilePenLine, label: "Draft legal documents faster" },
      { icon: Briefcase, label: "Hire and mentor interns" },
    ],
  },
  {
    role: "Student Track",
    intro:
      "Learn practical law, earn through internships, and gain real legal exposure.",
    steps: [
      { icon: GraduationCap, label: "Learn legal concepts" },
      { icon: Gavel, label: "Practice legal application" },
      { icon: Briefcase, label: "Work on internships" },
      { icon: ShieldCheck, label: "Build career-ready confidence" },
    ],
  },
];

export default function RoleJourney() {
  return (
    <section className="px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-4xl border border-amber-200/70 bg-amber-50/85 p-6 sm:p-8 lg:p-10 shadow-[0_12px_28px_rgba(120,53,15,0.1)]">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex rounded-full border border-amber-300/70 bg-amber-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-amber-900">
                Role Workflows
              </p>
              <h2 className="mt-4 text-3xl font-black text-stone-900 sm:text-4xl">
                Clear pathways for every legal persona.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-stone-600 sm:text-base">
              Each user group has a focused journey while sharing the same legal
              data and intelligence layer.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {roleTracks.map((track, index) => (
              <article
                key={track.role}
                className="law-enter-up law-card rounded-3xl border border-amber-200/70 bg-[#fffaf2] p-5"
                style={{ animationDelay: `${90 + index * 65}ms` }}
              >
                <h3 className="text-xl font-bold text-stone-900">
                  {track.role}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {track.intro}
                </p>

                <div className="mt-5 space-y-2.5">
                  {track.steps.map((step) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.label}
                        className="flex items-center gap-3 rounded-xl border border-amber-200/70 bg-amber-50 px-3 py-2.5"
                      >
                        <span className="rounded-lg border border-amber-300/60 bg-amber-100/80 p-1.5 text-amber-800">
                          <Icon size={14} />
                        </span>
                        <span className="text-sm text-stone-700">
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
