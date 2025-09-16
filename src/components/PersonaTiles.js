// app/(marketing)/components/PersonaTiles.js
import Link from "next/link";

const tiles = [
  {
    title: "Academia",
    desc: "Teach modern planning hands-on. Run feeders in a browser; export charts for reports.",
    href: "/templates#academia",
  },
  {
    title: "Consultants",
    desc: "Deliver faster studies. Prompt-to-model, clone scenarios, share live links with clients.",
    href: "/solutions#consultants",
  },
  {
    title: "Utilities",
    desc: "Innovation sandbox. Pilot EV/DER hosting safely; keep CYME/ETAP for filings.",
    href: "/enterprise#utilities",
  },
];

export default function PersonaTiles() {
  return (
    <section className="bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {tiles.map((t) => (
            <div
              key={t.title}
              className="border border-neutral-200 p-6"
            >
              <h3 className="text-lg font-semibold">{t.title}</h3>
              <p className="mt-2 text-neutral-700">{t.desc}</p>
              <Link
                href={t.href}
                className="mt-4 inline-flex text-[#ea580b] underline underline-offset-4"
              >
                Learn more
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
