import { Cpu, FileText, Users } from "lucide-react";
import Section from "./Section";
import FeatureCard from "./FeatureCard";

export default function UseCases() {
  return (
    <Section id="use-cases" className="bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">AI in Action: Built on Saral</h2>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Our versatile AI stack is the foundation for powerful, real-world energy applications in India.
        </p>
      </div>
      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
        <FeatureCard icon={<Cpu size={24} className="text-orange-600" />} title="Data Center Site Scoring">
          AI models that score potential sites based on power availability, grid stability, and climate data.
        </FeatureCard>
        <FeatureCard icon={<FileText size={24} className="text-orange-600" />} title="Contract Risk Analysis">
          Automatically flag risky or costly clauses in PPAs before you sign, saving time and money.
        </FeatureCard>
        <FeatureCard icon={<Users size={24} className="text-orange-600" />} title="Predictive Maintenance Training">
          Simulate grid events to train maintenance crews, improving response times and safety.
        </FeatureCard>
      </div>
    </Section>
  );
}

