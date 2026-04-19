import React from "react";
import {
  Bot,
  BriefcaseBusiness,
  CalendarClock,
  Files,
  GraduationCap,
  SearchCode,
  Scale,
} from "lucide-react";

const ecosystemCards = [
  {
    icon: Scale,
    title: "Clients and Citizens",
    description:
      "Use legal AI to understand rights, compare options, and book consultations with better context.",
    points: [
      "Ask legal questions",
      "Find suitable lawyers",
      "Book appointments",
    ],
  },
  {
    icon: BriefcaseBusiness,
    title: "Lawyers and Firms",
    description:
      "Manage office workflow, speed up drafting, and surface legal references while serving more clients.",
    points: ["Office management", "Document drafting", "Law reference support"],
  },
  {
    icon: GraduationCap,
    title: "Law Students",
    description:
      "Find internships, learn through practical legal tasks, and build paid real-world legal experience.",
    points: [
      "Internship discovery",
      "Mentor exposure",
      "Practical legal learning",
    ],
  },
];

const serviceStrip = [
  { icon: Bot, text: "Legal AI assistant" },
  { icon: SearchCode, text: "Law and precedent lookup" },
  { icon: Files, text: "Document drafting support" },
  { icon: CalendarClock, text: "Appointment management" },
];

export default function EcosystemGrid() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-amber-300/70 bg-amber-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
              Legal Capabilities
            </span>
            <h2 className="mt-4 max-w-2xl text-3xl font-black text-stone-900 sm:text-4xl">
              One platform, three legal tracks.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-stone-600 sm:text-base">
            CourtMitra is structured around the daily needs of clients, law
            professionals, and students.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {ecosystemCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className="law-enter-up law-card rounded-3xl border border-amber-200/70 bg-amber-50/85 p-6 shadow-[0_10px_24px_rgba(120,53,15,0.1)]"
                style={{ animationDelay: `${90 + index * 65}ms` }}
              >
                <div className="inline-flex rounded-xl border border-amber-300/60 bg-amber-100/80 p-2.5 text-amber-800">
                  <Icon size={18} />
                </div>
                <h3 className="mt-4 text-xl font-bold text-stone-900">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {card.description}
                </p>
                <div className="mt-4 space-y-2">
                  {card.points.map((point) => (
                    <div
                      key={point}
                      className="rounded-xl border border-amber-200/70 bg-[#fffaf2] px-3 py-2 text-sm text-stone-700"
                    >
                      {point}
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {serviceStrip.map((pill, index) => {
            const Icon = pill.icon;
            return (
              <div
                key={pill.text}
                className="law-enter-up flex items-center gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/90 px-4 py-3"
                style={{ animationDelay: `${170 + index * 50}ms` }}
              >
                <span className="rounded-lg border border-amber-300/60 bg-amber-100/80 p-1.5 text-amber-800">
                  <Icon size={14} />
                </span>
                <span className="text-sm text-stone-700">{pill.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
