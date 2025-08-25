import Header from "../components/Header";
import Hero from "../components/Hero";
import BlogSection from "../components/BlogSection";
import DeepDivesSection from "../components/DeepDivesSection";
import TechnologiesSection from "../components/TechnologiesSection";
import EnergySecuritySection from "../components/EnergySecuritySection";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default async function Home() {
  return (
    <div className="bg-white text-gray-900 font-sans antialiased">
      <Header />
      <main>
        <Hero />
        <BlogSection />
        <DeepDivesSection />
        <TechnologiesSection />
        <EnergySecuritySection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
