'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, ShieldAlert, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Will NEXORA DNS guarantee lower ping or auto-headshots in Free Fire?',
      a: 'No. Latency (ping) is governed by physical distance through fiber cables and your ISP’s routing agreements to Garena’s game servers. What NEXORA DNS provides is sub-5ms domain resolution times, elimination of local ISP DNS timeouts, and encrypted DoH/DoT transport. We strictly reject fake "headshot booster" or "zero ping" claims.',
    },
    {
      q: 'Can using NEXORA DNS get my Free Fire account banned?',
      a: 'Absolutely not. DNS is a foundational Internet protocol built into Android and iOS (like using Google DNS 8.8.8.8 or Cloudflare 1.1.1.1). It does not alter Free Fire APK/OBB files, inject memory code, or bypass anti-cheat mechanisms. It is 100% compliant with Free Fire fair-play terms.',
    },
    {
      q: 'Does NEXORA work on Android smartphones and tablets?',
      a: 'Yes! Android 9.0 through Android 15+ includes a native feature called "Private DNS" (DNS-over-TLS). You simply paste your assigned hostname into your phone settings once, and it automatically encrypts and accelerates Free Fire queries across mobile cellular data (Jazz, Zong, Telenor, Ufone) and Wi-Fi.',
    },
    {
      q: 'Does NEXORA work on iPhones and iPads?',
      a: 'Yes! On iOS 14.0 through iOS 18+, Apple provides native Encrypted DNS configuration profiles (.mobileconfig). We provide a digitally signed profile download that installs in two taps without any third-party VPN apps or jailbreak.',
    },
    {
      q: 'How quickly are Free Fire DNS credentials delivered after payment?',
      a: 'Instantly upon payment verification. If you choose our Sandbox mode or claim a Free Trial, delivery takes under 10 seconds. For manual Easypaisa / JazzCash payments, once the Transaction ID is verified, your dashboard immediately displays your assigned Private DNS hostnames and Apple profiles.',
    },
    {
      q: 'How do I pay with Easypaisa or JazzCash?',
      a: 'During guest checkout, select Easypaisa or JazzCash. Send the exact PKR amount to the displayed official account details, then paste your Transaction ID (TID) from the SMS receipt into the form. Our verification queue audits the transaction and unlocks your profile.',
    },
    {
      q: 'Do I need to install any third-party VPN apps?',
      a: 'No. NEXORA uses native operating system settings built into Android and iOS. This avoids battery drain and VPN detection flags during Free Fire ranked matches.',
    },
    {
      q: 'What is your refund policy?',
      a: 'If our DNS service fails to resolve domain names on your ISP network or experiences technical outages that our engineers cannot fix within 48 hours, you are entitled to a full replacement or refund under our terms.',
    },
  ];

  return (
    <div className="py-16 sm:py-20 min-h-screen relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        <div className="text-center space-y-3">
          <Badge variant="cyan" size="md">
            FREE FIRE FREQUENTLY ASKED QUESTIONS
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-[#F1F5F9] tracking-tight">
            KNOWLEDGE BASE & FAQ
          </h1>
          <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Clear, transparent answers to technical questions about Free Fire mobile DNS infrastructure, billing, and setup.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] overflow-hidden shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] transition-all hover:border-[#00E5FF]/30"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between text-sm sm:text-base font-bold text-[#F1F5F9] uppercase tracking-wide hover:bg-white/[0.03] transition-colors gap-3"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#00E5FF] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-5 sm:p-6 pt-0 text-xs sm:text-sm text-[#94A3B8] leading-relaxed border-t border-white/[0.06] font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions? */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] text-center space-y-4 shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
          <h3 className="text-lg font-bold text-[#F1F5F9] uppercase tracking-wide">Still Have Questions?</h3>
          <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
            Our network engineers are available to review your mobile ISP routing and device logs.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link href="/contact">
              <Button variant="primary" size="md">
                Open Support Ticket
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="outline" size="md">
                How It Works
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
