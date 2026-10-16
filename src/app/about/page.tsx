'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, Globe, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DEFAULT_SITE_CONFIG } from '@/lib/config';

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-20 min-h-screen relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        <div className="text-center space-y-3">
          <Badge variant="cyan" size="md">
            OUR MISSION & MANIFESTO
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-[#F1F5F9] tracking-tight">
            ABOUT {DEFAULT_SITE_CONFIG.brandName}
          </h1>
          <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Engineered exclusively for competitive Free Fire mobile players and esports squads tired of local ISP DNS timeouts, lobby desync, and deceptive snake-oil marketing.
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] space-y-6 text-sm text-[#94A3B8] leading-relaxed font-sans shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
          <h3 className="text-xl font-bold uppercase text-[#F1F5F9] font-mono">
            The Problem We Solved
          </h3>
          <p>
            In Pakistan and regional emerging esports markets, mobile networks (Jazz, Zong, Telenor, Ufone) and broadband ISPs frequently resolve gaming domain names through under-provisioned, transparent proxy resolvers. Free Fire players encounter lobby connection stalls, failed matchmaking handshakes, and jittery packet paths.
          </p>
          <p>
            Meanwhile, unethical sellers promote fake &quot;magic 0 ping DNS&quot; claiming impossible auto-headshot boosters or fabricated ping reductions that violate the physics of internet routing.
          </p>

          <h3 className="text-xl font-bold uppercase text-[#F1F5F9] font-mono pt-4">
            Our Core Principles
          </h3>
          <div className="grid grid-cols-1 gap-3.5 pt-1">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#F1F5F9] block font-mono text-xs uppercase mb-0.5">100% Engineering Honesty</strong>
                <span className="text-xs text-[#94A3B8]">We explain the exact mechanics of BGP Anycast resolution and never fabricate impossible network physics or guaranteed headshot boosts.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md flex items-start gap-3">
              <Zap className="w-5 h-5 text-[#00E5FF] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#F1F5F9] block font-mono text-xs uppercase mb-0.5">Pure Edge Speed for Free Fire</strong>
                <span className="text-xs text-[#94A3B8]">Sub-5ms regional cache hits with TLS 1.3 encrypted DoH/DoT tunnels configured natively on Android and iOS devices.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md flex items-start gap-3">
              <Globe className="w-5 h-5 text-[#8B5CF6] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#F1F5F9] block font-mono text-xs uppercase mb-0.5">Instant Local Checkout</strong>
                <span className="text-xs text-[#94A3B8]">Instant guest checkout with full support for PKR, Easypaisa, and JazzCash with instant DNS credential provisioning.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link href="/store">
            <Button variant="primary" size="lg">
              <span>EXPLORE FREE FIRE PACKAGES</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
