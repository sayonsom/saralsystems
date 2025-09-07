'use client';

import { useState } from 'react';

export default function GridGuardLanding() {
  const [selectedTab, setSelectedTab] = useState('no-data');
  const [calculatorInputs, setCalculatorInputs] = useState({
    consumers: '',
    monthlyUnits: '',
    collectionEfficiency: ''
  });
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = () => {
    if (calculatorInputs.consumers && calculatorInputs.monthlyUnits && calculatorInputs.collectionEfficiency) {
      setShowResults(true);
    }
  };

  const potentialReduction = () => {
    const units = parseInt(calculatorInputs.monthlyUnits) || 0;
    const efficiency = parseFloat(calculatorInputs.collectionEfficiency) || 0;
    const currentLoss = 100 - efficiency;
    const potentialNewLoss = currentLoss * 0.9; // 10% improvement
    const unitsRecovered = units * 0.02; // 2% recovery
    return {
      lossReduction: (currentLoss - potentialNewLoss).toFixed(1),
      unitsRecovered: (unitsRecovered / 1000).toFixed(2)
    };
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Grid<span className="text-[#ea580b]">Guard</span>
              </h1>
              <span className="ml-4 text-sm text-gray-600 border-l-2 border-gray-300 pl-4">
                Revenue Protection Analytics
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#approach" className="text-gray-700 hover:text-[#ea580b] transition">Our Approach</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-[#ea580b] transition">How It Works</a>
              <a href="#pilot" className="text-gray-700 hover:text-[#ea580b] transition">Pilot Program</a>
              <a href="#contact" className="text-gray-700 hover:text-[#ea580b] transition">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Humble but Confident */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Help Your Smart Meters Detect Revenue Leakages
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We analyze patterns in your existing smart meter data to identify potential AT&C loss areas. 
              No hardware changes, no system replacements - just insights from data you already collect.
            </p>
            <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto italic">
              We're a young team passionate about helping Indian DISCOMs improve revenue protection. 
              Give us a chance to show you what's possible.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-[#ea580b] text-white px-8 py-3 text-lg font-semibold hover:bg-orange-700 transition">
                Let's Discuss Your Challenges
              </button>
              <button className="bg-white text-[#ea580b] border-2 border-[#ea580b] px-8 py-3 text-lg font-semibold hover:bg-orange-50 transition">
                See Our Approach
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="bg-white py-8 border-y-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-[#ea580b]">Simple</div>
              <div className="text-sm text-gray-600">Works with your existing systems</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#ea580b]">Safe</div>
              <div className="text-sm text-gray-600">Your data never leaves your premises</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#ea580b]">Practical</div>
              <div className="text-sm text-gray-600">Actionable insights, not just reports</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#ea580b]">Supportive</div>
              <div className="text-sm text-gray-600">We work alongside your team</div>
            </div>
          </div>
        </div>
      </section>

      {/* No Data Required Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
            We Understand Your Data Challenges
          </h3>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Not everyone has clean data ready to upload. That's okay. We'll work with whatever you have.
          </p>
          
          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white border-2 border-gray-300 inline-flex">
              <button
                onClick={() => setSelectedTab('no-data')}
                className={`px-6 py-3 font-semibold transition ${
                  selectedTab === 'no-data' 
                    ? 'bg-[#ea580b] text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Quick Estimation
              </button>
              <button
                onClick={() => setSelectedTab('photo')}
                className={`px-6 py-3 font-semibold transition ${
                  selectedTab === 'photo' 
                    ? 'bg-[#ea580b] text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Send Photos
              </button>
              <button
                onClick={() => setSelectedTab('manual')}
                className={`px-6 py-3 font-semibold transition ${
                  selectedTab === 'manual' 
                    ? 'bg-[#ea580b] text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                We'll Help Extract
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white border-2 border-gray-300 p-8">
            {selectedTab === 'no-data' && (
              <div>
                <h4 className="text-xl font-bold mb-6">Get a Quick Sense of Potential Improvements</h4>
                <p className="text-gray-600 mb-6">
                  Just enter basic information you know off-hand. This gives a rough estimate, not a promise.
                </p>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of Consumers
                    </label>
                    <input
                      type="text"
                      value={calculatorInputs.consumers}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, consumers: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 focus:border-[#ea580b] outline-none"
                      placeholder="e.g., 50000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Monthly Units Billed (MU)
                    </label>
                    <input
                      type="text"
                      value={calculatorInputs.monthlyUnits}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, monthlyUnits: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 focus:border-[#ea580b] outline-none"
                      placeholder="e.g., 1000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Collection Efficiency (%)
                    </label>
                    <input
                      type="text"
                      value={calculatorInputs.collectionEfficiency}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, collectionEfficiency: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 focus:border-[#ea580b] outline-none"
                      placeholder="e.g., 85"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleCalculate}
                  className="bg-[#ea580b] text-white px-6 py-3 font-semibold hover:bg-orange-700 transition"
                >
                  See Potential
                </button>
                
                {showResults && (
                  <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-300">
                    <h5 className="font-bold text-lg mb-4">Potential Improvement Areas:</h5>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600">Possible AT&C Loss Reduction:</span>
                        <span className="ml-2 font-bold text-blue-700">~{potentialReduction().lossReduction}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Potential Units Recovery:</span>
                        <span className="ml-2 font-bold text-blue-700">~{potentialReduction().unitsRecovered} thousand units/month</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4 italic">
                      *These are rough estimates based on typical patterns. Actual results depend on specific local conditions.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {selectedTab === 'photo' && (
              <div className="text-center py-8">
                <h4 className="text-xl font-bold mb-6">After a quick NDA on your terms, share whatever format you have</h4>
                <p className="text-gray-600 mb-6">
                  Photos of printed reports, screenshots of systems, or even handwritten notes - 
                  we'll work with it all. Our team will manually process and analyze your data.
                </p>
                <div className="inline-block bg-gray-100 p-6 border-2 border-gray-300">
                  <div className="text-lg font-semibold mb-2">Email: sc@saralsystems.co</div>
                  <div className="text-sm text-gray-600">We'll respond within 24 hours</div>
                </div>
              </div>
            )}
            
            {selectedTab === 'manual' && (
              <div className="text-center py-8">
                <h4 className="text-xl font-bold mb-6">We'll Work With Your Team</h4>
                <p className="text-gray-600 mb-6">
                  If your data is in legacy systems or complex formats, we're happy to help extract it.
                  We can work remotely with your IT team or visit in person if needed.
                </p>
                <button className="bg-[#ea580b] text-white px-8 py-3 font-semibold hover:bg-orange-700 transition">
                  Schedule a Discussion
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Demo Placeholder */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-100 border-2 border-gray-300 p-12 text-center">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">Interactive Demo Section</h3>
            <p className="text-gray-600">Your interactive tool demo will be inserted here</p>
            {/* INSERT YOUR INTERACTIVE DEMO CODE HERE */}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section id="approach" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Approach
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 border-2 border-gray-300">
              <h4 className="font-bold text-xl mb-4 text-[#ea580b]">Pattern Recognition</h4>
              <p className="text-gray-600">
                We analyze consumption patterns from your smart meter data to identify unusual behaviors 
                that might indicate technical or commercial losses.
              </p>
            </div>
            <div className="bg-white p-6 border-2 border-gray-300">
              <h4 className="font-bold text-xl mb-4 text-[#ea580b]">Anomaly Detection</h4>
              <p className="text-gray-600">
                Our algorithms flag meters with suspicious patterns - sudden drops, 
                consistent under-reporting, or unusual timing patterns.
              </p>
            </div>
            <div className="bg-white p-6 border-2 border-gray-300">
              <h4 className="font-bold text-xl mb-4 text-[#ea580b]">Prioritized Actions</h4>
              <p className="text-gray-600">
                We don't just identify problems - we prioritize which areas to investigate first 
                for maximum impact with your limited resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How We Work With You
          </h3>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-[#ea580b] text-white w-10 h-10 flex items-center justify-center font-bold mr-6 flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Understanding Your Context</h4>
                  <p className="text-gray-600">
                    We start by understanding your specific challenges, data availability, 
                    and what success looks like for your DISCOM.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#ea580b] text-white w-10 h-10 flex items-center justify-center font-bold mr-6 flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Pilot on Limited Data</h4>
                  <p className="text-gray-600">
                    We begin with whatever data you can share - even just one feeder or division. 
                    This helps us prove the concept without overwhelming your team.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#ea580b] text-white w-10 h-10 flex items-center justify-center font-bold mr-6 flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Collaborative Analysis</h4>
                  <p className="text-gray-600">
                    We work with your team to validate findings. Your field knowledge combined 
                    with our analytics creates actionable insights.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#ea580b] text-white w-10 h-10 flex items-center justify-center font-bold mr-6 flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Gradual Expansion</h4>
                  <p className="text-gray-600">
                    Only after proving value do we discuss expanding to more areas. 
                    You control the pace and scope.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Give Us a Chance */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Consider GridGuard?
          </h3>
          <div className="max-w-3xl mx-auto space-y-6 text-lg text-gray-600">
            <p>
              <span className="font-semibold text-gray-900">We're new, and we know that.</span> We don't have 
              decades of experience or big client logos to show. What we do have is fresh perspective, 
              modern technology, and genuine commitment to solving your problems.
            </p>
            <p>
              <span className="font-semibold text-gray-900">We're flexible.</span> Unlike established vendors, 
              we can adapt our solution to your specific needs. We're building this with you, not just for you.
            </p>
            <p>
              <span className="font-semibold text-gray-900">We're invested in your success.</span> Your success 
              will be our first case study. We'll work harder than anyone else to ensure you see real value.
            </p>
            <p>
              <span className="font-semibold text-gray-900">We respect your constraints.</span> We understand 
              regulatory requirements, budget cycles, and the cautious approach needed in the power sector.
            </p>
          </div>
        </div>
      </section>

      {/* Pilot Program */}
      <section id="pilot" className="bg-[#ea580b] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-6">Start with a Small Pilot</h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            No commitments, no pressure. Let's just explore if we can add value to your operations.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-8 max-w-4xl mx-auto">
            <div>
              <div className="text-2xl font-bold mb-2">Limited Scope</div>
              <div className="text-lg">Start with just one feeder or division</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2">Your Terms</div>
              <div className="text-lg">You define success metrics</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2">No Risk</div>
              <div className="text-lg">Stop anytime if not satisfied</div>
            </div>
          </div>
          <button className="bg-white text-[#ea580b] px-8 py-4 text-xl font-bold hover:bg-gray-100 transition">
            Let's Have a Conversation
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 border-2 border-gray-300 p-12">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Ready to Explore?
            </h3>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              We're eager to learn about your challenges and see if we can help. 
              No sales pressure - just an honest discussion about possibilities.
            </p>
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <h4 className="font-bold mb-4">Email Us</h4>
                <a href="mailto:sc@saralsystems.co" className="text-[#ea580b] hover:underline">
                  sc@saralsystems.co
                </a>
              </div>
              <div className="text-center">
                <h4 className="font-bold mb-4">Call Us</h4>
                <p className="text-gray-600">
                  +91 93304 77432
                </p>
              </div>
            </div>
            <div className="text-center mt-8">
              <button className="bg-[#ea580b] text-white px-8 py-3 font-semibold hover:bg-orange-700 transition">
                Schedule a Call
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}