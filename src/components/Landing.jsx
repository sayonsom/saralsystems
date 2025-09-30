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

// NEW HERO — platform for grid professionals
function HeroSection() {
  return (
    <Section id="hero">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
            One workspace for grid professionals.
          </h1>

          <p className="mt-3 text-neutral-700 max-w-xl">
            Gridspeed helps planning, protection, rates, regulatory, and IT/OT teams work off the
            same studies, the same terms, and the same evidence—so filings ship faster and decisions
            stick. Access contingency results and power-flow evidence, generate submission-ready
            exhibits, and keep every figure tied to a study run and source.
          </p>

          <ul className="mt-4 space-y-2 text-sm text-neutral-800">
            <li>• Role-based workspaces: planner, protection, rates, regulatory, IT/OT.</li>
            <li>• N-0/N-1 evidence, hosting capacity & enablement, side-by-side with scope & cost.</li>
            <li>• Shared glossary & data dictionary to remove ambiguity and rework.</li>
            <li>• Approvals, audit logs, and export packs your Commission will accept.</li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <FlatButton href="/contact?subject=Personalized%20Demo" variant="primary" title="Request a Personalized Demo">
              Request a Personalized Demo
            </FlatButton>
            <FlatButton href="/contact?subject=Pilot" variant="outline" title="Start a Pilot">
              Start a Pilot
            </FlatButton>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-neutral-600">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Read-only to OT
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> In-country storage options
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> NERC-aligned / NIST-mapped controls
            </span>
          </div>
        </div>

        <div className="w-full aspect-[16/10] bg-neutral-100 border border-neutral-200 flex items-center justify-center">
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

/* Reused your comparison & use-cases sections below */

// NEW — Role-based Workspaces (adapts to the professional)
function RolesSection() {
  const roles = [
    ["Planning", "Run base/N-1, view worst-hour plots, and attach scope & cost in one place."],
    ["Protection", "Review settings impacts and restoration plans without chasing files."],
    ["Rates/Finance", "Levelized RR/ARR, allocators, and typical bills—traceable and exportable."],
    ["Regulatory/Legal", "Assemble exhibits with citations, redlines, and an audit pack."],
    ["IT/OT", "Read-only adapters, SSO/RBAC, logging; on-prem study agent supported."],
  ];
  return (
    <Section id="roles" alt>
      <h2 className="text-xl font-semibold">Adapts to the professional—toward one utility goal</h2>
      <p className="mt-2 text-neutral-700 max-w-3xl">
        Gridspeed molds to each role so teams don’t learn a new tool or hunt for data. Everyone
        sees the same evidence, in their language, with their responsibilities.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-5">
        {roles.map(([title, desc]) => (
          <div key={title} className="border border-neutral-200 p-6">
            <div className="font-semibold">{title}</div>
            <div className="text-neutral-700 mt-2 text-sm">{desc}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// NEW — Knowledge Retention (glossary, evidence locker, lineage)
function KnowledgeLayerSection() {
  return (
    <Section id="knowledge">
      <h2 className="text-xl font-semibold">Keep team knowledge. End the back-and-forth.</h2>
      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <ul className="space-y-2 text-neutral-700">
          <li>• Evidence locker: every chart/table ties to a study run, model version, and source file.</li>
          <li>• Shared glossary & data dictionary: align terms (Normal/LTE/STE, PSPF/ARR) across teams.</li>
          <li>• Scenario templates: EV/DER/weather/outage profiles with versioning and change logs.</li>
          <li>• Redline diffs of studies and exhibits to capture what changed and why.</li>
        </ul>
        <div className="w-full min-h-[160px] bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-500 text-sm">
          Knowledge & lineage diagram
        </div>
      </div>
    </Section>
  );
}

// NEW — Data Exchange & Approvals (role-based interpretation + governance)
function DataExchangeSection() {
  return (
    <Section id="exchange" alt>
      <h2 className="text-xl font-semibold">Role-based data interpretation & secure exchange</h2>
      <ul className="mt-3 space-y-2 text-neutral-700">
        <li>• Read-only ingest from CYME/Synergi, GIS, AMI/MDM, OMS, and capex workbooks.</li>
        <li>• Role-aware views: planners see constraints; rates see allocators; regulatory sees exhibit diff.</li>
        <li>• Approvals & sign-offs: planner → senior engineer → rates → regulatory—fully auditable.</li>
        <li>• Export packs: Word/Excel/PDF with citations, run IDs, and a regulator-ready audit bundle.</li>
      </ul>
      <div className="mt-5">
        <FlatButton href="/contact?subject=Personalized%20Demo" variant="outline">
          See a role-based walkthrough
        </FlatButton>
      </div>
    </Section>
  );
}

// Existing sections (edited copy only where helpful)

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
    ["Hybrid deployment", "On-prem study agent; burst to cloud for collaboration and reporting."],
    ["Guided configuration", "Contingencies, assumptions, and templates your team recognizes."],
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
        <li>• Queue 100+ cases; parallel execution; notify on completion.</li>
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
          <li>• <b>Data residency:</b> in-country storage; single-tenant or VPC-isolated options.</li>
          <li>• <b>On-prem first:</b> studies can run on a local agent; collaboration/reporting in the cloud.</li>
          <li>• <b>Read-only to OT:</b> no control path; adapters ingest exports and snapshots only.</li>
          <li>• <b>Encryption:</b> TLS in transit; AES-256 at rest. Customer-managed keys optional.</li>
          <li>• <b>Access:</b> SSO (SAML/OIDC), RBAC by role, MFA, IP allow-listing.</li>
        </ul>
        <ul className="space-y-2 text-neutral-700">
          <li>• <b>Compliance posture:</b> designed to support NERC CIP-aligned deployments; controls mapped to NIST 800-53 families.</li>
          <li>• <b>Auditability:</b> immutable logs; run IDs; inputs hashes; versioned models/exhibits.</li>
          <li>• <b>Change control:</b> evidence panels tie every figure to a study run or source document.</li>
          <li>• <b>Air-gapped mode:</b> export reports and logs for offline submission packages.</li>
        </ul>
      </div>
      <p className="mt-4 text-xs text-neutral-600">
        Gridspeed is a collaboration and reporting layer—<b>not</b> a control system. It does not issue operational setpoints or write back to OT.
      </p>
    </Section>
  );
}

function WhoItsForSection() {
  const items = [
    ["Planning", "Cut study-to-brief time; consistent assumptions; fewer re-runs."],
    ["Protection", "Coordinate settings and restoration plans with shared evidence."],
    ["Rates/Finance", "Levelization/ARR, allocators, and bills—traceable and exportable."],
    ["Regulatory/Legal", "Submission-ready exhibits with citations and redline diffs."],
  ];
  return (
    <Section id="who-its-for" alt>
      <h2 className="text-xl font-semibold">Built for utility business excellence</h2>
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
      a: "Yes. You can run studies on a local agent and store collaboration data in-country. Single-tenant and VPC isolation are supported."
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
        <li>• Guided onboarding for pilots; time-to-first brief in days.</li>
        <li>• Email support with SLAs; designated success manager for pilots.</li>
        <li>• Playbooks that mirror your SOPs: CIP Brief, Filing Pack, Capital Committee Package.</li>
      </ul>
    </Section>
  );
}

function FinalCTAStrip() {
  return (
    <section className="bg-[#EA580B] text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">Plan together. Prove together.</h2>
        <p className="mt-2 text-white/90">A collaboration platform designed for utility business excellence.</p>
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
      <RolesSection />
      <KnowledgeLayerSection />
      <DataExchangeSection />
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
