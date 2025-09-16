import Header from "../components/Header";
import Hero from "../components/Hero";
import BlogSection from "../components/BlogSection";
import DeepDivesSection from "../components/DeepDivesSection";
import TechnologiesSection from "../components/TechnologiesSection";
import EnergySecuritySection from "../components/EnergySecuritySection";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import PersonaTiles from "@/components/PersonaTiles";
import Walkthrough from "@/components/Walkthrough";
import ProofStrip from "@/components/ProofStrip";
import FeatureGrid from "@/components/FeatureGrid";
import SecurityAccordion from "@/components/SecurityAccordion";
import Pricing from "@/components/Pricing";
import DemoVideo from "@/components/DemoVideo";
import FAQ from "@/components/FAQs";

export default async function Home() {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Smart Grid Planning SaaS",
    url: "https://www.voltedge.dev",
    logo: "https://www.voltedge.dev/logo.png",
    sameAs: [
      "https://www.linkedin.com/company/voltedge",
      "https://twitter.com/gridleaf_",
    ],
  };

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "VoltEdge",
    applicationCategory: "EngineeringApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "$0.0",
      priceCurrency: "USD",
    },
    // aggregateRating: {
    //   "@type": "AggregateRating",
    //   ratingValue: "4.9",
    //   reviewCount: "27",
    // },
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
      <Header />
      <main>
        <Hero />
        <PersonaTiles />
        <Walkthrough />
        <ProofStrip />
        <FeatureGrid />
        <SecurityAccordion />
        <Pricing />
        <DemoVideo />
        <TechnologiesSection />
        <FAQ />
        <Contact />
        <BlogSection />
        <DeepDivesSection />
        <EnergySecuritySection />
        
      </main>
      <Footer />
    </div>
    
    </>
   
  );
}
