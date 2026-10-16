'use client';

import React, { useState } from 'react';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Clock, 
  Percent, 
  Smartphone, 
  AlertTriangle 
} from 'lucide-react';
import { Coupon } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/context/ToastContext';

interface Props {
  coupons: Coupon[];
  onSaveCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (code: string) => void;
}

export function AdminCouponsManager({
  coupons,
  onSaveCoupon,
  onDeleteCoupon
}: Props) {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form Fields
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [minSpendPKR, setMinSpendPKR] = useState<number>(300);
  const [maxUses, setMaxUses] = useState<number>(100);
  const [expiresAt, setExpiresAt] = useState('');
  const [platformRestriction, setPlatformRestriction] = useState<'all' | 'android' | 'ios'>('all');
  const [active, setActive] = useState(true);

  const handleOpenAddModal = () => {
    setEditingCoupon(null);
    setCode('');
    setDiscountType('percentage');
    setDiscountValue(15);
    setMinSpendPKR(300);
    setMaxUses(100);
    setExpiresAt('');
    setPlatformRestriction('all');
    setActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (c: Coupon) => {
    setEditingCoupon(c);
    setCode(c.code);
    setDiscountType(c.discountType || 'percentage');
    setDiscountValue(c.discountValue || c.discountPercentage || 15);
    setMinSpendPKR(c.minSpendPKR || 0);
    setMaxUses(c.maxUses || 0);
    setExpiresAt(c.expiresAt ? c.expiresAt.slice(0, 10) : '');
    setPlatformRestriction(c.platformRestriction || 'all');
    setActive(c.active);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!code.trim()) {
      showToast({ type: 'error', title: 'Code Required', message: 'Please enter a coupon code.' });
      return;
    }

    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');

    const coupon: Coupon = {
      code: cleanCode,
      discountPercentage: discountType === 'percentage' ? Number(discountValue) : Math.round((Number(discountValue) / 500) * 100),
      discountType,
      discountValue: Number(discountValue),
      minSpendPKR: Number(minSpendPKR) || 0,
      active,
      usageCount: editingCoupon?.usageCount || 0,
      maxUses: Number(maxUses) || undefined,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      platformRestriction,
    };

    onSaveCoupon(coupon);
    showToast({
      type: 'success',
      title: 'Coupon Saved',
      message: `Coupon ${cleanCode} has been saved.`,
      duration: 3000
    });
    setIsModalOpen(false);
  };

  const handleDelete = (codeToDelete: string) => {
    onDeleteCoupon(codeToDelete);
    showToast({
      type: 'info',
      title: 'Coupon Removed',
      message: `Coupon ${codeToDelete} has been deleted.`,
      duration: 2500
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.04] border border-[#00E5FF]/30 text-xs font-mono text-[#00E5FF] mb-2 font-bold shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Tag className="w-3.5 h-3.5" />
            <span>PROMOTIONS & DISCOUNT RULES • SERVER VALIDATED</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-[#F1F5F9] tracking-tight">
            COUPONS & PROMOTIONS
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-xl mt-1 leading-relaxed">
            Create percentage or fixed PKR discounts with minimum spend constraints, platform specificity (Android vs iOS), usage caps, and expiration dates.
          </p>
        </div>

        <Button variant="glass-cyan" size="sm" onClick={handleOpenAddModal} className="font-bold">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>New Coupon Code</span>
        </Button>
      </div>

      {/* Coupons Table */}
      <div className="rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] overflow-hidden shadow-glass-strong">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.04] border-b border-white/[0.08] text-[#94A3B8] uppercase">
              <tr>
                <th className="py-4 px-5">Coupon Code</th>
                <th className="py-4 px-5">Discount</th>
                <th className="py-4 px-5">Min Spend</th>
                <th className="py-4 px-5">Platform</th>
                <th className="py-4 px-5">Usage</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-[#F1F5F9]">
              {coupons.map((c) => (
                <tr key={c.code} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-4 px-5 font-bold text-[#00E5FF]">
                    {c.code}
                  </td>
                  <td className="py-4 px-5 font-bold">
                    {c.discountType === 'fixed' 
                      ? `Rs. ${c.discountValue || 0} Fixed` 
                      : `${c.discountPercentage}% Off`}
                  </td>
                  <td className="py-4 px-5 text-[#94A3B8]">
                    {c.minSpendPKR ? `Rs. ${c.minSpendPKR}` : 'No minimum'}
                  </td>
                  <td className="py-4 px-5">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] bg-white/[0.04] border border-white/[0.08]">
                      {c.platformRestriction ? c.platformRestriction.toUpperCase() : 'ALL'}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-[#94A3B8]">
                    {c.usageCount} / {c.maxUses || '∞'}
                  </td>
                  <td className="py-4 px-5">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                      c.active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {c.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(c)}
                      className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#00E5FF] hover:bg-white/[0.06] transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.code)}
                      className="p-1.5 rounded-lg text-[#94A3B8] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full p-7 rounded-3xl bg-[#0B1224]/90 backdrop-blur-2xl border border-white/[0.16] shadow-glass-strong space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono">
              {editingCoupon ? `Edit Coupon: ${code}` : 'Create Promotion Code'}
            </h3>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="FFSNIPER20"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                  >
                    <option value="percentage" className="bg-[#0B1224]">Percentage (%)</option>
                    <option value="fixed" className="bg-[#0B1224]">Fixed PKR (Rs.)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Discount Amount</label>
                  <input
                    type="number"
                    min="1"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Min Spend (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={minSpendPKR}
                    onChange={(e) => setMinSpendPKR(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Max Uses Cap</label>
                  <input
                    type="number"
                    min="1"
                    value={maxUses}
                    onChange={(e) => setMaxUses(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Platform Restriction</label>
                <select
                  value={platformRestriction}
                  onChange={(e) => setPlatformRestriction(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                >
                  <option value="all" className="bg-[#0B1224]">All Packages (Android & iOS)</option>
                  <option value="android" className="bg-[#0B1224]">Android Only Packages</option>
                  <option value="ios" className="bg-[#0B1224]">Apple iOS Only Packages</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Expiration Date (Optional)</label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#00E5FF]"
                  />
                  <span className="text-xs font-mono text-[#F1F5F9]">Coupon Active & Redeemable</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-white/[0.08]">
              <Button variant="glass" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="glass-cyan" size="sm" onClick={handleSave}>
                Save Coupon
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
