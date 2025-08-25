"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "./LoginModal";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navLinks = ["Services", "AI Brief", "Use Cases", "Insights", "Tools", "Contact"];
  const { user, logout } = useAuth();
  const userMenuRef = useRef(null);

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
          <nav className="flex flex-col items-center space-y-4">
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
              <div className="text-center">
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
    </header>
  );
}

