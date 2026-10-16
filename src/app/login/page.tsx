'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertCircle, Shield, Sliders } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, loginWithGoogle, switchDemoRole, isFirebaseActive } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const result = await loginWithEmail(email, password);
    setIsLoading(false);

    if (result.success) {
      showToast({
        type: 'success',
        title: 'Authentication Successful',
        message: 'Welcome back to NEXORA DNS portal.',
      });
      router.push('/dashboard');
    } else {
      setErrorMessage(result.error || 'Failed to authenticate.');
    }
  };

  const handleDemoLogin = (role: 'customer' | 'admin') => {
    switchDemoRole(role);
    showToast({
      type: 'info',
      title: 'Demo Session Active',
      message: `Switched session to ${role.toUpperCase()} persona.`,
    });
    router.push(role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <div className="py-20 bg-[#080D1A] min-h-[85vh] flex items-center justify-center relative overflow-hidden">
      {/* Decorative ambient glass glows */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-[#00E5FF]/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-[#8B5CF6]/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-md w-full mx-auto px-4">
        
        {/* Glass Card */}
        <div className="p-8 sm:p-9 rounded-3xl bg-white/[0.08] backdrop-blur-2xl border border-white/[0.16] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.20)] space-y-6">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/[0.12] text-[#00E5FF] mx-auto shadow-[0_0_20px_rgba(0,229,255,0.20)]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-[#F1F5F9]">
              AUTHENTICATE SESSION
            </h1>
            <p className="text-xs text-[#94A3B8] font-mono">
              Access your encrypted DNS keys and customer dashboard
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 backdrop-blur-md border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-[#94A3B8] font-mono mb-1.5 text-[11px] uppercase">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#F1F5F9] placeholder-neutral-500 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40 backdrop-blur-md transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[#94A3B8] font-mono text-[11px] uppercase">
                  Password
                </label>
                <Link href="/contact" className="text-[10px] text-[#94A3B8]/80 hover:text-[#00E5FF] underline font-mono">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#F1F5F9] placeholder-neutral-500 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40 backdrop-blur-md transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="glass-cyan"
              size="md"
              className="w-full font-bold shadow-[0_0_20px_rgba(0,229,255,0.25)]"
              isLoading={isLoading}
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Quick Demo Personas */}
          <div className="pt-4 border-t border-white/[0.10] space-y-2">
            <span className="text-[10px] uppercase font-mono text-[#94A3B8] block text-center">
              Quick Review Demo Switcher:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('customer')}
                className="py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.10] text-[#00E5FF] font-mono text-xs font-bold transition-all text-center backdrop-blur-md"
              >
                Gamer Persona
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.10] text-[#8B5CF6] font-mono text-xs font-bold transition-all text-center backdrop-blur-md"
              >
                Admin Persona
              </button>
            </div>
          </div>

          {/* Registration link */}
          <div className="text-center pt-2">
            <p className="text-xs text-[#94A3B8] font-sans">
              Don't have an account yet?{' '}
              <Link href="/register" className="text-[#00E5FF] font-bold hover:underline font-mono">
                Create Account
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
