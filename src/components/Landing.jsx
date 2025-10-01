"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, Shield, Users, Database, Cloud, FileText, Lock, Activity, ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';

const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', utility: '', country: '' });
  const [downloadFormData, setDownloadFormData] = useState({ email: '', company: '' });
  const [showSignIn, setShowSignIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloadSubmitting, setIsDownloadSubmitting] = useState(false);

  // Google Analytics helper function
  const trackEvent = (eventName, eventParams = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, eventParams);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track page view on mount
  useEffect(() => {
    trackEvent('page_view', {
      page_title: 'Landing Page',
      page_location: window.location.href
    });
  }, []);

  // Track section views
  useEffect(() => {
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionName = entry.target.getAttribute('data-section');
          if (sectionName) {
            trackEvent('section_view', {
              section_name: sectionName
            });
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.utility || !formData.country) {
      alert('Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    // Track pilot request attempt
    trackEvent('pilot_request_start', {
      utility: formData.utility,
      country: formData.country,
      device: window.innerWidth >= 768 ? 'desktop' : 'mobile'
    });

    try {
      const response = await fetch('/api/pilot-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Track successful pilot request
        trackEvent('pilot_request_success', {
          utility: formData.utility,
          country: formData.country,
          device: window.innerWidth >= 768 ? 'desktop' : 'mobile'
        });
        
        alert('Thank you for requesting access. We\'ll be in touch soon!');
        setFormData({ name: '', email: '', utility: '', country: '' });
      } else {
        // Track failed pilot request
        trackEvent('pilot_request_failed', {
          error: data.error || 'unknown_error',
          device: window.innerWidth >= 768 ? 'desktop' : 'mobile'
        });
        
        alert(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Track error
      trackEvent('pilot_request_error', {
        error: error.message,
        device: window.innerWidth >= 768 ? 'desktop' : 'mobile'
      });
      
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadSubmit = async () => {
    if (!downloadFormData.email || !downloadFormData.company) {
      alert('Please fill in all fields');
      return;
    }

    setIsDownloadSubmitting(true);
    
    // Track download info request attempt
    trackEvent('download_info_start', {
      company: downloadFormData.company
    });

    try {
      const response = await fetch('/api/download-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(downloadFormData),
      });

      const data = await response.json();

      if (response.ok) {
        // Track successful download request
        trackEvent('download_info_success', {
          company: downloadFormData.company
        });
        
        alert('Thank you! We\'ll send the pitch deck and demo video to your email shortly.');
        setDownloadFormData({ email: '', company: '' });
      } else {
        // Track failed download request
        trackEvent('download_info_failed', {
          error: data.error || 'unknown_error'
        });
        
        alert(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting download request:', error);
      
      // Track error
      trackEvent('download_info_error', {
        error: error.message
      });
      
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsDownloadSubmitting(false);
    }
  };

  const situations = [
    {
      category: "Data Request",
      task: "Situation for Utility: Engineering team needs CYME model for interconnection study",
      existing: "5 days of emails, manual extraction, compliance review",
      gridspeed: "30 minutes automated access with audit trail"
    },
    {
      category: "New Analysis Needed",
      task: "Situation for Utility: DER hosting capacity analysis for planning department",
      existing: "2 weeks to gather data from multiple systems",
      gridspeed: "Real-time dashboard with live data feeds"
    },
    {
      category: "Consultant Request",
      task: "Situation for Utility: External consultant needs grid model for reliability study",
      existing: "3 weeks for legal review, NDA, manual anonymization",
      gridspeed: "2 hours with automated data masking and access controls"
    },
    {
      category: "Easy Access to Public Data",
      task: "Situation for Utility: Rate case requires 5 years of outage and reliability metrics",
      existing: "6 weeks of manual compilation from multiple databases",
      gridspeed: "1 day automated report generation with source verification"
    },
    {
      category: "New AI Model",
      task: "Situation for Utility: Deploy vegetation management prediction model",
      existing: "6 months for IT security review and deployment",
      gridspeed: "2 weeks with pre-approved NERC-CIP compliant framework"
    },
    {
      category: "Testimony Filing",
      task: "Situation for Utility: Compile load forecast data and supporting documentation",
      existing: "4 weeks of document gathering and verification",
      gridspeed: "3 days with automated document generation and audit trail"
    },
    {
      category: "Consultant Collaboration",
      task: "Situation for Utility: Microgrid feasibility study requiring smart meter data",
      existing: "Manual CSV exports, email chains, version control issues",
      gridspeed: "Secure workspace with versioning and real-time collaboration"
    },
    {
      category: "Cross-Team Coordination",
      task: "Situation for Utility: Vegetation management needs outage history from operations",
      existing: "Multiple meetings, disparate systems, delayed decisions",
      gridspeed: "Unified view with role-based access to all teams"
    }
  ];

  return (
    <div className="min-h-screen text-gray-900 font-sans">

      {/* Access Form - Desktop (top-right sticky) */}
      <div className={`hidden md:block fixed right-6 top-20 z-50 w-80 bg-white border border-gray-300 shadow-lg`}>
        <div className="p-6">
          {!showSignIn ? (
            <>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">Request Early Access</h3>
                  <p className="text-xs text-gray-600 mt-1">15+ utilities shaping this together</p>
                </div>
                <button
                  onClick={() => {
                    trackEvent('sign_in_toggle', {
                      location: 'desktop_form_header',
                      action: 'open'
                    });
                    setShowSignIn(true);
                  }}
                  className="text-sm underline"
                  style={{ color: '#ea580b' }}
                >
                  Sign In
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Utility"
                  value={formData.utility}
                  onChange={(e) => setFormData({...formData, utility: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500"
                />
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-2 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#ea580b' }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  onClick={() => {
                    trackEvent('sign_in_toggle', {
                      location: 'desktop_form_bottom',
                      action: 'open'
                    });
                    setShowSignIn(true);
                  }}
                  className="w-full py-2 mt-2 text-sm underline"
                  style={{ color: '#ea580b' }}
                >
                  Sign In for Existing Pilot Customers
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  ✓ No commitment needed<br />
                  ✓ Only feedback requested<br />
                  ✓ Free pilot program
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg">Sign In</h3>
                <button
                  onClick={() => {
                    trackEvent('request_access_toggle', {
                      location: 'desktop_signin',
                      action: 'back_to_request'
                    });
                    setShowSignIn(false);
                  }}
                  className="text-sm underline"
                  style={{ color: '#ea580b' }}
                >
                  Request Access
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500"
                />
                <button
                  onClick={() => {
                    trackEvent('sign_in_attempt', {
                      location: 'desktop_form'
                    });
                  }}
                  className="w-full py-2 text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#ea580b' }}
                >
                  Sign In
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Access Form - Mobile (bottom sticky) */}
      <div className={`block md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-300 shadow-lg`}>
        <div className="p-4">
          {!showSignIn ? (
            <>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-base">Request Early Access</h3>
                  <p className="text-xs text-gray-600">15+ utilities shaping this</p>
                </div>
                <button
                  onClick={() => {
                    trackEvent('sign_in_toggle', {
                      location: 'mobile_form_header',
                      action: 'open'
                    });
                    setShowSignIn(true);
                  }}
                  className="text-xs underline"
                  style={{ color: '#ea580b' }}
                >
                  Sign In
                </button>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Utility"
                  value={formData.utility}
                  onChange={(e) => setFormData({...formData, utility: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500"
                />
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-2 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#ea580b' }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-base">Sign In</h3>
                <button
                  onClick={() => {
                    trackEvent('request_access_toggle', {
                      location: 'mobile_signin',
                      action: 'back_to_request'
                    });
                    setShowSignIn(false);
                  }}
                  className="text-xs underline"
                  style={{ color: '#ea580b' }}
                >
                  Request Access
                </button>
              </div>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500"
                />
                <button
                  onClick={() => {
                    trackEvent('sign_in_attempt', {
                      location: 'mobile_form'
                    });
                  }}
                  className="w-full py-2 text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#ea580b' }}
                >
                  Sign In
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Hero Section - Responsive margins with light primary background */}
      <section className="bg-orange-50 border-b border-orange-100" data-section="hero">
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-12 md:mr-96">
        <h2 className="text-4xl font-bold mb-10">
          <span style={{ color: '#ea580b' }}>Gridspeed</span> is a collaboration platform for utility teams
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* Problem Card */}
          <div className="border-2 border-gray-300 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: '#ea580b' }} />
              <h3 className="font-bold text-lg">Problem</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Teams email different people</li>
              <li>• Days waiting for CYME models</li>
              <li>• Compliance slows requests</li>
            </ul>
          </div>
          
          {/* Solution Card */}
          <div className="border-2 p-5" style={{ borderColor: '#ea580b', backgroundColor: '#fef5f1' }}>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#ea580b' }} />
              <h3 className="font-bold text-lg">Our Solution</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Auto-triages requests</li>
              <li>• Manages compliance</li>
              <li>• Data stays on your servers</li>
            </ul>
          </div>
          
          {/* Ask Card */}
          <div className="border-2 border-gray-300 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 flex-shrink-0" style={{ color: '#ea580b' }} />
              <h3 className="font-bold text-lg">Our Ask</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 15+ utilities testing now</li>
              <li>• Free pilot available</li>
              <li>• Your feedback shapes it</li>
            </ul>
          </div>
        </div>

          {/* Status Banner */}
          <div className="border-l-4 pl-4 py-3 mb-12" style={{ borderColor: '#ea580b', backgroundColor: '#fff7ed' }}>
            <p className="text-sm font-medium">Early Access Phase</p>
            <p className="text-sm text-gray-600">
              Free demo • Free pilot • Your feedback shapes what we build
            </p>
          </div>
        </div>
      </section>

      {/* Situations where Gridspeed can be useful - White background */}
      <section className="bg-white border-b border-gray-100" data-section="situations">
        <div className="max-w-4xl mx-auto px-6 py-12 md:mr-96 mb-64 md:mb-0">
        <h2 className="text-2xl font-bold mb-8">Situations where Gridspeed can be useful</h2>
        
        <div className="space-y-8">
          {situations.map((situation, index) => (
            <div
              key={index}
              className="border border-gray-200"
              onClick={() => {
                trackEvent('situation_card_click', {
                  category: situation.category,
                  position: index + 1
                });
              }}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-medium px-2 py-1 border border-gray-300">
                    {situation.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-4">{situation.task}</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 mb-2">TYPICAL EXISTING EFFORT</p>
                    <p className="text-sm text-gray-700">{situation.existing}</p>
                  </div>
                  <div className="p-4 border-2" style={{ borderColor: '#ea580b', backgroundColor: '#fef5f1' }}>
                    <p className="text-xs font-medium mb-2" style={{ color: '#ea580b' }}>GRIDSPEED TURNAROUND</p>
                    <p className="text-sm font-medium text-gray-900">{situation.gridspeed}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Core Capabilities - Light grey background */}
      <section className="bg-gray-50 border-b border-gray-100" data-section="core_capabilities">
        <div className="max-w-4xl mx-auto px-6 py-12 md:mr-96">
        <h2 className="text-2xl font-bold mb-8">Core capabilities</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div
            className="border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              trackEvent('capability_card_click', {
                capability: 'data_stays_with_you'
              });
            }}
          >
            <Database className="w-6 h-6 mb-3" style={{ color: '#ea580b' }} />
            <h3 className="font-bold mb-2">Data stays with you</h3>
            <p className="text-sm text-gray-700">
              On-premise or private cloud deployment. Your data never leaves your control.
            </p>
          </div>

          <div
            className="border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              trackEvent('capability_card_click', {
                capability: 'nerc_cip_compliant'
              });
            }}
          >
            <Shield className="w-6 h-6 mb-3" style={{ color: '#ea580b' }} />
            <h3 className="font-bold mb-2">NERC-CIP compliant</h3>
            <p className="text-sm text-gray-700">
              Built for critical infrastructure. Audit trails, access controls, compliance reports.
            </p>
          </div>

          <div
            className="border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              trackEvent('capability_card_click', {
                capability: 'smart_triaging'
              });
            }}
          >
            <Users className="w-6 h-6 mb-3" style={{ color: '#ea580b' }} />
            <h3 className="font-bold mb-2">Smart triaging</h3>
            <p className="text-sm text-gray-700">
              Automatically route requests to right teams. Anonymize sensitive data. Track usage.
            </p>
          </div>

          <div
            className="border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              trackEvent('capability_card_click', {
                capability: 'document_automation'
              });
            }}
          >
            <FileText className="w-6 h-6 mb-3" style={{ color: '#ea580b' }} />
            <h3 className="font-bold mb-2">Document automation</h3>
            <p className="text-sm text-gray-700">
              Generate reports from verified sources. Maintain version control. Create audit documentation.
            </p>
          </div>

          <div
            className="border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              trackEvent('capability_card_click', {
                capability: 'custom_llm_deployment'
              });
            }}
          >
            <Lock className="w-6 h-6 mb-3" style={{ color: '#ea580b' }} />
            <h3 className="font-bold mb-2">Custom LLM deployment</h3>
            <p className="text-sm text-gray-700">
              Your own Model-as-a-Service. Trained on your standards. Running in your environment.
            </p>
          </div>

          <div
            className="border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              trackEvent('capability_card_click', {
                capability: 'real_time_synthesis'
              });
            }}
          >
            <Activity className="w-6 h-6 mb-3" style={{ color: '#ea580b' }} />
            <h3 className="font-bold mb-2">Real-time synthesis</h3>
            <p className="text-sm text-gray-700">
              Connect SCADA, smart meters, planning tools. Live dashboards. Automated anomaly detection.
            </p>
          </div>
        </div>
        </div>
      </section>

      {/* Download More Information Section */}
      <section className="bg-white border-b border-gray-100" data-section="download_info">
        <div className="max-w-4xl mx-auto px-6 py-16 md:mr-96">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-3">Need more information before scheduling a meeting?</h2>
            <p className="text-lg text-gray-700">Download More Information</p>
          </div>
          
          <div className="max-w-xl mx-auto border-2 p-8" style={{ borderColor: '#ea580b', backgroundColor: '#fef5f1' }}>
            <p className="text-center text-sm text-gray-700 mb-6">
              Enter your official email and company, and we'll email you our pitch deck and demo video showing how it works.
            </p>
            
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Official Email"
                value={downloadFormData.email}
                onChange={(e) => setDownloadFormData({...downloadFormData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:border-gray-500"
              />
              <input
                type="text"
                placeholder="Company"
                value={downloadFormData.company}
                onChange={(e) => setDownloadFormData({...downloadFormData, company: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:border-gray-500"
              />
              <button
                onClick={handleDownloadSubmit}
                disabled={isDownloadSubmitting}
                className="w-full py-3 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#ea580b' }}
              >
                {isDownloadSubmitting ? 'Sending...' : 'Send Me the Information'}
              </button>
            </div>
            
            <p className="text-xs text-gray-600 text-center mt-4">
              No obligation • Instant delivery • Detailed product overview
            </p>
          </div>
        </div>
      </section>

      {/* Cloud Option - Light grey background */}
      <section className="bg-gray-50 border-b border-gray-100" data-section="cloud_option">
        <div className="max-w-4xl mx-auto px-6 py-12 md:mr-96">
          <div className="border border-gray-200 p-8">
          <Cloud className="w-6 h-6 mb-3" style={{ color: '#ea580b' }} />
          <h3 className="text-xl font-bold mb-3">Gridspeed Cloud for smaller projects</h3>
          <p className="text-gray-700 mb-4">
            Not everything needs enterprise deployment. Use our cloud service for:
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span>Microgrid design</span>
            </div>
            <div className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span>Data center planning</span>
            </div>
            <div className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span>Decarbonization studies</span>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Final CTA with primary color background */}
      <section className="py-16 px-6 pb-32 md:pb-16" style={{ backgroundColor: '#ea580b' }} data-section="final_cta">
        <div className="max-w-4xl mx-auto md:mr-96 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Help shape the future of utility collaboration
          </h2>
          <p className="text-lg mb-8 opacity-95">
            We're building Gridspeed with utilities, not for them. Every pilot helps us understand 
            your unique challenges. Every piece of feedback makes the platform better for everyone.
          </p>
          <button
            onClick={() => {
              trackEvent('final_cta_click', {
                cta_location: 'bottom_section',
                cta_text: 'Request Free Pilot'
              });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 py-3 bg-white font-medium hover:bg-gray-100 transition-colors"
            style={{ color: '#ea580b' }}
          >
            Request Free Pilot →
          </button>
        </div>
      </section>
    </div>
  );
};

export default Landing;