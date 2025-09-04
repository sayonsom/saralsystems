import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Lyapunov Stability for Smart Homes — Concepts | Saral",
  description:
    "An interactive concept lesson exploring Lyapunov stability for smart homes with AC, fridge, EV, and solar coordination.",
};

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Skip link for accessibility */}
      <a
        href="#concept-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-black focus:px-3 focus:py-2 focus:rounded"
      >
        Skip to content
      </a>

      {/* Global site header (fixed) */}
      <Header />

      {/* Content wrapper with offset for fixed header */}
      <div className="pt-16">
        {/* Teaching-friendly banner */}
        <section className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-white text-orange-700 border border-orange-200 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide">
                Concept
              </span>
              <p className="text-sm text-gray-700">
                Learn by reading on the left and experimenting on the right.
              </p>
            </div>
          </div>
        </section>

        {/* Page content from this concept */}
        <div id="concept-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>

        {/* Global site footer */}
        <Footer />
      </div>
    </div>
  );
}
