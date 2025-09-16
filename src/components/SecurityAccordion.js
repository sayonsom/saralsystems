// app/(marketing)/components/SecurityAccordion.js
"use client";
import { useState } from "react";

const items = [
  {
    q: "Security & Compliance",
    a: "Encryption in transit/at rest, backups, RBAC. Data residency options (IN/EU/US). Roadmap to SOC 2 Type II.",
  },
  {
    q: "On-prem / Private Cloud",
    a: "Air-gapped mode available. VPC peering, SSO/SAML support for enterprise.",
  },
  {
    q: "Regulatory Stance",
    a: "Designed as a sandbox for exploration/teaching. Keep filings in incumbent tools; export models and logs.",
  },
];

export default function SecurityAccordion() {
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">Enterprise trust, from day one</h2>
        <div className="mt-6 divide-y divide-neutral-200 border border-neutral-200">
          {items.map((it, idx) => (
            <div key={it.q}>
              <button
                className="w-full text-left px-4 py-4 hover:bg-neutral-100"
                onClick={() => setOpen(open === idx ? -1 : idx)}
                aria-expanded={open === idx}
              >
                <span className="font-semibold">{it.q}</span>
              </button>
              {open === idx && (
                <div className="px-4 pb-4 text-neutral-700">{it.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
