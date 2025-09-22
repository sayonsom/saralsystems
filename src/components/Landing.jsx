"use client";

import Link from "next/link";

const PRIMARY = "#EA580B";

// Generic section wrapper with alternating light backgrounds
function Section({ id, children, alt = false }) {
  return (
    <section
      id={id}
      className={`${alt ? "bg-white" : "bg-gray-50"} border-t border-gray-200`}
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">{children}</div>
    </section>
  );
}

// Flat button styles (no rounded, no shadow)
function FlatButton({ href, children, variant = "primary", className = "", title }) {
  const base =
    "inline-flex items-center justify-center px-5 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-0";
  const variants = {
    primary: `bg-[#EA580B] text-white hover:opacity-90 focus:ring-[#EA580B]`,
    outline: "border border-neutral-900 text-neutral-900 hover:bg-neutral-100 focus:ring-neutral-900",
    light: "bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-100 focus:ring-neutral-400",
  };
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`} title={title}>
      {children}
    </Link>
  );
}

/* =========================
   Sections
   ========================= */

function HeroSection() {
  return (
    <Section id="hero">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
            Plan smarter. Stay sovereign.
          </h1>
          <p className="mt-3 text-neutral-700 max-w-xl">
            GridLAB-D studies with AI model editing. Runs on-prem or cloud.
          </p>
          <div className="mt-6 flex gap-3">
            <FlatButton href="/signin" variant="primary" title="Create Free Account">
              Create Free Account
            </FlatButton>
            <FlatButton href="/contact" variant="outline" title="Request a Demo">
              Request a Demo
            </FlatButton>
          </div>
          <p className="mt-3 text-xs text-neutral-600">Free for research and non-commercial use.</p>
        </div>

        <div className="w-full aspect-[16/10] bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-500 text-sm">
          Hero image/diagram placeholder
        </div>
      </div>
    </Section>
  );
}

function PainPromiseSection() {
  return (
    <Section id="pain-promise" alt>
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h2 id="pain-promise-title" className="text-xl font-semibold">The old way</h2>
          <ul className="mt-3 space-y-2 text-neutral-700">
            <li>Long queues and manual edits</li>
            <li>Audit packs take days</li>
            <li>Models stuck in CYME/Synergi silos</li>
            <li>Risk of non-compliant filings</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold">The GridSpeed way</h2>
          <ul className="mt-3 space-y-2 text-neutral-700">
            <li>Studies in hours</li>
            <li>AI edits + imports from CYME/Synergi/GIS</li>
            <li>One-click audit exports</li>
            <li>Filing checks for regulators</li>
          </ul>
        </div>
      </div>
    </Section>
  );
}

function UseCasesSection() {
  const items = [
    ["Load forecasting", "Plan upgrades early."],
    ["8760 profile generation", "Year-long scenarios fast."],
    ["EV & DER feasibility", "Hosting and impacts."],
    ["Transformer upgrades", "Capacity and timing."],
    ["Feeder studies", "N-1/N-2 at scale."],
    ["Resiliency & microgrids", "Islanding and recovery."],
    ["Group studies for DER", "Batch interconnection reviews."],
    ["Substation studies", "Protection, loading, expansions."],
    ["Regulatory filings check", "Format, completeness, correctness."],
  ];
  return (
    <Section id="use-cases">
      <h2 className="text-xl font-semibold">Use cases</h2>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map(([title, desc]) => (
          <div key={title} className="border border-neutral-200 p-4 text-sm">
            <div className="font-semibold">{title}</div>
            <div className="text-neutral-700">{desc}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function CustomerDataIntegrationSection() {
  return (
    <Section id="data-integration" alt>
      <h2 className="text-xl font-semibold">Bring data together. No friction.</h2>
      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <ul className="space-y-2 text-neutral-700">
          <li>Pull customer and meter data via secure APIs.</li>
          <li>Match to feeders, transformers, and phases.</li>
          <li>De-identify or anonymize when needed.</li>
          <li>Bulk upload CSV/Parquet; schema hints auto-detected.</li>
        </ul>
        <div className="w-full min-h-[160px] bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-500 text-sm">
          Simple data flow graphic
        </div>
      </div>
    </Section>
  );
}

function CoreFeaturesSection() {
  const items = [
    ["Hybrid deployment", "On-prem first; burst to cloud."],
    ["AI model editing", "Generate, modify, and validate."],
    ["Compliance exports", "Immutable logs and PDFs."],
  ];
  return (
    <Section id="core-features">
      <h2 className="text-xl font-semibold">Core features</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map(([title, desc]) => (
          <div key={title} className="border border-neutral-200 p-6">
            <div className="font-semibold">{title}</div>
            <div className="text-neutral-700 mt-2 text-sm">{desc}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ScenarioLibrarySection() {
  return (
    <Section id="scenario-library" alt>
      <h2 className="text-xl font-semibold">Scenario Library</h2>
      <ul className="mt-3 space-y-2 text-neutral-700">
        <li>Reusable EV/DER, weather, and outage profiles.</li>
        <li>Versioned; share within team.</li>
      </ul>
    </Section>
  );
}

function BatchRunnerSection() {
  return (
    <Section id="batch-runner">
      <h2 className="text-xl font-semibold">Batch Runner</h2>
      <ul className="mt-3 space-y-2 text-neutral-700">
        <li>Queue 100+ cases; notify on finish.</li>
        <li>CSV/JSON results; CLI available.</li>
      </ul>
    </Section>
  );
}

function RegulatorySupportSection() {
  return (
    <Section id="regulatory" alt>
      <h2 className="text-xl font-semibold">Submission-ready by default.</h2>
      <ul className="mt-3 space-y-2 text-neutral-700">
        <li>Template packs for Commission filings.</li>
        <li>Auto checks: completeness, units, naming, dates.</li>
        <li>Traceable inputs/outputs; run hashes.</li>
        <li>Redline compare between scenarios.</li>
      </ul>
      <div className="mt-5">
        <FlatButton href="/contact?subject=Sample%20filing%20pack" variant="outline">
          View sample filing pack
        </FlatButton>
      </div>
      <div className="sr-only" aria-hidden="true">Regulator badge/logo strip placeholder</div>
    </Section>
  );
}

function HowItWorksSection() {
  const steps = [
    ["Import", "CYME/Synergi/GIS or start fresh."],
    ["Configure", "Chat with AI; set scenarios."],
    ["Simulate", "Parallel runs; deterministic logs."],
    ["Export", "Reports, profiles, audit pack."],
  ];
  return (
    <Section id="how-it-works">
      <h2 className="text-xl font-semibold">How it works</h2>
      <ol className="mt-6 grid gap-4 md:grid-cols-4">
        {steps.map(([title, desc], i) => (
          <li key={title} className="border border-neutral-200 p-6">
            <div className="text-xs text-neutral-500">Step {i + 1}</div>
            <div className="font-semibold mt-1">{title}</div>
            <div className="text-neutral-700 mt-2 text-sm">{desc}</div>
          </li>
        ))}
      </ol>
      <div className="mt-6">
        <FlatButton href="/contact?subject=Demo%20videos" variant="outline">Watch Demo Videos</FlatButton>
      </div>
    </Section>
  );
}

function IntegrationsSection() {
  return (
    <Section id="integrations" alt>
      <h2 className="text-xl font-semibold">Fits your stack.</h2>
      <p className="mt-3 text-neutral-700">
        ESRI GIS, SAP/OMS, CIS, AMI/MDM, CYME, Synergi. REST and ODBC hooks; webhooks for automation.
      </p>
      <div className="mt-4 w-full min-h-[80px] bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-500 text-sm">
        Integration icons row
      </div>
    </Section>
  );
}

function DataGovernanceSection() {
  return (
    <Section id="security">
      <h2 className="text-xl font-semibold">Built for critical infrastructure.</h2>
      <ul className="mt-3 space-y-2 text-neutral-700">
        <li>Data stays in-country; on-prem option.</li>
        <li>Encryption in transit/at rest; RBAC + MFA.</li>
        <li>ISO/NERC-aligned controls.</li>
        <li>Air-gapped export modes.</li>
      </ul>
    </Section>
  );
}

function WhoItsForSection() {
  const items = [
    ["Planners", "Faster studies, fewer bottlenecks."],
    ["Regulatory teams", "Clean, consistent filings."],
    ["IT/OT", "Hybrid control and simple deploys."],
    ["Consultants/EPCs", "Scalable batch runs."],
  ];
  return (
    <Section id="who-its-for" alt>
      <h2 className="text-xl font-semibold">Who it’s for</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {items.map(([title, desc]) => (
          <div key={title} className="border border-neutral-200 p-6">
            <div className="font-semibold">{title}</div>
            <div className="text-neutral-700 mt-2 text-sm">{desc}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ProofSection() {
  return (
    <Section id="proof">
      <h2 className="text-xl font-semibold">Open engine. Enterprise wrapper.</h2>
      <ul className="mt-3 space-y-2 text-neutral-700">
        <li>DOE’s GridLAB-D under the hood.</li>
        <li>Deterministic runs; reproducible results.</li>
        <li>Benchmarks and sample studies available.</li>
      </ul>
      <div className="mt-4 w-full min-h-[120px] bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-500 text-sm">
        Case study teaser blocks
      </div>
    </Section>
  );
}

function SupportSection() {
  return (
    <Section id="support" alt>
      <h2 className="text-xl font-semibold">Support</h2>
      <ul className="mt-3 space-y-2 text-neutral-700">
        <li>Email + SLA.</li>
        <li>Guided onboarding for pilots.</li>
      </ul>
    </Section>
  );
}

function FinalCTAStrip() {
  return (
    <section className="bg-[#EA580B] text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">Plan in hours. Prove it in minutes.</h2>
        <p className="mt-2 text-white/90">Free for research and non-commercial use.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <FlatButton href="/signin" variant="light">Create Free Account</FlatButton>
          <FlatButton href="/contact?subject=Pilot" variant="light">Request a Pilot</FlatButton>
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <div role="main">
      <HeroSection />
      <PainPromiseSection />
      <UseCasesSection />
      <CustomerDataIntegrationSection />
      <CoreFeaturesSection />
      <ScenarioLibrarySection />
      <BatchRunnerSection />
      <RegulatorySupportSection />
      <HowItWorksSection />
      <IntegrationsSection />
      <DataGovernanceSection />
      <WhoItsForSection />
      <ProofSection />
      <SupportSection />
      <FinalCTAStrip />
    </div>
  );
}