"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import {
  ChevronDown,
  Download,
  Mail,
  Calendar,
  BookOpen,
  Award,
  Briefcase,
  GraduationCap,
  Bot,
  Camera,
  Globe,
  FileText,
  ArrowRight,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";

const BASE = "https://www.saralsystems.co";

export default function Portfolio() {
  const [accordionOpen, setAccordionOpen] = useState({
    speakerBrief: false,
    headshot: false,
  });

  const toggleAccordion = (key) => {
    setAccordionOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const projects = [
    {
      title: "Quantum-in-the-Loop (QIL) Architecture",
      description:
        "First-of-its-kind quantum-encoded real-time simulations for power grid optimization using quantum mechanics principles.",
      tech: ["Quantum Computing", "RTDS", "Real-time Systems", "DNP3/IEC61850"],
      impact:
        "R&D 100 Award Finalist 2024 - Enabling quantum computing for utility-scale optimization.",
      link: "/research/quantum-in-loop",
    },
    {
      title: "10,000 Controller Hardware-in-Loop Platform",
      description:
        "World's largest CHIL test setup integrating 10,000 grid edge controllers with RTDS for cybersecurity and control experiments.",
      tech: ["RTDS", "Hardware-in-Loop", "Multi-protocol Comms", "Python"],
      impact:
        "Unprecedented scale modeling of power system complexity - $3.42M project.",
      link: "/research/chil-platform",
    },
    {
      title: "UI-ASSIST Smart Distribution",
      description:
        "USA-India collaborative for next-gen algorithms enabling renewable energy scale-up in distribution infrastructure.",
      tech: ["GridLAB-D", "OpenDSS", "PSSE", "Real-time Validation"],
      impact:
        "$6.5M international collaboration improving grid resilience across two democracies.",
      link: "/research/ui-assist",
    },
    {
      title: "Satellite Imagery Vegetation Management",
      description:
        "AI-powered proactive vegetation management reducing tree-related outages by 15-20% for utilities.",
      tech: ["Computer Vision", "ML/AI", "Satellite Imagery", "Python"],
      impact:
        "Reduced SAIDI by 1.26 minutes annually for Alabama Power pilot feeders.",
      link: "/tools/vegetation-management",
    },
    {
      title: "UtilityMaps Analytics Platform",
      description:
        "Co-pilot data analytics tool for clean energy developers with GIS-based siting and interconnection analysis.",
      tech: ["React", "GIS", "Python", "Cloud Computing"],
      impact:
        "20% faster renewable integration, 15% increased renewable potential identification.",
      link: "https://utilitymaps.co",
    },
    {
      title: "PyCANVASS Open Source",
      description:
        "Open-source simulation software for computing Smart Grid resiliency with industry-standard tool integration.",
      tech: ["Python", "GridLAB-D", "RTDS Integration"],
      impact:
        "Free tool enabling resilience computation for power systems worldwide.",
      link: "https://pypi.org/project/pycanvass/",
    },
  ];

  const workExperience = [
    {
      company: "National Renewable Energy Laboratory (NREL)",
      role: "Senior Scientist",
      timeframe: "2021 - Present",
      impact:
        "Leading 6+ transmission/distribution projects, established 28-core RTDS lab, quantum computing integration.",
      description:
        "PI/Co-PI of major DOE projects including UI-ASSIST ($6.5M), QIL architecture, and 10,000 CHIL platform.",
    },
    {
      company: "Plexflo Climate & Energy LLC",
      role: "Founder & Energy Consultant",
      timeframe: "2021 - Present",
      impact:
        "Delivered 3000+ feeder studies, 20% grid integration time reduction for renewables.",
      description:
        "Custom software solutions for distribution planning, GIS-based renewable siting, VR training platforms.",
    },
    {
      company: "Sync Energy AI",
      role: "Chief Technology Officer",
      timeframe: "2020 - 2021",
      impact:
        "Reduced outages 15-20%, improved SAIDI by 1.26 minutes, secured NSF SBIR grant.",
      description:
        "Led development of satellite-based vegetation management and outage prediction systems.",
    },
    {
      company: "National Grid",
      role: "Senior Quantitative Analyst",
      timeframe: "2018 - 2020",
      impact:
        "$5M+ cost savings through AI/ML asset management for 1M+ grid assets.",
      description:
        "Developed load forecasting for 2000+ feeders, Volt/VAR optimization, asset management tools.",
    },
    {
      company: "Idaho National Laboratory",
      role: "Research Engineer",
      timeframe: "2015 - 2016",
      impact:
        "Established 4 RTDS testbed for microgrid research and PHIL experiments.",
      description:
        "Advanced microgrid research with high-fidelity modeling and 3D visualization integration.",
    },
  ];

  const books = [
    {
      title: "Resiliency of Power Distribution Systems",
      year: "2023",
      publisher: "Wiley (UK)",
      description:
        "400-page comprehensive guide on power system resilience with Chen-Ching Liu and Anurag K. Srivastava.",
    },
  ];

  const aiAgents = [
    {
      name: "Energy Insight Analyst",
      description:
        "Customized ChatGPT for energy analytics and IEEE Standards Q&A.",
      users: "Public - Free Access",
      link: "https://chat.openai.com/g/g-lKD1quKOq-energy-insight-analyst",
    },
    {
      name: "Plexflo AI App Builder",
      description: "No-code AI assistant for electric utility professionals.",
      users: "Enterprise clients",
    },
    {
      name: "Evidence IoT Manager",
      description:
        "Browser-based IoT management for Industry 4.0, managing 2000+ devices.",
      users: "Large US organizations",
    },
  ];

  const education = [
    {
      degree: "Ph.D. in Electrical Engineering",
      institution: "Washington State University",
      year: "2018",
      focus:
        "Power systems resiliency, distributed energy resources, microgrids (GPA: 3.88/4.0)",
    },
    {
      degree: "M.S. in Electrical Engineering",
      institution: "Washington State University",
      year: "2015",
      focus: "Power systems engineering (GPA: 3.22/4.0)",
    },
    {
      degree: "B.Tech in Electrical Engineering",
      institution: "National Institute of Technology, Durgapur",
      year: "2012",
      focus: "First Class with Distinction (8.88/10)",
    },
  ];

  const certifications = [
    "10+ Journal Publications (850 citations, h-index: 14)",
    "3 US Patents (Probabilistic correlations, Conversational AI, Quantum-in-Loop)",
    "GridLAB-D YouTube Course Creator (10,000+ views)",
    "O-1 Extraordinary Ability Visa & Green Card Holder",
    "R&D 100 Award Finalist 2024",
  ];

  const galleryImages = [
    "/nrel-rtds-lab.jpg",
    "/quantum-computing-setup.jpg",
    "/ui-assist-collaboration.jpg",
    "/vegetation-management-demo.jpg",
  ];

  const videos = [
    { id: "VFhtltR6dFc", title: "TEDx Talk - Making AI Our Best Bet Against Climate Change" },
    { id: "VIDEO_ID_2", title: "GridLAB-D Modeling Demo" },
    { id: "VIDEO_ID_3", title: "Data Center Sustainability Talk" },
  ];

  // Auto-scroll for horizontal gallery (slower)
  const galleryRef = useRef(null);
  const [autoScrollPaused, setAutoScrollPaused] = useState(false);
  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    let rafId;
    let lastTs;
    const speedPxPerSec = 16; // slower speed
    const step = (ts) => {
      if (!lastTs) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      if (!autoScrollPaused) {
        el.scrollLeft += speedPxPerSec * dt;
        const max = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= max - 1) {
          el.scrollLeft = 0; // loop
        }
      }
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [autoScrollPaused]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sayonsom Chanda",
    jobTitle: "Senior Scientist at NREL | Founder at Plexflo",
    url: `${BASE}/sayonsom-chanda`,
    sameAs: [
      "https://github.com/sayonsom",
      "https://www.linkedin.com/in/sayonsom/",
      "https://scholar.google.com/citations?user=eTDi7boAAAAJ&hl=en",
      "https://chanda.io",
    ],
    worksFor: [
      {
        "@type": "Organization",
        name: "National Renewable Energy Laboratory",
        url: "https://www.nrel.gov",
      },
      {
        "@type": "Organization",
        name: "Plexflo Climate & Energy LLC",
        url: "https://plexflo.com",
      },
    ],
    knowsAbout: [
      "Power Systems Modeling",
      "GridLAB-D",
      "RTDS/Hardware-in-Loop",
      "Quantum Computing for Grid",
      "AI/ML for Energy",
      "Distribution System Planning",
      "Renewable Energy Integration",
      "Grid Resilience",
      "Real-time Simulations",
      "Vegetation Management",
    ],
    award: [
      "R&D 100 Award Finalist 2024",
      "NSF SBIR Grant $255,000",
      "Key Contributor Award - NREL",
      "William J. Wiley Scholarship",
    ],
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Washington State University" },
      { "@type": "CollegeOrUniversity", name: "National Institute of Technology Durgapur" },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />

      {/* Hero Section (smaller height) */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-sky-600/10 to-emerald-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-6 md:pt-20 md:pb-10">
          <div className="text-center">
            <div className="mb-6 inline-block">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-sky-600 p-1">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-sky-600 bg-clip-text text-transparent">SC</span>
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Sayonsom Chanda
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              AI, power systems, and cloud — building tools for GridLAB-D modeling, distribution planning, and data centers.
            </p>
            <div className="flex justify-center space-x-4 mb-6">
              <a href="https://github.com/sayonsom" className="text-gray-600 hover:text-indigo-600 transition-colors" aria-label="GitHub">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com/in/sayonsom/" className="text-gray-600 hover:text-indigo-600 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="https://x.com/sayonsom" className="text-gray-600 hover:text-indigo-600 transition-colors" aria-label="Twitter / X">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="/" className="text-gray-600 hover:text-indigo-600 transition-colors" aria-label="Website">
                <Globe className="w-6 h-6" />
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="#contact" className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                <Calendar className="inline-block w-4 h-4 mr-2" />
                Book Speaking
              </a>
              <a href="/newsletter" className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:border-indigo-400 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                <Mail className="inline-block w-4 h-4 mr-2" />
                Subscribe
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Scrolling Photo Gallery (taller + auto-scroll) */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="sr-only">Photo gallery</h2>
        </div>
        <div
          className="overflow-x-auto"
          ref={galleryRef}
          onMouseEnter={() => setAutoScrollPaused(true)}
          onMouseLeave={() => setAutoScrollPaused(false)}
        >
          <div className="flex items-stretch space-x-4 pb-2">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="w-64 md:w-80 h-40 md:h-56 rounded-none bg-gradient-to-r from-gray-200 to-gray-300 flex-shrink-0 shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 text-sm"
                aria-label={`Gallery item ${index + 1}`}
              >
                Photo {index + 1}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="h-2 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-indigo-600 font-semibold mb-4">{project.impact}</p>
                  <Link href={project.link} className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium">
                    View Project <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Experience */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Work Experience</h2>
          <div className="space-y-6">
            {workExperience.map((job, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{job.role}</h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <Briefcase className="w-4 h-4 mr-2" />
                      <span className="font-medium">{job.company}</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 mt-2 md:mt-0">{job.timeframe}</span>
                </div>
                <p className="text-gray-600 mb-3">{job.description}</p>
                <div className="bg-gradient-to-r from-indigo-50 to-sky-50 rounded-lg p-3">
                  <p className="text-sm font-semibold text-sky-700">Impact: {job.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Videos Carousel (edge-to-edge) */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Videos</h2>
        </div>
        <div className="overflow-x-auto">
          <div className="flex space-x-6 pb-4">
            {videos.map((v, i) => (
              <div key={i} className="min-w-[320px] md:min-w-[560px]">
                <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 w-full h-full rounded-none shadow-sm border border-gray-200"
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                <p className="mt-3 text-sm text-gray-700 font-medium px-4">{v.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Published Work & AI Agents */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <BookOpen className="w-8 h-8 mr-3 text-indigo-600" />
                Published Work
              </h2>
              <div className="space-y-6">
                {books.map((book, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{book.title}</h3>
                    <p className="text-gray-600 mb-2">{book.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{book.publisher}</span>
                      <span className="mx-2">•</span>
                      <span>{book.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <Bot className="w-8 h-8 mr-3 text-sky-600" />
                AI Agents
              </h2>
              <div className="space-y-6">
                {aiAgents.map((agent, index) => (
                  <div key={index} className="bg-gradient-to-r from-indigo-50 to-sky-50 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-indigo-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{agent.name}</h3>
                    <p className="text-gray-600 mb-2">{agent.description}</p>
                    <span className="inline-block px-3 py-1 bg-white rounded-full text-sm font-semibold text-indigo-600">
                      {agent.users} users
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education & Certifications */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <GraduationCap className="w-8 h-8 mr-3 text-indigo-600" />
                Education
              </h2>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-indigo-500">
                    <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700 font-medium">{edu.institution}</p>
                    <p className="text-gray-600 text-sm mt-1">{edu.focus}</p>
                    <p className="text-gray-500 text-sm mt-2">{edu.year}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <Award className="w-8 h-8 mr-3 text-sky-600" />
                Certifications
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:border-indigo-300 transition-colors">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3" />
                      <span className="text-gray-800 font-medium">{cert}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA: Speaking */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Invite Sayonsom to speak
          </h2>
          <p className="text-gray-600 mt-2 mb-6">
            Keynotes, panels, and workshops on AI for power systems, GridLAB-D, and
            energy infrastructure.
          </p>
          <a
            href="mailto:hello@saralsystems.co?subject=Speaking%20Invitation%20for%20Sayonsom%20Chanda"
            className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
          >
            <Mail className="w-4 h-4 mr-2" /> hello@saralsystems.co
          </a>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
