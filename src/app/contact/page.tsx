'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle, 
  FileText 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { createTicket } from '@/lib/store-db';
import { DEFAULT_SITE_CONFIG } from '@/lib/config';

export default function ContactSupportPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [orderId, setOrderId] = useState('');
  const [category, setCategory] = useState<'dns-setup' | 'order' | 'billing' | 'general'>('dns-setup');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    createTicket({
      customerId: user?.uid || `guest-${Math.random().toString(36).substring(2, 7)}`,
      customerEmail: email.trim(),
      customerName: name.trim(),
      orderId: orderId.trim() || undefined,
      subject: subject.trim(),
      message: message.trim(),
      category: category,
      priority: 'medium',
      status: 'open',
    });

    setIsSubmitted(true);
    showToast({
      type: 'success',
      title: 'Support Request Received',
      message: 'Your ticket has been logged and queued for engineering review.',
    });
  };

  return (
    <div className="py-16 sm:py-20 min-h-screen relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="cyan" size="md">
            FREE FIRE ENGINEERING DESK
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-[#F1F5F9] tracking-tight">
            SUPPORT & TECHNICAL INQUIRIES
          </h1>
          <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed">
            Need Free Fire mobile setup guidance, have order verification questions, or want to report ISP peering issues? Contact our engineering team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Direct Community & WhatsApp Channels */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-4">
              <h3 className="text-base font-bold text-[#F1F5F9] uppercase font-mono tracking-wide">
                Direct Channels
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Connect directly on mobile or join our Discord community for real-time announcements.
              </p>

              <div className="space-y-3 pt-2">
                <a
                  href={`https://wa.me/${DEFAULT_SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-white/[0.04] hover:bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3.5 text-xs text-emerald-300 font-mono transition-all group backdrop-blur-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="font-bold block text-[#F1F5F9] text-sm">WhatsApp Support</span>
                    <span className="text-[11px] text-[#94A3B8]">{DEFAULT_SITE_CONFIG.whatsappDisplay}</span>
                  </div>
                </a>

                <a
                  href={DEFAULT_SITE_CONFIG.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-white/[0.04] hover:bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center gap-3.5 text-xs text-[#C4B5FD] font-mono transition-all group backdrop-blur-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center shrink-0">
                    <Send className="w-5 h-5 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <span className="font-bold block text-[#F1F5F9] text-sm">Discord Community</span>
                    <span className="text-[11px] text-[#94A3B8]">Join Telemetry & Free Fire Channels</span>
                  </div>
                </a>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center gap-3.5 text-xs font-mono text-[#94A3B8] backdrop-blur-md">
                  <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#00E5FF]" />
                  </div>
                  <div>
                    <span className="font-bold block text-[#F1F5F9] text-sm">Official Email</span>
                    <span className="text-[11px] text-[#94A3B8]">{DEFAULT_SITE_CONFIG.supportEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-3 font-mono text-xs">
              <h4 className="text-[#F1F5F9] font-bold uppercase tracking-wider">Quick Resources:</h4>
              <ul className="space-y-2 text-[#94A3B8]">
                <li><Link href="/faq" className="hover:text-[#00E5FF] transition-colors underline">Frequently Asked Questions</Link></li>
                <li><Link href="/setup-guides" className="hover:text-[#00E5FF] transition-colors underline">Free Fire Mobile Setup Guides</Link></li>
                <li><Link href="/refund-policy" className="hover:text-[#00E5FF] transition-colors underline">Refund & Dispute Policy</Link></li>
              </ul>
            </div>

          </div>

          {/* Right Column: Ticket Submission Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-6">
              
              <h3 className="text-base font-bold text-[#F1F5F9] uppercase font-mono tracking-wide">
                Submit Support Ticket
              </h3>

              {isSubmitted ? (
                <div className="p-8 text-center rounded-2xl bg-white/[0.04] border border-emerald-500/40 space-y-3 backdrop-blur-md">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-[#F1F5F9] uppercase">Ticket Successfully Submitted</h4>
                  <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
                    Your request has been logged. You can review all updates and replies in your Customer Dashboard.
                  </p>
                  <div className="pt-2">
                    <Link href="/dashboard">
                      <Button variant="primary" size="sm">
                        View in Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#94A3B8] font-mono mb-1 text-[11px] uppercase">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Zain"
                        className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl px-4 py-2.5 text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40 backdrop-blur-md"
                      />
                    </div>

                    <div>
                      <label className="block text-[#94A3B8] font-mono mb-1 text-[11px] uppercase">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl px-4 py-2.5 text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40 backdrop-blur-md"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#94A3B8] font-mono mb-1 text-[11px] uppercase">
                        Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e: any) => setCategory(e.target.value)}
                        className="w-full bg-[#0B1224] border border-white/[0.12] rounded-xl px-4 py-2.5 text-[#F1F5F9] font-mono text-xs focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40"
                      >
                        <option value="dns-setup" className="bg-[#0B1224] text-[#F1F5F9]">Free Fire DNS Setup & Device Configuration</option>
                        <option value="order" className="bg-[#0B1224] text-[#F1F5F9]">Order & Payment Verification (TID)</option>
                        <option value="billing" className="bg-[#0B1224] text-[#F1F5F9]">Billing & Refund Request</option>
                        <option value="general" className="bg-[#0B1224] text-[#F1F5F9]">General Free Fire Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#94A3B8] font-mono mb-1 text-[11px] uppercase">
                        Order ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="e.g. NX-20261013-A1B2"
                        className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl px-4 py-2.5 text-[#F1F5F9] font-mono focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40 backdrop-blur-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#94A3B8] font-mono mb-1 text-[11px] uppercase">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Summary of your question or issue..."
                      className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl px-4 py-2.5 text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40 backdrop-blur-md"
                    />
                  </div>

                  <div>
                    <label className="block text-[#94A3B8] font-mono mb-1 text-[11px] uppercase">
                      Detailed Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please include your mobile device model (Android/iOS), mobile network (Jazz, Zong, Telenor, Ufone), and details of your inquiry..."
                      className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl px-4 py-2.5 text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40 backdrop-blur-md"
                    />
                  </div>

                  <Button type="submit" variant="primary" size="md" className="w-full font-bold">
                    <span>Submit Support Ticket</span>
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
