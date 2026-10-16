'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();
  const { registerWithEmail } = useAuth();
  const { showToast } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    const result = await registerWithEmail(email, password, displayName);
    setIsLoading(false);

    if (result.success) {
      showToast({
        type: 'success',
        title: 'Account Registered',
        message: 'Welcome to NEXORA Gaming DNS.',
      });
      router.push('/dashboard');
    } else {
      setErrorMessage(result.error || 'Failed to register account.');
    }
  };

  return (
    <div className="py-20 bg-[#080D1A] min-h-[85vh] flex items-center justify-center relative overflow-hidden">
      {/* Decorative ambient glass glows */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-[#00E5FF]/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-[#8B5CF6]/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-md w-full mx-auto px-4">
        
        <div className="p-8 sm:p-9 rounded-3xl bg-white/[0.08] backdrop-blur-2xl border border-white/[0.16] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.20)] space-y-6">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/[0.12] text-[#00E5FF] mx-auto shadow-[0_0_20px_rgba(0,229,255,0.20)]">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-[#F1F5F9]">
              REGISTER PLAYER ACCOUNT
            </h1>
            <p className="text-xs text-[#94A3B8] font-mono">
              Get an individual Anycast routing profile and manage orders
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
                Gamer Tag / Display Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. ApexLegend99"
                  className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#F1F5F9] placeholder-neutral-500 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40 backdrop-blur-md transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#94A3B8] font-mono mb-1.5 text-[11px] uppercase">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="player@example.com"
                  className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#F1F5F9] placeholder-neutral-500 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40 backdrop-blur-md transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#94A3B8] font-mono mb-1.5 text-[11px] uppercase">
                Password (Min 6 Characters) *
              </label>
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

            <div>
              <label className="block text-[#94A3B8] font-mono mb-1.5 text-[11px] uppercase">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              <ShieldCheck className="w-4 h-4 mr-2" />
              <span>Create Player Account</span>
            </Button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-[#94A3B8] font-sans">
              Already have an account?{' '}
              <Link href="/login" className="text-[#00E5FF] font-bold hover:underline font-mono">
                Sign In
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
