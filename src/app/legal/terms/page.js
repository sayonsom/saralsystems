import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms & Conditions",
  description: "Read Saral's Terms & Conditions: usage rules, disclaimers, and legal terms.",
  alternates: { canonical: "/legal/terms" },
};

export default function TermsPage() {
  return (
    <>
      <Header pageTitle="Terms & Conditions" />
      <main className="pt-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: September 11, 2025</p>

          <section className="mt-8 space-y-6 text-gray-700 leading-relaxed">
            <p>
              By accessing or using our website and services, you agree to these Terms & Conditions.
              If you do not agree, do not use the services.
            </p>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Use of Services</h2>
              <p className="mt-2">
                You agree to use the services in compliance with applicable laws and not to misuse or
                interfere with their operation or security.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Accounts</h2>
              <p className="mt-2">
                You are responsible for maintaining the confidentiality of your credentials and for
                activities under your account.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Disclaimers</h2>
              <p className="mt-2">
                Services are provided "as is" without warranties of any kind to the maximum extent
                permitted by law.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
              <p className="mt-2">
                Questions? Contact
                <a href="mailto:hello@saralsystems.co" className="text-orange-600 hover:underline"> hello@saralsystems.co</a>.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
