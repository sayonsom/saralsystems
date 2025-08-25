import { Cpu, Database, Cloud, Zap } from "lucide-react";
import Section from "./Section";
import FeatureCard from "./FeatureCard";
import CTAButton from "./CTAButton";

export default function TechnologiesSection() {
  const technologies = [
    {
      icon: <Cpu size={24} className="text-blue-600" />,
      title: "Intelligent Load Balancing",
      description: "AI-driven power distribution system that optimizes energy loads across data centers, reducing peak demand charges by up to 30%.",
      features: ["Real-time optimization", "Predictive modeling", "Automated switching"]
    },
    {
      icon: <Database size={24} className="text-green-600" />,
      title: "Smart Grid Analytics",
      description: "Advanced analytics platform for monitoring and predicting grid performance, enabling proactive maintenance and reduced downtime.",
      features: ["Pattern recognition", "Anomaly detection", "Preventive alerts"]
    },
    {
      icon: <Cloud size={24} className="text-purple-600" />,
      title: "Carbon-Aware Computing",
      description: "Workload scheduling system that shifts computational tasks to times when renewable energy is most available.",
      features: ["Carbon tracking", "Green scheduling", "Emissions reporting"]
    },
    {
      icon: <Zap size={24} className="text-orange-600" />,
      title: "Energy Recovery Systems",
      description: "Innovative heat recovery solutions that convert waste heat from data centers into usable energy for local communities.",
      features: ["Heat capture", "Energy conversion", "Community integration"]
    }
  ];

  return (
    <Section className="bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Technologies Built on Saral</h2>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg">
          Cutting-edge solutions powered by our AI platform, transforming India's energy infrastructure 
          one innovation at a time.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {technologies.map((tech, index) => (
          <div 
            key={tech.title}
            className="bg-white rounded-none p-6 transition-all duration-300 transform hover:scale-105"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="mb-4">{tech.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{tech.title}</h3>
            <p className="text-gray-600 mb-4">{tech.description}</p>
            <ul className="space-y-2">
              {tech.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-lg text-gray-700 mb-6">
          Ready to leverage these technologies for your energy infrastructure?
        </p>
      </div>

      <CTAButton />
    </Section>
  );
}