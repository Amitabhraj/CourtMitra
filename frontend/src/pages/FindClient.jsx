import React, { useState } from "react";
import {
  Users,
  Search,
  MapPin,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Filter,
  CheckCircle2,
  ArrowUpRight,
  Clock,
} from "lucide-react";

const initialClients = [
  {
    id: 1,
    category: "Property & Real Estate",
    title: "Property Title Verification & Injunction Suit",
    description:
      "Seeking legal consultation regarding ancestral agricultural land documentation, mutation check, and preventive stay order against unlawful encroachment.",
    location: "Dehradun, Uttarakhand",
    urgency: "High Priority",
    postedDate: "2 hours ago",
    mode: "In-Person Consultation",
  },
  {
    id: 2,
    category: "Corporate & Startup",
    title: "Founder Agreement & Seed Funding Advisory",
    description:
      "Early-stage tech startup looking for an experienced corporate advocate to review SHA (Shareholder Agreement), IP assignment deed, and compliance structure.",
    location: "Bengaluru, Karnataka",
    urgency: "Normal",
    postedDate: "5 hours ago",
    mode: "Virtual Consultation",
  },
  {
    id: 3,
    category: "Civil Law",
    title: "Commercial Breach of Contract & Recovery Notice",
    description:
      "Client requires legal notice drafting and civil suit advice against a vendor for persistent non-performance and outstanding invoices over ₹8.5 Lakhs.",
    location: "Delhi NCR",
    urgency: "High Priority",
    postedDate: "1 day ago",
    mode: "Virtual Consultation",
  },
  {
    id: 4,
    category: "Family & Matrimonial",
    title: "Mutual Consent Dissolution & Custody Mediation",
    description:
      "Looking for a family law advocate to facilitate mutual divorce petition under Section 13B and draft amicable terms for settlement and shared custody.",
    location: "Chandigarh",
    urgency: "Normal",
    postedDate: "2 days ago",
    mode: "In-Person Consultation",
  },
  {
    id: 5,
    category: "Cyber Law",
    title: "Online Financial Fraud & IT Act Complaint",
    description:
      "Need counsel on drafting an official complaint under Section 66D of the IT Act and liaising with the Cyber Crime Police Cell for unauthorized bank transfers.",
    location: "Pune, Maharashtra",
    urgency: "High Priority",
    postedDate: "3 days ago",
    mode: "Virtual Consultation",
  },
];

const categories = [
  "All",
  "Property & Real Estate",
  "Corporate & Startup",
  "Civil Law",
  "Family & Matrimonial",
  "Cyber Law",
];

const FindClient = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [connectedIds, setConnectedIds] = useState([]);

  const filteredClients = initialClients.filter((client) => {
    const matchesCategory =
      selectedCategory === "All" || client.category === selectedCategory;
    const matchesSearch =
      client.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleConnect = (id) => {
    if (!connectedIds.includes(id)) {
      setConnectedIds((prev) => [...prev, id]);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f2e8] px-4 pb-20 pt-28 text-stone-900 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(251,191,36,0.18),transparent_36%),radial-gradient(circle_at_85%_18%,rgba(251,146,60,0.12),transparent_32%),radial-gradient(circle_at_50%_86%,rgba(245,222,179,0.45),transparent_42%)]" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        {/* Header Banner */}
        <div className="law-panel rounded-4xl border border-amber-200/70 bg-amber-50/90 p-6 shadow-[0_20px_45px_rgba(120,53,15,0.12)] sm:p-9">
          <div className="flex items-center gap-2 text-amber-800">
            <span className="inline-flex rounded-full border border-amber-300/70 bg-amber-100/80 p-2">
              <Users size={18} />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
              Client Discovery Portal
            </p>
          </div>

          <h1 className="mt-4 text-3xl font-black text-stone-900 sm:text-4xl">
            Find Clients & Consultation Requests
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone-600 sm:text-base">
            Connect with individuals and organizations actively seeking verified
            legal counsel, document advisory, or courtroom representation.
            Review inquiries and propose initial consultations directly.
          </p>

          {/* Search & Category Filter */}
          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                type="text"
                placeholder="Search by legal subject, keywords, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-amber-200/80 bg-[#fffdfa] py-3 pl-11 pr-4 text-sm text-stone-800 placeholder-stone-400 shadow-inner outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-300/30"
              />
            </div>
          </div>

          {/* Category Badges */}
          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "border border-amber-400 bg-amber-200/80 text-amber-950 shadow-sm"
                    : "border border-amber-200/70 bg-[#fff9ef] text-stone-600 hover:border-amber-300 hover:bg-amber-100/60 hover:text-stone-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Client Inquiries Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => {
              const isConnected = connectedIds.includes(client.id);
              return (
                <article
                  key={client.id}
                  className="law-panel flex flex-col justify-between rounded-3xl border border-amber-200/80 bg-amber-50/85 p-6 shadow-[0_12px_28px_rgba(120,53,15,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(120,53,15,0.12)]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full border border-amber-300/70 bg-amber-100/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-900">
                        {client.category}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          client.urgency === "High Priority"
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        <Clock size={10} />
                        {client.urgency}
                      </span>
                    </div>

                    <h2 className="mt-4 text-lg font-bold text-stone-900">
                      {client.title}
                    </h2>

                    <p className="mt-2.5 text-xs leading-relaxed text-stone-600 sm:text-sm">
                      {client.description}
                    </p>

                    <div className="mt-5 space-y-2 border-t border-amber-200/70 pt-4 text-xs text-stone-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-amber-700" />
                        <span>{client.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-amber-700" />
                        <span>Mode: {client.mode}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-400">
                        <span>Posted {client.postedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-2">
                    <button
                      type="button"
                      onClick={() => handleConnect(client.id)}
                      className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                        isConnected
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-linear-to-r from-amber-400 to-orange-500 text-amber-950 hover:shadow-md hover:-translate-y-0.5"
                      }`}
                    >
                      {isConnected ? (
                        <>
                          <CheckCircle2 size={14} />
                          Consultation Offered
                        </>
                      ) : (
                        <>
                          <MessageSquare size={14} />
                          Offer Consultation
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="col-span-full rounded-3xl border border-dashed border-amber-300/80 bg-amber-50/60 p-12 text-center text-stone-600">
              <Users size={36} className="mx-auto text-amber-700/60" />
              <p className="mt-3 text-base font-bold text-stone-800">
                No matching client inquiries found.
              </p>
              <p className="mt-1 text-xs text-stone-500">
                Try clearing your search terms or selecting another category.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default FindClient;
