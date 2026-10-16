'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  getStoredProducts, 
  getProductById 
} from '@/lib/store-db';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight,
  Smartphone, 
  Zap, 
  Lock, 
  RefreshCcw, 
  AlertTriangle,
  ChevronDown,
  Sparkles,
  Server,
  Activity
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, formatPrice } = useCart();
  const { showToast } = useToast();

  const id = typeof params?.id === 'string' ? params.id : '';
  const product = getProductById(id);

  const [activeSetupTab, setActiveSetupTab] = useState<'android' | 'ios'>(product?.platform || 'android');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4 bg-[#080D1A]">
        <div className="p-8 rounded-3xl bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] shadow-glass-strong max-w-md">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black uppercase text-[#F1F5F9] tracking-tight mb-2">Package Not Found</h2>
          <p className="text-xs text-[#94A3B8] mb-6 leading-relaxed">The requested Free Fire DNS package could not be located in our catalog.</p>
          <Link href="/store">
            <Button variant="glass-cyan" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Return to Store</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isFree = product.pricePKR === 0;
  const isIos = product.platform === 'ios';
  const relatedProducts = getStoredProducts().filter((p) => p.id !== product.id).slice(0, 3);

  const handleBuyNow = () => {
    addToCart(product);
    showToast({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.name} is ready for checkout.`,
      duration: 3000,
    });
    router.push('/checkout');
  };

  return (
    <div className="py-12 bg-[#080D1A] min-h-screen relative overflow-hidden">
      {/* Decorative localized glass glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Glass Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8] mb-8">
          <Link href="/store" className="hover:text-[#00E5FF] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] hover:border-[#00E5FF]/40">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Store Catalog</span>
          </Link>
          <span className="text-[#94A3B8]/60">/</span>
          <span className="text-[#94A3B8] uppercase">{product.category}</span>
          <span className="text-[#94A3B8]/60">/</span>
          <span className="text-[#F1F5F9] font-bold truncate">{product.name}</span>
        </div>

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 border-b border-white/[0.08]">
          
          {/* Left Column: Product Overview & Highlights */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <Badge variant={isFree ? 'violet' : isIos ? 'violet' : 'cyan'} size="md">
                  {product.badge || (isIos ? 'APPLE iOS DoH' : 'ANDROID PRIVATE DNS')}
                </Badge>
                <span className="text-xs font-mono text-[#94A3B8] px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                  {product.durationLabel}
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>IN STOCK (INSTANT PROVISIONING)</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-[#F1F5F9] tracking-tight leading-tight">
                {product.name}
              </h1>

              <p className="text-sm sm:text-base text-[#94A3B8] mt-4 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Compatibility Matrix Card */}
            <div className="p-6 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-5">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#00E5FF]" />
                <span className="text-xs font-mono uppercase text-[#F1F5F9] tracking-wider font-bold">
                  Platform & Device Architecture:
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08]">
                  <span className="text-[10px] text-[#94A3B8] uppercase block mb-1">Supported Mobile OS</span>
                  <span className="text-[#00E5FF] font-bold">
                    {product.platform === 'ios' ? 'Apple iOS & iPadOS (14.0 – 18+)' : 'Android OS (9.0 – 15+)'}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08]">
                  <span className="text-[10px] text-[#94A3B8] uppercase block mb-1">Configuration Method</span>
                  <span className="text-[#8B5CF6] font-bold">
                    {product.configMethod || (product.platform === 'ios' ? 'Apple DoH Profile' : 'Private DNS (DoT Port 853)')}
                  </span>
                </div>
              </div>

              {product.compatibleDevices && (
                <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] text-xs">
                  <span className="text-[10px] text-[#94A3B8] uppercase font-mono block mb-1">Verified Device Models:</span>
                  <p className="text-[#F1F5F9] font-mono text-[11px] leading-relaxed">{product.compatibleDevices}</p>
                </div>
              )}

              <div className="pt-1">
                <span className="text-xs font-mono uppercase text-[#94A3B8] block font-bold mb-2">
                  Optimized Game Titles:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.supportedGames.map((game) => (
                    <span
                      key={game}
                      className="text-xs font-mono px-3 py-1 rounded-xl bg-white/[0.05] backdrop-blur-md text-[#F1F5F9] border border-white/[0.10]"
                    >
                      {game}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                <span>What Is Included In This Package:</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#94A3B8] p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] hover:border-white/[0.15] transition-colors">
                    <Check className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Purchase Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 p-7 sm:p-8 rounded-3xl bg-white/[0.08] backdrop-blur-2xl border border-white/[0.16] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.20)] space-y-6">
              
              <div className="pb-5 border-b border-white/[0.10]">
                <span className="text-xs font-mono uppercase text-[#94A3B8] block mb-1.5">
                  Package Pricing ({product.durationLabel})
                </span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-4xl sm:text-5xl font-black text-[#F1F5F9] font-mono tracking-tight">
                    {isFree ? 'FREE' : formatPrice(product.pricePKR)}
                  </span>
                  {!isFree && (
                    <span className="text-xs text-[#94A3B8] font-mono">
                      (One-time payment • No auto-charge)
                    </span>
                  )}
                </div>
              </div>

              {/* Purchase Actions */}
              <div className="space-y-3">
                <Button
                  variant={isFree ? 'violet' : 'glass-cyan'}
                  size="lg"
                  className="w-full text-sm font-bold shadow-[0_0_25px_rgba(0,229,255,0.25)]"
                  onClick={handleBuyNow}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  <span>{isFree ? 'Claim Free Trial Now' : 'Instant Checkout'}</span>
                </Button>

                <Button
                  variant="glass"
                  size="md"
                  className="w-full text-xs font-mono"
                  onClick={() => {
                    addToCart(product);
                    showToast({
                      type: 'success',
                      title: 'Added to Cart',
                      message: `${product.name} added to cart.`,
                      duration: 2500,
                    });
                  }}
                >
                  <ShoppingBag className="w-4 h-4 mr-2 text-[#00E5FF]" />
                  <span>Add To Cart</span>
                </Button>
              </div>

              {/* Delivery and Guarantee Badges */}
              <div className="space-y-3 pt-5 border-t border-white/[0.10] text-xs font-mono text-[#94A3B8]">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span>Instant delivery in Customer Dashboard upon payment</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center shrink-0">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <span>DoH TLS 1.3 & DoT Private DNS endpoints included</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <RefreshCcw className="w-3.5 h-3.5" />
                  </div>
                  <span>Eligible for support replacement or refund under policy</span>
                </div>
              </div>

              {/* Local Payment Badges */}
              <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] text-[11px] font-mono text-[#94A3B8] text-center">
                Supported: Easypaisa • JazzCash • Debit/Credit Cards
              </div>

              {/* Compatibility Verification Prompt */}
              <div className="p-3.5 rounded-2xl bg-[#00E5FF]/[0.05] border border-[#00E5FF]/20 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#CBD5E1]">
                  <Smartphone className="w-4 h-4 text-[#00E5FF] shrink-0" />
                  <span>Unsure about your OS version?</span>
                </div>
                <Link 
                  href="/compatibility" 
                  className="text-[11px] font-mono font-bold text-[#00E5FF] hover:underline shrink-0 flex items-center gap-1"
                >
                  <span>Check Device</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Technical Specs & Requirements */}
        <div className="py-16 border-b border-white/[0.08] space-y-6">
          <div>
            <h3 className="text-2xl font-black uppercase text-[#F1F5F9] tracking-tight">
              TECHNICAL SPECIFICATIONS
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1 font-mono">
              Network layer protocol standards utilized by this DNS package
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
              <span className="text-[10px] text-[#94A3B8] uppercase block mb-1">Protocol Transport</span>
              <span className="text-[#F1F5F9] font-bold text-sm">{product.specs.protocol}</span>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
              <span className="text-[10px] text-[#94A3B8] uppercase block mb-1">Encryption Cipher</span>
              <span className="text-[#00E5FF] font-bold text-sm">{product.specs.encryption}</span>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
              <span className="text-[10px] text-[#94A3B8] uppercase block mb-1">Target Geographic Edge</span>
              <span className="text-[#F1F5F9] font-bold text-sm">{product.specs.targetRegion}</span>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
              <span className="text-[10px] text-[#94A3B8] uppercase block mb-1">Routing Peering</span>
              <span className="text-[#8B5CF6] font-bold text-sm">{product.specs.routingOptimization}</span>
            </div>
          </div>
        </div>

        {/* Step-by-Step Setup Guide Preview */}
        <div className="py-16 border-b border-white/[0.08] space-y-6">
          <div>
            <h3 className="text-2xl font-black uppercase text-[#F1F5F9] tracking-tight">
              STEP-BY-STEP SETUP GUIDE
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1 font-mono">
              Takes less than 60 seconds on any supported device.
            </p>
          </div>

          <div className="flex items-center gap-2 border-b border-white/[0.10] pb-3">
            <button
              onClick={() => setActiveSetupTab('android')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeSetupTab === 'android'
                  ? 'bg-[#00E5FF] text-[#080D1A] shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/[0.04]'
              }`}
            >
              Android (Private DNS)
            </button>
            <button
              onClick={() => setActiveSetupTab('ios')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeSetupTab === 'ios'
                  ? 'bg-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/[0.04]'
              }`}
            >
              Apple iOS (.mobileconfig)
            </button>
          </div>

          <div className="p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-4 text-xs sm:text-sm text-[#94A3B8] font-sans">
            {activeSetupTab === 'android' && (
              <ol className="list-decimal list-inside space-y-3 leading-relaxed">
                <li>Open your Android device <strong className="text-[#F1F5F9]">Settings</strong> and tap <strong className="text-[#F1F5F9]">Network & Internet</strong> (or <em className="text-[#00E5FF]">Connections & Sharing</em> on Xiaomi/Samsung).</li>
                <li>Tap on <strong className="text-[#F1F5F9]">Private DNS</strong>. Change the setting from <em>Automatic</em> to <strong className="text-[#00E5FF]">Private DNS provider hostname</strong>.</li>
                <li>Enter your assigned Free Fire hostname (e.g. <code className="bg-white/[0.08] text-[#00E5FF] px-2.5 py-1 rounded-lg font-mono border border-white/[0.15]">{product.dnsConfig.dotHost || 'ff-android.pk.nexoradns.com'}</code>).</li>
                <li>Tap <strong className="text-[#F1F5F9]">Save</strong>. Free Fire matchmaking and Garena auth queries will now resolve via dedicated DoT encryption across both Wi-Fi and 4G/5G mobile data.</li>
              </ol>
            )}

            {activeSetupTab === 'ios' && (
              <ol className="list-decimal list-inside space-y-3 leading-relaxed">
                <li>Log in to your NEXORA Customer Dashboard from <strong className="text-[#F1F5F9]">Safari</strong> on your iPhone or iPad.</li>
                <li>Tap <strong className="text-[#8B5CF6]">Download Apple Free Fire Profile (.mobileconfig)</strong> for your active package.</li>
                <li>Open iPhone <strong className="text-[#F1F5F9]">Settings &gt; Profile Downloaded &gt; Install</strong> and confirm your device passcode.</li>
                <li>Your iPhone now routes Free Fire domain queries through encrypted DNS-over-HTTPS across both cellular and Wi-Fi networks with zero battery drain.</li>
              </ol>
            )}
          </div>
        </div>

        {/* FAQs */}
        <div className="py-16 border-b border-white/[0.08] space-y-6">
          <div>
            <h3 className="text-2xl font-black uppercase text-[#F1F5F9] tracking-tight">
              FREQUENTLY ASKED QUESTIONS
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1 font-mono">
              Answers specific to this package
            </p>
          </div>

          <div className="space-y-3">
            {product.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.10] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-[#F1F5F9] uppercase tracking-wide hover:bg-white/[0.04] transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-[#00E5FF] shrink-0 ml-2 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-[#94A3B8] leading-relaxed border-t border-white/[0.08]">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Honest Limitation Callout */}
        <div className="my-12 p-6 sm:p-7 rounded-3xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong flex flex-col sm:flex-row items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center shrink-0 border border-[#00E5FF]/20 shadow-[0_0_15px_rgba(0,229,255,0.15)]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-xs text-[#94A3B8] font-mono leading-relaxed">
            <strong className="text-[#F1F5F9] block font-sans mb-1 text-sm uppercase tracking-wider">
              Transparency Reminder:
            </strong>
            This DNS service optimizes lookup resolution and encrypts transport. In-game latency (ping) is fundamentally governed by your ISP routing paths, physical distance to game servers, and network conditions. We never guarantee zero lag or ping drops.
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="py-12 space-y-6">
            <h3 className="text-xl font-black uppercase text-[#F1F5F9] tracking-tight">
              RELATED PACKAGES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => {
                const relIos = rel.platform === 'ios';
                return (
                  <div
                    key={rel.id}
                    className="p-6 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong hover:border-white/[0.22] hover:-translate-y-1 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <Badge variant={relIos ? 'violet' : 'cyan'} size="sm" className="mb-3">
                        {relIos ? 'APPLE iOS' : 'ANDROID'}
                      </Badge>
                      <h4 className="text-base font-bold text-[#F1F5F9]">{rel.name}</h4>
                      <p className="text-xs text-[#94A3B8] mt-1.5 line-clamp-2">{rel.shortDescription}</p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                      <span className="text-base font-black text-[#F1F5F9] font-mono">
                        {rel.pricePKR === 0 ? 'FREE' : formatPrice(rel.pricePKR)}
                      </span>
                      <Link href={`/store/${rel.slug}`}>
                        <Button variant="glass" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
