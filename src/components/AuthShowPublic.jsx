"use client";

import { useAuth } from '@/contexts/AuthContext';

export default function AuthShowPublic({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? null : <>{children}</>;
}
