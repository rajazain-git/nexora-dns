'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '@/types';
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchDemoRole: (role: 'customer' | 'admin') => void;
  isFirebaseActive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_CUSTOMER: UserProfile = {
  uid: 'usr-customer-889',
  email: 'proplayer@gmail.com',
  displayName: 'Falcon Sniper PK',
  role: 'customer',
  phone: '03001234567',
  country: 'Pakistan',
  createdAt: '2026-01-10T12:00:00.000Z',
};

const DEMO_ADMIN: UserProfile = {
  uid: 'usr-admin-001',
  email: 'admin@nexoradns.com',
  displayName: 'Lead Network Admin',
  role: 'admin',
  phone: '03009998888',
  country: 'Pakistan',
  createdAt: '2025-11-01T10:00:00.000Z',
};

const ADMIN_WHITELIST = ['admin@nexoradns.com', 'zain@nexoradns.com'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check initial state
  useEffect(() => {
    // Check local storage for persisted session
    const storedUser = localStorage.getItem('nexora_active_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse cached user', e);
      }
    } else {
      // Default initial session: Customer demo user for easy testing
      setUser(DEMO_CUSTOMER);
      localStorage.setItem('nexora_active_user', JSON.stringify(DEMO_CUSTOMER));
    }

    // If Firebase Auth is configured, sync with real auth state
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          const isAdmin = ADMIN_WHITELIST.includes(fbUser.email?.toLowerCase() || '');
          const mappedUser: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email || 'customer@nexoradns.com',
            displayName: fbUser.displayName || 'NEXORA Member',
            role: isAdmin ? 'admin' : 'customer',
            createdAt: new Date().toISOString(),
          };
          setUser(mappedUser);
          localStorage.setItem('nexora_active_user', JSON.stringify(mappedUser));
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    if (isFirebaseConfigured && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
        const isAdmin = ADMIN_WHITELIST.includes(cred.user.email?.toLowerCase() || '');
        const mapped: UserProfile = {
          uid: cred.user.uid,
          email: cred.user.email || cleanEmail,
          displayName: cred.user.displayName || 'NEXORA Member',
          role: isAdmin ? 'admin' : 'customer',
          createdAt: new Date().toISOString(),
        };
        setUser(mapped);
        localStorage.setItem('nexora_active_user', JSON.stringify(mapped));
        setIsLoading(false);
        return { success: true };
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: err.message || 'Authentication failed' };
      }
    }

    // Standalone fallback: validate credentials
    if (pass.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const isAdmin = ADMIN_WHITELIST.includes(cleanEmail) || cleanEmail.includes('admin');
    const newUser: UserProfile = {
      uid: `usr-${Math.random().toString(36).substring(2, 8)}`,
      email: cleanEmail,
      displayName: cleanEmail.split('@')[0].toUpperCase(),
      role: isAdmin ? 'admin' : 'customer',
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('nexora_active_user', JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    if (isFirebaseConfigured && auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
        await updateProfile(cred.user, { displayName: name });
        const isAdmin = ADMIN_WHITELIST.includes(cleanEmail);
        const mapped: UserProfile = {
          uid: cred.user.uid,
          email: cleanEmail,
          displayName: name,
          role: isAdmin ? 'admin' : 'customer',
          createdAt: new Date().toISOString(),
        };
        setUser(mapped);
        localStorage.setItem('nexora_active_user', JSON.stringify(mapped));
        setIsLoading(false);
        return { success: true };
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: err.message || 'Registration failed' };
      }
    }

    if (pass.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const isAdmin = ADMIN_WHITELIST.includes(cleanEmail);
    const newUser: UserProfile = {
      uid: `usr-${Math.random().toString(36).substring(2, 8)}`,
      email: cleanEmail,
      displayName: name,
      role: isAdmin ? 'admin' : 'customer',
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('nexora_active_user', JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  };

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth) {
      // Mock Google sign-in
      const mockGoogle: UserProfile = {
        uid: 'usr-google-101',
        email: 'esports.champ@gmail.com',
        displayName: 'Google Player',
        role: 'customer',
        createdAt: new Date().toISOString(),
      };
      setUser(mockGoogle);
      localStorage.setItem('nexora_active_user', JSON.stringify(mockGoogle));
      return { success: true };
    }

    try {
      const res = await signInWithPopup(auth, googleProvider);
      const isAdmin = ADMIN_WHITELIST.includes(res.user.email?.toLowerCase() || '');
      const mapped: UserProfile = {
        uid: res.user.uid,
        email: res.user.email || '',
        displayName: res.user.displayName || 'Google User',
        role: isAdmin ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
      };
      setUser(mapped);
      localStorage.setItem('nexora_active_user', JSON.stringify(mapped));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.error(e);
      }
    }
    setUser(null);
    localStorage.removeItem('nexora_active_user');
  };

  const switchDemoRole = (role: 'customer' | 'admin') => {
    const target = role === 'admin' ? DEMO_ADMIN : DEMO_CUSTOMER;
    setUser(target);
    localStorage.setItem('nexora_active_user', JSON.stringify(target));
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        switchDemoRole,
        isFirebaseActive: isFirebaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
