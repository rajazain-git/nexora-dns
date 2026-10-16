'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Key, 
  ShoppingBag, 
  HelpCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Shield, 
  Smartphone, 
  LogOut,
  Send,
  Plus,
  Sparkles,
  Server
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { 
  getStoredOrders, 
  getStoredTickets, 
  createTicket 
} from '@/lib/store-db';
import { AssignedDNSConfig, Order, SupportTicket } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function CustomerDashboardPage() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'dns' | 'orders' | 'tickets' | 'profile'>('dns');
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // New ticket state
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'dns-setup' | 'order' | 'billing' | 'general'>('dns-setup');

  useEffect(() => {
    if (user) {
      const allOrders = getStoredOrders();
      // Filter strictly for this customer's orders or email
      const customerOrders = allOrders.filter(
        (o) => o.customerId === user.uid || o.customerEmail.toLowerCase() === user.email.toLowerCase()
      );
      setOrders(customerOrders);

      const allTickets = getStoredTickets();
      const customerTickets = allTickets.filter(
        (t) => t.customerId === user.uid || t.customerEmail.toLowerCase() === user.email.toLowerCase()
      );
      setTickets(customerTickets);
    }
  }, [user]);

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

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim() || !user) return;

    const newTicket = createTicket({
      customerId: user.uid,
      customerEmail: user.email,
      customerName: user.displayName,
      subject: ticketSubject.trim(),
      message: ticketMessage.trim(),
      category: ticketCategory,
      priority: 'medium',
      status: 'open',
    });

    setTickets([newTicket, ...tickets]);
    setIsTicketModalOpen(false);
    setTicketSubject('');
    setTicketMessage('');
    showToast({
      type: 'success',
      title: 'Ticket Submitted',
      message: `Support ticket #${newTicket.id} created.`,
    });
  };

  // Collect all assigned DNS configurations across paid/verified orders
  const activeConfigs: { orderId: string; config: AssignedDNSConfig; isPaid: boolean }[] = [];
  orders.forEach((o) => {
    if (o.paymentStatus === 'verified' && o.assignedConfigurations) {
      o.assignedConfigurations.forEach((cfg) => {
        activeConfigs.push({ orderId: o.id, config: cfg, isPaid: true });
      });
    }
  });

  return (
    <div className="py-10 bg-[#080D1A] min-h-screen relative overflow-hidden">
      {/* Decorative localized glass lighting orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-2/3 right-1/4 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Identity Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] p-0.5 shadow-[0_0_20px_rgba(0,229,255,0.25)]">
              <div className="w-full h-full bg-[#080D1A] rounded-[14px] flex items-center justify-center font-black text-2xl text-[#F1F5F9] font-mono">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'G'}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black uppercase text-[#F1F5F9] tracking-wide">
                  {user?.displayName || 'Active Gamer'}
                </h1>
                <Badge variant="cyan" size="sm">
                  {user?.role?.toUpperCase() || 'MEMBER'}
                </Badge>
              </div>

              <p className="text-xs text-[#94A3B8] font-mono mt-1">
                {user?.email || 'authenticated-session'} • ID: {user?.uid.slice(0, 10)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/store">
              <Button variant="glass-cyan" size="sm">
                <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                <span>Add DNS Plan</span>
              </Button>
            </Link>

            <Button
              variant="glass"
              size="sm"
              onClick={() => logout()}
              className="text-rose-400 hover:text-rose-300 hover:border-rose-500/40"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'dns', label: `Active DNS Credentials (${activeConfigs.length})`, icon: Key },
            { id: 'orders', label: `Order History (${orders.length})`, icon: ShoppingBag },
            { id: 'tickets', label: `Support Tickets (${tickets.length})`, icon: HelpCircle },
            { id: 'profile', label: 'Account Settings', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
                  active
                    ? 'bg-[#00E5FF] text-[#080D1A] shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ACTIVE DNS CONFIGURATIONS */}
        {activeTab === 'dns' && (
          <div className="space-y-6">
            {activeConfigs.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] space-y-4 shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#94A3B8] mx-auto shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                  <Key className="w-7 h-7 text-[#00E5FF]" />
                </div>
                <h3 className="text-lg font-bold text-[#F1F5F9] uppercase tracking-wide">No Active DNS Credentials Found</h3>
                <p className="text-xs text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                  You don't have any active paid DNS packages yet. Check your pending orders or explore our specialized Free Fire Android & iOS configs.
                </p>
                <div className="pt-3 flex justify-center gap-3">
                  <Link href="/store">
                    <Button variant="glass-cyan" size="sm">
                      Browse Free Fire DNS Packages
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {activeConfigs.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] space-y-5 shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] relative overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-[#00E5FF] uppercase font-bold">
                            ORDER #{item.orderId}
                          </span>
                          <span className="text-white/20">•</span>
                          <span className="text-xs font-mono text-[#94A3B8]">
                            License: {item.config.licenseKey}
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-[#F1F5F9] uppercase mt-1">
                          {item.config.productName}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant="emerald" size="sm" dot>
                          ACTIVE ANYCAST ROUTING
                        </Badge>
                        <span className="text-xs font-mono text-[#94A3B8]">
                          Expires: {item.config.expiresAt ? new Date(item.config.expiresAt).toLocaleDateString() : 'Permanent'}
                        </span>
                      </div>
                    </div>

                    {/* Technical Readout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                      
                      {/* Primary IPv4 */}
                      <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#94A3B8] uppercase block mb-1">Primary IPv4 Resolver</span>
                          <span className="text-[#F1F5F9] font-bold text-sm">{item.config.primaryIP}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(item.config.primaryIP, `Primary IP (${item.config.productName})`)}
                          className="px-3 py-1.5 rounded-xl bg-white/[0.06] text-[#94A3B8] hover:text-[#00E5FF] hover:bg-white/[0.10] border border-white/[0.10] flex items-center gap-1.5 transition-colors"
                        >
                          {copiedKey === `Primary IP (${item.config.productName})` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="text-[11px] font-sans font-bold">Copy</span>
                        </button>
                      </div>

                      {/* Secondary IPv4 */}
                      <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#94A3B8] uppercase block mb-1">Secondary IPv4 Resolver</span>
                          <span className="text-[#F1F5F9] font-bold text-sm">{item.config.secondaryIP}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(item.config.secondaryIP, `Secondary IP (${item.config.productName})`)}
                          className="px-3 py-1.5 rounded-xl bg-white/[0.06] text-[#94A3B8] hover:text-[#00E5FF] hover:bg-white/[0.10] border border-white/[0.10] flex items-center gap-1.5 transition-colors"
                        >
                          {copiedKey === `Secondary IP (${item.config.productName})` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="text-[11px] font-sans font-bold">Copy</span>
                        </button>
                      </div>

                      {/* Android Private DNS */}
                      <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#94A3B8] uppercase block mb-1">Android Private DNS (DoT)</span>
                          <span className="text-[#00E5FF] font-bold text-sm">{item.config.dotHost}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(item.config.dotHost, `Android Hostname (${item.config.productName})`)}
                          className="px-3 py-1.5 rounded-xl bg-white/[0.06] text-[#94A3B8] hover:text-[#00E5FF] hover:bg-white/[0.10] border border-white/[0.10] flex items-center gap-1.5 transition-colors"
                        >
                          {copiedKey === `Android Hostname (${item.config.productName})` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="text-[11px] font-sans font-bold">Copy</span>
                        </button>
                      </div>

                      {/* Encrypted DoH URL */}
                      <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                          <span className="text-[10px] text-[#94A3B8] uppercase block mb-1">Encrypted DNS-over-HTTPS (DoH)</span>
                          <span className="text-[#94A3B8] text-xs truncate block">{item.config.dohUrl}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(item.config.dohUrl, `DoH URL (${item.config.productName})`)}
                          className="px-3 py-1.5 rounded-xl bg-white/[0.06] text-[#94A3B8] hover:text-[#00E5FF] hover:bg-white/[0.10] border border-white/[0.10] flex items-center gap-1.5 shrink-0 transition-colors"
                        >
                          {copiedKey === `DoH URL (${item.config.productName})` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="text-[11px] font-sans font-bold">Copy</span>
                        </button>
                      </div>

                    </div>

                    {/* Quick Guide Links */}
                    <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-[#94A3B8]">
                      <span>Mobile Setup Guides:</span>
                      <Link href="/setup-guides/android" className="text-[#00E5FF] hover:underline flex items-center gap-1.5 transition-colors font-bold">
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Android Private DNS</span>
                      </Link>
                      <span className="text-white/20">•</span>
                      <Link href="/setup-guides/ios" className="text-[#8B5CF6] hover:underline flex items-center gap-1.5 transition-colors font-bold">
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Apple iOS (.mobileconfig)</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ORDER HISTORY */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="p-10 text-center rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong">
                <p className="text-[#94A3B8] text-sm">No orders recorded for this account.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-3xl border border-white/[0.12] bg-white/[0.06] backdrop-blur-xl shadow-glass-strong">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-white/[0.04] text-[#94A3B8] uppercase text-[11px] border-b border-white/[0.08]">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Package</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Fulfillment</th>
                      <th className="p-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-[#F1F5F9]/80">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="p-4 font-bold text-[#00E5FF]">{ord.id}</td>
                        <td className="p-4">
                          {ord.items.map((i) => i.productName).join(', ')}
                        </td>
                        <td className="p-4 font-bold text-[#F1F5F9]">
                          {ord.currency === 'PKR' ? `Rs. ${ord.totalAmount}` : `$${ord.totalAmount}`}
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={
                              ord.paymentStatus === 'verified'
                                ? 'emerald'
                                : ord.paymentStatus === 'pending'
                                ? 'amber'
                                : 'red'
                            }
                            size="sm"
                          >
                            {ord.paymentStatus.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className={`uppercase font-bold ${
                            ord.fulfillmentStatus === 'fulfilled' ? 'text-emerald-400' : 'text-[#94A3B8]'
                          }`}>
                            {ord.fulfillmentStatus}
                          </span>
                        </td>
                        <td className="p-4 text-[#94A3B8]">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SUPPORT TICKETS */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#F1F5F9] uppercase font-mono">
                  Your Support Inquiries
                </h3>
                <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
                  Direct technical assistance for routing and DNS configuration
                </p>
              </div>

              <Button
                variant="glass-cyan"
                size="sm"
                onClick={() => setIsTicketModalOpen(true)}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>New Ticket</span>
              </Button>
            </div>

            {tickets.length === 0 ? (
              <div className="p-10 text-center rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong space-y-3">
                <p className="text-[#94A3B8] text-sm">You currently have no open support tickets.</p>
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => setIsTicketModalOpen(true)}
                >
                  Create a Support Request
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((tck) => (
                  <div
                    key={tck.id}
                    className="p-6 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] space-y-3 font-sans shadow-glass-strong"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Badge
                          variant={tck.status === 'resolved' ? 'emerald' : tck.status === 'open' ? 'cyan' : 'amber'}
                          size="sm"
                        >
                          {tck.status.toUpperCase()}
                        </Badge>
                        <span className="text-xs font-mono text-[#94A3B8] font-bold">{tck.id}</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#94A3B8]">
                        {new Date(tck.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#F1F5F9]">{tck.subject}</h4>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">{tck.message}</p>

                    {/* Replies */}
                    {tck.replies.length > 0 && (
                      <div className="pt-3 border-t border-white/[0.08] space-y-2">
                        <span className="text-[10px] font-mono uppercase text-[#94A3B8] block">
                          Official Engineer Response:
                        </span>
                        {tck.replies.map((rep) => (
                          <div key={rep.id} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs">
                            <span className="text-[10px] text-[#00E5FF] font-mono font-bold block mb-1">
                              {rep.senderName} ({rep.sender.toUpperCase()}):
                            </span>
                            <p className="text-[#F1F5F9]/80 leading-relaxed">{rep.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === 'profile' && (
          <div className="p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] max-w-xl space-y-4 font-mono text-xs shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
            <h3 className="text-sm font-bold uppercase text-[#F1F5F9] font-mono border-b border-white/[0.08] pb-3">
              Account Metadata
            </h3>
            <div className="space-y-2.5 text-[#94A3B8]">
              <p><strong className="text-[#F1F5F9] uppercase">Gamer Tag:</strong> {user?.displayName}</p>
              <p><strong className="text-[#F1F5F9] uppercase">Email:</strong> {user?.email}</p>
              <p><strong className="text-[#F1F5F9] uppercase">Phone:</strong> {user?.phone || 'Not provided'}</p>
              <p><strong className="text-[#F1F5F9] uppercase">Account Role:</strong> {user?.role.toUpperCase()}</p>
              <p><strong className="text-[#F1F5F9] uppercase">Member Since:</strong> {new Date(user?.createdAt || '').toLocaleDateString()}</p>
            </div>
          </div>
        )}

      </div>

      {/* Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0B1224]/90 backdrop-blur-2xl border border-white/[0.16] rounded-3xl p-7 shadow-glass-strong space-y-5">
            <h3 className="text-base font-bold text-[#F1F5F9] uppercase font-mono">
              Open Support Ticket
            </h3>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[#94A3B8] font-mono mb-1.5 text-[11px] uppercase">
                  Category
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e: any) => setTicketCategory(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl px-3.5 py-2.5 text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] font-mono text-xs backdrop-blur-md"
                >
                  <option value="dns-setup" className="bg-[#0B1224] text-[#F1F5F9]">DNS Setup & Device Configuration</option>
                  <option value="order" className="bg-[#0B1224] text-[#F1F5F9]">Order & Payment Verification</option>
                  <option value="billing" className="bg-[#0B1224] text-[#F1F5F9]">Billing & Refund Request</option>
                  <option value="general" className="bg-[#0B1224] text-[#F1F5F9]">General Technical Question</option>
                </select>
              </div>

              <div>
                <label className="block text-[#94A3B8] font-mono mb-1.5 text-[11px] uppercase">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Android Private DNS showing handshake timeout"
                  className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl px-3.5 py-2.5 text-[#F1F5F9] placeholder-neutral-500 focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] font-mono mb-1.5 text-[11px] uppercase">
                  Detailed Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Please specify your game title, ISP (Jazz/Zong/Nayatel/PTCL), and device model..."
                  className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl px-3.5 py-2.5 text-[#F1F5F9] placeholder-neutral-500 focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="glass"
                  size="sm"
                  onClick={() => setIsTicketModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="glass-cyan" size="sm">
                  Submit Ticket
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
