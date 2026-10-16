'use client';

import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle, 
  Download, 
  Eye, 
  Filter,
  DollarSign
} from 'lucide-react';
import { Order, PaymentMethod, PaymentStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/context/ToastContext';

interface Props {
  orders: Order[];
  onVerifyPayment: (orderId: string, notes: string) => void;
  onRefundOrder: (orderId: string, amount: number, reason: string) => void;
  onExportCSV: () => void;
}

export function AdminPaymentsView({
  orders,
  onVerifyPayment,
  onRefundOrder,
  onExportCSV
}: Props) {
  const { showToast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<'all' | PaymentMethod>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Verification Modal
  const [selectedOrderForVerify, setSelectedOrderForVerify] = useState<Order | null>(null);
  const [verificationNote, setVerificationNote] = useState('');

  // Refund Modal
  const [selectedOrderForRefund, setSelectedOrderForRefund] = useState<Order | null>(null);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState('');

  // Computations by Gateway
  const gatewayStats = useMemo(() => {
    const stats: Record<PaymentMethod, { volume: number; verifiedCount: number; pendingCount: number }> = {
      easypaisa: { volume: 0, verifiedCount: 0, pendingCount: 0 },
      jazzcash: { volume: 0, verifiedCount: 0, pendingCount: 0 },
      card: { volume: 0, verifiedCount: 0, pendingCount: 0 },
      sandbox: { volume: 0, verifiedCount: 0, pendingCount: 0 },
    };

    orders.forEach(o => {
      const method = o.paymentMethod || 'sandbox';
      if (stats[method]) {
        if (o.paymentStatus === 'verified') {
          stats[method].volume += o.totalAmount;
          stats[method].verifiedCount += 1;
        } else if (o.paymentStatus === 'pending') {
          stats[method].pendingCount += 1;
        }
      }
    });

    return stats;
  }, [orders]);

  // Pending TID queue
  const pendingTidQueue = useMemo(() => {
    return orders.filter(o => o.paymentStatus === 'pending');
  }, [orders]);

  // Filtered payments list
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (selectedMethod !== 'all' && o.paymentMethod !== selectedMethod) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = o.id.toLowerCase().includes(q);
        const matchTid = o.paymentProof?.transactionId?.toLowerCase().includes(q);
        const matchName = o.customerName.toLowerCase().includes(q);
        const matchPhone = o.customerPhone?.toLowerCase().includes(q);
        const matchEmail = o.customerEmail.toLowerCase().includes(q);
        if (!matchId && !matchTid && !matchName && !matchPhone && !matchEmail) return false;
      }

      return true;
    });
  }, [orders, selectedMethod, searchQuery]);

  const handleConfirmVerification = () => {
    if (!selectedOrderForVerify) return;
    if (!verificationNote.trim()) {
      showToast({
        type: 'error',
        title: 'Audit Note Required',
        message: 'Please provide a verification note (e.g., SMS TID matched).'
      });
      return;
    }

    onVerifyPayment(selectedOrderForVerify.id, verificationNote.trim());
    showToast({
      type: 'success',
      title: 'Payment Verified',
      message: `Order #${selectedOrderForVerify.id} verified and fulfilled.`,
      duration: 3500
    });
    setSelectedOrderForVerify(null);
    setVerificationNote('');
  };

  const handleConfirmRefund = () => {
    if (!selectedOrderForRefund) return;
    if (!refundReason.trim()) {
      showToast({
        type: 'error',
        title: 'Reason Required',
        message: 'Please specify refund justification.'
      });
      return;
    }

    onRefundOrder(selectedOrderForRefund.id, refundAmount, refundReason.trim());
    showToast({
      type: 'info',
      title: 'Refund Processed',
      message: `Refund recorded for Order #${selectedOrderForRefund.id}.`
    });
    setSelectedOrderForRefund(null);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.04] border border-[#00E5FF]/30 text-xs font-mono text-[#00E5FF] mb-2 font-bold shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <DollarSign className="w-3.5 h-3.5" />
            <span>PAYMENT RECONCILIATION & TID CLEARING</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-[#F1F5F9] tracking-tight">
            PAYMENT GATEWAYS & SETTLEMENTS
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-xl mt-1 leading-relaxed">
            Reconcile manual Easypaisa and JazzCash Transaction IDs (TID), inspect card authorizations, and issue verified refunds.
          </p>
        </div>

        <Button variant="glass" size="sm" onClick={onExportCSV} className="font-mono text-xs">
          <Download className="w-4 h-4 mr-1.5" />
          <span>Export Ledger CSV</span>
        </Button>
      </div>

      {/* Gateway Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Easypaisa */}
        <div className="p-6 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong">
          <div className="flex items-center justify-between mb-3 text-xs font-mono">
            <span className="text-[#94A3B8] uppercase">EASYPAISA (PKR)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-[#F1F5F9]">
            Rs. {gatewayStats.easypaisa.volume.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] font-mono flex items-center justify-between">
            <span className="text-emerald-400">{gatewayStats.easypaisa.verifiedCount} verified</span>
            {gatewayStats.easypaisa.pendingCount > 0 ? (
              <span className="text-amber-400 font-bold">{gatewayStats.easypaisa.pendingCount} pending TID</span>
            ) : (
              <span className="text-[#94A3B8]">0 pending</span>
            )}
          </div>
        </div>

        {/* JazzCash */}
        <div className="p-6 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong">
          <div className="flex items-center justify-between mb-3 text-xs font-mono">
            <span className="text-[#94A3B8] uppercase">JAZZCASH (PKR)</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-[#F1F5F9]">
            Rs. {gatewayStats.jazzcash.volume.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] font-mono flex items-center justify-between">
            <span className="text-rose-400">{gatewayStats.jazzcash.verifiedCount} verified</span>
            {gatewayStats.jazzcash.pendingCount > 0 ? (
              <span className="text-amber-400 font-bold">{gatewayStats.jazzcash.pendingCount} pending TID</span>
            ) : (
              <span className="text-[#94A3B8]">0 pending</span>
            )}
          </div>
        </div>

        {/* Card Payments */}
        <div className="p-6 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong">
          <div className="flex items-center justify-between mb-3 text-xs font-mono">
            <span className="text-[#94A3B8] uppercase">CARD / STRIPE</span>
            <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-[#F1F5F9]">
            Rs. {gatewayStats.card.volume.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] font-mono flex items-center justify-between">
            <span className="text-[#8B5CF6]">{gatewayStats.card.verifiedCount} settled</span>
            <span className="text-[#94A3B8]">Auto-cleared</span>
          </div>
        </div>

        {/* Sandbox */}
        <div className="p-6 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong">
          <div className="flex items-center justify-between mb-3 text-xs font-mono">
            <span className="text-[#94A3B8] uppercase">SANDBOX / TRIALS</span>
            <div className="w-8 h-8 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-[#F1F5F9]">
            Rs. {gatewayStats.sandbox.volume.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] font-mono flex items-center justify-between">
            <span className="text-[#00E5FF]">{gatewayStats.sandbox.verifiedCount} trials/tests</span>
            <span className="text-[#94A3B8]">Instant provision</span>
          </div>
        </div>
      </div>

      {/* Pending TID Queue */}
      {pendingTidQueue.length > 0 && (
        <div className="p-6 sm:p-7 rounded-3xl bg-amber-400/[0.04] backdrop-blur-xl border border-amber-400/30 shadow-glass-strong space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
              <AlertTriangle className="w-4 h-4" />
              <span>Pending Manual TID Verification Queue ({pendingTidQueue.length})</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/[0.03] text-[#94A3B8] uppercase border-b border-white/[0.08]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer & Contact</th>
                  <th className="py-3 px-4">Method & TID Proof</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-[#F1F5F9]">
                {pendingTidQueue.map(o => (
                  <tr key={o.id} className="hover:bg-white/[0.03]">
                    <td className="py-3.5 px-4 font-bold text-[#00E5FF]">
                      {o.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-sans font-bold block">{o.customerName}</span>
                      <span className="text-[11px] text-[#94A3B8]">{o.customerPhone || o.customerEmail}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="uppercase text-[10px] px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] block w-fit mb-1 font-bold">
                        {o.paymentMethod}
                      </span>
                      <span className="text-amber-400 font-bold block">
                        TID: {o.paymentProof?.transactionId || 'Awaiting entry'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-sm">
                      Rs. {o.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="glass-cyan"
                        size="sm"
                        onClick={() => {
                          setSelectedOrderForVerify(o);
                          setVerificationNote(`TID #${o.paymentProof?.transactionId || 'MANUAL'} confirmed.`);
                        }}
                      >
                        Verify & Unlock
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filtered Payments Ledger */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong space-y-5">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by TID, Order ID, Phone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-x-auto w-full sm:w-auto">
            {[
              { id: 'all', label: 'All Gateways' },
              { id: 'easypaisa', label: 'Easypaisa' },
              { id: 'jazzcash', label: 'JazzCash' },
              { id: 'card', label: 'Card' },
              { id: 'sandbox', label: 'Sandbox' },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMethod(m.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                  selectedMethod === m.id
                    ? 'bg-[#00E5FF] text-[#080D1A] font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.03] border-b border-white/[0.08] text-[#94A3B8] uppercase">
              <tr>
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Gateway</th>
                <th className="py-3.5 px-4">TID / Reference</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-[#F1F5F9]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#94A3B8]">
                    No payment records match this filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(o => (
                  <tr key={o.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#00E5FF] block">{o.id}</span>
                      <span className="text-[10px] text-[#94A3B8]">{new Date(o.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-sans font-bold block">{o.customerName}</span>
                      <span className="text-[11px] text-[#94A3B8]">{o.customerPhone || o.customerEmail}</span>
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[11px]">
                      {o.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {o.paymentProof?.transactionId ? (
                        <span className="text-[#F1F5F9] font-bold">{o.paymentProof.transactionId}</span>
                      ) : (
                        <span className="text-white/30">N/A (Auto)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold">
                      Rs. {o.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] uppercase font-bold border ${
                        o.paymentStatus === 'verified'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : o.paymentStatus === 'pending'
                          ? 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {o.paymentStatus === 'pending' ? (
                        <Button
                          variant="glass-cyan"
                          size="sm"
                          onClick={() => {
                            setSelectedOrderForVerify(o);
                            setVerificationNote(`TID #${o.paymentProof?.transactionId || 'MANUAL'} confirmed.`);
                          }}
                        >
                          Verify
                        </Button>
                      ) : o.paymentStatus === 'verified' ? (
                        <Button
                          variant="glass"
                          size="sm"
                          onClick={() => {
                            setSelectedOrderForRefund(o);
                            setRefundAmount(o.totalAmount);
                            setRefundReason('');
                          }}
                          className="text-rose-400 hover:text-rose-300"
                        >
                          Refund
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verify TID Modal */}
      {selectedOrderForVerify && (
        <div className="fixed inset-0 z-50 bg-[#080D1A]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 sm:p-7 rounded-3xl bg-[#0B1224]/90 backdrop-blur-2xl border border-[#00E5FF]/40 shadow-glass-strong space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#00E5FF] font-mono flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span>Verify Payment & Fulfill DNS</span>
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Verify payment for Order <strong>#{selectedOrderForVerify.id}</strong> (Rs. {selectedOrderForVerify.totalAmount.toLocaleString()} via {selectedOrderForVerify.paymentMethod.toUpperCase()}).
            </p>

            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono">
              <span className="text-[#94A3B8] block">Customer Provided TID:</span>
              <strong className="text-amber-400 text-sm block mt-0.5">
                {selectedOrderForVerify.paymentProof?.transactionId || 'None Entered'}
              </strong>
            </div>

            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1">Reconciliation Audit Note *</label>
              <textarea
                rows={2}
                value={verificationNote}
                onChange={(e) => setVerificationNote(e.target.value)}
                placeholder="e.g. Confirmed against Easypaisa SMS receipt..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="glass" size="sm" onClick={() => setSelectedOrderForVerify(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmVerification}>
                Confirm & Fulfill
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {selectedOrderForRefund && (
        <div className="fixed inset-0 z-50 bg-[#080D1A]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 sm:p-7 rounded-3xl bg-[#0B1224]/90 backdrop-blur-2xl border border-rose-500/40 shadow-glass-strong space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 font-mono">
              Record Customer Refund
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Record refund for Order <strong>#{selectedOrderForRefund.id}</strong>.
            </p>

            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1">Refund Amount (PKR)</label>
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1">Mandatory Justification Reason</label>
              <textarea
                rows={2}
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="e.g. Incompatible Android version..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="glass" size="sm" onClick={() => setSelectedOrderForRefund(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleConfirmRefund}>
                Confirm Refund
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
