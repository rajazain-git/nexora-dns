'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  Send, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Smartphone, 
  MessageSquare,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { SupportTicket, SiteSettings, NotificationConfig } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/context/ToastContext';

interface Props {
  tickets: SupportTicket[];
  settings: SiteSettings;
  onReplyTicket: (ticketId: string, message: string) => void;
  onUpdateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
  onSaveNotificationSettings: (notif: NotificationConfig) => void;
}

export function AdminNotificationsManager({
  tickets,
  settings,
  onReplyTicket,
  onUpdateTicketStatus,
  onSaveNotificationSettings
}: Props) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'alerts' | 'tickets' | 'integrations'>('alerts');

  // Selected Ticket Drawer
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Notification Config State
  const [notifConfig, setNotifConfig] = useState<NotificationConfig>(() => {
    return settings.notifications || {
      emailProvider: 'none',
      adminEmail: 'admin@nexoradns.com',
      notifyOnOrder: true,
      notifyOnVerification: true,
      webhookUrl: '',
      webhookEnabled: false,
    };
  });

  const handleSendReply = () => {
    if (!selectedTicket || !replyMessage.trim()) return;
    onReplyTicket(selectedTicket.id, replyMessage.trim());
    showToast({
      type: 'success',
      title: 'Reply Sent',
      message: 'Support reply added to ticket history.',
      duration: 3000
    });
    setReplyMessage('');
    setSelectedTicket(null);
  };

  const handleSaveIntegrations = () => {
    onSaveNotificationSettings(notifConfig);
    showToast({
      type: 'success',
      title: 'Integrations Saved',
      message: 'Notification settings updated.',
      duration: 3000
    });
  };

  const handleTestWebhook = () => {
    if (!notifConfig.webhookUrl) {
      showToast({ type: 'error', title: 'URL Required', message: 'Please enter a webhook URL first.' });
      return;
    }
    showToast({
      type: 'info',
      title: 'Test Webhook Dispatched',
      message: `Simulated JSON payload dispatched to ${notifConfig.webhookUrl.substring(0, 30)}...`,
      duration: 4000
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.04] border border-[#00E5FF]/30 text-xs font-mono text-[#00E5FF] mb-2 font-bold shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Bell className="w-3.5 h-3.5" />
            <span>NOTIFICATIONS & SUPPORT • INCIDENT MANAGEMENT</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-[#F1F5F9] tracking-tight">
            SUPPORT & ALERT CENTER
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-xl mt-1 leading-relaxed">
            Monitor real-time system alerts, customer support inquiries, and configure notification webhooks for order alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="cyan" size="md">
            {tickets.filter(t => t.status === 'open').length} Open Tickets
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08]">
        {[
          { id: 'alerts', label: 'System Alerts & Incidents' },
          { id: 'tickets', label: `Customer Inquiries (${tickets.length})` },
          { id: 'integrations', label: 'Email & Webhook Integrations' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all ${
              activeTab === tab.id
                ? 'bg-[#00E5FF] text-[#080D1A] font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/[0.04]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: System Alerts */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-emerald-500/30 space-y-2 shadow-glass-strong">
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                <span className="font-bold">ANYCAST RESOLVERS</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-xs text-[#F1F5F9] font-bold">100% Operational</p>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">Port 853 DoT & 443 DoH listening across Asia-South edge.</p>
            </div>

            <div className="p-5 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-amber-400/30 space-y-2 shadow-glass-strong">
              <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                <span className="font-bold">PAYMENT AUDIT QUEUE</span>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <p className="text-xs text-[#F1F5F9] font-bold">Manual TID Verification</p>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">Easypaisa and JazzCash TIDs awaiting staff audit in Order Desk.</p>
            </div>

            <div className="p-5 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-[#00E5FF]/30 space-y-2 shadow-glass-strong">
              <div className="flex items-center justify-between text-xs font-mono text-[#00E5FF]">
                <span className="font-bold">DELIVERY PIPELINE</span>
                <Smartphone className="w-4 h-4" />
              </div>
              <p className="text-xs text-[#F1F5F9] font-bold">Zero Provisioning Failures</p>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">Signed Apple profiles and Private DNS keys generated cleanly.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Support Tickets */}
      {activeTab === 'tickets' && (
        <div className="rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] overflow-hidden shadow-glass-strong">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/[0.04] border-b border-white/[0.08] text-[#94A3B8] uppercase">
                <tr>
                  <th className="py-4 px-5">Ticket ID</th>
                  <th className="py-4 px-5">Customer</th>
                  <th className="py-4 px-5">Subject</th>
                  <th className="py-4 px-5">Category</th>
                  <th className="py-4 px-5">Priority</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-[#F1F5F9]">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#94A3B8]">
                      No active support tickets from players.
                    </td>
                  </tr>
                ) : (
                  tickets.map(t => (
                    <tr key={t.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-4 px-5 text-[#00E5FF] font-bold">{t.id}</td>
                      <td className="py-4 px-5 font-sans font-bold">{t.customerName}</td>
                      <td className="py-4 px-5 font-sans max-w-xs truncate">{t.subject}</td>
                      <td className="py-4 px-5 text-[#94A3B8]">{t.category}</td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                          t.priority === 'critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          t.priority === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-white/[0.04] text-[#94A3B8] border border-white/[0.08]'
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                          t.status === 'open' ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30' :
                          t.status === 'in-progress' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <Button
                          variant="glass"
                          size="sm"
                          onClick={() => setSelectedTicket(t)}
                          className="text-[11px] py-1 px-3 text-[#00E5FF]"
                        >
                          <MessageSquare className="w-3.5 h-3.5 mr-1" />
                          <span>Reply</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Integrations */}
      {activeTab === 'integrations' && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong space-y-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono">
              Order Alert Webhooks & Dispatch Settings
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
              Receive instant alerts to your private Discord server, Telegram bot, or webhook endpoint when new guest checkouts occur.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">
                Admin Notification Email
              </label>
              <input
                type="email"
                value={notifConfig.adminEmail}
                onChange={(e) => setNotifConfig(prev => ({ ...prev, adminEmail: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">
                Discord / Telegram Alert Webhook URL
              </label>
              <input
                type="url"
                value={notifConfig.webhookUrl}
                onChange={(e) => setNotifConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                placeholder="https://discord.com/api/webhooks/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifConfig.notifyOnOrder}
                  onChange={(e) => setNotifConfig(prev => ({ ...prev, notifyOnOrder: e.target.checked }))}
                  className="w-4 h-4 rounded accent-[#00E5FF]"
                />
                <span className="text-xs font-mono text-[#F1F5F9]">Notify immediately on new order</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifConfig.notifyOnVerification}
                  onChange={(e) => setNotifConfig(prev => ({ ...prev, notifyOnVerification: e.target.checked }))}
                  className="w-4 h-4 rounded accent-[#00E5FF]"
                />
                <span className="text-xs font-mono text-[#F1F5F9]">Notify upon payment verification</span>
              </label>
            </div>

            <div className="flex gap-2.5 pt-4 border-t border-white/[0.08]">
              <Button variant="glass" size="sm" onClick={handleTestWebhook}>
                Dispatch Test Payload
              </Button>
              <Button variant="glass-cyan" size="sm" onClick={handleSaveIntegrations} className="shadow-[0_0_15px_rgba(0,229,255,0.25)]">
                Save Integration Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full p-7 rounded-3xl bg-[#0B1224]/90 backdrop-blur-2xl border border-white/[0.16] shadow-glass-strong space-y-4">
            <div className="flex justify-between items-start border-b border-white/[0.08] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#00E5FF] font-bold">{selectedTicket.id}</span>
                <h4 className="text-sm font-bold text-[#F1F5F9]">{selectedTicket.subject}</h4>
                <p className="text-xs text-[#94A3B8]">Customer: {selectedTicket.customerName} ({selectedTicket.customerEmail})</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="w-8 h-8 rounded-xl bg-white/[0.04] text-[#94A3B8] hover:text-white flex items-center justify-center transition-colors">✕</button>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono space-y-1">
              <span className="text-[10px] text-[#94A3B8] uppercase">CUSTOMER INQUIRY:</span>
              <p className="text-[#F1F5F9] leading-relaxed">{selectedTicket.message}</p>
            </div>

            {/* Replies */}
            {selectedTicket.replies.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedTicket.replies.map(r => (
                  <div key={r.id} className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono space-y-1">
                    <span className="text-[10px] text-[#00E5FF] font-bold">{r.senderName} ({r.sender})</span>
                    <p className="text-[#F1F5F9] leading-relaxed">{r.message}</p>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Admin Response</label>
              <textarea
                rows={3}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your official technical response..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="flex gap-2">
                <button
                  onClick={() => onUpdateTicketStatus(selectedTicket.id, 'resolved')}
                  className="text-xs font-mono text-emerald-400 hover:underline"
                >
                  Mark Resolved
                </button>
              </div>
              <div className="flex gap-2.5">
                <Button variant="glass" size="sm" onClick={() => setSelectedTicket(null)}>
                  Cancel
                </Button>
                <Button variant="glass-cyan" size="sm" onClick={handleSendReply}>
                  Send Response
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
