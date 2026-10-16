'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowUpRight, 
  TrendingUp, 
  TrendingDown,
  ShieldCheck, 
  Smartphone, 
  Plus, 
  Tag, 
  Download, 
  Wrench,
  AlertTriangle,
  Activity,
  Sparkles,
  BarChart3,
  CreditCard,
  Users
} from 'lucide-react';
import { Order, Product, AuditLog, SiteSettings } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Props {
  orders: Order[];
  products: Product[];
  auditLogs: AuditLog[];
  settings: SiteSettings;
  onNavigateTab: (tab: string) => void;
  onRefresh: () => void;
}

export function AdminDashboardOverview({
  orders,
  products,
  auditLogs,
  settings,
  onNavigateTab,
  onRefresh
}: Props) {
  const [chartRange, setChartRange] = useState<'7d' | '30d' | 'all'>('7d');

  // Real statistics computed directly from orders
  const stats = useMemo(() => {
    const verifiedOrders = orders.filter(o => o.paymentStatus === 'verified');
    const grossRevenue = verifiedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const refundedOrders = orders.filter(o => o.paymentStatus === 'refunded');
    const refundedAmount = refundedOrders.reduce((sum, o) => sum + (o.refundDetails?.amount || o.totalAmount), 0);
    const netRevenue = Math.max(0, grossRevenue - refundedAmount);

    const pendingOrders = orders.filter(o => o.paymentStatus === 'pending');
    const fulfilledOrders = orders.filter(o => o.fulfillmentStatus === 'fulfilled');
    const cancelledOrders = orders.filter(o => o.paymentStatus === 'failed');

    // Historical comparison (last 30 days vs 31-60 days ago)
    const now = Date.now();
    const period30dMs = 30 * 24 * 60 * 60 * 1000;
    const currentPeriodOrders = orders.filter(o => new Date(o.createdAt).getTime() >= now - period30dMs);
    const prevPeriodOrders = orders.filter(o => {
      const t = new Date(o.createdAt).getTime();
      return t >= now - 2 * period30dMs && t < now - period30dMs;
    });

    const currentPeriodNet = currentPeriodOrders
      .filter(o => o.paymentStatus === 'verified')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const prevPeriodNet = prevPeriodOrders
      .filter(o => o.paymentStatus === 'verified')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const revenueDelta = prevPeriodNet > 0 
      ? ((currentPeriodNet - prevPeriodNet) / prevPeriodNet) * 100 
      : null;

    const ordersDelta = prevPeriodOrders.length > 0 
      ? ((currentPeriodOrders.length - prevPeriodOrders.length) / prevPeriodOrders.length) * 100 
      : null;

    const fulfillmentRate = orders.length > 0 
      ? Math.round((fulfilledOrders.length / orders.length) * 100) 
      : 0;

    return {
      grossRevenue,
      netRevenue,
      refundedAmount,
      completedSales: verifiedOrders.length,
      totalOrders: orders.length,
      pendingOrdersCount: pendingOrders.length,
      fulfilledOrdersCount: fulfilledOrders.length,
      refundedOrdersCount: refundedOrders.length,
      cancelledOrdersCount: cancelledOrders.length,
      fulfillmentRate,
      revenueDelta,
      ordersDelta,
      hasHistoricalComparison: prevPeriodOrders.length > 0
    };
  }, [orders]);

  // Product performance calculation
  const productPerformance = useMemo(() => {
    const perfMap: Record<string, { product: Product; unitsSold: number; revenuePKR: number }> = {};
    
    products.forEach(p => {
      perfMap[p.id] = { product: p, unitsSold: 0, revenuePKR: 0 };
    });

    orders.forEach(o => {
      if (o.paymentStatus === 'verified') {
        o.items.forEach(it => {
          if (perfMap[it.productId]) {
            perfMap[it.productId].unitsSold += it.quantity;
            perfMap[it.productId].revenuePKR += it.price * it.quantity;
          }
        });
      }
    });

    return Object.values(perfMap).sort((a, b) => b.revenuePKR - a.revenuePKR);
  }, [orders, products]);

  // Daily revenue chart data
  const chartData = useMemo(() => {
    const days = chartRange === '7d' ? 7 : chartRange === '30d' ? 30 : 60;
    const now = new Date();
    const result: Array<{ dateStr: string; label: string; amount: number }> = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      result.push({ dateStr: key, label, amount: 0 });
    }

    orders.forEach(o => {
      if (o.paymentStatus === 'verified' && o.createdAt) {
        const orderDate = o.createdAt.slice(0, 10);
        const entry = result.find(r => r.dateStr === orderDate);
        if (entry) {
          entry.amount += o.totalAmount;
        }
      }
    });

    const maxAmount = Math.max(...result.map(r => r.amount), 1);
    return { points: result, maxAmount };
  }, [orders, chartRange]);

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.04] border border-[#00E5FF]/30 text-xs font-mono text-[#00E5FF] mb-2 font-bold shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>OPERATIONAL METRICS • VERIFIED RECORDS ONLY</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-[#F1F5F9] tracking-tight">
            NEXORA FREE FIRE NETWORK OVERVIEW
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-xl mt-1 leading-relaxed">
            Real-time analytics synthesized strictly from authenticated customer purchases, TID reconciliations, and Anycast provisioning events.
          </p>
        </div>

        {/* Quick Actions Cluster */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button 
            variant="glass-cyan" 
            size="sm"
            onClick={() => onNavigateTab('analytics')}
            className="text-xs font-bold"
          >
            <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
            <span>Interactive Analytics</span>
          </Button>

          <Button 
            variant="glass" 
            size="sm"
            onClick={() => onNavigateTab('payments')}
            className="text-xs"
          >
            <CreditCard className="w-3.5 h-3.5 mr-1" />
            <span>Verify TIDs ({stats.pendingOrdersCount})</span>
          </Button>

          <Button 
            variant="glass" 
            size="sm"
            onClick={() => onNavigateTab('products')}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Add FF Package</span>
          </Button>

          <Button 
            variant="glass" 
            size="sm"
            onClick={() => onNavigateTab('customers')}
            className="text-xs text-[#94A3B8]"
          >
            <Users className="w-3.5 h-3.5 mr-1" />
            <span>Guest Orders</span>
          </Button>
        </div>
      </div>

      {/* 4 Large Premium Glass Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="p-6 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] hover:border-[#00E5FF]/40 hover:-translate-y-0.5 transition-all shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-3">
            <span>TOTAL REVENUE (NET)</span>
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] text-[#00E5FF] flex items-center justify-center border border-white/[0.08] shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F1F5F9] font-mono">
            Rs. {stats.netRevenue.toLocaleString()}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono">
            {stats.hasHistoricalComparison && stats.revenueDelta !== null ? (
              <span className={`inline-flex items-center gap-1 font-bold ${stats.revenueDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stats.revenueDelta >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{stats.revenueDelta >= 0 ? '+' : ''}{stats.revenueDelta.toFixed(1)}% vs prev 30d</span>
              </span>
            ) : (
              <span className="text-[#00E5FF] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{stats.completedSales} verified orders</span>
              </span>
            )}
            <span className="text-[#94A3B8] text-[10px]">Gross: Rs. {stats.grossRevenue.toLocaleString()}</span>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="p-6 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] hover:border-[#8B5CF6]/40 hover:-translate-y-0.5 transition-all shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-3">
            <span>TOTAL ORDERS</span>
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] text-[#8B5CF6] flex items-center justify-center border border-white/[0.08] shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F1F5F9] font-mono">
            {stats.totalOrders}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono">
            {stats.hasHistoricalComparison && stats.ordersDelta !== null ? (
              <span className={`inline-flex items-center gap-1 font-bold ${stats.ordersDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stats.ordersDelta >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{stats.ordersDelta >= 0 ? '+' : ''}{stats.ordersDelta.toFixed(1)}% vs prev</span>
              </span>
            ) : (
              <span className="text-[#94A3B8]">All guest checkouts</span>
            )}
            <span className="text-[#94A3B8] text-[10px]">{stats.refundedOrdersCount} refunded</span>
          </div>
        </div>

        {/* Card 3: Pending Orders */}
        <div className="p-6 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] hover:border-amber-400/40 hover:-translate-y-0.5 transition-all shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-3">
            <span>PENDING ORDERS</span>
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center border border-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            {stats.pendingOrdersCount}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-amber-400/90">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Awaiting TID Reconciliation</span>
            </span>
            <button 
              onClick={() => onNavigateTab('payments')}
              className="underline text-[10px] hover:text-[#F1F5F9]"
            >
              Verify &rarr;
            </button>
          </div>
        </div>

        {/* Card 4: Successfully Fulfilled Orders */}
        <div className="p-6 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] hover:border-emerald-400/40 hover:-translate-y-0.5 transition-all shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-3">
            <span>SUCCESSFULLY FULFILLED</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center border border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            {stats.fulfilledOrdersCount}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono">
            <span className="text-emerald-400/90 font-bold">{stats.fulfillmentRate}% Settlement Rate</span>
            <span className="text-[#94A3B8] text-[10px]">DoT & DoH Profiles</span>
          </div>
        </div>
      </div>

      {/* Sales Velocity Chart */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00E5FF]" />
              <span>Verified Sales Velocity (PKR)</span>
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Daily aggregate of verified Easypaisa, JazzCash & Card orders
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/[0.08]">
            <button
              onClick={() => setChartRange('7d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                chartRange === '7d' ? 'bg-[#00E5FF] text-[#080D1A] font-bold shadow-[0_0_10px_rgba(0,229,255,0.3)]' : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setChartRange('30d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                chartRange === '30d' ? 'bg-[#00E5FF] text-[#080D1A] font-bold shadow-[0_0_10px_rgba(0,229,255,0.3)]' : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setChartRange('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                chartRange === 'all' ? 'bg-[#00E5FF] text-[#080D1A] font-bold shadow-[0_0_10px_rgba(0,229,255,0.3)]' : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-6">
          <div className="h-52 flex items-end gap-2 border-b border-white/[0.08] pb-3">
            {chartData.points.map((pt, i) => {
              const heightPercent = Math.max(Math.round((pt.amount / chartData.maxAmount) * 100), 4);
              return (
                <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-[#0B1224]/90 backdrop-blur-md border border-[#00E5FF] text-[10px] font-mono text-[#F1F5F9] px-2.5 py-1 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-lg">
                    {pt.label}: Rs. {pt.amount.toLocaleString()}
                  </div>
                  {/* Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-lg transition-all ${
                      pt.amount > 0 
                        ? 'bg-gradient-to-t from-[#8B5CF6] to-[#00E5FF] group-hover:brightness-125 shadow-[0_0_12px_rgba(0,229,255,0.35)]' 
                        : 'bg-white/[0.05] opacity-50'
                    }`}
                  />
                  {/* Label */}
                  <span className="text-[9px] font-mono text-[#94A3B8] mt-2.5 truncate w-full text-center">
                    {i % Math.ceil(chartData.points.length / 7) === 0 ? pt.label : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Product Performance & Recent Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Free Fire Product Performance */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#8B5CF6]" />
              <span>Free Fire Package Performance</span>
            </h3>
            <button 
              onClick={() => onNavigateTab('products')}
              className="text-xs font-mono text-[#00E5FF] hover:underline"
            >
              Manage All &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {productPerformance.map(({ product, unitsSold, revenuePKR }) => (
              <div 
                key={product.id}
                className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_8px_currentColor] ${
                    product.platform === 'ios' ? 'bg-[#8B5CF6] text-[#8B5CF6]' : 'bg-[#00E5FF] text-[#00E5FF]'
                  }`} />
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#F1F5F9] truncate">
                      {product.name}
                    </p>
                    <p className="text-[10px] font-mono text-[#94A3B8]">
                      {product.durationLabel} • {product.configMethod || (product.platform === 'ios' ? 'Apple DoH' : 'Android DoT')}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <span className="text-xs font-bold text-[#F1F5F9] block">
                    Rs. {revenuePKR.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">
                    {unitsSold} sold
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Administrative Audit Trail */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
              <span>Administrative Audit Trail</span>
            </h3>
            <button 
              onClick={() => onNavigateTab('security')}
              className="text-xs font-mono text-[#00E5FF] hover:underline"
            >
              Full Log &rarr;
            </button>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {auditLogs.length === 0 ? (
              <p className="text-xs text-[#94A3B8] py-8 text-center font-mono">
                No administrative actions logged yet.
              </p>
            ) : (
              auditLogs.slice(0, 6).map(log => (
                <div 
                  key={log.id}
                  className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <span className="text-[#00E5FF] font-bold block truncate">
                      {log.action.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <span className="text-[#94A3B8] text-[11px] truncate block">
                      {log.details || `Target: ${log.targetId}`}
                    </span>
                    <span className="text-[10px] text-white/30">
                      By: {log.adminEmail}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#94A3B8] shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
