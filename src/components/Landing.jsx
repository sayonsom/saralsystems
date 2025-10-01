"use client";

import Link from "next/link";
import {
  Zap,
  TrendingDown,
  Clock,
  Hourglass,
  RefreshCw,
  FileText,
  Brain,
  ShieldCheck,
  ScrollText,
  Archive,
  GitBranch,
  Server,
  CheckCircle,
  Cloud,
  Building,
  Layers,
} from "lucide-react";

export default function Landing() {
  return (
    <div role="main" className="font-['Sen',sans-serif]">
      {/* Hero Section */}
      <section className="bg-[#ea580b] text-white py-[100px] px-5 text-center">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-[3.5em] mb-[30px] font-extrabold tracking-tight">Gridspeed</h1>
          <p className="text-2xl mb-[50px] font-normal">Bring Utility teams on one platform for faster grid planning</p>
          <Link
            href="#demo"
            className="inline-block bg-white text-[#ea580b] py-[18px] px-12 text-lg font-bold uppercase tracking-wide hover:bg-gray-100 transition-all"
          >
            Request Demo
          </Link>

          {/* Stats */}
          <div className="flex justify-center gap-20 mt-[60px] flex-wrap">
            <div className="text-center">
              <div className="w-10 h-10 flex items-center justify-center mx-auto mb-2.5">
                <Zap className="w-10 h-10" />
              </div>
              <div className="text-5xl font-extrabold">10x</div>
              <div className="text-base font-normal mt-2">Faster studies</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 flex items-center justify-center mx-auto mb-2.5">
                <TrendingDown className="w-10 h-10" />
              </div>
              <div className="text-5xl font-extrabold">90%</div>
              <div className="text-base font-normal mt-2">Less manual work</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 flex items-center justify-center mx-auto mb-2.5">
                <Clock className="w-10 h-10" />
              </div>
              <div className="text-5xl font-extrabold">Hours</div>
              <div className="text-base font-normal mt-2">Not weeks</div>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="w-full max-w-[1000px] h-[400px] bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-bold uppercase tracking-wider mt-[50px] mx-auto">
            Product Screenshot / Dashboard View
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-[100px] px-5 bg-gray-100">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[2.5em] mb-[60px] text-center text-[#1a1a1a] font-extrabold">
            We understand the challenges you face
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-[1100px] mx-auto">
            <div className="bg-white p-10 border-l-4 border-[#ea580b]">
              <div className="w-12 h-12 flex items-center justify-center text-[#ea580b] mb-5">
                <Hourglass className="w-12 h-12" />
              </div>
              <h3 className="text-[#1a1a1a] mb-3 text-[1.3em] font-bold">Time-intensive processes</h3>
              <p className="text-gray-600 text-base leading-6">
                Manual data imports and file conversions take days away from meaningful analysis work
              </p>
            </div>
            <div className="bg-white p-10 border-l-4 border-[#ea580b]">
              <div className="w-12 h-12 flex items-center justify-center text-[#ea580b] mb-5">
                <RefreshCw className="w-12 h-12" />
              </div>
              <h3 className="text-[#1a1a1a] mb-3 text-[1.3em] font-bold">Repetitive scenario work</h3>
              <p className="text-gray-600 text-base leading-6">
                Each variation requires recreating configuration files from the ground up
              </p>
            </div>
            <div className="bg-white p-10 border-l-4 border-[#ea580b]">
              <div className="w-12 h-12 flex items-center justify-center text-[#ea580b] mb-5">
                <FileText className="w-12 h-12" />
              </div>
              <h3 className="text-[#1a1a1a] mb-3 text-[1.3em] font-bold">Documentation burden</h3>
              <p className="text-gray-600 text-base leading-6">
                Reports and compliance documents consume hours of experienced engineer time
              </p>
            </div>
            <div className="bg-white p-10 border-l-4 border-[#ea580b]">
              <div className="w-12 h-12 flex items-center justify-center text-[#ea580b] mb-5">
                <Brain className="w-12 h-12" />
              </div>
              <h3 className="text-[#1a1a1a] mb-3 text-[1.3em] font-bold">Knowledge retention</h3>
              <p className="text-gray-600 text-base leading-6">
                Tribal knowledge walks out the door when experienced engineers retire
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-[100px] px-5 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[2.5em] mb-[60px] text-center text-[#1a1a1a] font-extrabold">
            Built to support your workflow
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[50px] mt-[60px] max-w-[1100px] mx-auto">
            <div>
              <div className="w-full h-[250px] bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-bold uppercase tracking-wider mb-5">
                Scenario Generation Interface
              </div>
              <h3 className="text-[#ea580b] mb-3 text-[1.4em] font-bold">Automated scenario generation</h3>
              <p className="text-gray-600 text-base leading-6">
                Generate study scenarios in minutes while maintaining your engineering standards and grid constraints
              </p>
            </div>

            <div>
              <div className="w-full h-[250px] bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-bold uppercase tracking-wider mb-5">
                Data Import View
              </div>
              <h3 className="text-[#ea580b] mb-3 text-[1.4em] font-bold">Direct CYME & Synergi import</h3>
              <p className="text-gray-600 text-base leading-6">
                Import your existing feeder models and customer data without conversion steps
              </p>
            </div>

            <div>
              <div className="w-full h-[250px] bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-bold uppercase tracking-wider mb-5">
                Study Templates Library
              </div>
              <h3 className="text-[#ea580b] mb-3 text-[1.4em] font-bold">Study templates</h3>
              <p className="text-gray-600 text-base leading-6">
                Templates for NWA, hosting capacity, DER integration, and vegetation management studies
              </p>
            </div>

            <div>
              <div className="w-full h-[250px] bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-bold uppercase tracking-wider mb-5">
                Report Builder
              </div>
              <h3 className="text-[#ea580b] mb-3 text-[1.4em] font-bold">Document generation</h3>
              <p className="text-gray-600 text-base leading-6">
                Create reports formatted to your utility's standards with tables and charts included
              </p>
            </div>

            <div>
              <div className="w-full h-[250px] bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-bold uppercase tracking-wider mb-5">
                Team Workspace View
              </div>
              <h3 className="text-[#ea580b] mb-3 text-[1.4em] font-bold">Team workspaces</h3>
              <p className="text-gray-600 text-base leading-6">
                Role-based access lets teams collaborate while maintaining appropriate data boundaries
              </p>
            </div>

            <div>
              <div className="w-full h-[250px] bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-bold uppercase tracking-wider mb-5">
                AMI Data Integration
              </div>
              <h3 className="text-[#ea580b] mb-3 text-[1.4em] font-bold">Smart meter integration</h3>
              <p className="text-gray-600 text-base leading-6">
                Connect AMI data directly into grid models for load analysis and validation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Governance Section */}
      <section className="py-[100px] px-5 bg-gray-100">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[2.5em] mb-[60px] text-center text-[#1a1a1a] font-extrabold">
            Your data stays under your control
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[50px] mt-[60px] max-w-[1100px] mx-auto">
            <div>
              <div className="w-12 h-12 flex items-center justify-center text-[#ea580b] mb-5">
                <ShieldCheck className="w-12 h-12" />
              </div>
              <h3 className="text-[#ea580b] mb-3 text-[1.4em] font-bold">Role-based access</h3>
              <p className="text-gray-600 text-base leading-6">
                Configure permissions by team, project, and data type to maintain operational security
              </p>
            </div>

            <div>
              <div className="w-12 h-12 flex items-center justify-center text-[#ea580b] mb-5">
                <ScrollText className="w-12 h-12" />
              </div>
              <h3 className="text-[#ea580b] mb-3 text-[1.4em] font-bold">Audit trails</h3>
              <p className="text-gray-600 text-base leading-6">
                Track every action and change with complete visibility into who accessed what and when
              </p>
            </div>

            <div>
              <div className="w-12 h-12 flex items-center justify-center text-[#ea580b] mb-5">
                <Archive className="w-12 h-12" />
              </div>
              <h3 className="text-[#ea580b] mb-3 text-[1.4em] font-bold">Knowledge preservation</h3>
              <p className="text-gray-600 text-base leading-6">
                Capture engineering decisions and methodology so expertise remains with your utility
              </p>
            </div>

            <div>
              <div className="w-12 h-12 flex items-center justify-center text-[#ea580b] mb-5">
                <GitBranch className="w-12 h-12" />
              </div>
              <h3 className="text-[#ea580b] mb-3 text-[1.4em] font-bold">Version control</h3>
              <p className="text-gray-600 text-base leading-6">
                Maintain complete history of study revisions with the ability to restore previous versions
              </p>
            </div>

            <div>
              <div className="w-12 h-12 flex items-center justify-center text-[#ea580b] mb-5">
                <Server className="w-12 h-12" />
              </div>
              <h3 className="text-[#ea580b] mb-3 text-[1.4em] font-bold">Data residency</h3>
              <p className="text-gray-600 text-base leading-6">
                Choose where your data lives with private cloud or on-premises deployment options
              </p>
            </div>

            <div>
              <div className="w-12 h-12 flex items-center justify-center text-[#ea580b] mb-5">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h3 className="text-[#ea580b] mb-3 text-[1.4em] font-bold">Compliance ready</h3>
              <p className="text-gray-600 text-base leading-6">
                Built with NERC CIP and utility security requirements in mind from day one
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deployment Section */}
      <section className="py-20 px-5 bg-[#1a1a1a] text-white text-center">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[2.5em] mb-5 font-extrabold">Deploy on your terms</h2>
          <p className="text-xl mb-[50px] text-gray-400">Run Gridspeed where your security policies require</p>

          <div className="w-full max-w-[800px] h-[350px] bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-bold uppercase tracking-wider my-10 mx-auto">
            Deployment Architecture Diagram
          </div>

          <div className="flex justify-center gap-[60px] flex-wrap max-w-[900px] mx-auto">
            <div className="flex-1 min-w-[250px] bg-[#2a2a2a] p-10 border-t-4 border-[#ea580b]">
              <div className="w-14 h-14 flex items-center justify-center mx-auto mb-5">
                <Cloud className="w-14 h-14 text-[#ea580b]" />
              </div>
              <h3 className="text-2xl mb-4 font-bold">Private Cloud</h3>
              <p className="text-gray-400 leading-6">
                Dedicated environment in your preferred cloud provider with full isolation and control
              </p>
            </div>

            <div className="flex-1 min-w-[250px] bg-[#2a2a2a] p-10 border-t-4 border-[#ea580b]">
              <div className="w-14 h-14 flex items-center justify-center mx-auto mb-5">
                <Building className="w-14 h-14 text-[#ea580b]" />
              </div>
              <h3 className="text-2xl mb-4 font-bold">On-Premises</h3>
              <p className="text-gray-400 leading-6">
                Deploy behind your firewall on your infrastructure for maximum data sovereignty
              </p>
            </div>

            <div className="flex-1 min-w-[250px] bg-[#2a2a2a] p-10 border-t-4 border-[#ea580b]">
              <div className="w-14 h-14 flex items-center justify-center mx-auto mb-5">
                <Layers className="w-14 h-14 text-[#ea580b]" />
              </div>
              <h3 className="text-2xl mb-4 font-bold">Hybrid</h3>
              <p className="text-gray-400 leading-6">
                Combine cloud convenience with on-prem security for critical data assets
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 px-5 bg-white text-center">
        <div className="max-w-[1200px] mx-auto">
          <h3 className="text-3xl mb-[50px] font-bold text-[#1a1a1a]">Works with your existing tools</h3>

          <div className="flex justify-center gap-[60px] flex-wrap items-center">
            <div className="bg-gray-100 text-[#1a1a1a] py-6 px-12 font-bold text-2xl border-2 border-gray-300">
              CYME
            </div>
            <div className="bg-gray-100 text-[#1a1a1a] py-6 px-12 font-bold text-2xl border-2 border-gray-300">
              SYNERGI
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-[100px] px-5 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[2.5em] mb-[60px] text-center text-[#1a1a1a] font-extrabold">Common questions</h2>

          <div className="max-w-[900px] mx-auto mt-[60px]">
            <div className="border-b-2 border-gray-200 py-[30px]">
              <div className="text-[1.3em] font-bold text-[#1a1a1a] mb-4">How long does implementation take?</div>
              <div className="text-base text-gray-600 leading-7">
                Most utilities are running studies within 2-4 weeks. We work with your IT team to ensure smooth integration with existing systems and security protocols.
              </div>
            </div>

            <div className="border-b-2 border-gray-200 py-[30px]">
              <div className="text-[1.3em] font-bold text-[#1a1a1a] mb-4">
                Can we customize study templates for our standards?
              </div>
              <div className="text-base text-gray-600 leading-7">
                Absolutely. Templates are fully customizable to match your utility's engineering standards, report formats, and regulatory requirements.
              </div>
            </div>

            <div className="border-b-2 border-gray-200 py-[30px]">
              <div className="text-[1.3em] font-bold text-[#1a1a1a] mb-4">What happens to our data?</div>
              <div className="text-base text-gray-600 leading-7">
                Your data never leaves your chosen environment. With on-prem or private cloud deployment, you maintain complete control over data location and access.
              </div>
            </div>

            <div className="border-b-2 border-gray-200 py-[30px]">
              <div className="text-[1.3em] font-bold text-[#1a1a1a] mb-4">
                Do you support other grid analysis tools?
              </div>
              <div className="text-base text-gray-600 leading-7">
                We're actively expanding integrations based on customer needs. Our API allows connection to most common utility data sources and modeling platforms.
              </div>
            </div>

            <div className="border-b-2 border-gray-200 py-[30px]">
              <div className="text-[1.3em] font-bold text-[#1a1a1a] mb-4">What training is required for our team?</div>
              <div className="text-base text-gray-600 leading-7">
                Planning engineers typically become productive within a few days. We provide hands-on training sessions tailored to your team's workflow and study types.
              </div>
            </div>

            <div className="border-b-2 border-gray-200 py-[30px]">
              <div className="text-[1.3em] font-bold text-[#1a1a1a] mb-4">
                How do you handle updates and maintenance?
              </div>
              <div className="text-base text-gray-600 leading-7">
                Updates are scheduled with your team and can be deployed during maintenance windows. On-prem deployments give you complete control over the update schedule.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="demo" className="py-[100px] px-5 bg-gray-100">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[2.5em] mb-[60px] text-center text-[#1a1a1a] font-extrabold">Request a demo</h2>
          <p className="text-center text-xl text-gray-600 mb-5">
            Let's discuss how Gridspeed can support your team's workflow
          </p>

          <div className="max-w-[700px] mx-auto mt-[60px] bg-white p-[50px]">
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-[30px]">
                <div>
                  <label className="block text-base font-bold text-[#1a1a1a] mb-2.5">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="John"
                    className="w-full p-4 text-base font-['Sen',sans-serif] border-2 border-gray-300 bg-white focus:outline-none focus:border-[#ea580b] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-base font-bold text-[#1a1a1a] mb-2.5">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Smith"
                    className="w-full p-4 text-base font-['Sen',sans-serif] border-2 border-gray-300 bg-white focus:outline-none focus:border-[#ea580b] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-[30px]">
                <div>
                  <label className="block text-base font-bold text-[#1a1a1a] mb-2.5">Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="john.smith@utility.com"
                    className="w-full p-4 text-base font-['Sen',sans-serif] border-2 border-gray-300 bg-white focus:outline-none focus:border-[#ea580b] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-base font-bold text-[#1a1a1a] mb-2.5">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="(555) 123-4567"
                    className="w-full p-4 text-base font-['Sen',sans-serif] border-2 border-gray-300 bg-white focus:outline-none focus:border-[#ea580b] transition-colors"
                  />
                </div>
              </div>

              <div className="mb-[30px]">
                <label className="block text-base font-bold text-[#1a1a1a] mb-2.5">Utility Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Your utility organization"
                  className="w-full p-4 text-base font-['Sen',sans-serif] border-2 border-gray-300 bg-white focus:outline-none focus:border-[#ea580b] transition-colors"
                />
              </div>

              <div className="mb-[30px]">
                <label className="block text-base font-bold text-[#1a1a1a] mb-2.5">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Distribution Planning Engineer"
                  className="w-full p-4 text-base font-['Sen',sans-serif] border-2 border-gray-300 bg-white focus:outline-none focus:border-[#ea580b] transition-colors"
                />
              </div>

              <div className="mb-[30px]">
                <label className="block text-base font-bold text-[#1a1a1a] mb-2.5">Primary Study Types</label>
                <select className="w-full p-4 text-base font-['Sen',sans-serif] border-2 border-gray-300 bg-white focus:outline-none focus:border-[#ea580b] transition-colors">
                  <option value="">Select your primary focus</option>
                  <option value="nwa">Non-Wire Alternatives</option>
                  <option value="hosting">Hosting Capacity</option>
                  <option value="der">DER Integration</option>
                  <option value="vegetation">Vegetation Management</option>
                  <option value="smart-meter">Smart Meter Integration</option>
                  <option value="multiple">Multiple Study Types</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-[30px]">
                <label className="block text-base font-bold text-[#1a1a1a] mb-2.5">Tell us about your needs</label>
                <textarea
                  placeholder="What challenges are you facing with your current grid planning workflow?"
                  className="w-full p-4 text-base font-['Sen',sans-serif] border-2 border-gray-300 bg-white focus:outline-none focus:border-[#ea580b] transition-colors resize-y min-h-[120px]"
                />
              </div>

              <div className="mb-[30px]">
                <label className="block text-base font-bold text-[#1a1a1a] mb-2.5">Preferred Deployment</label>
                <select className="w-full p-4 text-base font-['Sen',sans-serif] border-2 border-gray-300 bg-white focus:outline-none focus:border-[#ea580b] transition-colors">
                  <option value="">Select deployment preference</option>
                  <option value="cloud">Private Cloud</option>
                  <option value="onprem">On-Premises</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="discuss">Not sure - let's discuss</option>
                </select>
              </div>

              <button
                type="submit"
                className="bg-[#ea580b] text-white py-[18px] px-12 text-lg font-bold font-['Sen',sans-serif] uppercase tracking-wide w-full hover:bg-[#c94a09] transition-colors cursor-pointer border-none"
              >
                Request Demo
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-[120px] px-5 bg-[#ea580b] text-white text-center">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[2.8em] mb-[30px] font-extrabold">Ready to get started?</h2>
          <p className="text-[1.3em] mb-[50px] max-w-[700px] mx-auto">
            Join utility teams already accelerating their grid planning with Gridspeed
          </p>

          <Link
            href="#demo"
            className="inline-block bg-white text-[#ea580b] py-[18px] px-12 text-lg font-bold uppercase tracking-wide hover:bg-gray-100 transition-all"
          >
            Request Demo
          </Link>
        </div>
      </section>
    </div>
  );
}
