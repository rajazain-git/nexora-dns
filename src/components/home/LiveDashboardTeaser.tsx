'use client';

import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Wifi, Smartphone, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/Badge';
import { useToast } from '@/context/ToastContext';

export function LiveDashboardTeaser() {
  const { showToast } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>('android');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast({
      type: 'success',
      title: 'Copied to Clipboard',
      message: `${label} copied successfully.`,
      duration: 2500,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="relative rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] overflow-hidden max-w-4xl mx-auto">
      {/* Top Window Bar */}
      <div className="px-5 py-3.5 bg-white/[0.04] border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]/70" />
          <span className="text-[11px] font-mono text-[#94A3B8] ml-2">
            gateway.nexoradns.com/freefire-edge
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="cyan" size="sm" dot>
            FREE FIRE MOBILE ANYCAST
          </Badge>
        </div>
      </div>

      {/* Main Preview Content */}
      <div className="p-6 sm:p-8 space-y-6">
        
        {/* User Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00E5FF] uppercase tracking-wider font-bold">
                Active Free Fire Profile
              </span>
              <span className="text-[10px] font-mono text-[#94A3B8]">ID: FF-MOBILE-ANYCAST-01</span>
            </div>
            <h3 className="text-lg font-bold text-[#F1F5F9] tracking-wide mt-0.5">
              NEXORA Free Fire Edge Route
            </h3>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-[#94A3B8] block">Resolution Status</span>
              <span className="text-xs font-mono font-bold text-emerald-400">OPTIMIZED (30 Days)</span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          </div>
        </div>

        {/* Device Switcher Tabs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-mono text-[#94A3B8] tracking-wider font-medium">
              Free Fire Supported Mobile Platforms:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setActiveTab('android')}
              className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all backdrop-blur-md ${
                activeTab === 'android'
                  ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-[#F1F5F9] shadow-glow-cyan'
                  : 'bg-white/[0.04] border-white/[0.08] text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.12] flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4 text-[#00E5FF]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold leading-tight uppercase">Android Devices</p>
                <p className="text-[10px] text-[#94A3B8] font-mono">Native Private DNS (Port 853 DoT)</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('ios')}
              className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all backdrop-blur-md ${
                activeTab === 'ios'
                  ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-[#F1F5F9] shadow-glow-violet'
                  : 'bg-white/[0.04] border-white/[0.08] text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.12] flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4 text-[#8B5CF6]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold leading-tight uppercase">Apple iOS (iPhone & iPad)</p>
                <p className="text-[10px] text-[#94A3B8] font-mono">Signed Encrypted Profile (DoH)</p>
              </div>
            </button>
          </div>
        </div>

        {/* Credentials Readout Panels */}
        <div className="space-y-3 font-mono text-xs">
          {activeTab === 'android' ? (
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between gap-3 backdrop-blur-md">
              <div className="min-w-0">
                <span className="text-[10px] uppercase text-[#94A3B8] block mb-0.5">
                  Free Fire Android Private DNS Hostname:
                </span>
                <span className="text-[#00E5FF] font-bold text-sm tracking-wide">
                  ff-android.pk.nexoradns.com
                </span>
              </div>
              <button
                onClick={() => copyToClipboard('ff-android.pk.nexoradns.com', 'Private DNS Hostname')}
                className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-[#00E5FF]/20 border border-white/[0.12] text-[#F1F5F9] flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {copiedField === 'Private DNS Hostname' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#00E5FF]" />}
                <span className="text-[11px] font-sans font-bold">Copy</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between gap-3 backdrop-blur-md">
              <div className="min-w-0">
                <span className="text-[10px] uppercase text-[#94A3B8] block mb-0.5">
                  Apple iOS Signed MobileConfig Profile (DoH):
                </span>
                <span className="text-[#C4B5FD] font-bold text-sm tracking-wide truncate block">
                  https://doh.nexoradns.com/profiles/nexora-ff-ios.mobileconfig
                </span>
              </div>
              <button
                onClick={() => copyToClipboard('https://doh.nexoradns.com/profiles/nexora-ff-ios.mobileconfig', 'iOS Profile URL')}
                className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-[#8B5CF6]/20 border border-white/[0.12] text-[#F1F5F9] flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {copiedField === 'iOS Profile URL' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#8B5CF6]" />}
                <span className="text-[11px] font-sans font-bold">Copy</span>
              </button>
            </div>
          )}

          {/* DoH Encrypted Endpoint URL */}
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between gap-3 backdrop-blur-md">
            <div className="min-w-0">
              <span className="text-[10px] uppercase text-[#94A3B8] block mb-0.5">
                Free Fire Encrypted DNS-Over-HTTPS (DoH) Endpoint:
              </span>
              <span className="text-[#94A3B8] text-xs truncate block font-mono">
                https://doh.nexoradns.com/freefire/v1?key=NX-FREEFIRE-MOBILE
              </span>
            </div>
            <button
              onClick={() => copyToClipboard('https://doh.nexoradns.com/freefire/v1?key=NX-FREEFIRE-MOBILE', 'DoH URL')}
              className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-[#00E5FF]/20 border border-white/[0.12] text-[#F1F5F9] flex items-center gap-1.5 shrink-0 transition-colors"
            >
              {copiedField === 'DoH URL' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#00E5FF]" />}
              <span className="text-[11px] font-sans font-bold">Copy</span>
            </button>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#94A3B8] border-t border-white/[0.08]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted via TLS 1.3 • Zero VPN Battery Drain • Free Fire Fair-Play</span>
          </div>

          <Link
            href="/dashboard"
            className="text-[#00E5FF] hover:text-[#38EFFF] font-bold font-mono inline-flex items-center gap-1 group text-xs"
          >
            <span>Open Customer Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
