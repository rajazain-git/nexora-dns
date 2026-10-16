'use client';

import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  Filter, 
  Smartphone, 
  PieChart as PieIcon,
  BarChart3,
  Activity,
  ArrowUpRight,
  RefreshCcw,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Order, Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Props {
  orders: Order[];
  products: Product[];
  onNavigateTab?: (tab: string) => void;
  onRefresh?: () => void;
}

type DateRangeOption = 'today' | '7d' | '30d' | '90d' | 'custom';

// Custom Glassmorphic Tooltip for Recharts
function CustomGlassTooltip({ active, payload, label, prefix = '', suffix = '' }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-2xl bg-[#0B1224]/95 backdrop-blur-xl border border-white/[0.18] shadow-glass-strong text-xs font-mono space-y-1.5 min-w-[140px]">
        <p className="text-[11px] text-[#94A3B8] font-bold border-b border-white/[0.08] pb-1 uppercase tracking-wider">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: entry.color || entry.fill }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
              {entry.name}:
            </span>
            <span className="font-bold text-[#F1F5F9]">
              {prefix}{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}{suffix}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function AdminAnalyticsView({
  orders,
  products,
  onNavigateTab,
  onRefresh
}: Props) {
  const [dateRange, setDateRange] = useState<DateRangeOption>('30d');
  const [customStart, setCustomStart] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d.toISOString().slice(0, 10);
  });
  const [customEnd, setCustomEnd] = useState<string>(() => {
    return new Date().toISOString().slice(0, 10);
  });

  // Calculate timestamps for range filtering and historical comparison
  const { currentStartMs, currentEndMs, prevStartMs, prevEndMs } = useMemo(() => {
    const now = new Date();
    let currentStart = new Date();
    let currentEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (dateRange === 'today') {
      currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    } else if (dateRange === '7d') {
      currentStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (dateRange === '30d') {
      currentStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (dateRange === '90d') {
      currentStart = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    } else if (dateRange === 'custom') {
      currentStart = new Date(customStart + 'T00:00:00');
      currentEnd = new Date(customEnd + 'T23:59:59');
    }

    const durationMs = Math.max(currentEnd.getTime() - currentStart.getTime(), 1000 * 60 * 60 * 24);
    const prevStart = new Date(currentStart.getTime() - durationMs);
    const prevEnd = new Date(currentStart.getTime() - 1);

    return {
      currentStartMs: currentStart.getTime(),
      currentEndMs: currentEnd.getTime(),
      prevStartMs: prevStart.getTime(),
      prevEndMs: prevEnd.getTime()
    };
  }, [dateRange, customStart, customEnd]);

  // Filter orders for current period and previous equivalent period
  const { currentOrders, prevOrders } = useMemo(() => {
    const current: Order[] = [];
    const prev: Order[] = [];

    orders.forEach(o => {
      const orderMs = new Date(o.createdAt).getTime();
      if (orderMs >= currentStartMs && orderMs <= currentEndMs) {
        current.push(o);
      } else if (orderMs >= prevStartMs && orderMs <= prevEndMs) {
        prev.push(o);
      }
    });

    return { currentOrders: current, prevOrders: prev };
  }, [orders, currentStartMs, currentEndMs, prevStartMs, prevEndMs]);

  // Aggregate Key Metrics
  const metrics = useMemo(() => {
    // Current period verified revenue & orders
    const verifiedOrders = currentOrders.filter(o => o.paymentStatus === 'verified');
    const grossRevenue = verifiedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const refundedOrders = currentOrders.filter(o => o.paymentStatus === 'refunded');
    const refundedAmount = refundedOrders.reduce((sum, o) => sum + (o.refundDetails?.amount || o.totalAmount), 0);
    const netRevenue = Math.max(0, grossRevenue - refundedAmount);

    const pendingOrders = currentOrders.filter(o => o.paymentStatus === 'pending');
    const fulfilledOrders = currentOrders.filter(o => o.fulfillmentStatus === 'fulfilled');

    // Previous period verified revenue & orders
    const prevVerified = prevOrders.filter(o => o.paymentStatus === 'verified');
    const prevGross = prevVerified.reduce((sum, o) => sum + o.totalAmount, 0);
    const prevRefunded = prevOrders.filter(o => o.paymentStatus === 'refunded');
    const prevRefundedAmount = prevRefunded.reduce((sum, o) => sum + (o.refundDetails?.amount || o.totalAmount), 0);
    const prevNetRevenue = Math.max(0, prevGross - prevRefundedAmount);

    // Percentage comparisons
    const revenueDelta = prevNetRevenue > 0 
      ? ((netRevenue - prevNetRevenue) / prevNetRevenue) * 100 
      : null;

    const ordersDelta = prevOrders.length > 0 
      ? ((currentOrders.length - prevOrders.length) / prevOrders.length) * 100 
      : null;

    const fulfillmentRate = currentOrders.length > 0 
      ? Math.round((fulfilledOrders.length / currentOrders.length) * 100) 
      : 0;

    const awaitingFulfillment = currentOrders.filter(o => o.paymentStatus === 'verified' && o.fulfillmentStatus !== 'fulfilled');
    const failedOrders = currentOrders.filter(o => o.paymentStatus === 'failed');

    // Average Fulfillment Time (Calculated strictly when genuine order timestamps exist)
    const fulfilledWithTimestamps = currentOrders.filter(o => 
      o.fulfillmentStatus === 'fulfilled' && o.updatedAt && (o.paymentProof?.verifiedAt || o.createdAt)
    );
    const avgFulfillmentMinutes = fulfilledWithTimestamps.length > 0
      ? Math.round(
          fulfilledWithTimestamps.reduce((acc, o) => {
            const start = new Date(o.paymentProof?.verifiedAt || o.createdAt).getTime();
            const end = new Date(o.updatedAt).getTime();
            return acc + Math.max(0, end - start);
          }, 0) / (fulfilledWithTimestamps.length * 60000)
        )
      : null;

    // Platform split units and revenue
    let androidUnits = 0;
    let iosUnits = 0;
    let androidRev = 0;
    let iosRev = 0;

    currentOrders.forEach(o => {
      if (o.paymentStatus === 'verified') {
        o.items.forEach(it => {
          const prod = products.find(p => p.id === it.productId);
          if (prod?.platform === 'ios') {
            iosUnits += it.quantity;
            iosRev += it.price * it.quantity;
          } else {
            androidUnits += it.quantity;
            androidRev += it.price * it.quantity;
          }
        });
      }
    });

    return {
      grossRevenue,
      netRevenue,
      refundedAmount,
      totalOrders: currentOrders.length,
      pendingCount: pendingOrders.length,
      fulfilledCount: fulfilledOrders.length,
      awaitingFulfillmentCount: awaitingFulfillment.length,
      failedOrdersCount: failedOrders.length,
      avgFulfillmentMinutes,
      androidUnits,
      iosUnits,
      androidRev,
      iosRev,
      revenueDelta,
      ordersDelta,
      hasPrevData: prevOrders.length > 0,
      fulfillmentRate
    };
  }, [currentOrders, prevOrders, products]);

  // Chart 1: Revenue Over Time (Daily aggregation)
  const revenueChartData = useMemo(() => {
    const dayMap: Record<string, { date: string; revenue: number; gross: number; orders: number }> = {};
    const stepDays = Math.max(1, Math.ceil((currentEndMs - currentStartMs) / (1000 * 60 * 60 * 24)));
    const now = new Date(currentStartMs);

    for (let i = 0; i <= stepDays; i++) {
      const d = new Date(currentStartMs + i * 24 * 60 * 60 * 1000);
      if (d.getTime() > currentEndMs) break;
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dayMap[key] = { date: label, revenue: 0, gross: 0, orders: 0 };
    }

    currentOrders.forEach(o => {
      if (o.paymentStatus === 'verified') {
        const key = o.createdAt.slice(0, 10);
        if (dayMap[key]) {
          dayMap[key].revenue += o.totalAmount;
          dayMap[key].gross += o.totalAmount;
          dayMap[key].orders += 1;
        }
      }
    });

    return Object.values(dayMap);
  }, [currentOrders, currentStartMs, currentEndMs]);

  // Chart 2: Order Status Distribution (Donut Chart)
  const statusDistributionData = useMemo(() => {
    const counts = {
      verified: 0,
      pending: 0,
      refunded: 0,
      failed: 0
    };

    currentOrders.forEach(o => {
      if (o.paymentStatus === 'verified') counts.verified++;
      else if (o.paymentStatus === 'pending') counts.pending++;
      else if (o.paymentStatus === 'refunded') counts.refunded++;
      else counts.failed++;
    });

    const data = [
      { name: 'Verified & Paid', value: counts.verified, color: '#00E5FF' },
      { name: 'Pending Review', value: counts.pending, color: '#F59E0B' },
      { name: 'Refunded', value: counts.refunded, color: '#8B5CF6' },
      { name: 'Failed / Cancelled', value: counts.failed, color: '#64748B' },
    ].filter(d => d.value > 0);

    return data.length > 0 ? data : [{ name: 'No Orders', value: 1, color: '#1E293B' }];
  }, [currentOrders]);

  // Chart 3: Android vs iOS Comparison
  const platformComparisonData = useMemo(() => {
    const map: Record<string, { date: string; android: number; ios: number }> = {};
    const stepDays = Math.max(1, Math.ceil((currentEndMs - currentStartMs) / (1000 * 60 * 60 * 24)));

    for (let i = 0; i <= stepDays; i++) {
      const d = new Date(currentStartMs + i * 24 * 60 * 60 * 1000);
      if (d.getTime() > currentEndMs) break;
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      map[key] = { date: label, android: 0, ios: 0 };
    }

    currentOrders.forEach(o => {
      const key = o.createdAt.slice(0, 10);
      if (map[key]) {
        o.items.forEach(it => {
          const prod = products.find(p => p.id === it.productId);
          if (prod?.platform === 'ios') {
            map[key].ios += it.quantity;
          } else {
            map[key].android += it.quantity;
          }
        });
      }
    });

    return Object.values(map);
  }, [currentOrders, products, currentStartMs, currentEndMs]);

  // Chart 4: Best-Selling Products (Horizontal Ranking)
  const bestSellingProducts = useMemo(() => {
    const countMap: Record<string, { name: string; platform: string; units: number; revenue: number }> = {};

    products.forEach(p => {
      countMap[p.id] = { name: p.name, platform: p.platform, units: 0, revenue: 0 };
    });

    currentOrders.forEach(o => {
      if (o.paymentStatus === 'verified') {
        o.items.forEach(it => {
          if (countMap[it.productId]) {
            countMap[it.productId].units += it.quantity;
            countMap[it.productId].revenue += it.price * it.quantity;
          }
        });
      }
    });

    return Object.values(countMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [currentOrders, products]);

  // Recent Sales Activity Timeline (Latest 8 orders)
  const recentSalesActivity = useMemo(() => {
    return [...currentOrders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);
  }, [currentOrders]);

  return (
    <div className="space-y-8">
      {/* Header & Date Range Toolbar */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.04] border border-[#00E5FF]/30 text-xs font-mono text-[#00E5FF] mb-2 font-bold shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>EXECUTIVE ANALYTICS • RECONCILED LEDGER</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-[#F1F5F9] tracking-tight">
            NETWORK SALES & PERFORMANCE ANALYTICS
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-xl mt-1 leading-relaxed">
            Dynamic analytics derived strictly from real customer transactions. Net revenue excludes refunds; pending transactions require manual or automated verification before ledger recognition.
          </p>
        </div>

        {/* Date Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center gap-1">
            {[
              { id: 'today', label: 'Today' },
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '90d', label: '90 Days' },
              { id: 'custom', label: 'Custom' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setDateRange(tab.id as DateRangeOption)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  dateRange === tab.id
                    ? 'bg-[#00E5FF] text-[#080D1A] font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {dateRange === 'custom' && (
            <div className="flex items-center gap-2 p-1 px-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="bg-transparent text-[#F1F5F9] border-none focus:outline-none text-[11px]"
              />
              <span className="text-[#94A3B8]">&rarr;</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="bg-transparent text-[#F1F5F9] border-none focus:outline-none text-[11px]"
              />
            </div>
          )}

          {onRefresh && (
            <Button
              variant="glass"
              size="sm"
              onClick={onRefresh}
              className="text-xs font-mono text-[#94A3B8] hover:text-[#00E5FF]"
              title="Refresh Analytics"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* 4 Large Premium Glass Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Net Revenue */}
        <div className="p-6 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] hover:border-[#00E5FF]/40 hover:-translate-y-0.5 transition-all shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-3">
            <span>TOTAL NET REVENUE</span>
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] text-[#00E5FF] flex items-center justify-center border border-white/[0.08] shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F1F5F9] font-mono">
            Rs. {metrics.netRevenue.toLocaleString()}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono">
            {metrics.hasPrevData && metrics.revenueDelta !== null ? (
              <span className={`inline-flex items-center gap-1 font-bold ${metrics.revenueDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {metrics.revenueDelta >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{metrics.revenueDelta >= 0 ? '+' : ''}{metrics.revenueDelta.toFixed(1)}% vs prev</span>
              </span>
            ) : (
              <span className="text-[#94A3B8] text-[10px]">Baseline period</span>
            )}
            <span className="text-[#94A3B8] text-[10px]">Gross: Rs. {metrics.grossRevenue.toLocaleString()}</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-6 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] hover:border-[#8B5CF6]/40 hover:-translate-y-0.5 transition-all shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-3">
            <span>TOTAL ORDERS</span>
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] text-[#8B5CF6] flex items-center justify-center border border-white/[0.08] shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F1F5F9] font-mono">
            {metrics.totalOrders}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono">
            {metrics.hasPrevData && metrics.ordersDelta !== null ? (
              <span className={`inline-flex items-center gap-1 font-bold ${metrics.ordersDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {metrics.ordersDelta >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{metrics.ordersDelta >= 0 ? '+' : ''}{metrics.ordersDelta.toFixed(1)}% vs prev</span>
              </span>
            ) : (
              <span className="text-[#94A3B8] text-[10px]">No prior period data</span>
            )}
            <span className="text-[#94A3B8] text-[10px]">Refunds: {metrics.refundedAmount > 0 ? `Rs. ${metrics.refundedAmount}` : '0'}</span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="p-6 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] hover:border-amber-400/40 hover:-translate-y-0.5 transition-all shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-3">
            <span>PENDING ORDERS</span>
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center border border-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            {metrics.pendingCount}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-amber-400/90">
            <span>TID Reviews Required</span>
            {onNavigateTab && (
              <button 
                onClick={() => onNavigateTab('orders')}
                className="text-[10px] underline hover:text-[#F1F5F9]"
              >
                Inspect Queue &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Successfully Fulfilled Orders */}
        <div className="p-6 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] hover:border-emerald-400/40 hover:-translate-y-0.5 transition-all shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-3">
            <span>FULFILLED ORDERS</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center border border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            {metrics.fulfilledCount}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono">
            <span className="text-emerald-400/90">{metrics.fulfillmentRate}% Fulfillment Rate</span>
            <span className="text-[#94A3B8] text-[10px]">DoT & DoH Profiles</span>
          </div>
        </div>
      </div>

      {/* Feature F: Operational Intelligence & Fulfillment Velocity Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Awaiting Fulfillment */}
        <div className="p-4.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#94A3B8] block">Awaiting Fulfillment</span>
            <span className="text-xl font-black font-mono text-[#00E5FF]">{metrics.awaitingFulfillmentCount}</span>
            <span className="text-[10px] text-[#94A3B8] block">Verified &amp; unprovisioned</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center border border-[#00E5FF]/20">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: Average Fulfillment Velocity */}
        <div className="p-4.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#94A3B8] block">Avg Delivery Time</span>
            <span className="text-xl font-black font-mono text-emerald-400">
              {metrics.avgFulfillmentMinutes !== null ? `${metrics.avgFulfillmentMinutes} min` : 'Requires History'}
            </span>
            <span className="text-[10px] text-[#94A3B8] block">
              {metrics.avgFulfillmentMinutes !== null ? 'Order to license issuance' : 'Insufficient order timestamps'}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Activity className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: Platform Split */}
        <div className="p-4.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#94A3B8] block">Platform Volume Split</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-bold font-mono text-[#00E5FF]">{metrics.androidUnits} Android</span>
              <span className="text-white/30">•</span>
              <span className="text-sm font-bold font-mono text-[#C4B5FD]">{metrics.iosUnits} iOS</span>
            </div>
            <span className="text-[10px] text-[#94A3B8] block">
              {metrics.androidUnits + metrics.iosUnits > 0
                ? `${Math.round((metrics.androidUnits / (metrics.androidUnits + metrics.iosUnits)) * 100)}% Android share`
                : 'No settled items in range'}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-white/[0.06] text-[#A78BFA] flex items-center justify-center border border-white/[0.10]">
            <Smartphone className="w-4 h-4" />
          </div>
        </div>

        {/* Card 4: Checkout & Payment Failures */}
        <div className="p-4.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#94A3B8] block">Payment Failures</span>
            <span className="text-xl font-black font-mono text-rose-400">{metrics.failedOrdersCount}</span>
            <span className="text-[10px] text-[#94A3B8] block">
              {metrics.totalOrders > 0
                ? `${((metrics.failedOrdersCount / metrics.totalOrders) * 100).toFixed(1)}% failure rate`
                : 'Zero recorded failures'}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
            <HelpCircle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Row 1: Interactive Line/Area Chart for Revenue Over Time */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00E5FF]" />
              <span>Revenue Velocity Over Time (PKR)</span>
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Verified daily net revenue from successful Free Fire DNS order settlements
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#00E5FF]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
              Net Settled (PKR)
            </span>
          </div>
        </div>

        {revenueChartData.length === 0 || metrics.netRevenue === 0 ? (
          <div className="py-16 text-center space-y-2 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-xs font-mono text-[#94A3B8]">No verified revenue settled in this timeframe.</p>
            <p className="text-[11px] font-mono text-white/40">Complete test checkouts in Sandbox mode to visualize revenue trajectory.</p>
          </div>
        ) : (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="cyanRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#94A3B8" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <YAxis 
                  stroke="#94A3B8" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickFormatter={(val) => `Rs.${val}`}
                />
                <Tooltip content={<CustomGlassTooltip prefix="Rs. " />} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Net Revenue" 
                  stroke="#00E5FF" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#cyanRevGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Row 2: Two Column Charts: Orders Over Time & Paid vs Pending Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Orders Over Time Bar Chart */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#8B5CF6]" />
                <span>Orders Frequency Over Time</span>
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Total daily checkout order volume
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="barVioletGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#00E5FF" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomGlassTooltip suffix=" orders" />} />
                <Bar dataKey="orders" name="Orders" fill="url(#barVioletGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Paid vs Pending Donut Chart */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong space-y-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-[#00E5FF]" />
              <span>Settlement Status Ratio</span>
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Verified paid vs pending audit orders
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomGlassTooltip suffix=" orders" />} />
                <Pie
                  data={statusDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(255,255,255,0.12)" />
                  ))}
                </Pie>
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className="text-[11px] font-mono text-[#F1F5F9]">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Android vs iOS Sales & Best-Selling Packages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Android vs iOS Bar Comparison */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong space-y-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#00E5FF]" />
              <span>Android vs Apple iOS Units</span>
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Comparative volume of Android (DoT) vs Apple iOS (DoH Profile) packages
            </p>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformComparisonData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomGlassTooltip suffix=" units" />} />
                <Legend 
                  formatter={(val) => <span className="text-[11px] font-mono text-[#F1F5F9]">{val === 'android' ? 'Android DNS' : 'Apple iOS DNS'}</span>}
                />
                <Bar dataKey="android" name="android" fill="#00E5FF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ios" name="ios" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Best-Selling Products Ranking */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong space-y-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
              <span>Top-Performing Packages</span>
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Ranked by verified revenue generated in timeframe
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            {bestSellingProducts.length === 0 || metrics.netRevenue === 0 ? (
              <div className="h-full flex items-center justify-center text-xs font-mono text-[#94A3B8]">
                No product sales recorded in selected timeframe.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={bestSellingProducts}
                  margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis type="number" stroke="#94A3B8" fontSize={10} tickFormatter={(v) => `Rs.${v}`} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="#94A3B8" 
                    fontSize={10} 
                    width={110}
                    tickFormatter={(name) => name.length > 14 ? name.substring(0, 14) + '...' : name}
                  />
                  <Tooltip content={<CustomGlassTooltip prefix="Rs. " />} />
                  <Bar dataKey="revenue" name="Revenue" fill="#00E5FF" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Row 4: Recent Sales Activity Table */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#00E5FF]" />
              <span>Recent Sales Activity Timeline</span>
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Latest transactions recorded across guest checkout
            </p>
          </div>
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-mono text-[#00E5FF] hover:underline"
            >
              View All Orders &rarr;
            </button>
          )}
        </div>

        {recentSalesActivity.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-[#94A3B8] rounded-2xl bg-white/[0.02]">
            No sales activity found in this timeframe.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/[0.03] border-b border-white/[0.08] text-[#94A3B8] uppercase">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-[#F1F5F9]">
                {recentSalesActivity.map(o => (
                  <tr key={o.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#00E5FF]">
                      {o.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-sans font-bold block">{o.customerName || 'Guest Gamer'}</span>
                      <span className="text-[11px] text-[#94A3B8]">{o.customerEmail}</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-sans">
                      {o.items[0]?.productName || 'Free Fire DNS'}
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[11px] text-[#94A3B8]">
                      {o.paymentMethod}
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
                    <td className="py-3.5 px-4 text-right text-[#94A3B8]">
                      {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
