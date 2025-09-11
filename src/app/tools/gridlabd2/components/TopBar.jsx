"use client";

import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/LoginModal';

export default function TopBar() {
  const { user, logout, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  const userLabel = useMemo(() => {
    if (!user) return '';
    return user.displayName || user.email || 'Account';
  }, [user]);

  return (
    <div className="bg-white border-b-2 border-gray-300 shrink-0">
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold">GridLAB-D Cloud</h1>
          <div className="flex space-x-4 text-sm">
            {['File','Edit','View','Run','Help'].map(i => <button key={i} className="hover:text-[#ea580b]">{i}</button>)}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">{loading ? 'Checking auth…' : (user ? 'Signed in' : 'Ready')}</span>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="avatar" className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] text-orange-700 font-semibold">
                    {(userLabel || '?').slice(0,2).toUpperCase()}
                  </div>
                )}
                <span className="text-sm text-gray-700 max-w-[180px] truncate" title={userLabel}>{userLabel}</span>
              </div>
              <button onClick={logout} className="border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">Sign Out</button>
            </div>
          ) : (
            <button onClick={() => setShowLogin(true)} className="bg-[#ea580b] text-white px-4 py-1 text-sm font-semibold hover:bg-orange-700">Sign In</button>
          )}
        </div>
      </div>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
}
