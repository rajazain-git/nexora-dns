'use client';

import React from 'react';
import Link from 'next/link';
import { Smartphone, ArrowLeft, ArrowRight, ShieldCheck, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function IosGuidePage() {
  return (
    <div className="py-16 sm:py-20 min-h-screen relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
          <Link href="/setup-guides" className="hover:text-[#00E5FF] flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Setup Guides</span>
          </Link>
          <span>/</span>
          <span className="text-[#F1F5F9]">Apple iOS Guide</span>
        </div>

        <div>
          <Badge variant="violet" size="sm" className="mb-2">
            iOS 14.0+ NATIVE ENCRYPTED DOH
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-[#F1F5F9] tracking-tight">
            FREE FIRE APPLE IOS SETUP GUIDE (IPHONE & IPAD)
          </h1>
          <p className="text-[#94A3B8] text-xs sm:text-sm mt-2">
            Configure native Apple DNS over HTTPS (.mobileconfig) across Wi-Fi and 4G/5G mobile data for Free Fire with zero battery drain.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              step: '1',
              title: 'Open Safari & Access Customer Dashboard',
              desc: 'Open Safari on your iPhone and log in to your NEXORA Customer Dashboard.',
            },
            {
              step: '2',
              title: 'Download the Signed Apple Configuration Profile',
              desc: 'Under your active package, tap "Download iOS Profile (.mobileconfig)". Safari will show a prompt: "This website is trying to download a configuration profile. Do you want to allow this?" Tap Allow.',
            },
            {
              step: '3',
              title: 'Open iOS Settings > Profile Downloaded',
              desc: 'Go to your iPhone home screen, open Settings. Right near the top, tap "Profile Downloaded" (or go to General > VPN & Device Management).',
            },
            {
              step: '4',
              title: 'Tap Install & Confirm Passcode',
              desc: 'Tap Install in the top right corner. Enter your device passcode and confirm installation.',
            },
            {
              step: '5',
              title: 'Finished: Verified Native Encryption',
              desc: 'Go to Settings > General > VPN & Device Management > DNS. You will see NEXORA Free Fire DNS selected as the active provider.',
            },
          ].map((item) => (
            <div 
              key={item.step} 
              className="p-6 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] flex gap-4 items-start shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] hover:border-[#8B5CF6]/30 transition-all"
            >
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] text-white font-mono font-black text-sm flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.35)]">
                {item.step}
              </span>
              <div>
                <h3 className="text-base font-bold text-[#F1F5F9] uppercase tracking-wide">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Verification Callout */}
        <div className="p-6 rounded-2xl bg-[#8B5CF6]/[0.05] backdrop-blur-xl border border-[#8B5CF6]/30 flex items-start gap-4 shadow-glass-strong">
          <ShieldCheck className="w-6 h-6 text-[#8B5CF6] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#94A3B8] font-mono">
            <strong className="text-[#F1F5F9] block font-sans mb-1 uppercase tracking-wide">Automatic iOS Integration:</strong>
            Apple iOS applies encrypted DNS natively at the Darwin kernel network stack level. No background VPN apps are running, meaning 0% extra battery drain and full compatibility with in-game Free Fire tournaments.
          </div>
        </div>

        <div className="pt-4 flex justify-between items-center">
          <Link href="/setup-guides">
            <Button variant="secondary" size="md">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back to Guides</span>
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="violet" size="md">
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
