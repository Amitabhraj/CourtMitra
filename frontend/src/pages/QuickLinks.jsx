import React from "react";
import {
  ExternalLink,
  Gavel,
  Landmark,
  Scale,
  Sparkles,
  Building2,
  ShieldCheck,
} from "lucide-react";

const supremeCourtLinks = [
  {
    name: "Supreme Court of India",
    href: "https://www.sci.gov.in/",
  },
];

const governmentPortals = [
  {
    name: "eCourts India",
    href: "https://ecourts.gov.in/ecourts_home/",
  },
  {
    name: "eCourt Services",
    href: "https://services.ecourts.gov.in/ecourtindia_v6/",
  },
  {
    name: "District Court Services",
    href: "https://districts.ecourts.gov.in/",
  },
  {
    name: "National Judicial Data Grid",
    href: "https://njdg.ecourts.gov.in/njdgnew/",
  },
  {
    name: "Department of Justice",
    href: "https://doj.gov.in/",
  },
  {
    name: "NALSA",
    href: "https://nalsa.gov.in/",
  },
  {
    name: "E-Committee, Supreme Court of India",
    href: "https://ecommitteesci.gov.in/",
  },
];

const highCourtLinks = [
  {
    name: "Allahabad High Court",
    href: "https://www.allahabadhighcourt.in",
  },
  { name: "Andhra Pradesh High Court", href: "https://aphc.gov.in" },
  {
    name: "Bombay High Court",
    href: "https://bombayhighcourt.nic.in",
  },
  {
    name: "Calcutta High Court",
    href: "https://calcuttahighcourt.gov.in",
  },
  { name: "Chhattisgarh High Court", href: "https://highcourt.cg.gov.in" },
  { name: "Delhi High Court", href: "https://delhihighcourt.nic.in" },
  { name: "Gauhati High Court", href: "https://ghconline.gov.in" },
  { name: "Gujarat High Court", href: "https://gujarathighcourt.nic.in" },
  { name: "Himachal Pradesh High Court", href: "https://hphighcourt.nic.in" },
  { name: "Jammu & Kashmir High Court", href: "https://jkhighcourt.nic.in" },
  { name: "Jharkhand High Court", href: "https://jharkhandhighcourt.nic.in" },
  {
    name: "Karnataka Judiciary",
    href: "https://karnatakajudiciary.kar.nic.in",
  },
  { name: "Kerala High Court", href: "https://hckerala.gov.in" },
  { name: "Madhya Pradesh High Court", href: "https://mphc.gov.in" },
  {
    name: "Madras High Court",
    href: "https://www.hcmadras.tn.nic.in",
  },
  { name: "Manipur High Court", href: "https://hcmimphal.nic.in" },
  {
    name: "Meghalaya High Court",
    href: "https://meghalayahighcourt.nic.in",
  },
  { name: "Orissa High Court", href: "https://orissahighcourt.nic.in" },
  { name: "Patna High Court", href: "https://patnahighcourt.gov.in" },
  { name: "Punjab & Haryana High Court", href: "https://highcourtchd.gov.in" },
  { name: "Rajasthan High Court", href: "https://hcraj.nic.in" },
  { name: "Sikkim High Court", href: "https://hcs.gov.in" },
  { name: "Telangana High Court", href: "https://tshc.gov.in" },
  { name: "Tripura High Court", href: "https://thc.nic.in" },
  {
    name: "Uttarakhand High Court",
    href: "https://highcourtofuttarakhand.gov.in",
  },
];

const resourceGroups = [
  {
    icon: Building2,
    title: "Supreme Court",
    description: "Official national-level court resource.",
    links: supremeCourtLinks,
    compact: true,
  },
  {
    icon: Gavel,
    title: "High Courts",
    description: "Quick access to high court websites across India.",
    links: highCourtLinks,
  },
  {
    icon: ShieldCheck,
    title: "Government Portals",
    description:
      "Useful judicial and legal service portals gathered in one place.",
    links: governmentPortals,
  },
];

const QuickLinks = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f2e8] px-4 pb-16 pt-28 text-stone-900 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(251,191,36,0.16),transparent_36%),radial-gradient(circle_at_85%_18%,rgba(251,146,60,0.12),transparent_30%),radial-gradient(circle_at_50%_86%,rgba(245,222,179,0.42),transparent_42%)]" />

      <section className="law-panel relative z-10 mx-auto max-w-7xl rounded-4xl border border-amber-200/70 bg-amber-50/90 p-5 shadow-[0_22px_50px_rgba(120,53,15,0.14)] sm:p-7 lg:p-9">
        <div className="law-enter-up flex items-center gap-2 text-amber-800">
          <span className="inline-flex rounded-full border border-amber-300/70 bg-amber-100/80 p-2">
            <Sparkles size={16} />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.18em]">
            Quick Links
          </p>
        </div>

        <h1 className="law-enter-up mt-4 max-w-3xl text-3xl font-black text-stone-900 sm:text-4xl">
          One place for the court websites we gathered from across the internet.
        </h1>

        <p className="law-enter-up mt-3 max-w-3xl text-sm leading-relaxed text-stone-600 sm:text-base">
          This page keeps important court portals together so you can jump to
          the right official resource faster.
        </p>
      </section>

      <section className="relative z-10 mx-auto mt-8 flex max-w-7xl flex-col gap-5">
        {resourceGroups.map((group, index) => {
          const Icon = group.icon;
          const isCompact = Boolean(group.compact);

          return (
            <article
              key={group.title}
              className="law-enter-up rounded-4xl border border-amber-200/70 bg-linear-to-br from-amber-50 via-[#fff9ef] to-orange-50 p-5 shadow-[0_22px_46px_rgba(120,53,15,0.1)] sm:p-6"
              style={{ animationDelay: `${120 + index * 80}ms` }}
            >
              <div className="flex items-start gap-3 border-b border-amber-200/80 pb-4">
                <div className="rounded-2xl border border-amber-300/70 bg-amber-100/80 p-3 text-amber-800">
                  <Icon size={18} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-stone-900">
                    {group.title}
                  </h2>
                  <p className="mt-1 text-sm text-stone-600">
                    {group.description}
                  </p>
                </div>
              </div>

              <div className={isCompact ? "mt-4 grid gap-2" : "mt-4 space-y-2"}>
                {group.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center justify-between gap-3 rounded-2xl border border-amber-200/80 bg-white/80 px-4 py-3 text-sm font-medium text-stone-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50 hover:text-stone-900 ${
                      isCompact ? "min-h-18" : ""
                    }`}
                  >
                    <span>{link.name}</span>
                    <ExternalLink
                      size={16}
                      className="shrink-0 text-amber-700"
                    />
                  </a>
                ))}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
};

export default QuickLinks;
