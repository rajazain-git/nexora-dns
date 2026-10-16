'use client';

import React from 'react';
import { Shield, Zap, Globe, Lock, Cpu, Server, Layers, Gauge } from 'lucide-react';

export function FeaturesGrid() {
  const features = [
    {
      icon: <Globe className="w-6 h-6 text-[#00E5FF]" />,
      title: "Geo-Intelligent BGP Anycast",
      desc: "Queries are automatically directed through BGP Anycast routes to the closest physical server rack in Pakistan, UAE, or Singapore.",
      metric: "Anycast BGP v4",
    },
    {
      icon: <Lock className="w-6 h-6 text-[#8B5CF6]" />,
      title: "Strict TLS 1.3 DoH & DoT",
      desc: "DNS over HTTPS and DNS over TLS protocols safeguard your queries from local network inspection and ISP packet tampering.",
      metric: "TLS 1.3 Strict",
    },
    {
      icon: <Zap className="w-6 h-6 text-[#00E5FF]" />,
      title: "Zero ISP Redirection",
      desc: "Bypasses overloaded carrier caches that force DNS queries through convoluted regional hops before reaching game clusters.",
      metric: "Direct Peering",
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      title: "Adware & Telemetry Scrubbing",
      desc: "Silently drops non-essential telemetry packets and ad network calls, preserving your uplink queue for critical match state ticks.",
      metric: "Zero Bloat",
    },
    {
      icon: <Cpu className="w-6 h-6 text-[#8B5CF6]" />,
      title: "Dedicated Mobile OS Integration",
      desc: "Supported natively across Android Private DNS (DoT Port 853) and Apple iOS configuration profiles (DoH TLS 1.3). Zero third-party apps required.",
      metric: "Android & iOS Native",
    },
    {
      icon: <Gauge className="w-6 h-6 text-[#00E5FF]" />,
      title: "Automated Self-Service Delivery",
      desc: "Immediate credentials allocation and step-by-step setup guides unlock in your dashboard within 60 seconds of verified payment.",
      metric: "Automated Edge",
    },
  ];

  return (
    <section className="py-24 bg-[#080D1A] border-t border-white/[0.10] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] font-bold">
              NETWORK ARCHITECTURE
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-[#F1F5F9] tracking-tight">
            ENGINEERED FOR LOW-OVERHEAD ROUTING
          </h2>
          <p className="text-[#94A3B8] text-sm sm:text-base mt-2">
            Enterprise DNS infrastructure stripped of marketing fluff and fine-tuned for high-frequency multiplayer lookup reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="p-7 sm:p-8 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] hover:border-[#00E5FF]/45 shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.14)] hover:shadow-glow-cyan hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white/[0.08] border border-white/[0.12] backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-[#F1F5F9] uppercase tracking-wide group-hover:text-[#00E5FF] transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-2.5 leading-relaxed">
                  {f.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#94A3B8] uppercase">Standard:</span>
                <span className="text-[#00E5FF] font-bold bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.08]">{f.metric}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
