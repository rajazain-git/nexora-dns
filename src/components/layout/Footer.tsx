'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '../ui/Logo';
import { Badge } from '../ui/Badge';
import { MessageSquare, Shield, HelpCircle, ArrowUpRight, Phone, Send } from 'lucide-react';
import { DEFAULT_SITE_CONFIG, HONEST_DISCLAIMER } from '@/lib/config';
import { useSiteConfig } from '@/context/SiteConfigContext';

export function Footer() {
  const { settings } = useSiteConfig();
  const whatsappNum = settings.content?.whatsappNumber || settings.whatsappNumber || DEFAULT_SITE_CONFIG.whatsappNumber;
  const discordLink = settings.content?.discordUrl || settings.discordUrl || DEFAULT_SITE_CONFIG.discordUrl;
  const telegramLink = settings.content?.telegramUrl || "https://t.me/nexoradns";
  return (
    <footer className="bg-[#080D1A]/90 backdrop-blur-2xl border-t border-white/[0.10] relative pt-16 pb-12 overflow-hidden shadow-[0_-8px_32px_0_rgba(0,0,0,0.37)]">
      {/* Background technical grid & subtle glow */}
      <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#00E5FF]/[0.05] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-0 w-96 h-96 rounded-full bg-[#8B5CF6]/[0.05] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/[0.08]">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" showTagline={true} />
            <p className="text-xs text-[#94A3B8] max-w-sm leading-relaxed">
              High-performance gaming DNS infrastructure engineered for competitive multiplayer environments. Clean BGP Anycast routing, DoH/DoT TLS 1.3 encryption, and localized edge caching nodes.
            </p>

            {/* Live Operational Status */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.12] backdrop-blur-md text-[11px] font-mono text-[#00E5FF] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)]">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] animate-pulse" />
              <span>ALL 28 ANYCAST CLUSTERS OPERATIONAL</span>
            </div>

            {/* Social / Direct Channels */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.12] hover:border-emerald-500/40 text-xs font-mono text-emerald-400 transition-all backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Support</span>
              </a>
              <a
                href={discordLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.12] hover:border-[#8B5CF6]/50 text-xs font-mono text-[#A78BFA] transition-all backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Discord Community</span>
              </a>
            </div>
          </div>

          {/* Column 2: Products */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F1F5F9] font-mono mb-4">
              Free Fire Mobile DNS
            </h4>
            <ul className="space-y-2.5 text-xs text-[#94A3B8]">
              <li>
                <Link href="/store?platform=android" className="hover:text-[#00E5FF] transition-colors">
                  Android Free Fire Elite (30d)
                </Link>
              </li>
              <li>
                <Link href="/store?platform=android" className="hover:text-[#00E5FF] transition-colors">
                  Android Season Pass (90d)
                </Link>
              </li>
              <li>
                <Link href="/store?platform=ios" className="hover:text-[#00E5FF] transition-colors">
                  Apple iOS Free Fire Pro (30d)
                </Link>
              </li>
              <li>
                <Link href="/store?platform=ios" className="hover:text-[#00E5FF] transition-colors">
                  Apple iOS Season Pass (90d)
                </Link>
              </li>
              <li>
                <Link href="/store?platform=android" className="text-[#00E5FF] hover:underline">
                  Android 72h Free Trial
                </Link>
              </li>
              <li>
                <Link href="/store?platform=ios" className="text-[#8B5CF6] hover:underline">
                  Apple iOS 72h Free Trial
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Setup & Guides */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F1F5F9] font-mono mb-4">
              Mobile Setup & Tools
            </h4>
            <ul className="space-y-2.5 text-xs text-[#94A3B8]">
              <li>
                <Link href="/compatibility" className="text-[#00E5FF] font-semibold hover:underline">
                  Device Compatibility Checker
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-[#00E5FF] transition-colors">
                  Package Comparison Lab
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-[#00E5FF] transition-colors">
                  Track My Order (Guest)
                </Link>
              </li>
              <li>
                <Link href="/troubleshoot" className="hover:text-[#00E5FF] transition-colors">
                  Troubleshooting Center
                </Link>
              </li>
              <li>
                <Link href="/setup-guides/android" className="hover:text-[#00E5FF] transition-colors">
                  Android Private DNS Guide
                </Link>
              </li>
              <li>
                <Link href="/setup-guides/ios" className="hover:text-[#00E5FF] transition-colors">
                  Apple iOS Profile Guide
                </Link>
              </li>
              <li>
                <Link href="/ping-test" className="text-[#00E5FF] hover:underline">
                  Edge Route Latency Test
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Governance & Policies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F1F5F9] font-mono mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-[#94A3B8]">
              <li>
                <Link href="/about" className="hover:text-[#00E5FF] transition-colors">
                  About NEXORA
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#00E5FF] transition-colors">
                  Support & Tickets
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#00E5FF] transition-colors">
                  Technical FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#00E5FF] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#00E5FF] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#00E5FF] transition-colors">
                  Refund & Dispute Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Honest Disclosure Callout */}
        <div className="my-8 p-4.5 rounded-2xl bg-white/[0.04] border border-white/[0.10] backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-[11px] text-[#94A3B8] leading-relaxed">
            <strong className="text-[#F1F5F9]">Engineering Transparency:</strong> {HONEST_DISCLAIMER.shortNotice}
          </p>
        </div>

        {/* Bottom credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8] font-mono">
          <div>
            © {new Date().getFullYear()} {DEFAULT_SITE_CONFIG.brandName}. All Rights Reserved. Engineered for network infrastructure reliability.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#00E5FF]">TLS 1.3 ENCRYPTION</span>
            <span>•</span>
            <span className="text-[#8B5CF6]">BGP ANYCAST EDGE</span>
            <span>•</span>
            <span>ZERO LOGGING</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
