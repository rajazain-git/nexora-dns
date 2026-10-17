import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DeviceCompatibilityChecker } from '@/components/compatibility/DeviceCompatibilityChecker';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, HelpCircle, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Device & Carrier Compatibility Matrix | Free Fire DNS',
  description: 'Verify native DNS protocol support for your Android or Apple iOS device. Check compatibility for Android Private DNS (DoT) and Apple DoH profiles across Jazz, Zong, Telenor, and Ufone.',
  alternates: {
    canonical: '/compatibility',
  },
};

export default function CompatibilityPage() {
  return (
    <div className="py-16 sm:py-24 min-h-screen relative overflow-hidden bg-[#080D1A]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="cyan" size="md">
            HARDWARE &amp; OS VERIFICATION
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-[#F1F5F9] tracking-tight">
            DEVICE COMPATIBILITY CHECKER
          </h1>
          <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed">
            Ensure your mobile phone natively supports encrypted DNS protocols before checkout. 
            NEXORA operates strictly on RFC-standard Android Private DNS and Apple DoH profiles—no third-party APKs, no VPN battery drain.
          </p>
        </div>

        {/* The Interactive Compatibility Checker Component */}
        <DeviceCompatibilityChecker />

        {/* Quick Nav Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF]">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-[#F1F5F9]">Compare Packages</h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Explore side-by-side technical specifications, validity durations, and pricing for Android and iOS packages.
            </p>
            <Link href="/compare" className="inline-flex items-center gap-1.5 text-xs text-[#00E5FF] hover:underline pt-1">
              <span>Open Comparison Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#A78BFA]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-[#F1F5F9]">Troubleshooting Center</h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Encountering &quot;Private DNS couldn&apos;t connect&quot; or profile activation errors? Walk through guided diagnostics.
            </p>
            <Link href="/troubleshoot" className="inline-flex items-center gap-1.5 text-xs text-[#8B5CF6] hover:underline pt-1">
              <span>Launch Guided Wizard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-[#F1F5F9]">Track Existing Order</h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Already purchased? Track your payment verification and access your encrypted DNS credentials securely.
            </p>
            <Link href="/track-order" className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline pt-1">
              <span>Track Guest Order</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
