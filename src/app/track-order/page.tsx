'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Copy, 
  Check, 
  ExternalLink, 
  Smartphone, 
  Lock,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/context/ToastContext';

interface TimelineEvent {
  step: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

interface TrackedOrder {
  orderId: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  currency: string;
  totalAmount: number;
  maskedCustomerEmail: string;
  items: Array<{
    productName: string;
    duration: string;
    quantity: number;
    price: number;
  }>;
  timeline: TimelineEvent[];
  assignedConfigurations: Array<{
    productName: string;
    dotHost: string;
    dohUrl: string;
    licenseKey: string;
    expiresAt?: string;
    setupGuideUrl: string;
  }>;
}

export default function TrackOrderPage() {
  const { showToast } = useToast();
  const [orderId, setOrderId] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setOrder(null);

    if (!orderId.trim() || !emailOrPhone.trim()) {
      setErrorMessage('Please provide both your Order Reference and Email or Phone number.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderId.trim(),
          emailOrPhone: emailOrPhone.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to locate order. Please verify your reference.');
        return;
      }

      setOrder(data.order);
      showToast({
        type: 'success',
        title: 'Order Verified',
        message: `Loaded status for order #${data.order.orderId}`,
        duration: 3000,
      });

    } catch (err: any) {
      setErrorMessage('A network error occurred while contacting the tracking gateway.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    showToast({
      type: 'success',
      title: 'Copied to Clipboard',
      message: `${label} copied to clipboard.`,
      duration: 2500,
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="py-16 sm:py-24 min-h-screen relative overflow-hidden bg-[#080D1A]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="cyan" size="md">
            TRANSPARENT GUEST FULFILLMENT
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-[#F1F5F9] tracking-tight">
            TRACK MY ORDER
          </h1>
          <p className="text-[#94A3B8] text-xs sm:text-sm leading-relaxed">
            No customer account required. Enter your unique order reference and the contact details used at checkout to check payment verification status and access your DNS credentials.
          </p>
        </div>

        {/* Tracking Search Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.12)]">
          <form onSubmit={handleTrack} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] font-mono">
                  Order Reference *
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. NX-20261016-A1B2"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#0B1224] border border-white/[0.14] text-sm text-[#F1F5F9] placeholder:text-[#94A3B8]/50 focus:outline-none focus:border-[#00E5FF] font-mono uppercase transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                  />
                </div>
                <p className="text-[10px] text-[#94A3B8] font-mono">Found on your purchase confirmation receipt</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] font-mono">
                  Email or Phone Number *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type="text"
                    required
                    placeholder="email@example.com or 03001234567"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#0B1224] border border-white/[0.14] text-sm text-[#F1F5F9] placeholder:text-[#94A3B8]/50 focus:outline-none focus:border-[#00E5FF] transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                  />
                </div>
                <p className="text-[10px] text-[#94A3B8] font-mono">Dual-factor verification protects your order privacy</p>
              </div>

            </div>

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="glass-cyan"
              size="lg"
              disabled={isLoading}
              className="w-full font-bold shadow-[0_0_25px_rgba(0,229,255,0.25)]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Server Records...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <span>Track Order Status</span>
                </div>
              )}
            </Button>
          </form>
        </div>

        {/* Order Results Card */}
        {order && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Summary Top Bar */}
            <div className="p-6 rounded-3xl bg-white/[0.05] backdrop-blur-2xl border border-white/[0.12] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono text-[#94A3B8]">ORDER:</span>
                  <span className="text-lg font-black font-mono text-[#00E5FF] tracking-wider">
                    #{order.orderId}
                  </span>
                </div>
                <div className="text-xs text-[#94A3B8] mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} to {order.maskedCustomerEmail}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge 
                  variant={
                    order.paymentStatus === 'verified' 
                      ? 'emerald' 
                      : order.paymentStatus === 'pending' 
                        ? 'amber' 
                        : 'red'
                  }
                  size="md"
                >
                  {order.paymentStatus === 'verified' 
                    ? 'PAYMENT VERIFIED' 
                    : order.paymentStatus === 'pending' 
                      ? 'AWAITING VERIFICATION' 
                      : order.paymentStatus.toUpperCase()}
                </Badge>

                <div className="text-right font-mono">
                  <span className="text-xs text-[#94A3B8] block">Total</span>
                  <span className="text-base font-bold text-[#F1F5F9]">
                    Rs. {order.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Timeline Section */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.12] space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00E5FF]" />
                <span>Real-Time Fulfillment Timeline</span>
              </h3>

              <div className="space-y-6">
                {order.timeline.map((event, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    {/* Connecting line */}
                    {idx < order.timeline.length - 1 && (
                      <div className={`absolute left-3.5 top-8 bottom-0 w-0.5 ${
                        event.completed ? 'bg-[#00E5FF]/40' : 'bg-white/[0.10]'
                      }`} />
                    )}

                    {/* Step Icon */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border z-10 ${
                      event.completed
                        ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                        : event.current
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                          : 'bg-white/[0.05] border-white/[0.12] text-[#94A3B8]'
                    }`}>
                      {event.completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-[10px] font-mono font-bold">{idx + 1}</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#F1F5F9]">
                          {event.step}
                        </h4>
                        {event.current && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
                            Current Stage
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">
                        {event.description}
                      </p>
                      {event.timestamp && (
                        <span className="text-[10px] font-mono text-[#94A3B8]/70 block">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivered Credentials Box */}
            {order.assignedConfigurations && order.assignedConfigurations.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#00E5FF]/[0.05] backdrop-blur-2xl border border-[#00E5FF]/30 shadow-[0_0_35px_rgba(0,229,255,0.15)] space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-6 h-6 text-[#00E5FF]" />
                    <h3 className="text-lg font-black uppercase text-[#F1F5F9] tracking-tight">
                      Delivered Free Fire Credentials
                    </h3>
                  </div>
                  <Badge variant="cyan" size="sm">ACTIVE LICENSE</Badge>
                </div>

                <div className="space-y-4">
                  {order.assignedConfigurations.map((cfg, cIdx) => (
                    <div key={cIdx} className="p-5 rounded-2xl bg-[#080D1A]/80 border border-white/[0.10] space-y-4">
                      <h4 className="font-bold text-sm text-[#F1F5F9]">
                        {cfg.productName}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                        {/* DoT Host */}
                        <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-[#94A3B8] block">Private DNS Hostname (Android):</span>
                            <span className="text-[#00E5FF] font-bold">{cfg.dotHost}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(cfg.dotHost, 'Android DoT Hostname')}
                            className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-[#94A3B8] hover:text-[#F1F5F9]"
                          >
                            {copiedKey === 'Android DoT Hostname' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* License Key */}
                        <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-[#94A3B8] block">License Authorization Key:</span>
                            <span className="text-[#A78BFA] font-bold">{cfg.licenseKey}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(cfg.licenseKey, 'License Key')}
                            className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-[#94A3B8] hover:text-[#F1F5F9]"
                          >
                            {copiedKey === 'License Key' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <Link href={cfg.setupGuideUrl}>
                          <Button variant="glass-cyan" size="sm" className="text-xs">
                            <Smartphone className="w-3.5 h-3.5 mr-1.5" />
                            <span>Open Device Setup Guide</span>
                          </Button>
                        </Link>
                        {cfg.expiresAt && (
                          <span className="text-[11px] font-mono text-[#94A3B8]">
                            Valid until: {new Date(cfg.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assistance Section */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-[#8B5CF6] shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-[#F1F5F9]">Need assistance with this order?</h4>
                  <p className="text-[11px] text-[#94A3B8]">
                    Reference #{order.orderId} when messaging our support engineers.
                  </p>
                </div>
              </div>
              <Link href="/contact">
                <Button variant="outline" size="sm" className="text-xs shrink-0">
                  Contact Support
                </Button>
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
