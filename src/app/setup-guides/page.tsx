'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Smartphone, 
  ArrowRight, 
  Check, 
  ShieldCheck,
  Zap,
  Lock,
  Wifi
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DeviceCompatibilityChecker } from '@/components/compatibility/DeviceCompatibilityChecker';

export default function SetupGuidesHubPage() {
  const platforms = [
    {
      id: 'android',
      title: 'Android Private DNS Guide (Free Fire)',
      desc: 'Step-by-step setup for Samsung, Xiaomi, Poco, Infinix, Tecno, Realme, Vivo, and Google Pixel using native Android 9+ Private DNS (DoT).',
      time: '30 Seconds',
      devices: 'Samsung Galaxy, Redmi/Poco, Infinix, Tecno, Vivo, Oppo (Android 9.0 – 15+)',
      protocol: 'DNS-over-TLS (Port 853 Strict)',
      badge: 'Android Best Seller',
      href: '/setup-guides/android',
      color: 'cyan',
    },
    {
      id: 'ios',
      title: 'Apple iOS & iPadOS Guide (Free Fire)',
      desc: 'Step-by-step installation of the official signed Apple Encrypted DNS configuration profile (.mobileconfig) across Wi-Fi and 4G/5G mobile data.',
      time: '45 Seconds',
      devices: 'iPhone 11 through iPhone 16 Pro Max, iPad Pro, iPad Air (iOS 14.0 – 18+)',
      protocol: 'DNS-over-HTTPS (DoH TLS 1.3)',
      badge: 'Zero Third-Party Apps',
      href: '/setup-guides/ios',
      color: 'violet',
    },
  ];

  return (
    <div className="py-16 sm:py-20 min-h-screen relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="cyan" size="md">
            FREE FIRE MOBILE SETUP
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-[#F1F5F9] tracking-tight">
            MOBILE SETUP GUIDES
          </h1>
          <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed">
            Select your mobile operating system below for clear, native setup walkthroughs. Zero third-party VPN apps, zero root or jailbreak required, 100% compliant with Free Fire fair-play terms.
          </p>
        </div>

        {/* Guides Grid: Android and iOS Prominent Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {platforms.map((p) => {
            const isIos = p.color === 'violet';

            return (
              <div
                key={p.id}
                className={`p-8 rounded-3xl bg-white/[0.06] backdrop-blur-xl border ${
                  isIos ? 'border-white/[0.12] hover:border-[#8B5CF6]/60' : 'border-white/[0.12] hover:border-[#00E5FF]/60'
                } transition-all flex flex-col justify-between group shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] hover:-translate-y-1.5 duration-300 ${
                  isIos ? 'hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]' : 'hover:shadow-glow-cyan'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.12] backdrop-blur-md flex items-center justify-center ${
                      isIos ? 'text-[#C4B5FD]' : 'text-[#00E5FF]'
                    }`}>
                      <Smartphone className="w-8 h-8" />
                    </div>
                    <Badge variant={isIos ? 'violet' : 'cyan'} size="sm">
                      {p.badge}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-[#00E5FF] mb-2 font-bold">
                    <span>SETUP TIME: {p.time}</span>
                  </div>

                  <h3 className="text-xl font-bold text-[#F1F5F9] uppercase tracking-wide group-hover:text-[#00E5FF] transition-colors">
                    {p.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#94A3B8] mt-2.5 leading-relaxed">
                    {p.desc}
                  </p>

                  <div className="mt-6 space-y-2.5 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
                      <span className="text-[10px] text-[#94A3B8] uppercase block">Compatible Models:</span>
                      <span className="text-[#F1F5F9] text-[11px] font-bold">{p.devices}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
                      <span className="text-[10px] text-[#94A3B8] uppercase block">Protocol:</span>
                      <span className={`text-[11px] font-bold ${isIos ? 'text-[#8B5CF6]' : 'text-[#00E5FF]'}`}>{p.protocol}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-white/[0.08]">
                  <Link href={p.href}>
                    <Button variant={isIos ? 'violet' : 'primary'} size="md" className="w-full">
                      <span>Open {isIos ? 'iOS' : 'Android'} Guide</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Device Compatibility Engine */}
        <div className="space-y-4">
          <DeviceCompatibilityChecker />
        </div>

        {/* Free Fire Fair Play Compliance Notice */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] space-y-3 shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-[#F1F5F9] uppercase tracking-wide">
              100% Anti-Cheat Compliant
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
            Changing your DNS on Android or iOS is a standard network setting that merely resolves domain names (like using Google DNS or Cloudflare). It does NOT alter Free Fire game APK/OBB files, memory values, or packet payloads. You will never face anti-cheat or fair play penalties by using NEXORA DNS.
          </p>
        </div>

      </div>
    </div>
  );
}
