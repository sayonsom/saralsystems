"use client";
import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";

/**
 * GridSpeedComparison
 * Drop this into /app/(marketing)/components/GridSpeedComparison.jsx (or any components folder)
 * and render <GridSpeedComparison /> inside a Next.js 13/14/15 App Router page.
 *
 * Design goals for utilities/regulators:
 * - Crisp, unambiguous comparison
 * - Compliance-first cue (shield badge)
 * - Print- and PDF-friendly (no shadows, no rounded corners)
 * - Accessible semantics and keyboard focus order
 */
export default function GridSpeedComparison() {
  const accent = "#EA580B"; // brand accent

  const oldWay = [
    "Long queues and manual edits",
    "Audit packs take days",
    "Models stuck in CYME/Synergi silos",
    "Risk of non-compliant filings",
  ];

  const gridSpeedWay = [
    "Studies in hours",
    "AI edits + imports from CYME/Synergi/GIS",
    "One-click audit exports",
    "Filing checks for regulators",
  ];

  return (
    <section
      aria-labelledby="comparison-title"
      className="w-full border-y border-neutral-200 bg-white"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-6">
          <p className="text-[11px] tracking-widest uppercase text-neutral-500">
            How it compares
          </p>
          <h2
            id="comparison-title"
            className="text-2xl font-semibold leading-tight text-neutral-900"
          >
            There are two ways to do Distribution System Planning
          </h2>
        </header>

        {/* Comparison grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 border border-neutral-200 divide-y md:divide-y-0 md:divide-x divide-neutral-200"
          role="grid"
          aria-label="Old way compared to GridSpeed way"
        >
          <Column
            title="The old way"
            items={oldWay}
            icon="x"
            accent={accent}
          />
          <Column
            title="The GridSpeed way"
            items={gridSpeedWay}
            icon="check"
            accent={accent}
          />
        </div>

        {/* Compliance cue */}
        <div className="mt-6 inline-flex items-center gap-3 text-sm text-neutral-700">
          <ShieldCheck
            className="h-5 w-5"
            style={{ color: accent }}
            aria-hidden
          />
          <span>
            Built for compliance workflows: clear change logs, import provenance,
            and regulator-ready export manifests.
          </span>
        </div>
      </div>
    </section>
  );
}

function Column({
  title,
  items,
  icon,
  accent,
}) {
  const Icon = icon === "check" ? CheckCircle2 : XCircle;
  const isPositive = icon === "check";

  return (
    <div role="row" className="p-6 sm:p-8">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4" role="rowheader">
        {title}
      </h3>
      <ul className="space-y-4" role="list">
        {items.map((text, idx) => (
          <li key={idx} className="flex items-start gap-3" role="listitem">
            <Icon
              className="mt-[2px] h-5 w-5 shrink-0"
              style={{ color: isPositive ? accent : "#9CA3AF" }}
              aria-hidden
            />
            <span className="text-[15px] leading-6 text-neutral-800">
              {text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Example usage in a page (App Router):
 * ------------------------------------
 * // app/(marketing)/comparison/page.js
 * export default function Page() {
 *   return (
 *     <main className="bg-white">
 *       <GridSpeedComparison />
 *     </main>
 *   );
 * }
 */
