"use client";

import { useState, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import LoginModal from '@/components/LoginModal';
import { ChevronLeft, ChevronRight, Menu, Folder, User, Key, LifeBuoy, BookOpen, Grid } from 'lucide-react';

function ToolsLayoutContent({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, logout, loading } = useAuth();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get('tab') || 'home';

  const navItems = [
    { key: 'projects', label: 'My Projects', icon: Folder, href: '/tools?tab=projects' },
    { key: 'profile', label: 'Profile', icon: User, href: '/tools?tab=profile' },
    { key: 'api-keys', label: 'API Keys', icon: Key, href: '/tools?tab=api-keys' },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className={`flex flex-col bg-white border-right border-gray-200 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} border-r`}>
          {/* Sidebar header with collapse toggle */}
          <div className="flex items-center justify-between h-14 px-3 border-b border-gray-200">
            <Link href="/tools" className="flex items-center gap-2 hover:opacity-90">
              <Image src="/logo.png" alt="Logo" width={28} height={28} />
              {!collapsed && <span className="font-semibold tracking-wide">SARAL</span>}
            </Link>
            <button
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="p-2 rounded hover:bg-gray-100"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-2 space-y-1">
            {navItems.map(({ key, label, icon: Icon, href }) => {
              const isActive = activeTab === key;
              return (
                <Link
                  key={key}
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 ${isActive ? 'bg-gray-100' : ''}`}
                >
                  <Icon size={18} />
                  {!collapsed && <span className="truncate">{label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar footer links */}
          <div className="mt-auto border-t border-gray-200 p-2">
            <div className="flex flex-col gap-1 text-xs text-gray-600">
              <Link href="/tools" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
                <Grid size={14} />
                {!collapsed && <span>All Tools</span>}
              </Link>
              <Link href="/#contact" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
                <LifeBuoy size={14} />
                {!collapsed && <span>Contact Support</span>}
              </Link>
              <Link href="/blog" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
                <BookOpen size={14} />
                {!collapsed && <span>Blog</span>}
              </Link>
            </div>

            <div className="px-2 pt-2">
              {user ? (
                <button
                  onClick={logout}
                  className={`w-full text-xs ${collapsed ? 'px-0' : 'px-3'} py-2 bg-gray-900 text-white rounded hover:bg-gray-800`}
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className={`w-full text-xs ${collapsed ? 'px-0' : 'px-3'} py-2 bg-orange-600 text-white rounded hover:bg-orange-700`}
                >
                  Sign Up
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          {/* Top bar for mobile toggle */}
          {/* <div className="sticky top-0 z-10 h-14 flex items-center gap-3 bg-white/80 backdrop-blur border-b border-gray-200 px-4">
            <button
              aria-label="Toggle sidebar"
              className="md:hidden p-2 rounded hover:bg-gray-100"
              onClick={() => setCollapsed(!collapsed)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold">Tools</h1>
          </div> */}

          {/* Always render page content; gated sections handle auth themselves */}
          {children}
        </main>
      </div>

      {/* Auth modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}

export default function ToolsLayout({ children }) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ToolsLayoutContent>{children}</ToolsLayoutContent>
    </Suspense>
  );
}
