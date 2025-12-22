import Link from 'next/link';
import { ArrowLeft, Check, X, AlertTriangle, Download, Clock, Users, Monitor, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Node-RED for Automotive System Integration | GridSpeed Trainings',
  description: 'Technical training for automotive engineers on system-level prototyping, ECU simulation, and HIL validation using Node-RED. Practical, hands-on approach for rapid integration.',
  alternates: { canonical: '/trainings/node-red-automotive' },
  robots: { index: true, follow: true },
};

export default function NodeRedAutomotivePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/trainings"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Trainings
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Technical Training Program
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
              Node-RED for Automotive System Integration
            </h1>
            <p className="text-lg text-gray-300">
              Flow-based rapid prototyping for vehicle system simulation, ECU integration,
              and Hardware-in-the-Loop test bench development. No license fees. Full control.
            </p>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="bg-white border-b border-gray-200 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-900">The Integration Problem</h2>
            </div>

            <p className="text-gray-700 mb-6">
              Modern vehicle development involves dozens of ECUs, multiple communication protocols,
              and constant integration testing. The typical approach:
            </p>

            <ul className="space-y-3 text-gray-700 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">—</span>
                <span>Waiting weeks for specialized simulation hardware</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">—</span>
                <span>License costs that restrict who can run simulations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">—</span>
                <span>Manual test procedures that don't scale</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">—</span>
                <span>Integration bugs discovered late in the development cycle</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">—</span>
                <span>Knowledge locked in proprietary tools that only a few engineers can use</span>
              </li>
            </ul>

            <p className="text-gray-700">
              This training teaches a different approach: using open-source, flow-based programming
              to build system prototypes quickly, run them anywhere, and share them with anyone.
            </p>
          </div>
        </div>
      </section>

      {/* What You Learn */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-8">What the Training Covers</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Core Concepts</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Flow-based programming fundamentals for engineers</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Node-RED architecture and extension mechanisms</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">State machines and event-driven design patterns</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Creating custom nodes for automotive protocols</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Automotive Applications</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">CAN bus simulation and message injection</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">ECU rest-bus simulation for component testing</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Vehicle signal dashboards and real-time visualization</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Integration with physical hardware via GPIO, serial, Ethernet</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Test & Validation</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Building automated test sequences</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Fault injection and error condition simulation</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Test logging and result analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">CI/CD integration for continuous testing</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Deployment</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Running on Raspberry Pi, industrial PCs, or cloud</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Version control for flows and configurations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Multi-instance coordination for distributed systems</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Security considerations for connected test benches</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="bg-white border-b border-gray-200 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Who This Is For</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-gray-200 p-6">
              <h3 className="font-bold text-green-700 mb-4 flex items-center gap-2">
                <Check className="w-5 h-5" />
                Good Fit
              </h3>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li>System integration engineers who need rapid prototyping capability</li>
                <li>Test engineers building custom HIL and validation setups</li>
                <li>Manufacturing engineers automating test stations</li>
                <li>Engineering managers evaluating open-source alternatives</li>
                <li>Teams blocked by license availability or tool costs</li>
                <li>Engineers with basic programming knowledge (any language)</li>
              </ul>
            </div>

            <div className="border border-gray-200 p-6">
              <h3 className="font-bold text-gray-500 mb-4 flex items-center gap-2">
                <X className="w-5 h-5" />
                Not Designed For
              </h3>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li>Production ECU software development (use proper AUTOSAR tools)</li>
                <li>Safety-critical control systems requiring certification</li>
                <li>High-frequency real-time control (microsecond timing)</li>
                <li>Teams requiring formal tool qualification per ISO 26262</li>
                <li>Complete beginners with no programming background</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Free Practice Software */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <Download className="w-5 h-5" />
            <h2 className="text-xl font-bold">Free Practice Environment</h2>
          </div>

          <div className="max-w-3xl">
            <p className="text-gray-300 mb-6">
              All software used in this training is open-source and free to use commercially.
              You can practice before, during, and after the training at no cost.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="border border-gray-700 p-4">
                <h3 className="font-bold text-white mb-2">Node-RED</h3>
                <p className="text-sm text-gray-400">
                  Apache 2.0 license. Run on any machine with Node.js.
                </p>
              </div>
              <div className="border border-gray-700 p-4">
                <h3 className="font-bold text-white mb-2">CAN Nodes</h3>
                <p className="text-sm text-gray-400">
                  Open-source CAN bus integration for SocketCAN and commercial adapters.
                </p>
              </div>
              <div className="border border-gray-700 p-4">
                <h3 className="font-bold text-white mb-2">Dashboard</h3>
                <p className="text-sm text-gray-400">
                  Built-in UI framework for gauges, charts, and controls.
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-400 mt-6">
              Optional: Commercial CAN adapters (PEAK, Kvaser, Vector) for physical bus access.
              Not required for simulation exercises.
            </p>
          </div>
        </div>
      </section>

      {/* Why Not MATLAB/Simulink */}
      <section className="bg-white border-b border-gray-200 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Why Not MATLAB/Simulink?</h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            This training does not replace MATLAB/Simulink. Both tools serve different purposes.
            Here's an honest comparison:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 pr-4 font-bold text-gray-900">Criteria</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-900">MATLAB/Simulink</th>
                  <th className="text-left py-3 pl-4 font-bold text-gray-900">Node-RED</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium">Mathematical modeling</td>
                  <td className="py-3 px-4 text-green-700">Excellent. Purpose-built for this.</td>
                  <td className="py-3 pl-4 text-gray-500">Limited. Not the right tool.</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium">Control system design</td>
                  <td className="py-3 px-4 text-green-700">Industry standard with toolboxes.</td>
                  <td className="py-3 pl-4 text-gray-500">Basic. Use Simulink instead.</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium">Code generation</td>
                  <td className="py-3 px-4 text-green-700">Embedded Coder for production.</td>
                  <td className="py-3 pl-4 text-gray-500">Not applicable.</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium">Rapid integration testing</td>
                  <td className="py-3 px-4 text-gray-500">Requires licenses and setup.</td>
                  <td className="py-3 pl-4 text-green-700">Fast deployment, no licenses.</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium">Team-wide access</td>
                  <td className="py-3 px-4 text-gray-500">Limited by license count.</td>
                  <td className="py-3 pl-4 text-green-700">Unlimited. Everyone can run it.</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium">Protocol integration</td>
                  <td className="py-3 px-4 text-gray-700">Toolbox-dependent.</td>
                  <td className="py-3 pl-4 text-green-700">Direct Node.js ecosystem access.</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium">Edge deployment</td>
                  <td className="py-3 px-4 text-gray-500">Complex. Runtime licensing.</td>
                  <td className="py-3 pl-4 text-green-700">Runs on Raspberry Pi.</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium">Cost per seat</td>
                  <td className="py-3 px-4 text-gray-500">$$$$ per year with toolboxes.</td>
                  <td className="py-3 pl-4 text-green-700">$0. Apache 2.0 license.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-4 bg-gray-50 border border-gray-200">
            <p className="text-sm text-gray-700">
              <strong>Bottom line:</strong> Use MATLAB/Simulink for algorithm development and control design.
              Use Node-RED for system integration, test automation, and rapid validation where you need
              fast deployment and broad team access. They complement each other.
            </p>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Expected Outcomes</h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-gray-700">1</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Build working prototypes in hours</h3>
                <p className="text-sm text-gray-600">
                  Create functional system simulations without waiting for specialized tools or licenses.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-gray-700">2</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Validate integration early</h3>
                <p className="text-sm text-gray-600">
                  Test system interactions before hardware is available. Find interface issues earlier.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-gray-700">3</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Automate test procedures</h3>
                <p className="text-sm text-gray-600">
                  Replace manual test execution with reproducible, logged automated sequences.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-gray-700">4</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Share tools across teams</h3>
                <p className="text-sm text-gray-600">
                  Anyone can run the flows. No license restrictions. Version control friendly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-gray-700">5</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Extend with custom nodes</h3>
                <p className="text-sm text-gray-600">
                  Build proprietary protocol nodes that stay within your organization.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-gray-700">6</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Deploy anywhere</h3>
                <p className="text-sm text-gray-600">
                  Run on lab PCs, Raspberry Pi test rigs, or cloud infrastructure without licensing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Format */}
      <section className="bg-white border-b border-gray-200 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Delivery Format</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 p-6">
              <Clock className="w-5 h-5 text-gray-700 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Duration</h3>
              <p className="text-sm text-gray-600 mb-3">
                2-day intensive workshop (16 hours total)
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>Day 1: Fundamentals + automotive applications</li>
                <li>Day 2: Test automation + deployment</li>
              </ul>
            </div>

            <div className="border border-gray-200 p-6">
              <Monitor className="w-5 h-5 text-gray-700 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Format Options</h3>
              <p className="text-sm text-gray-600 mb-3">
                On-site or remote delivery available
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>On-site: At your facility (6+ participants)</li>
                <li>Remote: Live instructor-led sessions</li>
              </ul>
            </div>

            <div className="border border-gray-200 p-6">
              <Users className="w-5 h-5 text-gray-700 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Group Size</h3>
              <p className="text-sm text-gray-600 mb-3">
                Maximum 12 participants per session
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>Hands-on exercises with individual support</li>
                <li>Team-based capstone project</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-50 border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-2">Prerequisites</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Basic programming experience in any language</li>
              <li>• Familiarity with automotive network concepts (CAN, LIN, Ethernet)</li>
              <li>• Laptop with Node.js installed (setup instructions provided in advance)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16" style={{ backgroundColor: '#ea580b' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Discuss Your Training Requirements
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            We tailor the curriculum to your specific systems and use cases.
            Contact us to discuss your team's needs and schedule.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hello@gridspeed.app?subject=Node-RED%20Automotive%20Training%20Inquiry"
              className="px-8 py-3 bg-white font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              style={{ color: '#ea580b' }}
            >
              Contact for Scheduling
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <p className="text-white/70 text-sm mt-6">
            Response within 2 business days. No obligation.
          </p>
        </div>
      </section>

      {/* Footer Note */}
      <section className="bg-gray-900 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-400 text-center">
            Node-RED is a registered trademark of OpenJS Foundation.
            MATLAB and Simulink are registered trademarks of The MathWorks, Inc.
            This training is not affiliated with or endorsed by these organizations.
          </p>
        </div>
      </section>
    </div>
  );
}
