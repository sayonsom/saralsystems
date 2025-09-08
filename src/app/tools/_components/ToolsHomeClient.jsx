"use client";

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Activity, Cog, Satellite, Server, CircuitBoard } from 'lucide-react';

export default function ToolsHomeClient() {
  const { user } = useAuth();
  const username = user?.displayName || user?.email?.split('@')[0] || 'User';

  const tools = [
    { 
      title: 'Deep Dive', 
      icon: Activity, 
      href: '/tools/deepdive', 
      description: 'Analyze energy data patterns',
      color: 'text-orange-600' 
    },
    { 
      title: 'Forecast Assist', 
      icon: Cog, 
      href: '/tools/forecast-assist', 
      description: 'AI-powered load predictions',
      color: 'text-orange-600' 
    },
    { 
      title: 'Wizard', 
      icon: Satellite, 
      href: '/tools/wizard', 
      description: 'Smart grid optimization',
      color: 'text-orange-600' 
    },
    // { title: 'Data Center Designer', icon: Server, href: '/tools/data-center-designer', color: 'bg-purple-100 text-purple-600' },
    { 
      title: 'Modeler', 
      icon: CircuitBoard, 
      href: '/tools/gridlabd', 
      description: 'Distribution modeling',
      color: 'text-orange-600' 
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-4 text-sm text-gray-500">
        <Link href="/tools" className="hover:text-gray-700">Tools</Link>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">Welcome {username}!</h1>
        <p className="mt-2 text-gray-600">Choose a tool below to get started.</p>
      </div>
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {tools.map(({ title, icon: Icon, href, color, description }) => (
          <Link
            key={title}
            href={href}
            className="group bg-white border-2 border-gray-200 p-6 hover:shadow-xl hover:border-orange-600 hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-600 transform hover:scale-105"
          >
            <div className="w-14 h-14 border-2 border-gray-200 group-hover:border-orange-600 flex items-center justify-center mb-4 transition-colors duration-300">
              <Icon size={24} className={`transition-colors duration-300 ${color}`} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 group-hover:text-gray-900 mb-2">{title}</h2>
            <p className="text-sm text-gray-600 mb-3">{description}</p>
            {/* <p className="text-xs text-gray-500">Explore more and sign in to use the tool.</p> */}
          </Link>
        ))}
      </section>
    </div>
  );
}
