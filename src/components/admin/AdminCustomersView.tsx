'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  ShoppingBag, 
  Smartphone, 
  DollarSign, 
  Calendar, 
  Eye, 
  ShieldCheck, 
  Filter,
  CheckCircle2
} from 'lucide-react';
import { Order, Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Props {
  orders: Order[];
  products: Product[];
  onNavigateToOrder?: (orderId: string) => void;
}

interface CustomerSummary {
  key: string;
  name: string;
  email: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  verifiedCount: number;
  preferredPlatform: 'android' | 'ios' | 'both';
  firstSeen: string;
  lastActive: string;
  orders: Order[];
}

export function AdminCustomersView({
  orders,
  products,
  onNavigateToOrder
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'android' | 'ios'>('all');
  const [inspectCustomer, setInspectCustomer] = useState<CustomerSummary | null>(null);

  // Group orders by unique customer identifier (email or phone)
  const customers = useMemo(() => {
    const map: Record<string, CustomerSummary> = {};

    orders.forEach(o => {
      const key = (o.customerEmail || o.customerPhone || o.customerId || 'unknown').toLowerCase().trim();
      if (!map[key]) {
        map[key] = {
          key,
          name: o.customerName || 'Guest Gamer',
          email: o.customerEmail || 'N/A',
          phone: o.customerPhone || 'N/A',
          orderCount: 0,
          totalSpent: 0,
          verifiedCount: 0,
          preferredPlatform: 'android',
          firstSeen: o.createdAt,
          lastActive: o.createdAt,
          orders: []
        };
      }

      map[key].orderCount += 1;
      map[key].orders.push(o);

      if (o.paymentStatus === 'verified') {
        map[key].totalSpent += o.totalAmount;
        map[key].verifiedCount += 1;
      }

      if (new Date(o.createdAt).getTime() < new Date(map[key].firstSeen).getTime()) {
        map[key].firstSeen = o.createdAt;
      }
      if (new Date(o.createdAt).getTime() > new Date(map[key].lastActive).getTime()) {
        map[key].lastActive = o.createdAt;
      }
    });

    // Determine preferred platform for each customer
    Object.values(map).forEach(c => {
      let androidCount = 0;
      let iosCount = 0;

      c.orders.forEach(o => {
        o.items.forEach(it => {
          const prod = products.find(p => p.id === it.productId);
          if (prod?.platform === 'ios') iosCount++;
          else androidCount++;
        });
      });

      if (androidCount > 0 && iosCount === 0) c.preferredPlatform = 'android';
      else if (iosCount > 0 && androidCount === 0) c.preferredPlatform = 'ios';
      else c.preferredPlatform = 'both';
    });

    return Object.values(map).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders, products]);

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      if (platformFilter !== 'all' && c.preferredPlatform !== platformFilter && c.preferredPlatform !== 'both') {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.name.toLowerCase().includes(q);
        const matchEmail = c.email.toLowerCase().includes(q);
        const matchPhone = c.phone.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone) return false;
      }

      return true;
    });
  }, [customers, platformFilter, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.04] border border-[#00E5FF]/30 text-xs font-mono text-[#00E5FF] mb-2 font-bold shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Users className="w-3.5 h-3.5" />
            <span>GUEST ORDER PROFILES & CUSTOMER INTELLIGENCE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-[#F1F5F9] tracking-tight">
            GUEST GAMERS & CUSTOMERS
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-xl mt-1 leading-relaxed">
            Customers use frictionless guest checkout without forced accounts. Order histories and lifetime spending are synthesized automatically from verified transaction records.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-[#94A3B8] block">Total Unique Buyers</span>
          <span className="text-2xl font-black font-mono text-[#00E5FF]">{customers.length}</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by IGN, Email, or WhatsApp..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
          {[
            { id: 'all', label: 'All Players' },
            { id: 'android', label: 'Android Gamers' },
            { id: 'ios', label: 'Apple iOS Gamers' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPlatformFilter(p.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                platformFilter === p.id
                  ? 'bg-[#00E5FF] text-[#080D1A] font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] overflow-hidden shadow-glass-strong">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.03] border-b border-white/[0.08] text-[#94A3B8] uppercase">
              <tr>
                <th className="py-4 px-5">Customer IGN / Name</th>
                <th className="py-4 px-5">Contact & Delivery</th>
                <th className="py-4 px-5">Total Orders</th>
                <th className="py-4 px-5">Lifetime Value (PKR)</th>
                <th className="py-4 px-5">Primary Platform</th>
                <th className="py-4 px-5">Last Order</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-[#F1F5F9]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#94A3B8]">
                    No customer records found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(c => (
                  <tr key={c.key} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-4 px-5 font-sans font-bold text-sm">
                      {c.name}
                    </td>
                    <td className="py-4 px-5">
                      <span className="block text-[#00E5FF] font-mono">{c.email}</span>
                      <span className="text-[11px] text-[#94A3B8] font-mono">{c.phone}</span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-bold">{c.orderCount}</span> orders
                      {c.verifiedCount > 0 && (
                        <span className="text-[10px] text-emerald-400 block font-sans">
                          {c.verifiedCount} verified
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 font-bold text-sm">
                      Rs. {c.totalSpent.toLocaleString()}
                    </td>
                    <td className="py-4 px-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold border ${
                        c.preferredPlatform === 'ios'
                          ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30'
                          : c.preferredPlatform === 'android'
                          ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30'
                          : 'bg-white/[0.06] text-[#F1F5F9] border-white/[0.12]'
                      }`}>
                        {c.preferredPlatform === 'both' ? 'Multi-Device' : c.preferredPlatform.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-[#94A3B8]">
                      {new Date(c.lastActive).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Button
                        variant="glass"
                        size="sm"
                        onClick={() => setInspectCustomer(c)}
                        className="text-xs font-mono text-[#00E5FF]"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        <span>Inspect</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Customer Modal */}
      {inspectCustomer && (
        <div className="fixed inset-0 z-50 bg-[#080D1A]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-[#0B1224]/90 backdrop-blur-2xl border border-white/[0.16] shadow-glass-strong space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <h3 className="text-base font-bold uppercase text-[#F1F5F9] font-sans">
                  {inspectCustomer.name}
                </h3>
                <p className="text-xs font-mono text-[#00E5FF]">{inspectCustomer.email} • {inspectCustomer.phone}</p>
              </div>
              <button onClick={() => setInspectCustomer(null)} className="text-[#94A3B8] hover:text-[#F1F5F9]">✕</button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                <span className="text-[10px] text-[#94A3B8] uppercase block">Lifetime Value</span>
                <span className="text-sm font-black font-mono text-emerald-400">Rs. {inspectCustomer.totalSpent.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                <span className="text-[10px] text-[#94A3B8] uppercase block">Total Orders</span>
                <span className="text-sm font-black font-mono text-[#00E5FF]">{inspectCustomer.orderCount}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                <span className="text-[10px] text-[#94A3B8] uppercase block">Platform</span>
                <span className="text-sm font-black font-mono text-[#8B5CF6] uppercase">{inspectCustomer.preferredPlatform}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-[#94A3B8] block uppercase">Order History:</span>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {inspectCustomer.orders.map(o => (
                  <div key={o.id} className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="font-bold text-[#00E5FF] block">{o.id}</span>
                      <span className="text-[11px] text-[#94A3B8] font-sans">{o.items[0]?.productName || 'Package'}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#F1F5F9] block">Rs. {o.totalAmount.toLocaleString()}</span>
                      <span className={`text-[10px] uppercase font-bold ${
                        o.paymentStatus === 'verified' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {o.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="glass" size="sm" onClick={() => setInspectCustomer(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
