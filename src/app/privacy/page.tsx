'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { DEFAULT_SITE_CONFIG } from '@/lib/config';

export default function PrivacyPolicyPage() {
  return (
    <div className="py-16 sm:py-20 min-h-screen relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-sans relative z-10">
        
        <div>
          <Badge variant="cyan" size="sm" className="mb-2">
            PRIVACY & ZERO-LOGGING
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-[#F1F5F9] tracking-tight">
            PRIVACY POLICY
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-1">
            Zero DNS Telemetry Policy • {DEFAULT_SITE_CONFIG.brandName}
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] space-y-6 text-xs sm:text-sm text-[#94A3B8] leading-relaxed shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
          <section className="space-y-2">
            <h3 className="text-base font-bold uppercase text-[#F1F5F9] font-mono">1. Zero DNS Query Logging</h3>
            <p>
              We operate an uncompromising zero-log DNS resolver infrastructure. We do NOT store, log, inspect, sell, or monetize domain names queried by your mobile devices. Query records exist purely in volatile RAM during the microseconds required to return the A/AAAA record, and are instantly discarded.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold uppercase text-[#F1F5F9] font-mono">2. Guest Checkout & Minimal Data Collection</h3>
            <p>
              Customers use frictionless guest checkout without mandatory passwords or account creation. When purchasing a Free Fire DNS configuration, we collect only minimal fulfillment details:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#94A3B8] font-mono text-xs">
              <li>Email address (for receipt and DNS credential delivery)</li>
              <li>Customer display name / Free Fire IGN</li>
              <li>WhatsApp or phone number (for payment verification & setup support)</li>
              <li>Payment verification records (Transaction IDs)</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold uppercase text-[#F1F5F9] font-mono">3. Security Standards</h3>
            <p>
              All customer sessions and DNS endpoints are secured using TLS 1.3 encryption. We do not store sensitive payment card details or CVV numbers on our servers; card operations are tokenized through licensed payment gateways.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
