'use client';

import React from 'react';
import Link from 'next/link';
import { Smartphone, ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function WindowsGuidePage() {
  return (
    <div className="py-20 min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 text-center space-y-6 relative z-10 p-8 sm:p-10 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
        
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/[0.12] text-[#00E5FF] mx-auto backdrop-blur-md">
          <Smartphone className="w-8 h-8" />
        </div>

        <Badge variant="cyan" size="md">
          FREE FIRE MOBILE EXCLUSIVE
        </Badge>

        <h1 className="text-2xl sm:text-4xl font-black uppercase text-[#F1F5F9] tracking-tight">
          MOBILE DNS NOTICE
        </h1>

        <p className="text-sm text-[#94A3B8] leading-relaxed">
          NEXORA DNS is engineered exclusively for Free Fire mobile players on compatible <strong>Android</strong> and <strong>Apple iOS</strong> smartphones and tablets. We do not provide PC or general-purpose desktop DNS packages.
        </p>

        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <Link href="/setup-guides/android">
            <Button variant="primary" size="md">
              <span>Android Free Fire Guide</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>

          <Link href="/setup-guides/ios">
            <Button variant="violet" size="md">
              <span>Apple iOS Guide</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
