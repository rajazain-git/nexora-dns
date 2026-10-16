'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Smartphone, 
  Shield, 
  Zap, 
  ChevronRight, 
  Activity, 
  Wifi, 
  Lock,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { NetworkVisual } from './NetworkVisual';
import { useSiteConfig } from '@/context/SiteConfigContext';

export function HeroSection() {
  const { homepage } = useSiteConfig();
  const heroHeadline = homepage?.heroHeadline || "FREE FIRE MOBILE DNS. BUILT FOR YOUR DEVICE.";
  const heroSubheadline = homepage?.heroSubheadline || "Explore dedicated DNS configuration packages for compatible Android and iOS devices, with clear setup guides and secure order delivery.";
  const heroAndroidCta = homepage?.heroAndroidCta || "EXPLORE ANDROID DNS";
  const heroIosCta = homepage?.heroIosCta || "EXPLORE iOS DNS";
  const heroBadgeText = homepage?.heroBadgeText || "GARENA FREE FIRE MOBILE ROUTING • ANDROID & iOS COMPATIBLE";
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center pt-8 pb-24 overflow-hidden bg-[#080D1A]">
      {/* Background Interactive Canvas and Subtle Data Streams */}
      <NetworkVisual />

      {/* Thin Technical Grid Background */}
      <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />

      {/* Ambient Luminous Glow Gradients (Cyan & Violet) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] bg-[#00E5FF]/[0.06] blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[400px] bg-[#8B5CF6]/[0.06] blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[350px] bg-[#00E5FF]/[0.04] blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Top Tag & Trust Pill */}
        <div className="flex flex-col items-center text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.12] backdrop-blur-xl text-xs font-mono text-[#94A3B8] shadow-glass"
          >
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] animate-pulse" />
            <span className="font-bold tracking-wider text-[#F1F5F9]">{heroBadgeText}</span>
          </motion.div>
        </div>

        {/* Main Headline & Supporting Text */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#F1F5F9] leading-[1.08] font-sans"
          >
            FREE FIRE MOBILE DNS.{' '}
            <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#5CEBFF] to-[#8B5CF6] drop-shadow-[0_0_35px_rgba(0,229,255,0.45)]">
              BUILT FOR YOUR DEVICE.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-[#94A3B8] max-w-3xl mx-auto leading-relaxed font-normal"
          >
            {heroSubheadline}
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <Link href="/store?platform=android">
              <Button variant="primary" size="lg" className="min-w-[230px]">
                <Smartphone className="w-4 h-4 mr-2" />
                <span>{heroAndroidCta}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Link href="/store?platform=ios">
              <Button variant="violet" size="lg" className="min-w-[230px]">
                <Smartphone className="w-4 h-4 mr-2" />
                <span>{heroIosCta}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Honest Technical Capabilities Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-[#94A3B8]"
          >
            <div className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.12] backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)]">
              <Zap className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span className="text-[#F1F5F9]">ANDROID PRIVATE DNS (DoT)</span>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.12] backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)]">
              <Shield className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span className="text-[#F1F5F9]">APPLE SIGNED PROFILE (DoH)</span>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.12] backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[#F1F5F9]">ZERO VPN APPS • ZERO BATTERY DRAIN</span>
            </div>
          </motion.div>
        </div>

        {/* 2 PRIMARY CATEGORY CARDS IN TRANSLUCENT GLASS (Requirement 3) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-14 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Card 1: Android DNS */}
          <div className="rounded-3xl p-7 sm:p-8 bg-white/[0.06] backdrop-blur-2xl border border-white/[0.14] hover:border-[#00E5FF]/50 shadow-[0_12px_40px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.18)] hover:shadow-glow-cyan transition-all duration-300 relative group overflow-hidden flex flex-col justify-between">
            {/* Ambient Cyan Aura */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#00E5FF]/10 blur-[60px] pointer-events-none rounded-full group-hover:scale-125 transition-transform duration-500" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <Badge variant="cyan" size="md" dot>
                  ANDROID PRIVATE DNS
                </Badge>
                <span className="text-[11px] font-mono text-[#00E5FF] font-bold">
                  DoT PORT 853
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#F1F5F9] group-hover:text-[#00E5FF] transition-colors">
                Android Free Fire DNS
              </h2>

              <p className="text-xs sm:text-sm text-[#94A3B8] mt-2.5 leading-relaxed">
                Direct carrier-bypassing DNS-over-TLS edge routing engineered natively for Samsung, Xiaomi, Poco, Infinix, Tecno & Realme smartphones.
              </p>

              {/* Glass Feature Points */}
              <div className="mt-6 space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
                  <span className="text-[#94A3B8]">Encryption Protocol</span>
                  <span className="text-[#F1F5F9] font-bold">Strict TLS 1.3 / DoT</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
                  <span className="text-[#94A3B8]">Setup Method</span>
                  <span className="text-[#00E5FF] font-bold">Android 9+ Settings</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
                  <span className="text-[#94A3B8]">Carrier Support</span>
                  <span className="text-emerald-400 font-bold">Jazz, Zong, Nayatel, PTCL</span>
                </div>
              </div>
            </div>

            <div className="mt-7 pt-5 border-t border-white/[0.10] flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#94A3B8] block uppercase">Starting From</span>
                <span className="text-xl font-black text-[#F1F5F9] font-mono">Rs. 350 <span className="text-xs text-[#94A3B8] font-normal">/ month</span></span>
              </div>
              <Link href="/store?platform=android">
                <Button variant="primary" size="md">
                  <span>Configure Android</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Card 2: Apple iOS DNS */}
          <div className="rounded-3xl p-7 sm:p-8 bg-white/[0.06] backdrop-blur-2xl border border-white/[0.14] hover:border-[#8B5CF6]/50 shadow-[0_12px_40px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.18)] hover:shadow-glow-violet transition-all duration-300 relative group overflow-hidden flex flex-col justify-between">
            {/* Ambient Violet Aura */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#8B5CF6]/10 blur-[60px] pointer-events-none rounded-full group-hover:scale-125 transition-transform duration-500" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <Badge variant="violet" size="md" dot>
                  APPLE SIGNED PROFILE
                </Badge>
                <span className="text-[11px] font-mono text-[#C4B5FD] font-bold">
                  DoH HTTPS
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#F1F5F9] group-hover:text-[#A78BFA] transition-colors">
                Apple iOS Free Fire DNS
              </h2>

              <p className="text-xs sm:text-sm text-[#94A3B8] mt-2.5 leading-relaxed">
                Custom signed <code className="text-[#C4B5FD]">.mobileconfig</code> payload for iPhone and iPad with encrypted DNS over HTTPS and zero mobile ad telemetry.
              </p>

              {/* Glass Feature Points */}
              <div className="mt-6 space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
                  <span className="text-[#94A3B8]">Encryption Protocol</span>
                  <span className="text-[#F1F5F9] font-bold">DoH HTTPS TLS 1.3</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
                  <span className="text-[#94A3B8]">Setup Method</span>
                  <span className="text-[#C4B5FD] font-bold">One-Tap Profile Install</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
                  <span className="text-[#94A3B8]">Compatibility</span>
                  <span className="text-emerald-400 font-bold">iPhone 8 to 16 Pro Max</span>
                </div>
              </div>
            </div>

            <div className="mt-7 pt-5 border-t border-white/[0.10] flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#94A3B8] block uppercase">Starting From</span>
                <span className="text-xl font-black text-[#F1F5F9] font-mono">Rs. 450 <span className="text-xs text-[#94A3B8] font-normal">/ month</span></span>
              </div>
              <Link href="/store?platform=ios">
                <Button variant="violet" size="md">
                  <span>Configure Apple iOS</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Clean Glassmorphic Device HUD Enclosure */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <div className="relative p-1 rounded-3xl bg-gradient-to-b from-[#00E5FF]/25 via-white/[0.12] to-[#8B5CF6]/20 shadow-[0_16px_50px_rgba(0,0,0,0.45)]">
            
            {/* Phone Bezel Glass Enclosure */}
            <div className="rounded-[22px] bg-[#0A101F]/90 backdrop-blur-2xl border border-white/[0.12] p-6 sm:p-8 overflow-hidden relative shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
              
              {/* Subtle Ambient Illumination */}
              <div className="absolute top-0 right-1/4 w-60 h-60 bg-[#00E5FF]/10 blur-[80px] pointer-events-none rounded-full" />
              <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-[#8B5CF6]/10 blur-[80px] pointer-events-none rounded-full" />

              {/* Header Status Bar Inside Smartphone */}
              <div className="flex items-center justify-between border-b border-white/[0.10] pb-4 mb-6 text-xs font-mono">
                <div className="flex items-center gap-2 text-[#F1F5F9]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] animate-pulse" />
                  <span className="font-bold tracking-wider">NEXORA TELEMETRY HUD</span>
                  <span className="text-white/20">|</span>
                  <span className="text-[#94A3B8]">FREE FIRE MOBILE</span>
                </div>

                <div className="flex items-center gap-3 text-[#94A3B8]">
                  <span className="hidden sm:inline">LTE / 5G / Wi-Fi</span>
                  <Wifi className="w-4 h-4 text-[#00E5FF]" />
                  <Lock className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              {/* Active DNS Route Telemetry Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs mb-6">
                
                {/* Node 1: Garena Matchmaker Edge */}
                <div className="p-4.5 rounded-2xl bg-white/[0.04] border border-white/[0.10] backdrop-blur-md space-y-2 relative overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#94A3B8] uppercase">Game Target</span>
                    <span className="text-[10px] text-[#00E5FF] font-bold">OPTIMIZED</span>
                  </div>
                  <p className="text-sm font-bold text-[#F1F5F9]">freefiremobile.com</p>
                  <p className="text-[11px] text-[#94A3B8]">Garena Asia-South & Singapore Cluster</p>
                  <div className="pt-2 flex items-center justify-between text-[11px] border-t border-white/[0.08]">
                    <span className="text-[#94A3B8]">Lookup Latency:</span>
                    <span className="text-emerald-400 font-bold">&lt; 5 ms (Edge RAM)</span>
                  </div>
                </div>

                {/* Node 2: Android Private DNS */}
                <div className="p-4.5 rounded-2xl bg-white/[0.04] border border-[#00E5FF]/25 backdrop-blur-md space-y-2 relative overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#94A3B8] uppercase">Android Engine</span>
                    <span className="text-[10px] text-[#00E5FF] font-bold">DoT PORT 853</span>
                  </div>
                  <p className="text-sm font-bold text-[#F1F5F9]">ff-android.pk.nexoradns.com</p>
                  <p className="text-[11px] text-[#94A3B8]">Native OS Settings (Samsung, Xiaomi, Vivo)</p>
                  <div className="pt-2 flex items-center justify-between text-[11px] border-t border-white/[0.08]">
                    <span className="text-[#94A3B8]">Encryption:</span>
                    <span className="text-[#00E5FF] font-bold">Strict TLS 1.3</span>
                  </div>
                </div>

                {/* Node 3: Apple iOS Profile */}
                <div className="p-4.5 rounded-2xl bg-white/[0.04] border border-[#8B5CF6]/25 backdrop-blur-md space-y-2 relative overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#94A3B8] uppercase">Apple Engine</span>
                    <span className="text-[10px] text-[#8B5CF6] font-bold">DoH HTTPS</span>
                  </div>
                  <p className="text-sm font-bold text-[#F1F5F9]">Apple Signed Profile</p>
                  <p className="text-[11px] text-[#94A3B8]">NetworkExtension (.mobileconfig)</p>
                  <div className="pt-2 flex items-center justify-between text-[11px] border-t border-white/[0.08]">
                    <span className="text-[#94A3B8]">Ad Telemetry:</span>
                    <span className="text-emerald-400 font-bold">100% Stripped</span>
                  </div>
                </div>

              </div>

              {/* Bottom Honest Architecture Strip */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-[#94A3B8]">
                  <Shield className="w-4 h-4 text-[#00E5FF] shrink-0" />
                  <span>Fair Play Architecture: Operates at DNS domain level. No APK modifications or cheat hooks.</span>
                </div>
                <Link href="/how-it-works" className="text-[#00E5FF] hover:underline font-bold shrink-0 flex items-center gap-1">
                  <span>How DNS Operates</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
