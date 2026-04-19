import React from "react";
import { ArrowUpRight, Bot, FileText, Gavel, Scale } from "lucide-react";

const featurePills = [
  {
    title: "Legal Chatbot",
    subtitle: "Get legal guidance instantly",
    icon: Bot,
  },
  {
    title: "Document Drafting",
    subtitle: "Draft notices and agreements",
    icon: FileText,
  },
  {
    title: "Lawyer Discovery",
    subtitle: "Find relevant legal professionals",
    icon: Gavel,
  },
];

const metrics = [
  { value: "24/7", label: "AI legal guidance" },
  { value: "One Platform", label: "Clients, lawyers, and students" },
  { value: "Practical", label: "Real legal workflows" },
];

export default function HeroOrbit() {
  return (
    <section className="px-4 pt-36 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="px-2 py-8 sm:px-4 lg:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="law-enter-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/70 bg-amber-100/85 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.17em] text-amber-900">
                <Scale size={14} />
                Legal Operating System
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight text-stone-900 sm:text-5xl lg:text-[3.4rem]">
                The Legal Ecosystem
                <span className="mt-2 block bg-linear-to-r from-amber-700 via-orange-600 to-amber-500 bg-clip-text text-transparent">
                  Built for Real Work.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
                CourtMitra combines legal advice, lawyer search, document
                drafting, appointment flow, law references, and internships into
                one focused, law-first experience.
              </p>

              <div className="mt-8 flex flex-wrap gap-3.5">
                <button className="group inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-amber-400 to-orange-500 px-6 py-3.5 text-sm font-semibold text-amber-50 shadow-[0_12px_26px_rgba(217,119,6,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(217,119,6,0.3)]">
                  Explore Platform
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </div>

            <div className="law-enter-up delay-120">
              <div className="relative overflow-hidden rounded-4xl border border-amber-200/70 bg-amber-50/85 p-6 shadow-[0_14px_28px_rgba(120,53,15,0.1)]">
                <div className="pointer-events-none absolute -top-14 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-amber-200/35 blur-3xl" />
                <div className="relative rounded-3xl border border-amber-200/70 bg-[#fffaf2] p-6">
                  <div className="flex items-center justify-center gap-5">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl border border-amber-200/70 bg-amber-50 text-stone-600">
                      <Gavel size={24} />
                    </div>
                    <div className="grid h-24 w-24 place-items-center rounded-3xl border border-amber-300/70 bg-amber-100/70 text-amber-800 shadow-[0_0_30px_rgba(251,191,36,0.25)]">
                      <Scale size={36} />
                    </div>
                    <div className="grid h-16 w-16 place-items-center rounded-2xl border border-amber-200/70 bg-amber-50 text-stone-600">
                      <FileText size={24} />
                    </div>
                  </div>
                  <p className="mt-5 text-center text-sm text-stone-600">
                    Legal Advice • Drafting • Representation
                  </p>
                </div>

                <div className="mt-4 space-y-3.5">
                  {featurePills.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="law-card flex items-start gap-3 rounded-xl border border-amber-200/70 bg-[#fffaf2] px-3 py-2.5"
                      >
                        <span className="rounded-lg border border-amber-300/60 bg-amber-100/85 p-1.5 text-amber-800">
                          <Icon size={14} />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-stone-800">
                            {item.title}
                          </p>
                          <p className="text-xs text-stone-600">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {metrics.map((item, idx) => (
              <div
                key={item.label}
                className="law-enter-up rounded-2xl border border-amber-200/70 bg-amber-50/90 px-4 py-4"
                style={{ animationDelay: `${140 + idx * 70}ms` }}
              >
                <p className="text-2xl font-black text-amber-800">
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-stone-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
