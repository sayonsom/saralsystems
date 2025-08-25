import { Search, TrendingDown, Bot, GraduationCap } from "lucide-react";
import Section from "./Section";
import FeatureCard from "./FeatureCard";

export default function Services() {
  return (
    <Section id="services" className="bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Services</h2>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          AI-powered solutions to solve India's most pressing energy challenges.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          icon={<Search size={24} className="text-orange-600" />}
          title="Data Center Prospecting & Design"
          imageSrc="/window.svg"
          delay={0}
        >
          We help you identify high-potential data center locations and design for optimal power and cooling efficiency.
        </FeatureCard>
        <FeatureCard
          icon={<TrendingDown size={24} className="text-orange-600" />}
          title="PPA Cost-Saving Analysis"
          imageSrc="/globe.svg"
          delay={100}
        >
          Our AI analyzes your energy contracts to find and recommend actionable cost-saving opportunities in your PPAs.
        </FeatureCard>
        <FeatureCard
          icon={<Bot size={24} className="text-orange-600" />}
          title="AI Workflow Automation"
          imageSrc="/file.svg"
          delay={200}
        >
          We design and implement custom AI workflows to automate complex tasks in your energy projects, boosting productivity.
        </FeatureCard>
        <FeatureCard
          icon={<GraduationCap size={24} className="text-orange-600" />}
          title="Energy Workforce Skill-Gap ID"
          imageSrc="/next.svg"
          delay={300}
        >
          Identify and address skill gaps in your team to ensure your workforce is ready for the energy transition.
        </FeatureCard>
      </div>
    </Section>
  );
}

