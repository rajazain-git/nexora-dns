'use client';

import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  RotateCcw, 
  Download, 
  Eye, 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  Smartphone, 
  DollarSign, 
  Key, 
  MessageSquare,
  Lock,
  Plus,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Order, PaymentStatus, FulfillmentStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/context/ToastContext';

interface Props {
  orders: Order[];
  onVerifyPayment: (orderId: string, notes: string) => void;
  onRefundOrder: (orderId: string, amount: number, reason: string) => void;
  onAddOrderNote: (orderId: string, note: string) => void;
  onManualFulfill: (orderId: string) => void;
  onExportCSV: () => void;
}

export function AdminOrdersManager({
  orders,
  onVerifyPayment,
  onRefundOrder,
  onAddOrderNote,
  onManualFulfill,
  onExportCSV
}: Props) {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'refunded'>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  // Selected Order Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Verification & Audit State
  const [verificationNote, setVerificationNote] = useState('');
  const [newAdminNote, setNewAdminNote] = useState('');

  // Refund State
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState('');

  const filteredOrders = useMemo(() => {
    let result = orders.filter(o => {
      if (statusFilter !== 'all' && o.paymentStatus !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = o.id.toLowerCase().includes(q);
        const matchName = o.customerName.toLowerCase().includes(q);
        const matchEmail = o.customerEmail.toLowerCase().includes(q);
        const matchPhone = o.customerPhone?.toLowerCase().includes(q);
        const matchTid = o.paymentProof?.transactionId?.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchEmail && !matchPhone && !matchTid) return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'amount-desc') {
        return b.totalAmount - a.totalAmount;
      }
      if (sortBy === 'amount-asc') {
        return a.totalAmount - b.totalAmount;
      }
      return 0;
    });

    return result;
  }, [orders, statusFilter, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage]);

  const handleVerify = () => {
    if (!selectedOrder) return;
    if (!verificationNote.trim()) {
      showToast({
        type: 'error',
        title: 'Audit Note Required',
        message: 'You must provide a verification note (e.g. TID reconciled against SMS).',
      });
      return;
    }

    onVerifyPayment(selectedOrder.id, verificationNote.trim());
    showToast({
      type: 'success',
      title: 'Payment Verified & DNS Provisioned',
      message: `Order #${selectedOrder.id} has been verified and fulfilled.`,
      duration: 3500,
    });
    setVerificationNote('');
    setSelectedOrder(null);
  };

  const handleAddNote = () => {
    if (!selectedOrder || !newAdminNote.trim()) return;
    onAddOrderNote(selectedOrder.id, newAdminNote.trim());
    showToast({ type: 'success', title: 'Note Added', message: 'Internal audit note logged.' });
    setNewAdminNote('');
  };

  const handleOpenRefund = (o: Order) => {
    setSelectedOrder(o);
    setRefundAmount(o.totalAmount);
    setRefundReason('');
    setIsRefundModalOpen(true);
  };

  const handleConfirmRefund = () => {
    if (!selectedOrder) return;
    if (!refundReason.trim()) {
      showToast({ type: 'error', title: 'Reason Required', message: 'Please specify refund justification.' });
      return;
    }

    onRefundOrder(selectedOrder.id, refundAmount, refundReason.trim());
    showToast({
      type: 'info',
      title: 'Order Refunded',
      message: `Refund recorded for Order #${selectedOrder.id}.`,
      duration: 3000,
    });
    setIsRefundModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.04] border border-[#00E5FF]/30 text-xs font-mono text-[#00E5FF] mb-2 font-bold shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>PAYMENT RECONCILIATION & ORDER LIFECYCLE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-[#F1F5F9] tracking-tight">
            LIVE ORDERS MANAGEMENT
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-xl mt-1 leading-relaxed">
            Verify Easypaisa, JazzCash & Card Transaction IDs (TID). Verification immediately provisions dedicated Free Fire Anycast DNS credentials and unlocks the Apple iOS .mobileconfig profile.
          </p>
        </div>

        <Button variant="glass" size="sm" onClick={onExportCSV} className="font-mono text-xs">
          <Download className="w-4 h-4 mr-1.5" />
          <span>Export Orders CSV</span>
        </Button>
      </div>

      {/* Toolbar: Search, Status Filters, Sorting */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Order ID, Name, Phone, or TID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] placeholder-neutral-500 backdrop-blur-md transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'pending', label: 'Pending Review' },
              { id: 'verified', label: 'Verified & Paid' },
              { id: 'refunded', label: 'Refunded' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => {
                  setStatusFilter(f.id as any);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                  statusFilter === f.id
                    ? 'bg-[#00E5FF] text-[#080D1A] font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 p-1 px-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#00E5FF]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-[#F1F5F9] border-none focus:outline-none text-xs font-mono cursor-pointer"
            >
              <option value="date-desc" className="bg-[#0B1224] text-[#F1F5F9]">Newest First</option>
              <option value="date-asc" className="bg-[#0B1224] text-[#F1F5F9]">Oldest First</option>
              <option value="amount-desc" className="bg-[#0B1224] text-[#F1F5F9]">Amount: High to Low</option>
              <option value="amount-asc" className="bg-[#0B1224] text-[#F1F5F9]">Amount: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] overflow-hidden shadow-glass-strong">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.04] border-b border-white/[0.08] text-[#94A3B8] uppercase">
              <tr>
                <th className="py-4 px-5">Order ID & Date</th>
                <th className="py-4 px-5">Platform</th>
                <th className="py-4 px-5">Customer Reference</th>
                <th className="py-4 px-5">Package Item</th>
                <th className="py-4 px-5">Amount</th>
                <th className="py-4 px-5">Payment & TID</th>
                <th className="py-4 px-5">Fulfillment</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-[#F1F5F9]">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#94A3B8]">
                    No orders matching your search or filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((o) => {
                  const isVerified = o.paymentStatus === 'verified';
                  const isPending = o.paymentStatus === 'pending';
                  const isRefunded = o.paymentStatus === 'refunded';
                  const isIos = o.items.some(i => i.productName.toLowerCase().includes('ios') || i.productName.toLowerCase().includes('apple'));

                  return (
                    <tr key={o.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-4 px-5">
                        <span className="font-bold text-[#00E5FF] block">{o.id}</span>
                        <span className="text-[10px] text-[#94A3B8]">
                          {new Date(o.createdAt).toLocaleDateString()} {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] uppercase font-bold border ${
                          isIos 
                            ? 'bg-[#8B5CF6]/15 text-[#8B5CF6] border-[#8B5CF6]/30' 
                            : 'bg-[#00E5FF]/15 text-[#00E5FF] border-[#00E5FF]/30'
                        }`}>
                          {isIos ? 'Apple iOS' : 'Android'}
                        </span>
                      </td>

                      <td className="py-4 px-5 font-sans">
                        <span className="font-bold block text-white">{o.customerName || 'Guest Gamer'}</span>
                        <span className="text-[11px] font-mono text-[#94A3B8] block">{o.customerEmail}</span>
                        <span className="text-[10px] font-mono text-[#94A3B8]">{o.customerPhone}</span>
                      </td>

                      <td className="py-4 px-5">
                        {o.items.map((it, idx) => (
                          <div key={idx} className="text-[11px] font-sans">
                            {it.productName} (x{it.quantity})
                          </div>
                        ))}
                      </td>

                      <td className="py-4 px-5 font-bold text-[#F1F5F9]">
                        Rs. {o.totalAmount.toLocaleString()}
                        {o.discountAmount > 0 && (
                          <span className="block text-[10px] text-emerald-400 font-mono">
                            -Rs. {o.discountAmount} ({o.couponCode})
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                            isVerified 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : isPending
                              ? 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}>
                            {o.paymentStatus}
                          </span>
                          <span className="text-[10px] text-[#94A3B8] uppercase">
                            {o.paymentMethod}
                          </span>
                        </div>
                        {o.paymentProof?.transactionId && (
                          <span className="text-[10px] text-[#00E5FF] font-mono block">
                            TID: {o.paymentProof.transactionId}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                          o.fulfillmentStatus === 'fulfilled'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-white/[0.05] text-[#94A3B8] border-white/[0.1]'
                        }`}>
                          {o.fulfillmentStatus}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right space-x-2">
                        <Button
                          variant="glass"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(o);
                            setVerificationNote(o.paymentProof?.transactionId ? `TID #${o.paymentProof.transactionId} verified.` : 'Payment confirmed.');
                          }}
                          className="text-[11px] py-1 px-2.5"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>View</span>
                        </Button>

                        {isPending && (
                          <Button
                            variant="glass-cyan"
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(o);
                              setVerificationNote(`TID #${o.paymentProof?.transactionId || 'MANUAL'} confirmed.`);
                            }}
                            className="text-[11px] py-1 px-2.5 font-bold"
                          >
                            <span>Verify</span>
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 sm:p-5 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
          <span className="text-[#94A3B8]">
            Showing <strong className="text-[#F1F5F9]">{filteredOrders.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{' '}
            <strong className="text-[#F1F5F9]">{Math.min(currentPage * pageSize, filteredOrders.length)}</strong> of{' '}
            <strong className="text-[#F1F5F9]">{filteredOrders.length}</strong> orders
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="glass"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="text-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" />
              <span>Previous</span>
            </Button>

            <span className="text-[#F1F5F9] px-2 font-bold">
              {currentPage} / {totalPages}
            </span>

            <Button
              variant="glass"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="text-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Order Details & Audit Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-[#080D1A]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full p-6 sm:p-8 rounded-3xl bg-[#0B1224]/90 backdrop-blur-2xl border border-white/[0.16] shadow-glass-strong space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-xs font-mono text-[#00E5FF] block">ORDER INSPECTION</span>
                <h3 className="text-lg font-bold text-[#F1F5F9] font-mono">
                  #{selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#94A3B8] hover:text-[#F1F5F9] text-sm"
              >
                ✕
              </button>
            </div>

            {/* Customer Details */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-[#94A3B8] block text-[10px] uppercase">Gamer IGN / Name:</span>
                <span className="text-[#F1F5F9] font-bold font-sans text-sm">{selectedOrder.customerName || 'Guest'}</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[10px] uppercase">Email Receipt Destination:</span>
                <span className="text-[#F1F5F9]">{selectedOrder.customerEmail}</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[10px] uppercase">WhatsApp Contact:</span>
                <span className="text-[#F1F5F9]">{selectedOrder.customerPhone || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[10px] uppercase">Order Date:</span>
                <span className="text-[#F1F5F9]">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#94A3B8] block uppercase">Purchased DNS Package:</span>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-[#F1F5F9] font-bold block">{item.productName}</span>
                      <span className="text-[#94A3B8] text-[11px]">Duration: {item.duration} • Qty: {item.quantity}</span>
                    </div>
                    <span className="text-sm font-bold text-[#00E5FF]">Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & TID Proof */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8] uppercase">Payment Method:</span>
                <span className="text-[#F1F5F9] font-bold uppercase">{selectedOrder.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8] uppercase">Customer Submitted TID:</span>
                <span className="text-amber-400 font-bold">{selectedOrder.paymentProof?.transactionId || 'None Provided'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8] uppercase">Sender Account Reference:</span>
                <span className="text-[#F1F5F9]">{selectedOrder.paymentProof?.senderAccount || 'N/A'}</span>
              </div>
            </div>

            {/* Verification Form if Pending */}
            {selectedOrder.paymentStatus === 'pending' && (
              <div className="p-4 rounded-2xl bg-amber-400/[0.05] border border-amber-400/30 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono">
                  <ShieldCheck className="w-4 h-4" />
                  <span>MANUAL TID AUDIT & UNLOCK</span>
                </div>
                <div>
                  <label className="text-[11px] font-mono text-[#94A3B8] block mb-1">
                    Audited Verification Note *
                  </label>
                  <input
                    type="text"
                    value={verificationNote}
                    onChange={(e) => setVerificationNote(e.target.value)}
                    placeholder="e.g. Reconciled against Easypaisa SMS record..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                  />
                </div>
                <Button variant="primary" size="sm" onClick={handleVerify} className="w-full font-bold">
                  Confirm Payment & Deliver Credentials
                </Button>
              </div>
            )}

            {/* Manual Fulfillment (If Paid but Unfulfilled) */}
            {selectedOrder.paymentStatus === 'verified' && selectedOrder.fulfillmentStatus !== 'fulfilled' && (
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-[#00E5FF]/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F1F5F9] block">Manual DNS Fulfillment</span>
                  <span className="text-[11px] text-[#94A3B8]">Generate Anycast hostnames and Apple profile keys now.</span>
                </div>
                <Button 
                  variant="glass-cyan" 
                  size="sm"
                  onClick={() => {
                    onManualFulfill(selectedOrder.id);
                    showToast({ type: 'success', title: 'Fulfilled', message: 'DNS configuration provisioned.' });
                    setSelectedOrder(null);
                  }}
                >
                  Fulfill Now
                </Button>
              </div>
            )}

            {/* Internal Admin Notes */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#94A3B8] block uppercase">INTERNAL ADMIN AUDIT NOTES</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAdminNote}
                  onChange={(e) => setNewAdminNote(e.target.value)}
                  placeholder="Add internal note to this order..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                />
                <Button variant="glass" size="sm" onClick={handleAddNote}>
                  Add Note
                </Button>
              </div>
              {selectedOrder.adminNotes && selectedOrder.adminNotes.length > 0 && (
                <div className="space-y-2 pt-2 max-h-28 overflow-y-auto">
                  {selectedOrder.adminNotes.map(n => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-white/[0.03] text-[11px] font-mono text-[#94A3B8] flex justify-between border border-white/[0.06]">
                      <span>{n.note}</span>
                      <span className="text-[10px] text-white/30">{new Date(n.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              {selectedOrder.paymentStatus !== 'refunded' ? (
                <button
                  onClick={() => handleOpenRefund(selectedOrder)}
                  className="text-xs font-mono text-rose-400 hover:underline"
                >
                  Issue Refund Record...
                </button>
              ) : <span className="text-xs font-mono text-rose-400">Order is Refunded</span>}

              <Button variant="glass" size="sm" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {isRefundModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#080D1A]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full p-7 rounded-3xl bg-[#0B1224]/90 backdrop-blur-2xl border border-rose-500/40 shadow-glass-strong space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 font-mono">
              Record Customer Refund
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Record refund amount and mandatory audited reason.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Refund Amount (PKR)</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-rose-500 backdrop-blur-md"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Reason for Refund</label>
                <textarea
                  rows={2}
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-rose-500 backdrop-blur-md"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <Button variant="glass" size="sm" onClick={() => setIsRefundModalOpen(false)}>
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
