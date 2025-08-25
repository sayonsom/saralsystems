"use client";

import { useState } from "react";
import { Sparkles, LoaderCircle } from "lucide-react";
import Section from "./Section";

export default function AiBrief() {
  const [formStatus, setFormStatus] = useState(null);
  const [projectDescription, setProjectDescription] = useState("");
  const [projectBrief, setProjectBrief] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateProjectBrief = async () => {
    if (!projectDescription) {
      setError("Please describe your project first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setProjectBrief(null);

    try {
      const response = await fetch("/api/ai-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectDescription }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      setProjectBrief(data);
    } catch (e) {
      setError("Sorry, we couldn't generate the brief. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Section id="ai-brief">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-x-3 text-gray-900">
          <Sparkles className="text-orange-600" />
          Get an AI-Powered Project Brief
        </h2>
        <p className="text-gray-600 mt-2 mb-8">
          Describe your energy project below, and our AI will generate a customized starter kit for you in seconds.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-none p-6 space-y-4">
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="e.g., 'I want to install solar panels on my factory roof in Pune to reduce electricity bills.'"
            rows="3"
            className="w-full bg-white border border-gray-300 rounded-none p-3 focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none transition text-lg text-gray-900"
          ></textarea>
          <button
            onClick={generateProjectBrief}
            disabled={isLoading}
            className="bg-orange-600 text-white px-8 py-3 rounded-none font-bold text-lg hover:bg-orange-700 transition-all duration-300 inline-flex items-center justify-center gap-x-2 transform hover:scale-105 w-full sm:w-auto disabled:bg-orange-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <LoaderCircle className="animate-spin" /> Generating...
              </>
            ) : (
              "✨ Generate Brief"
            )}
          </button>
        </div>

        {error && <p className="mt-4 text-red-600">{error}</p>}

        {projectBrief && (
          <div className="mt-8 text-left bg-white border border-gray-200 rounded-none p-6 animate-fade-in">
            <h3 className="text-2xl font-bold mb-4 text-orange-600">Your Project Starter Kit</h3>

            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-2 text-gray-900">Key Considerations</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {projectBrief.key_considerations.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-2 text-gray-900">Your Next Steps</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {projectBrief.next_steps.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900">Recommended Saral Service</h4>
              <p className="text-orange-700 bg-orange-50 p-3 rounded-none border border-orange-200">
                {projectBrief.recommended_service}
              </p>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}

