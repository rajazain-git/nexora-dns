'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { DEFAULT_SITE_CONFIG } from '@/lib/config';

export default function TermsPage() {
  return (
    <div className="py-16 sm:py-20 min-h-screen relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-sans relative z-10">
        
        <div>
          <Badge variant="cyan" size="sm" className="mb-2">
            LEGAL TERMS
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-[#F1F5F9] tracking-tight">
            TERMS OF SERVICE
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-1">
            Last Updated: January 2026 • {DEFAULT_SITE_CONFIG.brandName}
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] space-y-6 text-xs sm:text-sm text-[#94A3B8] leading-relaxed shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
          <section className="space-y-2">
            <h3 className="text-base font-bold uppercase text-[#F1F5F9] font-mono">1. Acceptance of Terms</h3>
            <p>
              By accessing or purchasing Free Fire DNS services from {DEFAULT_SITE_CONFIG.brandName}, you agree to comply with and be bound by these Terms of Service. If you do not agree, do not use our services.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold uppercase text-[#F1F5F9] font-mono">2. Nature of Service</h3>
            <p>
              {DEFAULT_SITE_CONFIG.brandName} provides encrypted domain name resolution services (DNS) utilizing Anycast edge routing, DNS-over-HTTPS (DoH), and DNS-over-TLS (DoT) configured specifically for Free Fire on mobile devices (Android and iOS). Our service accelerates domain resolution overhead and provides encrypted query transport.
            </p>
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-[#94A3B8] backdrop-blur-md">
              <strong className="text-[#00E5FF] block uppercase font-mono text-xs mb-1">Network Disclaimer:</strong> 
              {DEFAULT_SITE_CONFIG.brandName} does not guarantee reductions in in-game UDP tick ping or packet loss during active matches. Latency is fundamentally constrained by your Internet Service Provider&apos;s physical routing and physical distance to Garena&apos;s game servers.
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold uppercase text-[#F1F5F9] font-mono">3. Acceptable Use Policy</h3>
            <p>
              You agree not to use our DNS services to engage in distributed denial of service (DDoS) reflection attacks, unauthorized network penetration testing, or malicious traffic generation. Violation results in immediate license revocation without refund.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold uppercase text-[#F1F5F9] font-mono">4. Payments & Billing</h3>
            <p>
              All prices are listed in Pakistani Rupees (PKR) or United States Dollars (USD). Access durations are fixed periods (e.g., 30 days, 90 days, 365 days). We do not automatically renew or charge your payment method without explicit re-authorization.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
