import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy",
  description: "Read Saral's Privacy Policy: how we collect, use, and protect your information.",
  alternates: { canonical: "/legal/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Header pageTitle="Privacy Policy" />
      <main className="pt-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: September 11, 2025</p>

          <section className="mt-8 space-y-6 text-gray-700 leading-relaxed">
            <p>
              We respect your privacy. This policy explains what information we collect, how we use it,
              and your rights.
            </p>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Information We Collect</h2>
              <p className="mt-2">
                We may collect information you provide directly (such as account details and contact
                information) and data generated from your use of our services (such as logs and usage
                analytics). Refer to product-specific documentation for additional details.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">How We Use Information</h2>
              <p className="mt-2">
                We use your information to provide and improve services, ensure security, communicate
                updates, and meet legal obligations.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Your Choices</h2>
              <p className="mt-2">
                You can request access, correction, or deletion of your data where applicable. Contact us at
                <a href="mailto:hello@saralsystems.co" className="text-orange-600 hover:underline"> hello@saralsystems.co</a>.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
              <p className="mt-2">
                If you have questions about this policy, please contact us at
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
