'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'violet' | 'emerald' | 'amber' | 'neutral' | 'outline' | 'red';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export function Badge({ children, variant = 'neutral', size = 'sm', className, dot = false }: BadgeProps) {
  const base = "inline-flex items-center font-bold uppercase tracking-wider rounded-lg border select-none backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]";

  const sizes = {
    sm: "text-[10px] px-2.5 py-0.5 gap-1.5 font-mono",
    md: "text-xs px-3 py-1 gap-2 font-mono",
  };

  const variants = {
    cyan: "bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30 shadow-[0_2px_10px_rgba(0,229,255,0.1)]",
    violet: "bg-[#8B5CF6]/15 text-[#C4B5FD] border-[#8B5CF6]/35 shadow-[0_2px_10px_rgba(139,92,246,0.1)]",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_2px_10px_rgba(52,211,153,0.1)]",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_2px_10px_rgba(251,191,36,0.1)]",
    neutral: "bg-white/[0.06] text-[#94A3B8] border-white/[0.12]",
    outline: "bg-transparent text-[#94A3B8] border-white/[0.14]",
    red: "bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_2px_10px_rgba(244,63,94,0.1)]",
  };

  const dotColors = {
    cyan: "bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]",
    violet: "bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6]",
    emerald: "bg-emerald-400 shadow-[0_0_8px_#34d399]",
    amber: "bg-amber-400 shadow-[0_0_8px_#fbbf24]",
    neutral: "bg-[#94A3B8]",
    outline: "bg-[#94A3B8]",
    red: "bg-rose-400 shadow-[0_0_8px_#f43f5e]",
  };

  return (
    <span className={twMerge(clsx(base, sizes[size], variants[variant], className))}>
      {dot && <span className={clsx("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])} />}
      {children}
    </span>
  );
}
