'use client';

import React from 'react';
import Link from 'next/link';
import { Smartphone, Check, ArrowLeft, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function AndroidGuidePage() {
  return (
    <div className="py-16 sm:py-20 min-h-screen relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
          <Link href="/setup-guides" className="hover:text-[#00E5FF] flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Setup Guides</span>
          </Link>
          <span>/</span>
          <span className="text-[#F1F5F9]">Android Private DNS</span>
        </div>

        <div>
          <Badge variant="cyan" size="sm" className="mb-2">
            ANDROID 9.0+ NATIVE
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-[#F1F5F9] tracking-tight">
            ANDROID PRIVATE DNS SETUP GUIDE
          </h1>
          <p className="text-[#94A3B8] text-xs sm:text-sm mt-2">
            Configures native DNS-over-TLS (DoT) system-wide on both Wi-Fi and mobile data (Jazz, Zong, Telenor, Ufone).
          </p>
        </div>

        {/* Step-by-step instructions */}
        <div className="space-y-4">
          {[
            {
              step: '1',
              title: 'Open Settings on Your Android Device',
              desc: 'Swipe down your notification shade or tap the Settings gear icon from your app drawer.',
            },
            {
              step: '2',
              title: 'Navigate to Network & Internet',
              desc: 'Depending on your phone brand: On Samsung go to "Connections > More connection settings". On Xiaomi/Poco go to "Connection & sharing". On Vivo/Oppo/Realme go to "Other networks & connections".',
            },
            {
              step: '3',
              title: 'Tap on Private DNS',
              desc: 'Select "Private DNS". By default, it is set to "Automatic" or "Off".',
            },
            {
              step: '4',
              title: 'Select "Private DNS provider hostname"',
              desc: 'Select the third option ("Designated Private DNS" or "Private DNS provider hostname").',
            },
            {
              step: '5',
              title: 'Enter Your Assigned Free Fire Hostname & Save',
              desc: 'Enter the hostname shown in your Customer Dashboard (e.g. ff-android.pk.nexoradns.com) and tap Save.',
            },
          ].map((item) => (
            <div 
              key={item.step} 
              className="p-6 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] flex gap-4 items-start shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] hover:border-[#00E5FF]/30 transition-all"
            >
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#00A3FF] text-[#080D1A] font-mono font-black text-sm flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,229,255,0.35)]">
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
        <div className="p-6 rounded-2xl bg-[#00E5FF]/[0.05] backdrop-blur-xl border border-[#00E5FF]/30 flex items-start gap-4 shadow-glass-strong">
          <ShieldCheck className="w-6 h-6 text-[#00E5FF] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#94A3B8] font-mono">
            <strong className="text-[#F1F5F9] block font-sans mb-1 uppercase tracking-wide">How to verify it works:</strong>
            Under Private DNS, your phone will say &quot;Connected&quot; beneath the hostname. If it says &quot;Couldn&apos;t connect&quot;, verify your internet connection or check your hostname spelling in the dashboard.
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
            <Button variant="primary" size="md">
              <span>View Your Hostname</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
