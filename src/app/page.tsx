'use client';

import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { ProductCatalogPreview } from '@/components/home/ProductCatalogPreview';
import { FeaturesGrid } from '@/components/home/FeaturesGrid';
import { HonestLimitations } from '@/components/home/HonestLimitations';
import { RouteTesterTeaser } from '@/components/home/RouteTesterTeaser';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { useSiteConfig } from '@/context/SiteConfigContext';

export default function HomePage() {
  const { homepage } = useSiteConfig();
  const enabled = homepage?.enabledSections || {
    hero: true,
    products_catalog: true,
    features: true,
    device_comparison: true,
    faq: true,
    cta_banner: true,
  };

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      {enabled.hero !== false && <HeroSection />}

      {/* 2. Product Catalog Preview */}
      {enabled.products_catalog !== false && <ProductCatalogPreview />}

      {/* 3. Features & Architecture */}
      {enabled.features !== false && <FeaturesGrid />}

      {/* 4. Honest Technical Limitations & Device Comparison */}
      {enabled.device_comparison !== false && <HonestLimitations />}

      {/* 5. Interactive Route Benchmarker Teaser */}
      {enabled.faq !== false && <RouteTesterTeaser />}

      {/* 6. Pre-Footer Call to Action */}
      {enabled.cta_banner !== false && (
        <section className="py-24 bg-[#080D1A] border-t border-white/[0.10] relative overflow-hidden">
          <div className="absolute inset-0 tech-grid-cyan opacity-25 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#00E5FF]/[0.05] blur-[140px] pointer-events-none rounded-full" />
          
          <div className="max-w-5xl mx-auto px-4 relative z-10">
            <div className="p-10 sm:p-14 rounded-3xl bg-white/[0.06] backdrop-blur-2xl border border-white/[0.14] text-center shadow-[0_16px_50px_0_rgba(0,0,0,0.4),inset_0_1px_1px_0_rgba(255,255,255,0.18)] space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B5CF6]/10 blur-[80px] pointer-events-none rounded-full" />

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.12] backdrop-blur-md text-[#00E5FF] text-xs font-mono font-bold uppercase tracking-wider shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
                <Zap className="w-3.5 h-3.5" />
                <span>INSTANT SETUP & PROVISIONING</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black uppercase text-[#F1F5F9] tracking-tight leading-tight">
                TAKE CONTROL OF YOUR NETWORK ROUTING
              </h2>

              <p className="text-[#94A3B8] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Choose a dedicated Free Fire DNS profile for your Android phone or Apple iOS device. Delivered directly to your customer dashboard instantly.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                <Link href="/store">
                  <Button variant="primary" size="lg">
                    <span>EXPLORE MOBILE DNS PLANS</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

                <Link href="/setup-guides">
                  <Button variant="secondary" size="lg">
                    <span>MOBILE SETUP GUIDES</span>
                  </Button>
                </Link>
              </div>

              <div className="pt-4 flex items-center justify-center gap-2 text-xs text-[#94A3B8] font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Supported payment channels: Easypaisa, JazzCash, and Cards.</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
