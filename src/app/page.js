import Footer from "../components/Footer";
import Landing from "../components/Landing";

export default async function Home() {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GridSpeed",
    url: "https://www.gridspeed.app",
    logo: "https://www.gridspeed.app/logo.png",
    sameAs: [],
  };

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "GridSpeed",
    applicationCategory: "EngineeringApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "$0.0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />

      <div className="bg-white text-gray-900 font-sans antialiased">
        <main>
          <Landing />
        </main>
        <Footer />
      </div>
    </>
  );
}
