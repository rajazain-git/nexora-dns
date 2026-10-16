'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from './Button';
import { Badge } from './Badge';

export function CartDrawer() {
  const {
    items,
    itemCount,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    total,
    currency,
    formatPrice,
    coupon,
    couponCodeInput,
    setCouponCodeInput,
    couponError,
    applyCoupon,
    removeCoupon
  } = useCart();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    applyCoupon(couponCodeInput);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-[#080D1A]/75 backdrop-blur-xl z-50 transition-opacity"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0B1224]/92 backdrop-blur-2xl border-l border-white/[0.12] z-50 flex flex-col shadow-[0_16px_48px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.12)]"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/[0.10] flex items-center justify-between bg-white/[0.03] backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#00E5FF]" />
                <h3 className="font-bold text-[#F1F5F9] uppercase tracking-wider text-base">Your Cart</h3>
                <Badge variant="cyan" size="sm">
                  {itemCount} {itemCount === 1 ? 'PACKAGE' : 'PACKAGES'}
                </Badge>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-[#94A3B8] hover:text-[#F1F5F9] transition-colors p-1.5 rounded-lg hover:bg-white/[0.08]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
              {items.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/[0.12] flex items-center justify-center text-[#94A3B8] mb-4 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)]">
                    <ShoppingBag className="w-7 h-7 text-[#00E5FF]" />
                  </div>
                  <h4 className="text-base font-semibold text-[#F1F5F9] mb-1">Your cart is empty</h4>
                  <p className="text-xs text-[#94A3B8] max-w-xs mb-6">
                    Select an Anycast DNS routing profile matched to your network requirements.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsCartOpen(false)}
                  >
                    <Link href="/store">Explore DNS Plans</Link>
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-4 rounded-2xl bg-white/[0.05] border border-white/[0.12] hover:border-[#00E5FF]/40 transition-all flex gap-3 relative group backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)] hover:shadow-glow-cyan"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-14 h-14 rounded-xl bg-white/[0.08] border border-white/[0.12] flex items-center justify-center shrink-0 overflow-hidden text-lg shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]">
                      {item.product.platform === 'ios' ? '🍎' : '🤖'}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-[#F1F5F9] truncate group-hover:text-[#00E5FF] transition-colors">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[#94A3B8] hover:text-rose-400 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-[#94A3B8] font-mono">
                          {item.product.durationLabel}
                        </span>
                        <span className="text-white/20">•</span>
                        <span className="text-[11px] text-[#8B5CF6] font-mono">
                          {item.product.specs.targetRegion.split(' ')[0]}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/[0.08]">
                        {/* Quantity adjuster */}
                        <div className="flex items-center border border-white/[0.12] rounded-lg bg-black/30 backdrop-blur-sm">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-[#94A3B8] hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-bold px-2 text-[#F1F5F9]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-[#94A3B8] hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-[#00E5FF] font-mono">
                          {formatPrice(item.product.pricePKR * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Summary */}
            {items.length > 0 && (
              <div className="p-5 border-t border-white/[0.10] bg-white/[0.03] backdrop-blur-xl space-y-4">
                {/* Coupon Input */}
                {coupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/35 text-emerald-300 text-xs font-mono backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{coupon.code} ({coupon.discountPercentage}% OFF)</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[#94A3B8] hover:text-white text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      className="flex-1 bg-white/[0.04] border border-white/[0.12] rounded-xl px-3.5 py-2 text-xs text-[#F1F5F9] placeholder-[#94A3B8] focus:outline-none focus:border-[#00E5FF] focus:bg-white/[0.08] uppercase font-mono backdrop-blur-md transition-all"
                    />
                    <Button type="submit" variant="secondary" size="sm">
                      Apply
                    </Button>
                  </form>
                )}

                {couponError && (
                  <p className="text-[11px] text-rose-400">{couponError}</p>
                )}

                {/* Subtotals */}
                <div className="space-y-1.5 text-xs text-[#94A3B8] font-mono">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#F1F5F9]">
                      {currency === 'PKR' ? `Rs. ${subtotal.toLocaleString()}` : `$${subtotal}`}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount</span>
                      <span>
                        -{currency === 'PKR' ? `Rs. ${discountAmount.toLocaleString()}` : `$${discountAmount}`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-[#F1F5F9] pt-2 border-t border-white/[0.10]">
                    <span className="uppercase tracking-wider">Total</span>
                    <span className="text-[#00E5FF] font-black text-base">
                      {currency === 'PKR' ? `Rs. ${total.toLocaleString()}` : `$${total}`}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full"
                >
                  <Button variant="primary" size="lg" className="w-full">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>

                <div className="flex items-center justify-center gap-2 text-[10px] text-[#94A3B8] uppercase tracking-wider font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Instant Automated Delivery Upon Verification</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
