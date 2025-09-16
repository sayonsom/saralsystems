// app/components/Hero.js
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
              Accelerate
              <span className="text-[#ea580b]"> Smart Grid</span> planning
            </h1>
            <p className="mt-4 text-neutral-700 max-w-xl">
              Enhanced productivity for the tools you already trust (like CYMEDIST, Synergi). Our platform works alongside your established systems to streamline network modeling and scenario analysis, helping you meet regulatory requirements faster with full transparency and control. No replacements, no black boxes—just better results from your current investments.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center px-5 py-3 bg-[#ea580b] text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#ea580b]"
              >
                Free for Research
              </Link>
              <Link
                href="/enterprise"
                className="inline-flex items-center px-5 py-3 border border-neutral-900 text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                Get Demo for Utilities
              </Link>
            </div>
            <p className="mt-4 text-sm text-neutral-600">
              SOC-2 Compliance • Import from CYME/Synergi • Deploy on your cloud or on prem
            </p>
          </div>
          {/* Replace this placeholder with a light, short MP4/WebM loop for performance */}
          <div className="w-full aspect-video bg-neutral-100 flex items-center justify-center text-neutral-500">
            <span className="px-4 text-center text-sm">
              60-sec demo video here (prompt → model → voltage chart)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
