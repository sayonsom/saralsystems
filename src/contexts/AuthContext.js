"use client";

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTestUser, setIsTestUser] = useState(false);
  const hasManuallyLoggedOutRef = useRef(false);
  const isInitialLoadRef = useRef(true);

  // Test credentials login - explicitly marked as test
  const loginWithTestCredentials = async () => {
    try {
      console.log('[Auth] Logging in with test credentials');
      hasManuallyLoggedOutRef.current = false;
      const result = await signInWithEmailAndPassword(auth, 'test@test.com', 'test123');
      setIsTestUser(true);
      return result;
    } catch (err) {
      console.error('[Auth] Test login failed:', err);
      setIsTestUser(false);
      throw err;
    }
  };

  // Production user login
  const login = async (email, password) => {
    try {
      console.log('[Auth] Logging in user:', email);
      hasManuallyLoggedOutRef.current = false;
      
      // Clear any test user state
      setIsTestUser(false);
      
      // Ensure we sign out any existing session first to prevent conflicts
      if (auth.currentUser && auth.currentUser.email === 'test@test.com') {
        console.log('[Auth] Signing out test user before production login');
        await signOut(auth);
      }
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Mark as test user if it's the test account
      if (email === 'test@test.com') {
        setIsTestUser(true);
      }
      
      console.log('[Auth] Login successful for:', email);
      return result;
    } catch (err) {
      console.error('[Auth] Login failed for:', email, err);
      throw err;
    }
  };

  const signup = async (email, password) => {
    try {
      console.log('[Auth] Creating new user:', email);
      hasManuallyLoggedOutRef.current = false;
      setIsTestUser(false);
      
      // Sign out any existing session first
      if (auth.currentUser) {
        await signOut(auth);
      }
      
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('[Auth] Signup successful for:', email);
      return result;
    } catch (err) {
      console.error('[Auth] Signup failed:', err);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      console.log('[Auth] Initiating Google login');
      hasManuallyLoggedOutRef.current = false;
      setIsTestUser(false);
      
      // Sign out any test user first
      if (auth.currentUser && auth.currentUser.email === 'test@test.com') {
        console.log('[Auth] Signing out test user before Google login');
        await signOut(auth);
      }
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('[Auth] Google login successful');
      return result;
    } catch (err) {
      console.error('[Auth] Google login failed:', err);
      throw err;
    }
  };

  useEffect(() => {
    console.log('[Auth] Setting up auth state listener');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[Auth] Auth state changed:', firebaseUser ? firebaseUser.email : 'null');
      
      if (firebaseUser) {
        // User is signed in
        setUser(firebaseUser);
        
        // Check if it's the test user
        if (firebaseUser.email === 'test@test.com') {
          setIsTestUser(true);
          console.log('[Auth] Test user detected');
        } else {
          setIsTestUser(false);
          console.log('[Auth] Production user detected:', firebaseUser.email);
        }
      } else {
        // No user signed in
        setUser(null);
        setIsTestUser(false);
        
        // REMOVED: Auto-login with test credentials
        // This was causing interference with production users
        // Test login should only happen explicitly via loginWithTestCredentials()
        console.log('[Auth] No user signed in');
      }
      
      // Mark initial load as complete
      if (isInitialLoadRef.current) {
        isInitialLoadRef.current = false;
        console.log('[Auth] Initial auth check complete');
      }
      
      setLoading(false);
    });

    return () => {
      console.log('[Auth] Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      console.log('[Auth] Logging out user:', user?.email);
      hasManuallyLoggedOutRef.current = true;
      setUser(null);
      setIsTestUser(false);
      
      // Clear any cached auth state
      await signOut(auth);
      
      console.log('[Auth] Logout successful');
    } catch (err) {
      console.error('[Auth] Logout error:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      loginWithGoogle,
      loginWithTestCredentials,
      loading,
      isTestUser
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
