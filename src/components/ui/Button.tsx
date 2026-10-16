'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'cyan' | 'secondary' | 'outline' | 'violet' | 'danger' | 'ghost' | 'glass' | 'glass-cyan' | 'glass-violet';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = "relative inline-flex items-center justify-center font-bold tracking-wider uppercase transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]";
    
    const sizeStyles = {
      sm: "text-xs px-3.5 py-1.5 gap-1.5",
      md: "text-xs sm:text-sm px-5 py-2.5 gap-2",
      lg: "text-sm sm:text-base px-7 py-3.5 gap-2.5",
    };

    const cyanStyle = "bg-[#00E5FF] hover:bg-[#38EFFF] text-[#080D1A] shadow-glow-cyan hover:shadow-glow-cyan-lg border border-[#5CEBFF]/50 active:translate-y-0.5 font-extrabold shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.4)]";

    const variantStyles = {
      primary: cyanStyle,
      cyan: cyanStyle,
      secondary: "bg-white/[0.06] hover:bg-white/[0.12] text-[#F1F5F9] border border-white/[0.12] hover:border-[#00E5FF]/50 backdrop-blur-md active:translate-y-0.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]",
      outline: "bg-transparent hover:bg-white/[0.06] text-[#F1F5F9] border border-white/[0.14] hover:border-[#00E5FF] active:translate-y-0.5 backdrop-blur-sm",
      violet: "bg-[#8B5CF6] hover:bg-[#A78BFA] text-white shadow-glow-violet hover:shadow-glow-violet-lg border border-[#C4B5FD]/40 active:translate-y-0.5 font-bold shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.35)]",
      glass: "bg-white/[0.06] hover:bg-white/[0.12] text-[#F1F5F9] border border-white/[0.12] hover:border-white/[0.24] backdrop-blur-md shadow-glass shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] active:translate-y-0.5",
      'glass-cyan': "bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 hover:border-[#00E5FF]/60 backdrop-blur-md shadow-[0_4px_20px_rgba(0,229,255,0.15),inset_0_1px_0_0_rgba(255,255,255,0.2)] active:translate-y-0.5",
      'glass-violet': "bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30 hover:border-[#8B5CF6]/60 backdrop-blur-md shadow-[0_4px_20px_rgba(139,92,246,0.15),inset_0_1px_0_0_rgba(255,255,255,0.2)] active:translate-y-0.5",
      danger: "bg-rose-950/40 hover:bg-rose-900/60 text-rose-200 border border-rose-800/40 active:translate-y-0.5 backdrop-blur-md",
      ghost: "bg-transparent hover:bg-white/[0.06] text-[#94A3B8] hover:text-[#F1F5F9] border border-transparent",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
