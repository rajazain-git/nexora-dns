'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Network, 
  ShieldAlert, 
  Zap, 
  Lock, 
  ArrowRight, 
  Cpu, 
  Server, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { HONEST_DISCLAIMER } from '@/lib/config';

export default function HowItWorksPage() {
  const steps = [
    {
      step: '01',
      title: 'Free Fire Domain Lookup Handshake',
      desc: 'When you queue for a match in Free Fire Mobile, your device needs the IP address of Garena matchmaking and lobby cluster servers. It dispatches a DNS query packet to resolve the hostname.',
      icon: <Cpu className="w-6 h-6 text-[#00E5FF]" />,
    },
    {
      step: '02',
      title: 'BGP Anycast Edge Route Traversal',
      desc: 'Instead of being routed to an overloaded local ISP recursive server 12 hops away, your query hits our closest Anycast edge node in Pakistan, UAE, or Singapore via optimized BGP peering.',
      icon: <Network className="w-6 h-6 text-[#8B5CF6]" />,
    },
    {
      step: '03',
      title: 'TLS 1.3 Encryption & Adware Stripping',
      desc: 'Under native DoH / DoT, your query is encrypted with TLS 1.3. Any telemetry tracking or ad-network queries made by background mobile apps are silently dropped, keeping your uplink queue empty.',
      icon: <Lock className="w-6 h-6 text-emerald-400" />,
    },
    {
      step: '04',
      title: 'Instant Cache Hit & Sub-5ms Return',
      desc: 'Because Free Fire competitive endpoints are cached on our regional edge nodes, resolution is returned in 2ms to 8ms. Your mobile client connects to matchmaking with zero DNS timeout stalls.',
      icon: <Zap className="w-6 h-6 text-[#00E5FF]" />,
    },
  ];

  return (
    <div className="py-16 sm:py-20 min-h-screen relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="cyan" size="md">
            FREE FIRE TECHNICAL DEEP DIVE
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-[#F1F5F9] tracking-tight">
            HOW NEXORA MOBILE DNS WORKS
          </h1>
          <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed">
            Understand the exact networking lifecycle of a DNS packet, how Anycast edge peering operates for Free Fire, and the physical limits of network routing.
          </p>
        </div>

        {/* 4 Step Architecture Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((st) => (
            <div
              key={st.step}
              className="p-8 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] relative overflow-hidden group hover:border-[#00E5FF]/40 transition-all shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] hover:-translate-y-1 duration-300"
            >
              <span className="text-6xl font-black font-mono text-white/[0.05] absolute right-6 top-6 pointer-events-none group-hover:text-[#00E5FF]/15 transition-colors">
                {st.step}
              </span>

              <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.12] backdrop-blur-md flex items-center justify-center mb-6">
                {st.icon}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-[#00E5FF]">STAGE {st.step}</span>
              </div>

              <h3 className="text-lg font-bold text-[#F1F5F9] uppercase tracking-wide mb-3">
                {st.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                {st.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Packet Path Comparison */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-6">
          <h3 className="text-xl font-black uppercase text-[#F1F5F9] tracking-wide">
            PACKET ROUTING COMPARISON
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            {/* Standard ISP */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-rose-500/20 backdrop-blur-md space-y-3">
              <span className="text-rose-400 font-bold uppercase block text-sm">Default Local ISP DNS Route</span>
              <div className="space-y-1.5 text-[#94A3B8]">
                <p>1. Free Fire queries <code className="text-[#F1F5F9] bg-white/[0.05] px-1.5 py-0.5 rounded">client.freefiremobile.com</code></p>
                <p>2. Query passes to congested ISP local exchange gateway</p>
                <p>3. ISP cache miss triggers iterative lookup across 3 upstream tiers</p>
                <p>4. Potential ISP transparent DNS redirection / telemetry injection</p>
                <p className="text-rose-400 font-bold pt-2">Result: 45ms – 110ms lookup latency + lobby jitter</p>
              </div>
            </div>

            {/* NEXORA Anycast */}
            <div className="p-6 rounded-2xl bg-[#00E5FF]/[0.04] border border-[#00E5FF]/30 backdrop-blur-md space-y-3">
              <span className="text-[#00E5FF] font-bold uppercase block text-sm">NEXORA Anycast Edge Route</span>
              <div className="space-y-1.5 text-[#94A3B8]">
                <p>1. Free Fire queries <code className="text-[#F1F5F9] bg-white/[0.05] px-1.5 py-0.5 rounded">client.freefiremobile.com</code> via DoH/DoT</p>
                <p>2. BGP Anycast routes to closest edge cluster in Asia-South</p>
                <p>3. Local edge memory cache delivers immediate record match</p>
                <p>4. Adware / tracker queries dropped without socket stalling</p>
                <p className="text-emerald-400 font-bold pt-2">Result: 2ms – 8ms lookup latency + clean packet stream</p>
              </div>
            </div>
          </div>
        </div>

        {/* Honest Limitations Callout */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
          <div className="text-xs text-[#94A3B8] leading-relaxed font-mono">
            <strong className="text-[#F1F5F9] block font-sans mb-1 uppercase tracking-wider">
              Network Realities & Disclaimer:
            </strong>
            {HONEST_DISCLAIMER.fullNotice}
          </div>
        </div>

        {/* CTA */}
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
