"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Activity, Cog, Satellite, Server, CircuitBoard } from 'lucide-react';

export default function ToolsHomePage() {
  const { user } = useAuth();
  const username = user?.displayName || user?.email?.split('@')[0] || 'User';

  const tools = [
    { title: 'Smart Meter Load Disaggregation', icon: Activity, href: '/tools/smart-meter-load-disaggregation', color: 'bg-orange-100 text-orange-600' },
    { title: 'Generate Distribution System Models', icon: Cog, href: '/tools/generate-distribution-models', color: 'bg-blue-100 text-blue-600' },
    { title: 'Satellite-based Resilience Monitoring', icon: Satellite, href: '/tools/satellite-resilience-monitoring', color: 'bg-green-100 text-green-600' },
    { title: 'Data Center Designer', icon: Server, href: '/tools/data-center-designer', color: 'bg-purple-100 text-purple-600' },
    { title: 'GridLab-D Web IDE', icon: CircuitBoard, href: '/tools/gridlabd', color: 'bg-emerald-100 text-emerald-600' },
  ];

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-4 text-sm text-gray-500">
          <Link href="/tools" className="hover:text-gray-700">Tools</Link>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Welcome {username} to Saral</h1>
          <p className="mt-2 text-gray-600">Choose a tool below to get started.</p>
        </div>
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {tools.map(({ title, icon: Icon, href, color }) => (
            <Link
              key={title}
              href={href}
              className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${color}`}>
                <Icon size={22} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-gray-900">{title}</h2>
              <p className="mt-2 text-sm text-gray-600">Coming soon. Click to learn more when available.</p>
            </Link>
          ))}
        </section>
      </div>
    </ProtectedRoute>
  );
}
