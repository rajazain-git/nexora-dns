'use client';

import React from 'react';
import Link from 'next/link';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { DEFAULT_SITE_CONFIG } from '@/lib/config';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  brandName?: string;
  showTagline?: boolean;
}

export function Logo({ size = 'md', brandName, showTagline = false }: LogoProps) {
  const { settings } = useSiteConfig();
  const effectiveBrandName = brandName || settings?.theme?.brandName || settings?.brandName || DEFAULT_SITE_CONFIG.brandName;

  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', badge: 'text-[9px] px-1.5 py-0.5' },
    md: { icon: 'w-9 h-9', text: 'text-xl', badge: 'text-[10px] px-2 py-0.5' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', badge: 'text-xs px-2.5 py-1' },
  };

  const parts = effectiveBrandName.split(' ');
  const mainName = parts[0] || 'NEXORA';
  const subName = parts.slice(1).join(' ') || 'DNS';

  return (
    <Link href="/" className="inline-flex items-center gap-3 group select-none">
      {/* Network Infrastructure Emblem: Anycast Data Node & Wave Orbitals */}
      <div className={`relative ${sizeMap[size].icon} flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-[0_0_12px_rgba(0,229,255,0.45)] transition-transform duration-300 group-hover:scale-105"
        >
          {/* Glass Outer Enclosure */}
          <rect
            x="3"
            y="3"
            width="38"
            height="38"
            rx="10"
            stroke="rgba(255,255,255,0.18)"
            fill="rgba(255,255,255,0.06)"
            strokeWidth="1.5"
          />
          {/* Violet Gradient Orbital Loop */}
          <path
            d="M 12 22 C 12 14, 32 14, 32 22 C 32 30, 12 30, 12 22"
            className="stroke-[#8B5CF6] fill-none"
            strokeWidth="1.75"
            strokeDasharray="2 2"
          />
          {/* Cyan High-Speed Packet Ray */}
          <circle cx="22" cy="22" r="5" className="fill-[#00E5FF] shadow-glow-cyan" />
          <circle cx="22" cy="22" r="9" className="stroke-[#00E5FF]/50 stroke-[1.5] fill-none animate-pulse" />
          {/* Peripheral Edge Gateway Nodes */}
          <circle cx="12" cy="22" r="2.5" className="fill-[#8B5CF6]" />
          <circle cx="32" cy="22" r="2.5" className="fill-[#00E5FF]" />
          <circle cx="22" cy="10" r="2" className="fill-[#94A3B8]" />
          <circle cx="22" cy="34" r="2" className="fill-[#94A3B8]" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-wider uppercase text-[#F1F5F9] font-sans ${sizeMap[size].text}`}>
            {mainName}
          </span>
          <span className={`font-black tracking-widest uppercase text-[#00E5FF] font-sans ${sizeMap[size].text}`}>
            {subName}
          </span>
          <span className={`bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 rounded font-mono font-bold uppercase tracking-wider ${sizeMap[size].badge}`}>
            NETWORK
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-[#94A3B8] uppercase tracking-widest font-mono mt-1">
            Next-Gen Anycast Infrastructure
          </span>
        )}
      </div>
    </Link>
  );
}
