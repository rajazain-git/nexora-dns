'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  ShoppingBag, 
  Eye, 
  Check, 
  ShieldAlert, 
  Smartphone, 
  Apple, 
  Zap, 
  Sparkles,
  SlidersHorizontal,
  Clock,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { getStoredProducts } from '@/lib/store-db';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

function PlatformUrlSync({ onSelect }: { onSelect: (platform: string) => void }) {
  const searchParams = useSearchParams();
  React.useEffect(() => {
    const p = searchParams.get('platform');
    if (p === 'android' || p === 'ios') {
      onSelect(p);
    }
  }, [searchParams, onSelect]);
  return null;
}

export default function StorePage() {
  const { addToCart, formatPrice } = useCart();
  const { showToast } = useToast();
  
  const [products] = useState<Product[]>(() => getStoredProducts());
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Platform filter
      if (selectedPlatform === 'android' && p.platform !== 'android') return false;
      if (selectedPlatform === 'ios' && p.platform !== 'ios') return false;

      // Duration filter
      if (selectedDuration !== 'all') {
        if (selectedDuration === 'trial' && p.duration !== 'trial-3d') return false;
        if (selectedDuration === '1-month' && p.duration !== '1-month') return false;
        if (selectedDuration === '3-months' && p.duration !== '3-months') return false;
      }

      // Price filter
      if (selectedPriceRange !== 'all') {
        if (selectedPriceRange === 'free' && p.pricePKR !== 0) return false;
        if (selectedPriceRange === 'under-500' && (p.pricePKR === 0 || p.pricePKR > 500)) return false;
        if (selectedPriceRange === '500-plus' && p.pricePKR <= 500) return false;
      }

      // Availability filter
      if (selectedAvailability !== 'all' && p.availability !== selectedAvailability) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchDevices = p.compatibleDevices?.toLowerCase().includes(q);
        const matchMethod = p.configMethod?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchDevices && !matchMethod) return false;
      }

      return true;
    });
  }, [products, selectedPlatform, selectedDuration, selectedPriceRange, selectedAvailability, searchQuery]);

  // Partition into Android & iOS
  const androidProducts = useMemo(() => {
    return filteredProducts.filter((p) => p.platform === 'android');
  }, [filteredProducts]);

  const iosProducts = useMemo(() => {
    return filteredProducts.filter((p) => p.platform === 'ios');
  }, [filteredProducts]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    showToast({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.name} is ready in your cart.`,
      duration: 2500,
    });
  };

  const renderProductCard = (product: Product, isIos: boolean) => {
    const isFree = product.pricePKR === 0;

    return (
      <div
        key={product.id}
        className={`rounded-3xl bg-white/[0.06] backdrop-blur-xl border ${
          isIos 
            ? 'border-white/[0.12] hover:border-[#8B5CF6]/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.14)] hover:shadow-glow-violet' 
            : 'border-white/[0.12] hover:border-[#00E5FF]/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.14)] hover:shadow-glow-cyan'
        } transition-all duration-300 flex flex-col justify-between p-6 sm:p-7 relative group hover:-translate-y-1.5 overflow-hidden`}
      >
        {/* Subtle Ambient Orb inside Card */}
        <div className={`absolute top-0 right-0 w-40 h-40 ${isIos ? 'bg-[#8B5CF6]/10' : 'bg-[#00E5FF]/10'} blur-2xl pointer-events-none rounded-full group-hover:scale-125 transition-transform duration-500`} />

        <div>
          {/* Top Badge & Duration */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5">
              <span className={`p-1.5 rounded-lg ${isIos ? 'bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30' : 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30'}`}>
                <Smartphone className="w-3.5 h-3.5" />
              </span>
              <Badge variant={isFree ? 'neutral' : isIos ? 'violet' : 'cyan'} size="sm">
                {product.badge || (isIos ? 'iOS DNS' : 'Android DNS')}
              </Badge>
            </div>
            <span className="text-[10px] font-mono text-[#94A3B8] bg-white/[0.05] px-2.5 py-1 rounded-lg border border-white/[0.10] backdrop-blur-sm">
              {product.durationLabel}
            </span>
          </div>

          {/* Product Name */}
          <Link href={`/store/${product.slug}`}>
            <h3 className="text-lg font-black text-[#F1F5F9] uppercase tracking-tight group-hover:text-[#00E5FF] transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Compatibility Details */}
          <div className="mt-4 pt-3 border-t border-white/[0.08] space-y-2 text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono text-[#94A3B8] block mb-0.5">
                Compatible Devices:
              </span>
              <p className="text-[11px] font-mono text-[#F1F5F9] bg-white/[0.04] px-2.5 py-1.5 rounded-xl border border-white/[0.08] backdrop-blur-sm">
                {product.compatibleDevices || (isIos ? 'iPhone 11–16, iPad (iOS 14+)' : 'Samsung, Xiaomi, Infinix, Tecno (Android 9+)')}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-[#94A3B8] block mb-0.5">
                Configuration Method:
              </span>
              <p className={`text-[11px] font-mono px-2.5 py-1 rounded-xl border backdrop-blur-sm ${
                isIos 
                  ? 'bg-[#8B5CF6]/10 text-[#C4B5FD] border-[#8B5CF6]/30' 
                  : 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30'
              }`}>
                {product.configMethod || (isIos ? 'Apple DoH Profile (.mobileconfig)' : 'Android Private DNS (DoT Port 853)')}
              </p>
            </div>
          </div>

          {/* Key Features Bullet List */}
          <div className="mt-4 space-y-1.5 pt-3 border-t border-white/[0.08]">
            {product.features.slice(0, 3).map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-[#F1F5F9]">
                <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isIos ? 'text-[#8B5CF6]' : 'text-[#00E5FF]'}`} />
                <span className="line-clamp-1 text-[#94A3B8]">{feat}</span>
              </div>
            ))}
          </div>

          {/* Setup Instructions Summary Pill */}
          <div className="mt-3.5 p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono text-[#94A3B8] flex items-center justify-between backdrop-blur-sm">
            <span>Setup: Native OS Settings</span>
            <span className="text-emerald-400 font-bold">Zero VPN Apps</span>
          </div>
        </div>

        {/* Pricing & Purchase Actions */}
        <div className="mt-6 pt-4 border-t border-white/[0.08]">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="text-2xl font-black text-[#F1F5F9] font-mono tracking-tight">
                {isFree ? 'FREE TRIAL' : formatPrice(product.pricePKR)}
              </span>
              {!isFree && (
                <span className="text-xs text-[#94A3B8] ml-1 font-mono">
                  / {product.duration === '1-month' ? '30 days' : '90 days'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
              <span>IN STOCK</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link href={`/store/${product.slug}`} className="w-full">
              <Button variant="secondary" size="sm" className="w-full">
                <Eye className="w-3.5 h-3.5 mr-1" />
                <span>Details</span>
              </Button>
            </Link>

            <Button
              variant={isFree ? 'secondary' : isIos ? 'violet' : 'primary'}
              size="sm"
              className="w-full font-bold"
              onClick={() => handleAddToCart(product)}
            >
              <ShoppingBag className="w-3.5 h-3.5 mr-1" />
              <span>{isFree ? 'Claim Trial' : 'Buy Now'}</span>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-12 bg-[#080D1A] min-h-screen">
      <Suspense fallback={null}>
        <PlatformUrlSync onSelect={setSelectedPlatform} />
      </Suspense>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.12] text-[#00E5FF] text-xs font-mono font-bold uppercase tracking-wider mb-3 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
              <Zap className="w-3.5 h-3.5" />
              <span>FREE FIRE MOBILE DNS STORE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase text-[#F1F5F9] tracking-tight">
              DEDICATED MOBILE DNS PACKAGES
            </h1>
            <p className="text-[#94A3B8] text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
              Engineered exclusively for Garena Free Fire on mobile devices. Choose between native <strong>Android Private DNS</strong> and official <strong>Apple iOS Encrypted Profiles</strong>.
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs font-mono text-[#94A3B8] block uppercase">Live Store Catalog</span>
            <span className="text-sm font-mono font-bold text-[#00E5FF] bg-white/[0.04] px-3 py-1 rounded-lg border border-white/[0.08]">
              {filteredProducts.length} Dedicated Packages Active
            </span>
          </div>
        </div>

        {/* Filter and Controls Toolbar */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] space-y-4 shadow-[0_12px_40px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
          
          {/* Row 1: Search & Platform Category Toggle */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by phone model (Samsung, Xiaomi, iPhone), duration, or protocol..."
                className="w-full bg-white/[0.04] border border-white/[0.12] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F1F5F9] placeholder-[#94A3B8] focus:outline-none focus:border-[#00E5FF] focus:bg-white/[0.08] backdrop-blur-md transition-all font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] hover:text-[#F1F5F9]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Platform Segmented Selector */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.10] self-start lg:self-auto backdrop-blur-md">
              <button
                onClick={() => setSelectedPlatform('all')}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                  selectedPlatform === 'all'
                    ? 'bg-white/[0.10] text-[#F1F5F9] border border-white/[0.14] shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                All Mobile DNS
              </button>

              <button
                onClick={() => setSelectedPlatform('android')}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
                  selectedPlatform === 'android'
                    ? 'bg-[#00E5FF] text-[#080D1A] font-extrabold shadow-glow-cyan'
                    : 'text-[#94A3B8] hover:text-[#00E5FF]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android DNS</span>
              </button>

              <button
                onClick={() => setSelectedPlatform('ios')}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
                  selectedPlatform === 'ios'
                    ? 'bg-[#8B5CF6] text-white font-extrabold shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                    : 'text-[#94A3B8] hover:text-[#C4B5FD]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>iOS DNS</span>
              </button>
            </div>

          </div>

          {/* Row 2: Secondary Filters (Duration, Price, Availability) */}
          <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 text-[#94A3B8]">
                <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span className="text-[11px] uppercase">Duration:</span>
              </div>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="bg-white/[0.04] border border-white/[0.12] rounded-xl px-3 py-1.5 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              >
                <option value="all" className="bg-[#0B1224]">All Durations</option>
                <option value="trial" className="bg-[#0B1224]">3-Day Free Trial</option>
                <option value="1-month" className="bg-[#0B1224]">30 Days (1 Month)</option>
                <option value="3-months" className="bg-[#0B1224]">90 Days (Season Pass)</option>
              </select>

              <div className="flex items-center gap-1 text-[#94A3B8] ml-2">
                <span className="text-[11px] uppercase">Price:</span>
              </div>
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="bg-white/[0.04] border border-white/[0.12] rounded-xl px-3 py-1.5 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              >
                <option value="all" className="bg-[#0B1224]">All Price Ranges</option>
                <option value="free" className="bg-[#0B1224]">100% Free Trial</option>
                <option value="under-500" className="bg-[#0B1224]">Under Rs. 500</option>
                <option value="500-plus" className="bg-[#0B1224]">Rs. 500+</option>
              </select>

              <div className="flex items-center gap-1 text-[#94A3B8] ml-2">
                <span className="text-[11px] uppercase">Availability:</span>
              </div>
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="bg-white/[0.04] border border-white/[0.12] rounded-xl px-3 py-1.5 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              >
                <option value="all" className="bg-[#0B1224]">All Status</option>
                <option value="in-stock" className="bg-[#0B1224]">In Stock (Instant Setup)</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            {(selectedPlatform !== 'all' || selectedDuration !== 'all' || selectedPriceRange !== 'all' || selectedAvailability !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedPlatform('all');
                  setSelectedDuration('all');
                  setSelectedPriceRange('all');
                  setSelectedAvailability('all');
                  setSearchQuery('');
                }}
                className="text-[11px] text-[#00E5FF] hover:underline flex items-center gap-1 font-bold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>

        </div>

        {/* SECTION 1: ANDROID DNS */}
        {(selectedPlatform === 'all' || selectedPlatform === 'android') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.12] flex items-center justify-center text-[#00E5FF] backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase text-[#F1F5F9] tracking-tight">
                    ANDROID DNS (FREE FIRE)
                  </h2>
                  <p className="text-xs text-[#94A3B8] font-mono">
                    Configured for Samsung, Xiaomi, Poco, Infinix, Tecno, Realme & all Android 9.0+ phones via native Private DNS
                  </p>
                </div>
              </div>

              <Link href="/setup-guides/android" className="hidden sm:inline-flex items-center text-xs font-mono text-[#00E5FF] hover:underline gap-1">
                <span>Android Setup Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {androidProducts.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white/[0.04] border border-white/[0.08] text-[#94A3B8] text-xs backdrop-blur-md">
                No Android packages match your current filter selections.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {androidProducts.map((prod) => renderProductCard(prod, false))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: iOS DNS */}
        {(selectedPlatform === 'all' || selectedPlatform === 'ios') && (
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.12] flex items-center justify-center text-[#8B5CF6] backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase text-[#F1F5F9] tracking-tight">
                    APPLE iOS DNS (FREE FIRE)
                  </h2>
                  <p className="text-xs text-[#94A3B8] font-mono">
                    Configured for iPhone 11–16 & iPads via official signed Apple DNS-over-HTTPS profiles (.mobileconfig)
                  </p>
                </div>
              </div>

              <Link href="/setup-guides/ios" className="hidden sm:inline-flex items-center text-xs font-mono text-[#C4B5FD] hover:underline gap-1">
                <span>iOS Setup Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {iosProducts.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white/[0.04] border border-white/[0.08] text-[#94A3B8] text-xs backdrop-blur-md">
                No iOS packages match your current filter selections.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {iosProducts.map((prod) => renderProductCard(prod, true))}
              </div>
            )}
          </div>
        )}

        {/* No Products At All */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 rounded-3xl bg-white/[0.04] border border-white/[0.10] space-y-4 backdrop-blur-xl">
            <p className="text-[#F1F5F9] text-base font-bold">No Free Fire DNS packages matched your filters.</p>
            <p className="text-[#94A3B8] text-xs max-w-md mx-auto">Try resetting your duration, platform, or price filters to view all available mobile packages.</p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSelectedPlatform('all');
                setSelectedDuration('all');
                setSelectedPriceRange('all');
                setSelectedAvailability('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Technical Notice Banner */}
        <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.10] backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-xl">
          <ShieldAlert className="w-6 h-6 text-[#00E5FF] shrink-0" />
          <div className="text-xs text-[#94A3B8] leading-relaxed font-mono">
            <strong className="text-[#F1F5F9] block font-sans mb-0.5">COMPATIBILITY & FAIR PLAY COMPLIANCE:</strong>
            NEXORA DNS relies 100% on native operating system DNS resolver functions (Android Private DNS and Apple Encrypted DNS). It does NOT modify Free Fire APK/OBB files, memory values, or packet payloads. 100% compliant with Garena Fair Play rules.
          </div>
        </div>

      </div>
    </div>
  );
}
