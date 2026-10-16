'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Check, Eye } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useCart } from '@/context/CartContext';
import { INITIAL_PRODUCTS } from '@/lib/products';
import { useToast } from '@/context/ToastContext';

export function ProductCatalogPreview() {
  const { addToCart, formatPrice } = useCart();
  const { showToast } = useToast();

  const featured = INITIAL_PRODUCTS.filter((p) => p.isFeatured || p.category === 'free-trial').slice(0, 4);

  return (
    <section className="py-24 bg-[#080D1A] border-t border-white/[0.10] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] font-bold">
                FREE FIRE MOBILE STORE
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-[#F1F5F9] tracking-tight">
              FEATURED MOBILE DNS PLANS
            </h2>
            <p className="text-[#94A3B8] text-sm sm:text-base mt-2 max-w-xl">
              Dedicated Free Fire DNS configurations engineered for compatible Android and Apple iOS mobile devices.
            </p>
          </div>

          <Link href="/store">
            <Button variant="outline" size="md">
              <span>View All Mobile Plans</span>
              <ArrowRight className="w-4 h-4 ml-1.5 text-[#00E5FF]" />
            </Button>
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => {
            const isFree = product.pricePKR === 0;

            return (
              <div
                key={product.id}
                className="rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] hover:border-[#00E5FF]/45 shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.14)] hover:shadow-glow-cyan hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between p-6 relative group overflow-hidden"
              >
                {/* Header & Badges */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant={isFree ? 'violet' : 'cyan'} size="sm">
                      {product.badge || product.category.toUpperCase()}
                    </Badge>
                    <span className="text-[10px] font-mono text-[#94A3B8]">
                      {product.durationLabel}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#F1F5F9] uppercase tracking-tight group-hover:text-[#00E5FF] transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-xs text-[#94A3B8] mt-2 line-clamp-2 leading-relaxed">
                    {product.shortDescription}
                  </p>

                  {/* Platforms Supported */}
                  <div className="mt-4 pt-3 border-t border-white/[0.08]">
                    <span className="text-[10px] uppercase font-mono text-[#94A3B8] block mb-1.5">
                      Compatibility:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.supportedPlatforms.slice(0, 3).map((plat) => (
                        <span
                          key={plat}
                          className="text-[10px] font-mono bg-white/[0.05] text-[#94A3B8] px-2 py-0.5 rounded-lg border border-white/[0.10] backdrop-blur-sm"
                        >
                          {plat}
                        </span>
                      ))}
                      {product.supportedPlatforms.length > 3 && (
                        <span className="text-[10px] font-mono text-[#94A3B8] px-1 py-0.5">
                          +{product.supportedPlatforms.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Top Features */}
                  <div className="mt-4 space-y-2">
                    {product.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#F1F5F9]">
                        <Check className="w-3.5 h-3.5 text-[#00E5FF] shrink-0 mt-0.5" />
                        <span className="line-clamp-1 text-[#94A3B8]">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="mt-6 pt-4 border-t border-white/[0.08]">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-2xl font-black text-[#F1F5F9] font-mono tracking-tight">
                        {isFree ? 'FREE' : formatPrice(product.pricePKR)}
                      </span>
                      {!isFree && (
                        <span className="text-xs text-[#94A3B8] ml-1 font-mono">
                          / {product.duration === '1-month' ? 'month' : product.duration === '3-months' ? '3 mo' : 'year'}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">INSTANT SETUP</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link href={`/store/${product.slug}`} className="w-full">
                      <Button variant="secondary" size="sm" className="w-full">
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        <span>Details</span>
                      </Button>
                    </Link>

                    <Button
                      variant={isFree ? 'violet' : 'primary'}
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        addToCart(product);
                        showToast({
                          type: 'success',
                          title: 'Added to Cart',
                          message: `${product.name} added to your cart.`,
                          duration: 2500,
                        });
                      }}
                    >
                      <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                      <span>{isFree ? 'Claim' : 'Buy Now'}</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Catalog Footer Notice */}
        <div className="mt-12 text-center">
          <p className="text-xs text-[#94A3B8] font-mono">
            * All packages include step-by-step setup guides for Android (Private DNS) and Apple iOS (.mobileconfig Profile).
          </p>
        </div>
      </div>
    </section>
  );
}
