import React from "react";
import { Building2, GraduationCap, Rocket, Scale } from "lucide-react";

const highlights = [
  {
    icon: GraduationCap,
    title: "Built By Students",
    description:
      "We are a student team building practical legal-tech experiences that are easy to use and useful in real workflows.",
  },
  {
    icon: Rocket,
    title: "Hackathon Journey",
    description:
      "CourtMitra started as a hackathon idea and quickly evolved into a working platform with legal guidance, discovery, and drafting support.",
  },
  {
    icon: Building2,
    title: "Shivalik College",
    description:
      "This project was designed and built for a hackathon at Shivalik College, where we focused on impact, clarity, and execution.",
  },
];

const About = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f2e8] px-4 pb-16 pt-28 text-stone-900 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(251,191,36,0.16),transparent_36%),radial-gradient(circle_at_85%_18%,rgba(251,146,60,0.12),transparent_30%),radial-gradient(circle_at_50%_86%,rgba(245,222,179,0.42),transparent_42%)]" />

      <section className="law-panel relative z-10 mx-auto max-w-7xl rounded-4xl border border-amber-200/70 bg-amber-50/90 p-5 shadow-[0_22px_50px_rgba(120,53,15,0.14)] sm:p-7 lg:p-9">
        <div className="law-enter-up flex items-center gap-2 text-amber-800">
          <span className="inline-flex rounded-full border border-amber-300/70 bg-amber-100/80 p-2">
            <Scale size={16} />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.18em]">
            About CourtMitra
          </p>
        </div>

        <h1 className="law-enter-up mt-4 max-w-3xl text-3xl font-black text-stone-900 sm:text-4xl">
          We are students who built this for a hackathon at Shivalik College.
        </h1>

        <p className="law-enter-up mt-3 max-w-3xl text-sm leading-relaxed text-stone-600 sm:text-base">
          CourtMitra is our attempt to make legal help feel more accessible and
          less intimidating. We built this platform during a hackathon, focusing
          on practical features that support legal guidance, lawyer discovery,
          and document drafting in one experience.
        </p>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="law-enter-up rounded-2xl border border-amber-200/80 bg-[#fff8ec] p-4"
                style={{ animationDelay: `${120 + index * 70}ms` }}
              >
                <div className="inline-flex rounded-lg border border-amber-300/70 bg-amber-100/70 p-2 text-amber-800">
                  <Icon size={17} />
                </div>
                <h2 className="mt-3 text-base font-black text-stone-900">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm text-stone-600">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-8 max-w-7xl rounded-4xl border border-amber-200/70 bg-linear-to-br from-amber-50 via-[#fff9ef] to-orange-50 p-5 shadow-[0_22px_46px_rgba(120,53,15,0.1)] sm:p-7 lg:p-9">
        <div className="law-enter-up">
          <h2 className="text-2xl font-black text-stone-900 sm:text-3xl">
            Team Photo
          </h2>
          <p className="mt-2 text-sm text-stone-600 sm:text-base">
            Our hackathon team at Shivalik College.
          </p>
        </div>

        <figure className="law-enter-up mt-5 overflow-hidden rounded-2xl border border-amber-200/80 bg-white shadow-[0_14px_30px_rgba(120,53,15,0.12)]">
          <div className="aspect-video w-full">
            <img
              src="/team.png"
              alt="CourtMitra team at Shivalik College hackathon"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </figure>
      </section>
    </main>
  );
};

export default About;
