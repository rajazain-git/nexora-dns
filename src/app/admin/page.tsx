'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  ShoppingBag, 
  Package, 
  Tag, 
  Settings, 
  FileText, 
  RefreshCcw, 
  Lock, 
  Eye, 
  Palette, 
  Layout, 
  Bell, 
  RotateCcw, 
  Wrench, 
  Activity, 
  LogOut,
  BarChart3,
  CreditCard,
  Users,
  Search,
  Menu,
  X,
  ChevronRight,
  HelpCircle,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { 
  getStoredOrders, 
  getStoredProducts, 
  saveProduct, 
  deleteProduct, 
  getStoredCoupons, 
  saveCoupon, 
  deleteCoupon,
  getStoredTickets, 
  replyToTicket, 
  updateTicketStatus,
  getStoredAuditLogs, 
  getPublishedSettings,
  saveDraftSettings,
  publishSettings,
  getSettingsVersions,
  restoreSettingsVersion,
  verifyPayment,
  refundOrder,
  addOrderAdminNote,
  manuallyFulfillOrder,
  exportOrdersToCSV
} from '@/lib/store-db';
import { 
  Order, 
  Product, 
  Coupon, 
  SupportTicket, 
  AuditLog, 
  SiteSettings, 
  SettingsVersion,
  NotificationConfig 
} from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Logo } from '@/components/ui/Logo';

// Admin Sub-components
import { AdminDashboardOverview } from '@/components/admin/AdminDashboardOverview';
import { AdminAnalyticsView } from '@/components/admin/AdminAnalyticsView';
import { AdminProductsManager } from '@/components/admin/AdminProductsManager';
import { AdminOrdersManager } from '@/components/admin/AdminOrdersManager';
import { AdminPaymentsView } from '@/components/admin/AdminPaymentsView';
import { AdminCustomersView } from '@/components/admin/AdminCustomersView';
import { AdminAppearanceStudio } from '@/components/admin/AdminAppearanceStudio';
import { AdminHomepageBuilder } from '@/components/admin/AdminHomepageBuilder';
import { AdminCouponsManager } from '@/components/admin/AdminCouponsManager';
import { AdminNotificationsManager } from '@/components/admin/AdminNotificationsManager';
import { AdminSecurityCenter } from '@/components/admin/AdminSecurityCenter';
import { AdminBackupsManager } from '@/components/admin/AdminBackupsManager';
import { AdminSettingsView } from '@/components/admin/AdminSettingsView';

export type AdminTab = 
  | 'overview'
  | 'analytics'
  | 'products'
  | 'orders'
  | 'payments'
  | 'customers'
  | 'customizer'
  | 'homepage'
  | 'coupons'
  | 'support'
  | 'notifications'
  | 'security'
  | 'backups'
  | 'settings';

export default function AdminControlCenterPage() {
  const { user, isAdmin, loginWithEmail, logout } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Live state from store-db
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(() => getPublishedSettings());
  const [versions, setVersions] = useState<SettingsVersion[]>([]);

  // Admin login fallback form state
  const [adminEmailInput, setAdminEmailInput] = useState('admin@nexoradns.com');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const refreshData = () => {
    setOrders(getStoredOrders());
    setProducts(getStoredProducts());
    setCoupons(getStoredCoupons());
    setTickets(getStoredTickets());
    setAuditLogs(getStoredAuditLogs());
    setSettings(getPublishedSettings());
    setVersions(getSettingsVersions());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Compute notification badges
  const pendingTidCount = useMemo(() => {
    return orders.filter(o => o.paymentStatus === 'pending').length;
  }, [orders]);

  const openTicketsCount = useMemo(() => {
    return tickets.filter(t => t.status === 'open').length;
  }, [tickets]);

  const totalAlertsCount = pendingTidCount + openTicketsCount;

  // Admin Login Action
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    const res = await loginWithEmail(adminEmailInput, adminPasswordInput);
    setIsLoggingIn(false);

    if (res.success) {
      showToast({
        type: 'success',
        title: 'Authentication Successful',
        message: 'Welcome to the NEXORA Administrator Control Center.',
      });
      refreshData();
    } else {
      setLoginError(res.error || 'Invalid administrator credentials.');
    }
  };

  // Mutators
  const handleSaveDraft = (draft: SiteSettings) => {
    saveDraftSettings(draft, user?.email || 'admin@nexoradns.com');
    setSettings(draft);
    refreshData();
  };

  const handlePublish = (note?: string) => {
    publishSettings(user?.email || 'admin@nexoradns.com', note || 'Published from Control Center');
    refreshData();
  };

  const handleSaveProduct = (prod: Product) => {
    saveProduct(prod, user?.email || 'admin@nexoradns.com');
    refreshData();
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id, user?.email || 'admin@nexoradns.com');
    refreshData();
  };

  const handleSaveCoupon = (c: Coupon) => {
    saveCoupon(c, user?.email || 'admin@nexoradns.com');
    refreshData();
  };

  const handleDeleteCoupon = (code: string) => {
    deleteCoupon(code, user?.email || 'admin@nexoradns.com');
    refreshData();
  };

  const handleVerifyPayment = (orderId: string, notes: string) => {
    verifyPayment(orderId, user?.email || 'admin@nexoradns.com', notes);
    refreshData();
  };

  const handleRefundOrder = (orderId: string, amount: number, reason: string) => {
    refundOrder(orderId, user?.email || 'admin@nexoradns.com', amount, reason);
    refreshData();
  };

  const handleAddOrderNote = (orderId: string, note: string) => {
    addOrderAdminNote(orderId, user?.email || 'admin@nexoradns.com', note);
    refreshData();
  };

  const handleManualFulfill = (orderId: string) => {
    manuallyFulfillOrder(orderId, user?.email || 'admin@nexoradns.com');
    refreshData();
  };

  const handleExportCSV = () => {
    const csvContent = exportOrdersToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `nexora_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast({ type: 'success', title: 'Export Complete', message: 'CSV downloaded.' });
  };

  const handleReplyTicket = (ticketId: string, msg: string) => {
    replyToTicket(ticketId, {
      sender: 'admin',
      senderName: user?.displayName || 'Lead Network Architect',
      message: msg
    });
    refreshData();
  };

  const handleUpdateTicketStatus = (ticketId: string, st: SupportTicket['status']) => {
    updateTicketStatus(ticketId, st, user?.email || 'admin@nexoradns.com');
    refreshData();
  };

  const handleSaveNotificationSettings = (notif: NotificationConfig) => {
    const updated: SiteSettings = {
      ...settings,
      notifications: notif,
    };
    saveDraftSettings(updated, user?.email || 'admin@nexoradns.com');
    publishSettings(user?.email || 'admin@nexoradns.com', 'Updated notification settings');
    refreshData();
  };

  const handleRestoreVersion = (versionId: string) => {
    restoreSettingsVersion(versionId, user?.email || 'admin@nexoradns.com');
    refreshData();
  };

  const handleCreateSnapshot = (note: string) => {
    publishSettings(user?.email || 'admin@nexoradns.com', note);
    refreshData();
  };

  // 14 Navigation Items Grouped by Section
  const navigationGroups = [
    {
      group: 'Core Operations',
      items: [
        { id: 'overview', label: 'Overview', icon: Activity, badge: null },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
        { id: 'products', label: 'DNS Products', icon: Package, badge: `${products.length}` },
        { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: `${orders.length}` },
        { id: 'payments', label: 'Payments', icon: CreditCard, badge: pendingTidCount > 0 ? `${pendingTidCount}` : null, badgeColor: 'bg-amber-400 text-black' },
        { id: 'customers', label: 'Customers / Guests', icon: Users, badge: null },
      ]
    },
    {
      group: 'Storefront Customizer',
      items: [
        { id: 'customizer', label: 'Website Customizer', icon: Palette, badge: null },
        { id: 'homepage', label: 'Homepage Builder', icon: Layout, badge: null },
        { id: 'coupons', label: 'Coupons & Promos', icon: Tag, badge: `${coupons.length}` },
      ]
    },
    {
      group: 'Support & Administration',
      items: [
        { id: 'support', label: 'Support Center', icon: MessageSquare, badge: openTicketsCount > 0 ? `${openTicketsCount}` : null, badgeColor: 'bg-[#8B5CF6] text-white' },
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: totalAlertsCount > 0 ? `${totalAlertsCount}` : null, badgeColor: 'bg-[#00E5FF] text-black' },
        { id: 'security', label: 'Security & Audit Logs', icon: ShieldAlert, badge: null },
        { id: 'backups', label: 'Backup & Restore', icon: RotateCcw, badge: `v${settings.version || 1}` },
        { id: 'settings', label: 'Website Settings', icon: Settings, badge: settings.maintenance?.enabled ? 'MAINT' : null, badgeColor: 'bg-rose-500 text-white' },
      ]
    }
  ];

  // Active Tab Title Lookup for Breadcrumb
  const activeTabLabel = useMemo(() => {
    for (const group of navigationGroups) {
      const match = group.items.find(i => i.id === activeTab);
      if (match) return match.label;
    }
    return 'Overview';
  }, [activeTab]);

  // If visitor is NOT an authenticated administrator
  if (!isAdmin) {
    return (
      <div className="min-h-[85vh] bg-[#080D1A] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient lights */}
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-[#00E5FF]/10 rounded-full blur-[130px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-[#8B5CF6]/10 rounded-full blur-[130px] pointer-events-none -z-10" />

        <div className="max-w-md w-full p-8 sm:p-9 rounded-3xl bg-white/[0.08] backdrop-blur-2xl border border-white/[0.16] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.20)] space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-[#00E5FF] mx-auto shadow-[0_0_20px_rgba(0,229,255,0.20)]">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black uppercase text-[#F1F5F9] tracking-tight">
              ADMIN CONTROL CENTER
            </h2>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Authorized administrator credentials required. Public visitors and customers use guest checkout without accounts.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 backdrop-blur-md border border-rose-500/30 text-rose-400 text-xs font-mono">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Admin Email</label>
              <input
                type="email"
                value={adminEmailInput}
                onChange={(e) => setAdminEmailInput(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40 backdrop-blur-md transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Password</label>
              <input
                type="password"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40 backdrop-blur-md transition-all"
              />
            </div>

            <Button
              type="submit"
              variant="glass-cyan"
              size="lg"
              className="w-full font-bold shadow-[0_0_20px_rgba(0,229,255,0.25)]"
              disabled={isLoggingIn}
            >
              <Lock className="w-4 h-4 mr-1.5" />
              <span>{isLoggingIn ? 'Authenticating...' : 'Sign In as Administrator'}</span>
            </Button>
          </form>

          <div className="pt-2 text-center">
            <Link href="/" className="text-xs font-mono text-[#00E5FF] hover:underline">
              &larr; Return to Public Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar navigation component shared between desktop and mobile drawer
  const renderSidebarNav = () => (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.25)]">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            {!isSidebarCollapsed && (
              <div>
                <span className="font-black text-sm uppercase tracking-wider text-[#F1F5F9] block leading-tight">
                  NEXORA
                </span>
                <span className="text-[10px] font-mono text-[#00E5FF] tracking-widest block font-bold">
                  CONTROL CENTER
                </span>
              </div>
            )}
          </div>
          {!isSidebarCollapsed && (
            <span className="px-2 py-0.5 rounded-lg text-[9px] font-mono bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 font-bold">
              v{settings.version || 1}
            </span>
          )}
        </div>

        {/* 14 Navigation Items in 3 Groups */}
        <div className="space-y-6">
          {navigationGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!isSidebarCollapsed && (
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8]/70 px-3 block mb-2 font-bold">
                  {group.group}
                </span>
              )}
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as AdminTab);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all text-left group relative ${
                      isActive
                        ? 'bg-[#00E5FF] text-[#080D1A] font-bold shadow-[0_0_15px_rgba(0,229,255,0.35)]'
                        : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/[0.04]'
                    }`}
                    title={isSidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                    {!isSidebarCollapsed && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}
                    {!isSidebarCollapsed && item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        item.badgeColor || (isActive ? 'bg-[#080D1A] text-[#00E5FF]' : 'bg-white/[0.08] text-[#F1F5F9]')
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Admin Profile & Logout Footer */}
      <div className="pt-4 border-t border-white/[0.08] space-y-3">
        {!isSidebarCollapsed ? (
          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <span className="text-[11px] font-sans font-bold text-[#F1F5F9] block truncate">
                {user?.displayName || 'Administrator'}
              </span>
              <span className="text-[10px] font-mono text-[#94A3B8] block truncate">
                {user?.email}
              </span>
            </div>
            <button
              onClick={logout}
              className="text-[#94A3B8] hover:text-rose-400 p-1.5 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            className="w-full flex items-center justify-center p-2 rounded-xl text-rose-400 hover:bg-rose-500/10"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080D1A] text-[#F1F5F9] relative flex overflow-x-hidden">
      {/* Decorative ambient lighting orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00E5FF]/[0.07] rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#8B5CF6]/[0.07] rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Desktop Fixed Left Sidebar */}
      <aside 
        className={`hidden md:flex flex-col fixed top-0 left-0 bottom-0 z-30 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        } p-4 bg-[#080D1A]/85 backdrop-blur-2xl border-r border-white/[0.12] shadow-glass-strong`}
      >
        {renderSidebarNav()}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-md flex">
          <div className="w-72 max-w-[85vw] h-full p-5 bg-[#0B1224] border-r border-white/[0.16] shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="flex justify-end pb-2">
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="text-[#94A3B8] hover:text-[#F1F5F9] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderSidebarNav()}
          </div>
          <div className="flex-1" onClick={() => setIsMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
      }`}>
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-20 px-4 sm:px-8 py-4 bg-[#080D1A]/80 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-[#94A3B8] hover:text-[#F1F5F9] md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop collapse toggle */}
            <button
              onClick={() => setIsSidebarCollapsed(prev => !prev)}
              className="hidden md:flex p-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-[#94A3B8] hover:text-[#F1F5F9]"
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
              <span className="hidden sm:inline">NEXORA Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-white/30 hidden sm:inline" />
              <span className="text-[#00E5FF] font-bold">{activeTabLabel}</span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            {/* Notification Badge Button */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-[#94A3B8] hover:text-[#00E5FF] transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {totalAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#00E5FF] text-[#080D1A] font-mono font-black text-[10px] flex items-center justify-center shadow-[0_0_8px_#00E5FF]">
                  {totalAlertsCount}
                </span>
              )}
            </button>

            {/* Refresh Data */}
            <Button
              variant="glass"
              size="sm"
              onClick={refreshData}
              className="text-xs font-mono text-[#94A3B8] hover:text-[#00E5FF] hidden sm:flex"
              title="Refresh Data"
            >
              <RefreshCcw className="w-3.5 h-3.5 mr-1" />
              <span>Refresh</span>
            </Button>

            {/* Live Storefront Link */}
            <Link href="/" target="_blank">
              <Button
                variant="glass"
                size="sm"
                className="text-xs font-mono text-[#00E5FF]"
              >
                <Eye className="w-3.5 h-3.5 mr-1" />
                <span className="hidden sm:inline">Storefront</span>
              </Button>
            </Link>

            {/* Sign Out */}
            <Button
              variant="glass"
              size="sm"
              onClick={logout}
              className="text-xs font-mono text-rose-400 hover:text-rose-300 hover:border-rose-500/40"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </header>

        {/* Dynamic Content Panel */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* 1. Overview */}
          {activeTab === 'overview' && (
            <AdminDashboardOverview
              orders={orders}
              products={products}
              auditLogs={auditLogs}
              settings={settings}
              onNavigateTab={(t) => setActiveTab(t as AdminTab)}
              onRefresh={refreshData}
            />
          )}

          {/* 2. Interactive Analytics */}
          {activeTab === 'analytics' && (
            <AdminAnalyticsView
              orders={orders}
              products={products}
              onNavigateTab={(t) => setActiveTab(t as AdminTab)}
              onRefresh={refreshData}
            />
          )}

          {/* 3. DNS Products */}
          {activeTab === 'products' && (
            <AdminProductsManager
              products={products}
              onSaveProduct={handleSaveProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {/* 4. Orders */}
          {activeTab === 'orders' && (
            <AdminOrdersManager
              orders={orders}
              onVerifyPayment={handleVerifyPayment}
              onRefundOrder={handleRefundOrder}
              onAddOrderNote={handleAddOrderNote}
              onManualFulfill={handleManualFulfill}
              onExportCSV={handleExportCSV}
            />
          )}

          {/* 5. Payments */}
          {activeTab === 'payments' && (
            <AdminPaymentsView
              orders={orders}
              onVerifyPayment={handleVerifyPayment}
              onRefundOrder={handleRefundOrder}
              onExportCSV={handleExportCSV}
            />
          )}

          {/* 6. Customers / Guest Orders */}
          {activeTab === 'customers' && (
            <AdminCustomersView
              orders={orders}
              products={products}
              onNavigateToOrder={(id) => {
                setActiveTab('orders');
              }}
            />
          )}

          {/* 7. Website Customizer */}
          {activeTab === 'customizer' && (
            <AdminAppearanceStudio
              settings={settings}
              onSaveDraft={handleSaveDraft}
              onPublish={handlePublish}
              onRestoreVersion={() => setActiveTab('backups')}
            />
          )}

          {/* 8. Homepage Builder */}
          {activeTab === 'homepage' && (
            <AdminHomepageBuilder
              settings={settings}
              onSaveDraft={handleSaveDraft}
              onPublish={handlePublish}
            />
          )}

          {/* 9. Coupons & Promotions */}
          {activeTab === 'coupons' && (
            <AdminCouponsManager
              coupons={coupons}
              onSaveCoupon={handleSaveCoupon}
              onDeleteCoupon={handleDeleteCoupon}
            />
          )}

          {/* 10. Support Center */}
          {activeTab === 'support' && (
            <AdminNotificationsManager
              tickets={tickets}
              settings={settings}
              onReplyTicket={handleReplyTicket}
              onUpdateTicketStatus={handleUpdateTicketStatus}
              onSaveNotificationSettings={handleSaveNotificationSettings}
            />
          )}

          {/* 11. Notifications */}
          {activeTab === 'notifications' && (
            <AdminNotificationsManager
              tickets={tickets}
              settings={settings}
              onReplyTicket={handleReplyTicket}
              onUpdateTicketStatus={handleUpdateTicketStatus}
              onSaveNotificationSettings={handleSaveNotificationSettings}
            />
          )}

          {/* 12. Security & Audit Logs */}
          {activeTab === 'security' && (
            <AdminSecurityCenter
              user={user}
              auditLogs={auditLogs}
              onLogout={logout}
            />
          )}

          {/* 13. Backup & Restore */}
          {activeTab === 'backups' && (
            <AdminBackupsManager
              versions={versions}
              currentSettings={settings}
              onRestoreVersion={handleRestoreVersion}
              onCreateSnapshot={handleCreateSnapshot}
            />
          )}

          {/* 14. Website Settings */}
          {activeTab === 'settings' && (
            <AdminSettingsView
              settings={settings}
              onSaveDraft={handleSaveDraft}
              onPublish={handlePublish}
            />
          )}
        </main>
      </div>
    </div>
  );
}
