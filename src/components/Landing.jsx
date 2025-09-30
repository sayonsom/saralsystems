"use client";

import Link from "next/link";
import GridSpeedComparison from "./GridSpeedComparison";
import UseCasesFeatures from "./UseCasesFeatures";
import Image from "next/image";

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
            Plan Faster. Prove Reliability. Ship Filings.
          </h1>
          <p className="mt-4 text-neutral-700 max-w-xl">
            Gridspeed is the collaboration layer for grid planners, rates, and regulatory teams.
            Run studies, compare wires vs alternatives, and generate submission-ready exhibits—
            all with traceable assumptions, model versions, and audit trails your Commission will accept.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-neutral-700">
            <li>• N-0 / N-1 evidence with worst-hour thermal & voltage plots.</li>
            <li>• Hosting capacity & DER enablement side-by-side with capital scope.</li>
            <li>• Levelized revenue requirement / ARR, allocators, and bill examples.</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <FlatButton href="/contact?subject=Personalized%20Demo" variant="primary" title="Request a Personalized Demo">
              Request a Personalized Demo
            </FlatButton>
            <FlatButton href="/contact?subject=Sample%20Exhibits" variant="outline" title="See Sample Exhibits">
              See Sample Exhibits
            </FlatButton>
          </div>
          <p className="mt-3 text-xs text-neutral-600">Pilot-friendly. Read-only to OT by default. No rip-and-replace.</p>
        </div>

        <div className="w-full aspect-[16/10] bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-500 text-sm">
          <Image
            src="https://res.cloudinary.com/dti7egpsg/image/upload/v1758534604/SARAL%20Systems%20Blog/hero_for_now_m97crj.png"
            width={960}
            height={540}
            alt="Gridspeed console: studies, evidence panel, and exhibits preview"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </Section>
  );
}

/* Replaced legacy UseCasesSection with UseCasesFeatures component */

function CustomerDataIntegrationSection() {
  return (
    <Section id="data-integration" alt>
      <h2 className="text-xl font-semibold">Bring planning data together. No friction.</h2>
      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <ul className="space-y-2 text-neutral-700">
          <li>• Import CYME/Synergi exports, GIS feeders, AMI/MDM snapshots, capex lists.</li>
          <li>• Match meters to feeders/phase; reconcile model deltas with change logs.</li>
          <li>• Mask or de-identify sensitive fields; scoped, read-only adapters.</li>
          <li>• Bulk upload CSV/Parquet; schema hints and quick validators.</li>
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
    ["Hybrid deployment", "On-prem agent for studies; burst to cloud for collaboration and reporting."],
    ["Guided model configuration", "Parameter checks, scenario templates, and study packages your team recognizes."],
    ["Compliance exports", "Immutable logs, run IDs, and submission-ready PDFs/Word/Excel."],
  ];
  return (
    <Section id="core-features">
      <h2 className="text-xl font-semibold">Core capabilities</h2>
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
      <h2 className="text-xl font-semibold">Scenario library</h2>
      <ul className="mt-3 space-y-2 text-neutral-700">
        <li>• Reusable EV/DER, weather, and outage profiles with versioning.</li>
        <li>• Share across planning, rates, and regulatory—same assumptions, fewer rewrites.</li>
      </ul>
    </Section>
  );
}

function BatchRunnerSection() {
  return (
    <Section id="batch-runner">
      <h2 className="text-xl font-semibold">Batch runner</h2>
      <ul className="mt-3 space-y-2 text-neutral-700">
        <li>• Queue 100+ cases; parallel execution; email/webhook notification on completion.</li>
        <li>• CSV/JSON results with deterministic run logs for reproducibility.</li>
      </ul>
    </Section>
  );
}

function RegulatorySupportSection() {
  return (
    <Section id="regulatory" alt>
      <h2 className="text-xl font-semibold">Submission-ready by default</h2>
      <ul className="mt-3 space-y-2 text-neutral-700">
        <li>• Template packs for Commission filings and capital committee briefs.</li>
        <li>• Auto-checks for completeness, units, naming, and dates.</li>
        <li>• Traceable inputs/outputs with run hashes and model versions.</li>
        <li>• Redline compare between scenarios and exhibits.</li>
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
    ["Import", "CYME/Synergi/GIS, AMI/MDM, capex lists, or start with a template."],
    ["Configure", "Define contingencies, assumptions, and scenario windows."],
    ["Simulate", "Run base and N-1 cases with deterministic logs and run IDs."],
    ["Export", "Reports, exhibits, allocators, bill examples, and an audit pack."],
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
        <FlatButton href="/contact?subject=Demo%20videos" variant="outline">Watch demo videos</FlatButton>
      </div>
    </Section>
  );
}

function IntegrationsSection() {
  return (
    <Section id="integrations" alt>
      <h2 className="text-xl font-semibold">Fits your stack</h2>
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
      <h2 className="text-xl font-semibold">Security, data storage & compliance</h2>
      <div className="mt-3 grid gap-8 md:grid-cols-2">
        <ul className="space-y-2 text-neutral-700">
          <li>• **Data residency:** choose in-country storage; single-tenant or VPC-isolated options.</li>
          <li>• **On-prem first:** studies can run on a local agent; collaboration & reporting in the cloud.</li>
          <li>• **Read-only to OT:** no control path; adapters ingest exports and snapshots only.</li>
          <li>• **Encryption:** TLS in transit; AES-256 at rest. Customer-managed keys optional.</li>
          <li>• **Access:** SSO (SAML/OIDC), RBAC by role, MFA, IP allow-listing.</li>
        </ul>
        <ul className="space-y-2 text-neutral-700">
          <li>• **Compliance posture:** designed to support **NERC CIP-aligned** deployments; controls mapped to **NIST 800-53** families.</li>
          <li>• **Auditability:** immutable audit logs; run IDs; inputs hashes; versioned models and exhibits.</li>
          <li>• **Change control:** evidence panels tie every figure to a study run or source document.</li>
          <li>• **Air-gapped mode:** export reports and logs for offline submission packages.</li>
        </ul>
      </div>
      <p className="mt-4 text-xs text-neutral-600">
        Note: Gridspeed is a collaboration and reporting layer—**not** a control system. It does not issue operational setpoints or write back to OT.
      </p>
    </Section>
  );
}

function WhoItsForSection() {
  const items = [
    ["Planners", "Cut study-to-brief time; consistent assumptions; fewer re-runs."],
    ["Rates/Finance", "Levelization/ARR, allocators, and bill examples—traceable and exportable."],
    ["Regulatory/Legal", "Submission-ready exhibits with citations and redline diffs."],
    ["IT/OT", "Read-only adapters, hybrid deployment, strong identity and logging."],
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
        <li>• Deterministic runs with reproducible results and tolerances you can set.</li>
        <li>• Evidence panels: every chart and table ties back to a study run or source file.</li>
        <li>• Benchmarks and sample studies available on request.</li>
      </ul>
      <div className="mt-4 w-full min-h-[120px] bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-500 text-sm">
        Case study teaser blocks
      </div>
    </Section>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: "Does Gridspeed replace CYME/Synergi or our DMS?",
      a: "No. Gridspeed sits beside your existing tools. It ingests read-only exports, orchestrates studies, and packages results with citations and audit logs."
    },
    {
      q: "Can we keep data in-country and on-prem?",
      a: "Yes. You can run studies on a local agent and store collaboration data in-country. We also support single-tenant and VPC isolation."
    },
    {
      q: "How do you handle N-1 and hosting capacity?",
      a: "You define contingencies and limits. Gridspeed runs base and contingency cases, surfaces worst-hour plots, and tracks model versions and runs."
    },
    {
      q: "Will regulatory staff accept exhibits generated here?",
      a: "Exhibits mirror your filing format and include traceable sources, run IDs, and redline diffs—built to withstand discovery."
    },
    {
      q: "What about NERC/NIST requirements?",
      a: "Deployments are designed to support NERC CIP-aligned controls and map to NIST 800-53 families. We operate read-only to OT, with SSO, RBAC, logging, and encryption."
    },
    {
      q: "How do we start without a big integration?",
      a: "Begin with a pilot: import model snapshots and capex lists, reproduce a recent study, and generate a capital brief. No rip-and-replace."
    },
  ];
  return (
    <Section id="faqs" alt>
      <h2 className="text-xl font-semibold">FAQs</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {faqs.map(({ q, a }) => (
          <div key={q} className="border border-neutral-200 p-6">
            <div className="font-semibold">{q}</div>
            <div className="text-neutral-700 mt-2 text-sm">{a}</div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <FlatButton href="/contact?subject=Security%20and%20Compliance%20Brief" variant="outline">
          Request security & compliance brief
        </FlatButton>
      </div>
    </Section>
  );
}

function SupportSection() {
  return (
    <Section id="support">
      <h2 className="text-xl font-semibold">Deployment & support</h2>
      <ul className="mt-3 space-y-2 text-neutral-700">
        <li>• Guided onboarding for pilots; typical time-to-first brief in days.</li>
        <li>• Email support with SLAs; designated success manager for pilots.</li>
        <li>• Run playbooks that mirror your SOPs: CIP Brief, Filing Pack, Capital Committee Package.</li>
      </ul>
    </Section>
  );
}

function FinalCTAStrip() {
  return (
    <section className="bg-[#EA580B] text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">Plan in hours. Prove it in minutes.</h2>
        <p className="mt-2 text-white/90">Built for critical infrastructure teams. Read-only to OT. Submission-ready outputs.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <FlatButton href="/contact?subject=Personalized%20Demo" variant="light">Request a Personalized Demo</FlatButton>
          <FlatButton href="/contact?subject=Pilot" variant="light">Start a Pilot</FlatButton>
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <div role="main">
      <HeroSection />
      <GridSpeedComparison />
      <UseCasesFeatures />
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
      <FAQSection />
      <SupportSection />
      <FinalCTAStrip />
    </div>
  );
}
