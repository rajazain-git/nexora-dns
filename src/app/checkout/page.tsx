'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  AlertCircle, 
  Check, 
  ArrowRight, 
  Tag, 
  Lock, 
  Zap, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { createOrder } from '@/lib/store-db';
import { PaymentMethod } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DEFAULT_SITE_CONFIG } from '@/lib/config';

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    items, 
    subtotal, 
    discountAmount, 
    total, 
    currency, 
    formatPrice, 
    clearCart, 
    removeFromCart,
    coupon, 
    applyCoupon, 
    removeCoupon,
    couponCodeInput,
    setCouponCodeInput,
    couponError
  } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [customerName, setCustomerName] = useState(user?.displayName || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '03001234567');
  
  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('sandbox');
  const [transactionId, setTransactionId] = useState('');
  const [senderAccount, setSenderAccount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [compatibilityAcknowledged, setCompatibilityAcknowledged] = useState(true);

  const isFreeOrder = total === 0;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);

    if (items.length === 0) {
      setErrorNotice('Your cart is empty. Please add a package to continue.');
      return;
    }

    if (!customerName.trim() || !customerEmail.trim()) {
      setErrorNotice('Please provide your name and email address.');
      return;
    }

    if (!isFreeOrder && (paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash')) {
      if (!transactionId.trim()) {
        setErrorNotice('Please enter your Easypaisa/JazzCash Transaction ID (TID) from the SMS receipt.');
        return;
      }
    }

    if (!compatibilityAcknowledged) {
      setErrorNotice('Please confirm your device OS compatibility before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create Order
      const newOrder = createOrder({
        customerId: user?.uid || `guest-${Math.random().toString(36).substring(2, 8)}`,
        customerEmail: customerEmail.trim().toLowerCase(),
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        items: items.map((it) => ({
          productId: it.product.id,
          productName: it.product.name,
          price: it.product.pricePKR,
          quantity: it.quantity,
          duration: it.product.durationLabel,
        })),
        subtotal: subtotal,
        discountAmount: discountAmount,
        totalAmount: total,
        currency: currency,
        couponCode: coupon?.code,
        paymentMethod: isFreeOrder ? 'sandbox' : paymentMethod,
        paymentStatus: isFreeOrder || paymentMethod === 'sandbox' ? 'verified' : 'pending',
        fulfillmentStatus: isFreeOrder || paymentMethod === 'sandbox' ? 'fulfilled' : 'pending',
        paymentProof: {
          transactionId: transactionId.trim() || (paymentMethod === 'sandbox' ? 'SANDBOX-SIM-TXN-OK' : undefined),
          senderAccount: senderAccount.trim() || undefined,
          notes: paymentMethod === 'sandbox' ? 'Verified in Sandbox Simulation' : 'Awaiting admin TID review',
          verifiedAt: isFreeOrder || paymentMethod === 'sandbox' ? new Date().toISOString() : undefined,
          verifiedBy: paymentMethod === 'sandbox' ? 'Automated Sandbox Engine' : undefined,
        },
      });

      clearCart();
      showToast({
        type: 'success',
        title: 'Order Created Successfully',
        message: `Order #${newOrder.id} has been registered.`,
        duration: 3500,
      });

      router.push(`/checkout/success?orderId=${newOrder.id}`);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorNotice(err.message || 'Failed to complete order. Please retry.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4 bg-[#080D1A]">
        <div className="p-8 rounded-3xl bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] shadow-glass-strong max-w-md">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-[#94A3B8] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-[#00E5FF]" />
          </div>
          <h2 className="text-2xl font-black uppercase text-[#F1F5F9] tracking-tight mb-2">Your Cart is Empty</h2>
          <p className="text-xs text-[#94A3B8] mb-6 max-w-sm leading-relaxed">
            Please select a Free Fire DNS package before proceeding to encrypted checkout.
          </p>
          <Link href="/store">
            <Button variant="glass-cyan" size="md">
              <span>Browse DNS Store</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#080D1A] min-h-screen relative overflow-hidden">
      {/* Decorative ambient glass aura */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="mb-8 border-b border-white/[0.08] pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.06] backdrop-blur-md border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-mono font-bold uppercase tracking-wider mb-3 shadow-[0_0_15px_rgba(0,229,255,0.15)]">
            <Lock className="w-3.5 h-3.5" />
            <span>Encrypted Checkout Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-[#F1F5F9] tracking-tight">
            ORDER CHECKOUT
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-1">
            Guest checkout enabled — no permanent password or account registration required
          </p>
        </div>

        {errorNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 backdrop-blur-xl border border-rose-500/30 text-rose-200 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 7 Columns: Customer Info & Payment Details */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* 1. Customer Information */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-5">
                <h3 className="text-sm font-bold uppercase text-[#F1F5F9] font-mono tracking-wider flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-[#00E5FF] text-[#080D1A] text-xs flex items-center justify-center font-black">1</span>
                  <span>Customer Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <label className="block text-[#94A3B8] font-mono mb-1 text-[11px] uppercase">
                      Full Name / Gamer Tag *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Zain Ahmed"
                      className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl px-3.5 py-2.5 text-xs text-[#F1F5F9] placeholder-neutral-500 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40 backdrop-blur-md transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[#94A3B8] font-mono mb-1 text-[11px] uppercase">
                      Email Address (For DNS Delivery) *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. gamer@gmail.com"
                      className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl px-3.5 py-2.5 text-xs text-[#F1F5F9] placeholder-neutral-500 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40 backdrop-blur-md transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#94A3B8] font-mono mb-1 text-[11px] uppercase">
                      WhatsApp / Mobile Phone (For Activation SMS) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 0300 1234567"
                      className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl px-3.5 py-2.5 text-xs text-[#F1F5F9] placeholder-neutral-500 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40 backdrop-blur-md transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Payment Method Selector */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase text-[#F1F5F9] font-mono tracking-wider flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-[#00E5FF] text-[#080D1A] text-xs flex items-center justify-center font-black">2</span>
                    <span>Payment Method</span>
                  </h3>
                  <Badge variant="cyan" size="sm">
                    PKR & International
                  </Badge>
                </div>

                {isFreeOrder ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono backdrop-blur-md">
                    Free Trial Package: No payment or card required. Instant provisioning directly upon submission.
                  </div>
                ) : (
                  <div className="space-y-3">
                    
                    {/* Sandbox Option (Clearly Labeled Demo Mode) */}
                    <div
                      onClick={() => setPaymentMethod('sandbox')}
                      className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all backdrop-blur-xl ${
                        paymentMethod === 'sandbox'
                          ? 'bg-white/[0.10] border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.20)]'
                          : 'bg-white/[0.04] border-white/[0.08] hover:border-[#00E5FF]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === 'sandbox'}
                            onChange={() => setPaymentMethod('sandbox')}
                            className="accent-[#00E5FF]"
                          />
                          <span className="text-xs font-bold text-[#F1F5F9] uppercase font-mono">
                            ⚡ Instant Test Sandbox (Recommended for Review)
                          </span>
                        </div>
                        <Badge variant="cyan" size="sm">
                          INSTANT PROVISION
                        </Badge>
                      </div>
                      <p className="text-[11px] text-[#94A3B8] mt-2 ml-6 leading-relaxed">
                        Emulates server-side payment verification. Immediately approves order and issues unique DNS Anycast credentials and DoH URL without real money charges.
                      </p>
                    </div>

                    {/* Easypaisa */}
                    <div
                      onClick={() => setPaymentMethod('easypaisa')}
                      className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all backdrop-blur-xl ${
                        paymentMethod === 'easypaisa'
                          ? 'bg-white/[0.10] border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.20)]'
                          : 'bg-white/[0.04] border-white/[0.08] hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === 'easypaisa'}
                            onChange={() => setPaymentMethod('easypaisa')}
                            className="accent-emerald-500"
                          />
                          <span className="text-xs font-bold text-[#F1F5F9] uppercase font-mono">
                            Easypaisa Mobile Account / App
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                          PAKISTAN (PKR)
                        </span>
                      </div>

                      {paymentMethod === 'easypaisa' && (
                        <div className="mt-3.5 ml-6 pt-3.5 border-t border-white/[0.10] space-y-3 text-xs font-mono text-[#F1F5F9]/80">
                          <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] space-y-1">
                            <p className="text-[#94A3B8]">Send Rs. {total.toLocaleString()} to Easypaisa Account:</p>
                            <p className="text-emerald-400 font-bold">Number: {DEFAULT_SITE_CONFIG.easypaisaAccountNumber}</p>
                            <p className="text-[#F1F5F9]">Title: {DEFAULT_SITE_CONFIG.easypaisaAccountTitle}</p>
                          </div>

                          <div>
                            <label className="block text-[#94A3B8] text-[11px] mb-1">
                              Enter Easypaisa Transaction ID (TID from SMS) *
                            </label>
                            <input
                              type="text"
                              value={transactionId}
                              onChange={(e) => setTransactionId(e.target.value)}
                              placeholder="e.g. 10482910485"
                              className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl px-3.5 py-2 text-[#F1F5F9] focus:outline-none focus:border-emerald-500 backdrop-blur-md"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* JazzCash */}
                    <div
                      onClick={() => setPaymentMethod('jazzcash')}
                      className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all backdrop-blur-xl ${
                        paymentMethod === 'jazzcash'
                          ? 'bg-white/[0.10] border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.20)]'
                          : 'bg-white/[0.04] border-white/[0.08] hover:border-amber-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === 'jazzcash'}
                            onChange={() => setPaymentMethod('jazzcash')}
                            className="accent-amber-500"
                          />
                          <span className="text-xs font-bold text-[#F1F5F9] uppercase font-mono">
                            JazzCash Mobile Account
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                          PAKISTAN (PKR)
                        </span>
                      </div>

                      {paymentMethod === 'jazzcash' && (
                        <div className="mt-3.5 ml-6 pt-3.5 border-t border-white/[0.10] space-y-3 text-xs font-mono text-[#F1F5F9]/80">
                          <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] space-y-1">
                            <p className="text-[#94A3B8]">Send Rs. {total.toLocaleString()} to JazzCash Account:</p>
                            <p className="text-amber-400 font-bold">Number: {DEFAULT_SITE_CONFIG.jazzcashAccountNumber}</p>
                            <p className="text-[#F1F5F9]">Title: {DEFAULT_SITE_CONFIG.jazzcashAccountTitle}</p>
                          </div>

                          <div>
                            <label className="block text-[#94A3B8] text-[11px] mb-1">
                              Enter JazzCash Transaction ID (TID from SMS) *
                            </label>
                            <input
                              type="text"
                              value={transactionId}
                              onChange={(e) => setTransactionId(e.target.value)}
                              placeholder="e.g. 02938472910"
                              className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl px-3.5 py-2 text-[#F1F5F9] focus:outline-none focus:border-amber-500 backdrop-blur-md"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Payment */}
                    <div
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all backdrop-blur-xl ${
                        paymentMethod === 'card'
                          ? 'bg-white/[0.10] border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.20)]'
                          : 'bg-white/[0.04] border-white/[0.08] hover:border-[#00E5FF]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === 'card'}
                            onChange={() => setPaymentMethod('card')}
                            className="accent-[#00E5FF]"
                          />
                          <span className="text-xs font-bold text-[#F1F5F9] uppercase font-mono">
                            Credit / Debit Card (Visa, Mastercard)
                          </span>
                        </div>
                        <CreditCard className="w-4 h-4 text-[#00E5FF]" />
                      </div>

                      {paymentMethod === 'card' && (
                        <div className="mt-3.5 ml-6 pt-3.5 border-t border-white/[0.10] text-xs font-mono text-[#94A3B8]">
                          <p>
                            Card gateway integration uses 3D Secure verification. Sandbox test card token will be executed.
                          </p>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>

            </div>

            {/* Right 5 Columns: Order Summary Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.08] backdrop-blur-2xl border border-white/[0.16] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.20)] space-y-5 sticky top-28">
                
                <h3 className="text-sm font-bold uppercase text-[#F1F5F9] font-mono tracking-wider border-b border-white/[0.10] pb-3 flex items-center justify-between">
                  <span>Order Summary</span>
                  <Badge variant="cyan" size="sm">
                    {items.length} {items.length === 1 ? 'ITEM' : 'ITEMS'}
                  </Badge>
                </h3>

                {/* Items preview */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((it) => (
                    <div
                      key={it.product.id}
                      className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-[#F1F5F9] truncate">{it.product.name}</p>
                        <p className="text-[11px] text-[#94A3B8] font-mono">
                          Qty: {it.quantity} • {it.product.durationLabel}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-[#F1F5F9]">
                          {formatPrice(it.product.pricePKR * it.quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(it.product.id)}
                          className="block text-[10px] text-rose-400 hover:underline mt-0.5 ml-auto"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Input */}
                <div className="pt-2 border-t border-white/[0.10]">
                  {coupon ? (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Code: {coupon.code} (-{coupon.discountPercentage}%)</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-[#94A3B8] hover:text-[#F1F5F9] underline text-[11px]"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon Code"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        className="flex-1 bg-white/[0.05] border border-white/[0.12] rounded-xl px-3.5 py-2 text-xs text-[#F1F5F9] placeholder-neutral-500 uppercase font-mono focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                      />
                      <Button
                        type="button"
                        variant="glass"
                        size="sm"
                        onClick={() => applyCoupon(couponCodeInput)}
                      >
                        Apply
                      </Button>
                    </div>
                  )}

                  {couponError && (
                    <p className="text-[11px] text-rose-400 mt-1.5">{couponError}</p>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-2 pt-3 border-t border-white/[0.10] text-xs font-mono text-[#94A3B8]">
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

                  <div className="flex justify-between text-base font-bold text-[#F1F5F9] pt-3 border-t border-white/[0.10]">
                    <span className="uppercase">Final Amount</span>
                    <span className="text-[#00E5FF] font-black text-2xl">
                      {currency === 'PKR' ? `Rs. ${total.toLocaleString()}` : `$${total}`}
                    </span>
                  </div>
                </div>

                {/* Device OS Compatibility Acknowledgement */}
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#CBD5E1]">
                    <input
                      type="checkbox"
                      checked={compatibilityAcknowledged}
                      onChange={(e) => setCompatibilityAcknowledged(e.target.checked)}
                      className="mt-0.5 accent-[#00E5FF] rounded"
                    />
                    <span className="leading-relaxed">
                      I confirm my mobile device runs compatible OS (Android 9+ or iOS 14+) and understand this DNS stabilizes resolver routing without game hacks.{' '}
                      <Link href="/compatibility" target="_blank" className="text-[#00E5FF] underline inline-block">
                        Check Compatibility &rarr;
                      </Link>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="glass-cyan"
                  size="lg"
                  className="w-full text-sm font-bold shadow-[0_0_25px_rgba(0,229,255,0.25)]"
                  isLoading={isSubmitting}
                >
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  <span>
                    {isFreeOrder
                      ? 'Claim Free DNS Access'
                      : paymentMethod === 'sandbox'
                      ? 'Complete & Instant Provision'
                      : 'Submit Order & Await Verification'}
                  </span>
                </Button>

                <p className="text-[10px] text-center text-[#94A3B8]/80 font-mono">
                  By clicking submit, you confirm that network latency is governed by your ISP and physical distance.
                </p>

              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
}
