import React from "react";
import { ShieldCheck, Lock, Eye, FileText, Scale, CheckCircle2 } from "lucide-react";

const policySections = [
  {
    icon: Lock,
    title: "1. Information We Collect",
    content:
      "When using CourtMitra, we may collect information you provide directly to us, such as your name, email address, phone number, professional credentials (for advocates), and academic background (for law students). We also collect query data submitted to LawBot and details related to appointment bookings and internship applications.",
  },
  {
    icon: ShieldCheck,
    title: "2. How We Protect Your Legal Privileged Data",
    content:
      "We recognize the paramount importance of advocate-client confidentiality. Consultations, private inquiries, and case drafts generated on CourtMitra are protected with industry-standard encryption protocols and strict role-based access controls. We do not sell or monetize personal legal inquiries.",
  },
  {
    icon: Eye,
    title: "3. AI Processing & Knowledge Retrieval",
    content:
      "LawBot utilizes Retrieval-Augmented Generation (RAG) to reference statutory law and precedents. Queries processed by our AI services are stripped of unnecessary personal identifiers to maintain privacy. We do not use your confidential case descriptions to train public generative models.",
  },
  {
    icon: FileText,
    title: "4. Document Generation & Storage",
    content:
      "Legal documents drafted via CourtMitra (such as notices, affidavits, and agreements) are generated client-side or securely in-session. Users retain complete ownership of their documents and can download or remove their drafting history at their discretion.",
  },
  {
    icon: Scale,
    title: "5. Third-Party Portals & Official Links",
    content:
      "CourtMitra provides direct access to official government and judicial portals (such as eCourts, Supreme Court of India, and High Courts). While we link to these verified resources for public convenience, their independent privacy terms apply once you navigate to those domains.",
  },
];

const PrivacyPolicy = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f2e8] px-4 pb-20 pt-28 text-stone-900 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(251,191,36,0.18),transparent_36%),radial-gradient(circle_at_85%_18%,rgba(251,146,60,0.12),transparent_32%),radial-gradient(circle_at_50%_86%,rgba(245,222,179,0.45),transparent_42%)]" />

      <div className="relative z-10 mx-auto max-w-4xl space-y-8">
        <div className="law-panel rounded-4xl border border-amber-200/70 bg-amber-50/90 p-6 shadow-[0_20px_45px_rgba(120,53,15,0.12)] sm:p-9">
          <div className="flex items-center gap-2 text-amber-800">
            <span className="inline-flex rounded-full border border-amber-300/70 bg-amber-100/80 p-2">
              <ShieldCheck size={18} />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
              Legal Trust & Security
            </p>
          </div>

          <h1 className="mt-4 text-3xl font-black text-stone-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
            At CourtMitra, we treat privacy, confidentiality, and data integrity
            with the highest standard of care. This policy describes how we
            collect, use, and safeguard your data across all our legal
            services.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-amber-800">
            <CheckCircle2 size={14} className="text-amber-700" />
            Last Updated: September 2026
          </div>
        </div>

        <div className="space-y-6">
          {policySections.map((sec) => {
            const Icon = sec.icon;
            return (
              <section
                key={sec.title}
                className="law-panel rounded-3xl border border-amber-200/75 bg-[#fffaf2] p-6 shadow-[0_12px_28px_rgba(120,53,15,0.06)] sm:p-8"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-amber-300/70 bg-amber-100/80 p-2 text-amber-900">
                    <Icon size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-stone-900 sm:text-xl">
                    {sec.title}
                  </h2>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-stone-700 sm:text-base">
                  {sec.content}
                </p>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
