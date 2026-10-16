'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  Key, 
  Smartphone, 
  Globe,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getOrderById } from '@/lib/store-db';
import { Order } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/context/ToastContext';

function CheckoutSuccessPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const { showToast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      const found = getOrderById(orderId);
      if (found) {
        setOrder(found);
        if (found.paymentStatus === 'verified') {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00E5FF', '#8B5CF6', '#10B981', '#F1F5F9'],
          });
        }
      }
    }
  }, [orderId]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    showToast({
      type: 'success',
      title: 'Copied to Clipboard',
      message: `${label} copied successfully.`,
      duration: 2500,
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4 bg-[#080D1A]">
        <div className="p-8 rounded-3xl bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] shadow-glass-strong max-w-md">
          <h2 className="text-xl font-bold text-[#F1F5F9] mb-2">Order Not Found</h2>
          <p className="text-xs text-[#94A3B8] mb-6">
            Could not find an order with identifier #{orderId || 'UNKNOWN'}.
          </p>
          <Link href="/dashboard">
            <Button variant="glass-cyan" size="sm">
              Go to Customer Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isVerified = order.paymentStatus === 'verified';
  const isPending = order.paymentStatus === 'pending';

  return (
    <div className="py-16 bg-[#080D1A] min-h-screen relative overflow-hidden">
      {/* Ambient background glass lights */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Status Header Banner */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/[0.08] backdrop-blur-2xl border border-white/[0.15] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.20)] mx-auto">
            {isVerified ? (
              <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
            ) : (
              <Clock className="w-10 h-10 text-amber-400" />
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black uppercase text-[#F1F5F9] tracking-tight">
            {isVerified ? 'PAYMENT VERIFIED & DNS PROVISIONED' : 'ORDER RECEIVED — PENDING VERIFICATION'}
          </h1>

          <div className="flex items-center justify-center gap-2.5 font-mono text-xs">
            <span className="text-[#94A3B8]">ORDER IDENTIFIER:</span>
            <span className="text-[#00E5FF] font-black">{order.id}</span>
            <span className="text-white/20">•</span>
            <Badge variant={isVerified ? 'emerald' : 'amber'} size="sm">
              {order.paymentStatus.toUpperCase()}
            </Badge>
          </div>

          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-lg mx-auto leading-relaxed">
            {isVerified
              ? 'Your high-availability Anycast DNS credentials have been automatically provisioned to your profile.'
              : 'Your payment proof has been submitted to the billing gateway queue. Credentials unlock automatically once verified.'}
          </p>
        </div>

        {/* Unlocked Credentials Box (if verified) */}
        {isVerified && order.assignedConfigurations && order.assignedConfigurations.length > 0 && (
          <div className="rounded-3xl bg-white/[0.08] backdrop-blur-2xl border border-emerald-500/30 p-6 sm:p-8 space-y-6 shadow-glass-strong shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="flex items-center justify-between border-b border-white/[0.10] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Key className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#F1F5F9] uppercase font-mono tracking-wide">
                  Your Provisioned Free Fire DNS Configuration
                </h3>
              </div>
              <Badge variant="emerald" size="sm">
                READY FOR PLAY
              </Badge>
            </div>

            {order.assignedConfigurations.map((cfg, idx) => (
              <div key={idx} className="space-y-4 bg-white/[0.04] backdrop-blur-md p-5 rounded-2xl border border-white/[0.08] font-mono text-xs">
                <div className="flex justify-between items-center text-[#F1F5F9]">
                  <span className="font-bold text-sm text-[#00E5FF]">{cfg.productName}</span>
                  <span className="text-[#94A3B8] text-[10px]">
                    Expires: {cfg.expiresAt ? new Date(cfg.expiresAt).toLocaleDateString() : 'Active'}
                  </span>
                </div>

                {/* Primary & Secondary IPs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#94A3B8] block uppercase">Primary IPv4</span>
                      <span className="text-[#F1F5F9] font-bold">{cfg.primaryIP}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(cfg.primaryIP, `Primary IP (${cfg.productName})`)}
                      className="p-2 rounded-lg bg-white/[0.06] text-[#94A3B8] hover:text-[#00E5FF] hover:bg-white/[0.10] border border-white/[0.10] transition-colors"
                    >
                      {copiedKey === `Primary IP (${cfg.productName})` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#94A3B8] block uppercase">Secondary IPv4</span>
                      <span className="text-[#F1F5F9] font-bold">{cfg.secondaryIP}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(cfg.secondaryIP, `Secondary IP (${cfg.productName})`)}
                      className="p-2 rounded-lg bg-white/[0.06] text-[#94A3B8] hover:text-[#00E5FF] hover:bg-white/[0.10] border border-white/[0.10] transition-colors"
                    >
                      {copiedKey === `Secondary IP (${cfg.productName})` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* DoT Private Hostname (Android) */}
                <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block uppercase">Android Private DNS Hostname</span>
                    <span className="text-[#00E5FF] font-bold">{cfg.dotHost}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(cfg.dotHost, `Android Hostname (${cfg.productName})`)}
                    className="p-2 rounded-lg bg-white/[0.06] text-[#94A3B8] hover:text-[#00E5FF] hover:bg-white/[0.10] border border-white/[0.10] transition-colors"
                  >
                    {copiedKey === `Android Hostname (${cfg.productName})` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Encrypted DoH URL */}
                <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] text-[#94A3B8] block uppercase">DoH (DNS over HTTPS) URL</span>
                    <span className="text-[#94A3B8] truncate block text-[11px]">{cfg.dohUrl}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(cfg.dohUrl, `DoH URL (${cfg.productName})`)}
                    className="p-2 rounded-lg bg-white/[0.06] text-[#94A3B8] hover:text-[#00E5FF] hover:bg-white/[0.10] border border-white/[0.10] transition-colors shrink-0"
                  >
                    {copiedKey === `DoH URL (${cfg.productName})` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Summary Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] space-y-6 shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
          <h3 className="text-sm font-bold uppercase text-[#F1F5F9] font-mono border-b border-white/[0.10] pb-3">
            Summary Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[#94A3B8] block mb-1">Customer:</span>
              <span className="text-[#F1F5F9] font-bold">{order.customerName}</span>
              <span className="text-[#94A3B8] block text-[11px]">{order.customerEmail}</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[#94A3B8] block mb-1">Payment Method:</span>
              <span className="text-[#F1F5F9] font-bold uppercase">{order.paymentMethod}</span>
              {order.paymentProof?.transactionId && (
                <span className="text-[#94A3B8] block text-[11px]">TID: {order.paymentProof.transactionId}</span>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[#94A3B8] block mb-1">Fulfillment Status:</span>
              <span className={`font-bold uppercase ${isVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                {order.fulfillmentStatus}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[#94A3B8] block mb-1">Total Paid:</span>
              <span className="text-2xl font-black text-[#00E5FF]">
                {order.currency === 'PKR' ? `Rs. ${order.totalAmount.toLocaleString()}` : `$${order.totalAmount}`}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-white/[0.10] flex flex-wrap gap-4">
            <Link href={`/track-order`} className="flex-1">
              <Button variant="glass-cyan" size="lg" className="w-full">
                <span>Track Order Live (Guest &amp; User)</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Link href="/setup-guides">
              <Button variant="glass" size="lg">
                <span>Setup Guides</span>
              </Button>
            </Link>

            <a
              href={`https://wa.me/923001234567?text=Hello%20NEXORA%20Billing,%20please%20verify%20my%20TID%20for%20order%20${order.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="text-emerald-400 border-emerald-500/30">
                <span>WhatsApp Billing Help</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center text-neutral-400 font-mono text-xs">Loading order confirmation...</div>}>
      <CheckoutSuccessPageContent />
    </Suspense>
  );
}
