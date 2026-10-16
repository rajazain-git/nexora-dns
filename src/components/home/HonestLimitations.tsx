'use client';

import React from 'react';
import { CheckCircle2, ShieldAlert, Cpu, Globe2, Activity } from 'lucide-react';
import { HONEST_DISCLAIMER } from '@/lib/config';

export function HonestLimitations() {
  return (
    <section className="py-24 bg-[#080D1A] relative border-t border-white/[0.10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.12] backdrop-blur-md text-[#00E5FF] text-xs font-mono font-bold uppercase tracking-wider mb-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Engineering Transparency Manifesto</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-[#F1F5F9] tracking-tight">
            THE TRUTH ABOUT GAMING DNS
          </h2>
          <p className="text-[#94A3B8] text-sm sm:text-base mt-3 leading-relaxed">
            We operate on network integrity and empirical network architecture. Here is exactly what our Anycast resolvers solve and where physical network laws apply.
          </p>
        </div>

        {/* 2-Column Truth Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: What NEXORA Solves */}
          <div className="rounded-3xl bg-white/[0.06] backdrop-blur-2xl border border-[#00E5FF]/35 p-7 sm:p-9 relative overflow-hidden shadow-[0_12px_40px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.18)]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#00E5FF]/10 blur-3xl pointer-events-none rounded-full" />
            
            <div className="flex items-center gap-3.5 mb-7">
              <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/15 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black uppercase text-[#F1F5F9] tracking-wide">
                  What NEXORA DNS Solves
                </h3>
                <span className="text-xs font-mono text-[#00E5FF] font-bold">
                  EMPIRICAL RESOLUTION GAINS
                </span>
              </div>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-[#94A3B8]">
              <li className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                <span className="text-[#00E5FF] font-bold font-mono">01.</span>
                <div>
                  <strong className="text-[#F1F5F9] block font-sans">Bypasses Sluggish Local ISP Resolvers</strong>
                  <span>Standard Pakistani & regional ISPs run congested DNS proxies with 40ms–120ms lookup delay. NEXORA delivers sub-5ms local Anycast edge resolution.</span>
                </div>
              </li>

              <li className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                <span className="text-[#00E5FF] font-bold font-mono">02.</span>
                <div>
                  <strong className="text-[#F1F5F9] block font-sans">Eliminates DNS Redirection & Hijacking</strong>
                  <span>Prevents ISP transparent proxying from tampering with game authentication endpoints or routing queries to overseas CDNs.</span>
                </div>
              </li>

              <li className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                <span className="text-[#00E5FF] font-bold font-mono">03.</span>
                <div>
                  <strong className="text-[#F1F5F9] block font-sans">Strict DoH & DoT TLS 1.3 Encryption</strong>
                  <span>Locks down your query packets from snooping, packet injection, and ISP throttling profiles.</span>
                </div>
              </li>

              <li className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                <span className="text-[#00E5FF] font-bold font-mono">04.</span>
                <div>
                  <strong className="text-[#F1F5F9] block font-sans">Strips In-Game Adware & Telemetry Noise</strong>
                  <span>Blocks background tracking domains in mobile games so your bandwidth buffer is reserved exclusively for game state UDP packets.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Card 2: What No DNS Can Change */}
          <div className="rounded-3xl bg-white/[0.06] backdrop-blur-2xl border border-[#8B5CF6]/35 p-7 sm:p-9 relative overflow-hidden shadow-[0_12px_40px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.18)]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#8B5CF6]/10 blur-3xl pointer-events-none rounded-full" />

            <div className="flex items-center gap-3.5 mb-7">
              <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black uppercase text-[#F1F5F9] tracking-wide">
                  What DNS Cannot Change
                </h3>
                <span className="text-xs font-mono text-[#8B5CF6] font-bold">
                  PHYSICAL & HARDWARE REALITIES
                </span>
              </div>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-[#94A3B8]">
              <li className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                <span className="text-[#8B5CF6] font-bold font-mono">01.</span>
                <div>
                  <strong className="text-[#F1F5F9] block font-sans">Physical Distance To Game Host (Speed of Light)</strong>
                  <span>If a server is physically situated in Frankfurt or Singapore, light in fiber cables takes a minimum fixed time (~110ms and ~65ms). No software alters physics.</span>
                </div>
              </li>

              <li className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                <span className="text-[#8B5CF6] font-bold font-mono">02.</span>
                <div>
                  <strong className="text-[#F1F5F9] block font-sans">Submarine Cable Disruptions or ISP Backhaul</strong>
                  <span>When an undersea cable (e.g., SMW4 or AAE-1) is degraded, routing hops degrade universally at the telecom backbone level.</span>
                </div>
              </li>

              <li className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                <span className="text-[#8B5CF6] font-bold font-mono">03.</span>
                <div>
                  <strong className="text-[#F1F5F9] block font-sans">Home Wi-Fi Bufferbloat & Cellular Dead Zones</strong>
                  <span>Weak cellular signal or walls interfering with your 2.4GHz home Wi-Fi require physical router tuning, not DNS modification.</span>
                </div>
              </li>

              <li className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                <span className="text-[#8B5CF6] font-bold font-mono">04.</span>
                <div>
                  <strong className="text-[#F1F5F9] block font-sans">Game Engine Tickrate & Netcode Mechanics</strong>
                  <span>Hit registration depends on server netcode tickrate (64/128 tick) and opponent latency compensation. DNS is not a cheat or modifier.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Detailed Disclosure Box */}
        <div className="mt-10 p-6 rounded-2xl bg-white/[0.04] border border-white/[0.10] backdrop-blur-xl text-center max-w-4xl mx-auto shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
          <p className="text-xs text-[#94A3B8] font-mono leading-relaxed">
            {HONEST_DISCLAIMER.fullNotice}
          </p>
        </div>
      </div>
    </section>
  );
}
