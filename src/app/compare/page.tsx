'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Check, 
  X, 
  HelpCircle, 
  ArrowRight, 
  Smartphone, 
  Apple, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Info,
  Clock,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { getStoredProducts } from '@/lib/store-db';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export default function ComparePage() {
  const [platformFilter, setPlatformFilter] = useState<'all' | 'android' | 'ios'>('all');
  const [recommendedFor, setRecommendedFor] = useState<'android' | 'ios' | null>(null);
  const products = getStoredProducts();
  const { addToCart, formatPrice } = useCart();
  const { showToast } = useToast();

  const filteredProducts = products.filter(p => {
    if (platformFilter === 'all') return true;
    return p.platform === platformFilter;
  });

  const handleQuickAdd = (product: Product) => {
    addToCart(product);
    showToast({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.name} is ready for checkout.`,
      duration: 3000,
    });
  };

  return (
    <div className="py-16 sm:py-24 min-h-screen relative overflow-hidden bg-[#080D1A]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="cyan" size="md">
            TRANSPARENT SPECIFICATIONS
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-[#F1F5F9] tracking-tight">
            DNS PACKAGE COMPARISON LAB
          </h1>
          <p className="text-[#94A3B8] text-xs sm:text-sm leading-relaxed">
            Compare genuine configuration methods, device compatibility, validity periods, and limitations across our Free Fire mobile DNS packages. Zero fabricated speed claims or false ping promises.
          </p>
        </div>

        {/* Filters and Recommendation Engine */}
        <div className="p-6 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.12] flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          
          {/* Platform Filter Buttons */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.05] border border-white/[0.10] w-full md:w-auto justify-center">
            <button
              type="button"
              onClick={() => setPlatformFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                platformFilter === 'all'
                  ? 'bg-white/[0.12] text-[#F1F5F9] border border-white/[0.2] shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              All Packages ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setPlatformFilter('android')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition-all ${
                platformFilter === 'android'
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android Only</span>
            </button>
            <button
              type="button"
              onClick={() => setPlatformFilter('ios')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition-all ${
                platformFilter === 'ios'
                  ? 'bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30 shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>Apple iOS Only</span>
            </button>
          </div>

          {/* Device Recommendation Helper */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
            <span className="text-xs text-[#94A3B8] font-mono">Recommend for:</span>
            <button
              type="button"
              onClick={() => {
                setRecommendedFor(recommendedFor === 'android' ? null : 'android');
                if (platformFilter !== 'all') setPlatformFilter('android');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                recommendedFor === 'android'
                  ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]'
                  : 'bg-white/[0.03] border-white/[0.08] text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>My Phone is Android</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRecommendedFor(recommendedFor === 'ios' ? null : 'ios');
                if (platformFilter !== 'all') setPlatformFilter('ios');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                recommendedFor === 'ios'
                  ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#A78BFA]'
                  : 'bg-white/[0.03] border-white/[0.08] text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              <Apple className="w-3 h-3" />
              <span>My Phone is iPhone</span>
            </button>
          </div>

        </div>

        {/* Side-by-Side Comparison Matrix (Desktop & Tablet) */}
        <div className="hidden lg:block overflow-x-auto rounded-3xl border border-white/[0.12] bg-white/[0.03] backdrop-blur-2xl shadow-glass-strong">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.10] bg-white/[0.02]">
                <th className="p-6 text-xs font-bold uppercase tracking-wider text-[#94A3B8] font-mono w-1/4">
                  Specification / Package
                </th>
                {filteredProducts.map(p => {
                  const isRec = recommendedFor === p.platform;
                  return (
                    <th key={p.id} className={`p-6 min-w-[240px] align-top transition-all ${
                      isRec ? 'bg-[#00E5FF]/[0.04]' : ''
                    }`}>
                      <div className="space-y-2">
                        {isRec && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30">
                            <Sparkles className="w-3 h-3" />
                            <span>BEST FIT FOR YOUR OS</span>
                          </span>
                        )}
                        <h4 className="text-base font-black text-[#F1F5F9]">
                          {p.name}
                        </h4>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black font-mono text-[#00E5FF]">
                            {p.pricePKR === 0 ? 'FREE' : `Rs. ${p.pricePKR}`}
                          </span>
                          <span className="text-xs text-[#94A3B8] font-mono">
                            / {p.durationLabel}
                          </span>
                        </div>
                        <div className="pt-2 flex gap-2">
                          <Link href={`/store/${p.id}`} className="flex-1">
                            <Button variant="glass-cyan" size="sm" className="w-full text-xs">
                              Buy Now
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuickAdd(p)}
                            className="text-xs text-[#00E5FF]"
                            title="Add to Cart"
                          >
                            + Cart
                          </Button>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.08] text-xs">
              
              {/* Row 1: Platform & Protocol */}
              <tr>
                <td className="p-5 font-mono font-bold text-[#F1F5F9] bg-white/[0.01]">
                  Target Operating System
                </td>
                {filteredProducts.map(p => (
                  <td key={p.id} className="p-5">
                    <div className="flex items-center gap-2">
                      {p.platform === 'android' ? (
                        <Smartphone className="w-4 h-4 text-[#00E5FF]" />
                      ) : (
                        <Apple className="w-4 h-4 text-[#A78BFA]" />
                      )}
                      <span className="font-bold text-[#F1F5F9] uppercase">
                        {p.platform}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 2: Configuration Method */}
              <tr>
                <td className="p-5 font-mono font-bold text-[#F1F5F9] bg-white/[0.01]">
                  Supported Config Method
                </td>
                {filteredProducts.map(p => (
                  <td key={p.id} className="p-5 text-[#94A3B8]">
                    {p.configMethod || (p.platform === 'android' ? 'Native Private DNS (DoT Port 853)' : 'Apple Encrypted Profile (.mobileconfig DoH)')}
                  </td>
                ))}
              </tr>

              {/* Row 3: Setup Difficulty */}
              <tr>
                <td className="p-5 font-mono font-bold text-[#F1F5F9] bg-white/[0.01]">
                  Setup Difficulty
                </td>
                {filteredProducts.map(p => (
                  <td key={p.id} className="p-5">
                    <span className="inline-flex items-center gap-1.5 text-[#10B981] font-mono font-bold">
                      <Check className="w-4 h-4" />
                      <span>Very Easy (&lt; 45s)</span>
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 4: Third-Party Apps Required */}
              <tr>
                <td className="p-5 font-mono font-bold text-[#F1F5F9] bg-white/[0.01]">
                  Third-Party Apps Needed
                </td>
                {filteredProducts.map(p => (
                  <td key={p.id} className="p-5 font-mono text-[#CBD5E1]">
                    Zero (100% Native OS Settings)
                  </td>
                ))}
              </tr>

              {/* Row 5: Battery / Background Drain */}
              <tr>
                <td className="p-5 font-mono font-bold text-[#F1F5F9] bg-white/[0.01]">
                  Battery &amp; RAM Impact
                </td>
                {filteredProducts.map(p => (
                  <td key={p.id} className="p-5 font-mono text-emerald-400">
                    0% (Native System Level)
                  </td>
                ))}
              </tr>

              {/* Row 6: Anti-Cheat Compliance */}
              <tr>
                <td className="p-5 font-mono font-bold text-[#F1F5F9] bg-white/[0.01]">
                  Fair Play Compliance
                </td>
                {filteredProducts.map(p => (
                  <td key={p.id} className="p-5 text-emerald-400 font-mono font-bold">
                    100% Compliant (Zero Modding)
                  </td>
                ))}
              </tr>

              {/* Row 7: Compatible Hardware */}
              <tr>
                <td className="p-5 font-mono font-bold text-[#F1F5F9] bg-white/[0.01]">
                  Compatible Hardware
                </td>
                {filteredProducts.map(p => (
                  <td key={p.id} className="p-5 text-[#94A3B8] leading-relaxed">
                    {p.compatibleDevices || (p.platform === 'android' ? 'Samsung, Xiaomi, Poco, Infinix, Tecno (Android 9+)' : 'iPhone 11-16, iPad (iOS 14+)')}
                  </td>
                ))}
              </tr>

              {/* Row 8: Honest Limitations */}
              <tr>
                <td className="p-5 font-mono font-bold text-amber-400 bg-white/[0.01]">
                  Important Limitations
                </td>
                {filteredProducts.map(p => (
                  <td key={p.id} className="p-5 text-[11px] text-[#94A3B8] leading-relaxed">
                    Does not modify game recoil or provide unfair aim advantages. Strictly stabilizes DNS resolver routing.
                  </td>
                ))}
              </tr>

              {/* Row 9: Availability */}
              <tr>
                <td className="p-5 font-mono font-bold text-[#F1F5F9] bg-white/[0.01]">
                  Stock Status
                </td>
                {filteredProducts.map(p => (
                  <td key={p.id} className="p-5">
                    <Badge variant="cyan" size="sm">
                      IN STOCK • IMMEDIATE ALLOCATION
                    </Badge>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>

        {/* Mobile Comparison Cards (for screens < lg) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
          {filteredProducts.map(p => {
            const isRec = recommendedFor === p.platform;
            return (
              <div 
                key={p.id}
                className={`p-6 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border transition-all space-y-5 ${
                  isRec 
                    ? 'border-[#00E5FF]/60 shadow-[0_0_25px_rgba(0,229,255,0.2)]' 
                    : 'border-white/[0.12]'
                }`}
              >
                <div>
                  {isRec && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 mb-2">
                      <Sparkles className="w-3 h-3" />
                      <span>RECOMMENDED FOR YOUR DEVICE</span>
                    </span>
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={p.platform === 'android' ? 'cyan' : 'violet'} size="sm">
                      {p.platform.toUpperCase()}
                    </Badge>
                    <span className="text-xl font-mono font-black text-[#00E5FF]">
                      {p.pricePKR === 0 ? 'FREE' : `Rs. ${p.pricePKR}`}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#F1F5F9] mt-2">
                    {p.name}
                  </h4>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    {p.shortDescription}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Validity:</span>
                    <span className="text-[#F1F5F9] font-bold">{p.durationLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Setup Time:</span>
                    <span className="text-emerald-400 font-bold">&lt; 45 Seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Apps Needed:</span>
                    <span className="text-[#CBD5E1]">Zero (Native)</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#CBD5E1]">
                  <div className="text-[10px] uppercase font-mono text-[#94A3B8]">Key Features:</div>
                  {p.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex gap-3">
                  <Link href={`/store/${p.id}`} className="flex-1">
                    <Button variant="glass-cyan" size="sm" className="w-full text-xs">
                      View Package
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAdd(p)}
                    className="text-xs text-[#00E5FF]"
                  >
                    + Cart
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Honest Operational Notice */}
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md flex items-start sm:items-center gap-3">
          <Info className="w-5 h-5 text-[#00E5FF] shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            <strong className="text-[#F1F5F9]">Honest Technical Guarantee:</strong> All comparison data above is sourced directly from genuine mobile operating system network specifications. NEXORA DNS never artificially inflates claims, promises impossible 1ms latency, or advertises game hacks.
          </p>
        </div>

      </div>
    </div>
  );
}
