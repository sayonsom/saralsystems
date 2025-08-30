"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "./LoginModal";
import { useRouter } from "next/navigation";
import SearchModal from "./SearchModal";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [mobileSuggestions, setMobileSuggestions] = useState([]);
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false);
  const navLinks = ["Services", "AI Brief", "Use Cases", "Insights", "Tools", "Contact"];
  const { user, logout } = useAuth();
  const userMenuRef = useRef(null);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const router = useRouter();

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced suggestions when 3+ chars
  useEffect(() => {
    const q = searchQuery.trim();
    let active = true;
    if (q.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=5`);
        const data = await res.json();
        if (!active) return;
        setSuggestions(data.results || []);
        setShowSuggestions(true);
      } catch (e) {
        if (!active) return;
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 200);
    return () => { active = false; clearTimeout(t); };
  }, [searchQuery]);

  // Mobile suggestions (3+ chars)
  useEffect(() => {
    const q = searchQuery.trim();
    let active = true;
    if (q.length < 3 || !isOpen) {
      setMobileSuggestions([]);
      setShowMobileSuggestions(false);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=5`);
        const data = await res.json();
        if (!active) return;
        setMobileSuggestions(data.results || []);
        setShowMobileSuggestions(true);
      } catch (e) {
        if (!active) return;
        setMobileSuggestions([]);
        setShowMobileSuggestions(false);
      }
    }, 250);
    return () => { active = false; clearTimeout(t); };
  }, [searchQuery, isOpen]);

  // Keyboard shortcut: Cmd+K / Ctrl+K opens modal
  useEffect(() => {
    const onKeyDown = (e) => {
      const key = e.key?.toLowerCase();
      const isInput = ["input", "textarea"].includes((e.target?.tagName || "").toLowerCase()) || e.target?.isContentEditable;
      if (!isInput && (e.metaKey || e.ctrlKey) && key === "k") {
        e.preventDefault();
        setShowSearchModal(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const submitSearch = (e, qOverride) => {
    e?.preventDefault?.();
    const q = (qOverride ?? searchQuery).trim();
    if (q) {
      setShowSearchModal(true);
      setShowSuggestions(false);
      setShowMobileSuggestions(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-2 text-2xl font-bold text-gray-900">
              <Image src="/logo.png" alt="Logo" width={32} height={32} />
              <span>SARAL</span>
            </a>
          </div>
          <div className="hidden md:block">
            <nav className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={
                    link === "Insights" ? "/insights" : 
                    link === "Tools" ? "/tools" :
                    `#${link.toLowerCase().replace(" ", "-")}`
                  }
                  className="text-gray-700 hover:text-orange-600 transition-colors duration-300"
                >
                  {link}
                </a>
              ))}

              {/* Global Search (desktop) */}
              <div className="relative">
                <form onSubmit={submitSearch}>
                  <input
                    ref={desktopSearchRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(suggestions.length > 0)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onClick={() => setShowSearchModal(true)}
                    placeholder="Search… (⌘K)"
                    aria-label="Search the site"
                    className="w-56 lg:w-72 border border-gray-300 bg-white/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </form>

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute mt-1 left-0 right-0 bg-white border border-gray-200 shadow-lg z-50">
                    <ul className="py-2">
                      {suggestions.map((s, idx) => (
                        <li key={idx} className="px-3 py-2 hover:bg-gray-50">
                          <a href={s.href} className="block">
                            <div className="text-[11px] uppercase text-gray-500">{s.type}</div>
                            <div className="text-sm font-medium" dangerouslySetInnerHTML={{ __html: s.highlightedTitle || escapeHtml(s.title) }} />
                          </a>
                        </li>
                      ))}
                      <li className="px-3 py-2 border-t text-sm text-gray-600">
                        Press Enter to view more results…
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors duration-300"
                  >
                    <User size={20} />
                    <span>{user.email?.split('@')[0] || 'User'}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <a
                        href="/tools"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Tools
                      </a>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-gray-700 px-4 py-2 font-semibold hover:text-orange-600 transition-colors duration-300"
                >
                  Sign In
                </button>
              )}

              <a
                href="#contact"
                className="h-16 flex items-center bg-[#EA580B] text-black px-4 font-semibold hover:bg-black hover:text-white transition-colors duration-300"
              >
                Request a Consultation
              </a>
            </nav>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-gray-900">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg pb-4 border-t border-gray-200">
          {/* Global Search (mobile) */}
          <form onSubmit={submitSearch} className="px-4 pt-3">
            <input
              ref={mobileSearchRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowMobileSuggestions(mobileSuggestions.length > 0)}
              onBlur={() => setTimeout(() => setShowMobileSuggestions(false), 150)}
              placeholder="Search… (Ctrl/Cmd+K)"
              aria-label="Search the site"
              className="w-full border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </form>
          {showMobileSuggestions && mobileSuggestions.length > 0 && (
            <div className="px-4">
              <div className="mt-2 bg-white border border-gray-200 shadow">
                <ul className="py-2">
                  {mobileSuggestions.map((s, idx) => (
                    <li key={idx} className="px-3 py-2 hover:bg-gray-50">
                      <a href={s.href} className="block" onClick={() => setIsOpen(false)}>
                        <div className="text-[11px] uppercase text-gray-500">{s.type}</div>
                        <div className="text-sm font-medium" dangerouslySetInnerHTML={{ __html: s.highlightedTitle || escapeHtml(s.title) }} />
                      </a>
                    </li>
                  ))}
                  <li className="px-3 py-2 border-t text-sm text-gray-600">Press Enter to open full search…</li>
                </ul>
              </div>
            </div>
          )}
          <nav className="flex flex-col items-center space-y-4 mt-4">
            {navLinks.map((link) => (
              <a
                key={link}
                href={
                  link === "Insights" ? "/insights" : 
                  link === "Tools" ? "/tools" :
                  `#${link.toLowerCase().replace(" ", "-")}`
                }
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-orange-600 transition-colors duration-300 text-lg"
              >
                {link}
              </a>
            ))}
            {user ? (
              <div className="text-center w-full px-4">
                <div className="flex items-center justify-center space-x-2 text-gray-700 mb-4">
                  <User size={20} />
                  <span>{user.email?.split('@')[0] || 'User'}</span>
                </div>
                <a
                  href="/tools"
                  onClick={() => setIsOpen(false)}
                  className="block bg-orange-600 text-white px-6 py-2 rounded-none font-semibold hover:bg-orange-700 transition-colors duration-300 mb-4"
                >
                  Access Tools
                </a>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block w-full bg-gray-600 text-white px-6 py-2 rounded-none font-semibold hover:bg-gray-700 transition-colors duration-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setIsOpen(false);
                }}
                className="text-gray-700 px-6 py-2 font-semibold hover:text-orange-600 transition-colors duration-300"
              >
                Sign In
              </button>
            )}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="bg-gray-900 text-white px-6 py-2 rounded-none font-semibold hover:bg-gray-800 transition-colors duration-300"
            >
              Request a Consultation
            </a>
          </nav>
        </div>
      )}
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />

      {/* Search Modal */}
      <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} initialQuery={searchQuery} />
    </header>
  );
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

