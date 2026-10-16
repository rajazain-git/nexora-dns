'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DEFAULT_SITE_CONFIG } from '@/lib/config';

export default function RefundPolicyPage() {
  return (
    <div className="py-16 sm:py-20 min-h-screen relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-sans relative z-10">
        
        <div>
          <Badge variant="cyan" size="sm" className="mb-2">
            CONSUMER PROTECTION
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-[#F1F5F9] tracking-tight">
            REFUND & REPLACEMENT POLICY
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-1">
            Fair Dispute Resolution • {DEFAULT_SITE_CONFIG.brandName}
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] space-y-6 text-xs sm:text-sm text-[#94A3B8] leading-relaxed shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
          <section className="space-y-2">
            <h3 className="text-base font-bold uppercase text-[#F1F5F9] font-mono">1. Eligibility for Refunds</h3>
            <p>
              We want all Free Fire players to have a dependable, verified experience. You are eligible for a replacement DNS profile or a full refund if:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-[#94A3B8] font-mono text-xs">
              <li>Our DNS resolvers fail to respond or resolve domain names on your mobile network.</li>
              <li>You experience an unresolvable server failure verified by our engineering team within 48 hours of purchase.</li>
              <li>You were charged twice due to a payment processing glitch.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold uppercase text-[#F1F5F9] font-mono">2. Non-Refundable Scenarios</h3>
            <p>
              Because we are transparent regarding physical network constraints:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-[#94A3B8] font-mono text-xs">
              <li>Refunds are not granted because in-game Free Fire matchmaking routed you to a distant regional server (e.g. Middle East vs Singapore).</li>
              <li>Refunds are not granted due to local device antenna faults or nationwide submarine cable disruptions.</li>
              <li>Violations of acceptable use policies void all refund eligibility.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold uppercase text-[#F1F5F9] font-mono">3. How to Request a Refund</h3>
            <p>
              Simply open a support ticket from your Customer Dashboard or contact us via WhatsApp with your Order ID and description of the technical issue. Our team reviews all requests within 24 to 48 hours.
            </p>
          </section>

          <div className="pt-4 border-t border-white/[0.08] flex flex-wrap gap-3">
            <Link href="/contact">
              <Button variant="primary" size="sm">
                Submit Refund Request
              </Button>
            </Link>
            <Link href="/store">
              <Button variant="secondary" size="sm">
                Explore Store
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
