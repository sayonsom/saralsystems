"use client";

import { useState } from "react";
import Section from "./Section";

export default function Contact() {
  const [formStatus, setFormStatus] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormStatus("success");
    setTimeout(() => setFormStatus(null), 5000);
    e.target.reset();
  };

  return (
    <Section id="contact">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Connect with Saral</h2>
        <p className="text-gray-600 mt-2 mb-8">
          Ready to simplify your energy challenges? Tell us about your project, and our specialists will get in touch.
        </p>

        <form onSubmit={handleFormSubmit} className="text-left space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full bg-white border border-gray-300 rounded-none p-3 focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Work Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full bg-white border border-gray-300 rounded-none p-3 focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              id="company"
              name="company"
              className="w-full bg-white border border-gray-300 rounded-none p-3 focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
              Which service are you interested in? *
            </label>
            <select
              id="service"
              name="service"
              required
              className="w-full bg-white border border-gray-300 rounded-none p-3 focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none transition appearance-none"
            >
              <option>Data Center Prospecting & Design</option>
              <option>PPA Cost-Saving Analysis</option>
              <option>AI Workflow Automation</option>
              <option>Energy Workforce Skill-Gap ID</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              How can we help? *
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              required
              className="w-full bg-white border border-gray-300 rounded-none p-3 focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none transition"
            ></textarea>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-orange-600 text-white px-8 py-3 rounded-none font-bold text-lg hover:bg-orange-700 transition-transform duration-300 inline-block transform hover:scale-105 w-full sm:w-auto"
            >
              Send Message
            </button>
          </div>
        </form>

        {formStatus === "success" && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-none">
            Thank you! Your message has been sent successfully. We'll be in touch soon.
          </div>
        )}
      </div>
    </Section>
  );
}

