import React from "react";
import { ArrowUpRight, Building2, ScrollText, ShieldCheck } from "lucide-react";
import HeroOrbit from "../components/home/HeroOrbit";
import EcosystemGrid from "../components/home/EcosystemGrid";
import RoleJourney from "../components/home/RoleJourney";

const legalPrinciples = [
  {
    icon: ShieldCheck,
    title: "Trustworthy Guidance",
    body: "Legal support is built around explainability, references, and actionable next steps.",
  },
  {
    icon: ScrollText,
    title: "Practical Legal Drafting",
    body: "From notices to structured templates, drafting is designed to be faster and clearer.",
  },
  {
    icon: Building2,
    title: "Operational Clarity",
    body: "Law office operations, appointments, and internships stay aligned in one legal workspace.",
  },
];

const Home = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f2e8] text-stone-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(251,191,36,0.18),transparent_36%),radial-gradient(circle_at_84%_14%,rgba(251,146,60,0.12),transparent_32%),radial-gradient(circle_at_52%_74%,rgba(245,222,179,0.45),transparent_42%)]" />
      <div
        aria-hidden
        className="law-float-a pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-amber-300/22 blur-[100px]"
      />
      <div
        aria-hidden
        className="law-float-b pointer-events-none absolute -right-20 top-88 h-80 w-80 rounded-full bg-orange-200/22 blur-[110px]"
      />

      <div className="relative z-10 pb-16">
        <HeroOrbit />
        <EcosystemGrid />
        <RoleJourney />

        <section className="px-4 pb-10 sm:px-6 lg:px-8">
          <div className="law-panel mx-auto max-w-7xl rounded-4xl border border-amber-200/70 bg-amber-50/85 p-6 shadow-[0_20px_45px_rgba(120,53,15,0.12)] sm:p-8 lg:p-10">
            <div className="law-enter-up flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="inline-flex rounded-full border border-amber-300/70 bg-amber-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
                  Legal Principles
                </p>
                <h2 className="mt-4 max-w-3xl text-3xl font-black text-stone-900 sm:text-4xl">
                  Calm, practical, and built around legal outcomes.
                </h2>
              </div>
              <button className="group inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-semibold text-amber-50 shadow-[0_12px_26px_rgba(217,119,6,0.25)] transition-all duration-300 hover:-translate-y-0.5">
                Open Legal Workspace
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </button>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {legalPrinciples.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="law-enter-up rounded-2xl border border-amber-200/70 bg-amber-50/90 p-4"
                    style={{ animationDelay: `${140 + index * 65}ms` }}
                  >
                    <div className="inline-flex rounded-lg border border-amber-300/60 bg-amber-100/80 p-2 text-amber-800">
                      <Icon size={16} />
                    </div>
                    <h3 className="mt-3 text-base font-bold text-stone-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                      {item.body}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
