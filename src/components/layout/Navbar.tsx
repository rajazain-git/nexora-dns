'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  User, 
  ShieldAlert, 
  Activity, 
  ChevronDown, 
  LogOut,
  Sliders,
  HelpCircle,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { DEFAULT_SITE_CONFIG } from '@/lib/config';
import { useSiteConfig } from '@/context/SiteConfigContext';

export function Navbar() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen, currency, setCurrency } = useCart();
  const { user, isAdmin, logout, switchDemoRole } = useAuth();
  const { settings } = useSiteConfig();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const announcementActive = settings.homepage?.announcementActive ?? settings.announcementActive ?? DEFAULT_SITE_CONFIG.announcementActive;
  const announcementText = settings.homepage?.announcementText ?? settings.announcementText ?? "⚡ DEDICATED FREE FIRE ANYCAST NODES ACTIVE FOR ANDROID (DoT) & iOS (DoH)";

  const navLinks = [
    { name: 'Store', href: '/store' },
    { name: 'Compatibility', href: '/compatibility' },
    { name: 'Compare', href: '/compare' },
    { name: 'Setup Guides', href: '/setup-guides' },
    { name: 'Track Order', href: '/track-order' },
    { name: 'Troubleshoot', href: '/troubleshoot' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Network Infrastructure Telemetry Bar */}
      {announcementActive && (
        <div className="bg-[#0B1224]/80 backdrop-blur-md border-b border-white/[0.08] text-[11px] py-1.5 px-4 text-center text-[#94A3B8] font-mono tracking-wider flex items-center justify-center gap-2 relative z-40">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] animate-pulse shrink-0" />
          <span className="text-[#F1F5F9] font-medium">{announcementText}</span>
        </div>
      )}

      {/* Main Floating Glass Navbar */}
      <header className="sticky top-0 z-40 w-full bg-[#080D1A]/75 backdrop-blur-2xl border-b border-white/[0.10] shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 h-20 flex items-center justify-between gap-2 lg:gap-3 xl:gap-4">
          
          {/* Brand Logo */}
          <Logo size="md" showTagline={false} />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md shrink-0">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-2 xl:px-2.5 2xl:px-3.5 py-1.5 text-[11px] xl:text-[11.5px] 2xl:text-xs font-bold uppercase tracking-wider transition-all rounded-lg relative ${
                    active
                      ? 'text-[#F1F5F9] bg-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] border border-white/[0.14]'
                      : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/[0.05]'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-2 right-2 xl:left-2.5 xl:right-2.5 2xl:left-3 2xl:right-3 h-0.5 bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Stack */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-3 shrink-0">
            
            {/* Anycast Health Pill - only on extra wide screens (2xl) so laptop navbar doesn't overflow */}
            <div className="hidden 2xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.12] backdrop-blur-md text-[10px] font-mono font-bold text-[#00E5FF] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF] animate-pulse" />
              <span>ANYCAST 28 NODES ACTIVE</span>
            </div>

            {/* Currency Selector (PKR / USD) */}
            <div className="flex items-center bg-white/[0.04] border border-white/[0.12] backdrop-blur-md rounded-lg p-0.5 text-[11px] font-mono">
              <button
                onClick={() => setCurrency('PKR')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                  currency === 'PKR'
                    ? 'bg-[#00E5FF] text-[#080D1A] shadow-glow-cyan'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                PKR
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                  currency === 'USD'
                    ? 'bg-[#00E5FF] text-[#080D1A] shadow-glow-cyan'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                USD
              </button>
            </div>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.12] hover:border-[#00E5FF]/40 text-[#F1F5F9] transition-all backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] group"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#94A3B8] group-hover:text-[#00E5FF] transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#00E5FF] text-[#080D1A] text-[10px] font-mono font-black flex items-center justify-center shadow-[0_0_8px_#00E5FF]">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Account / Role Switcher Menu */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 p-1.5 pr-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.12] backdrop-blur-md text-[#F1F5F9] transition-all text-xs shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)]"
                  title={user.displayName}
                >
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold font-mono shrink-0 ${
                    isAdmin ? 'bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/40' : 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                  }`}>
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden 2xl:inline-block max-w-[80px] truncate font-medium text-[#F1F5F9]">
                    {user.displayName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                </button>
              ) : (
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    <User className="w-3.5 h-3.5 mr-1 text-[#00E5FF]" />
                    <span>Login</span>
                  </Button>
                </Link>
              )}

              {/* User Dropdown */}
              {user && isUserDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-[#0B1224]/95 backdrop-blur-2xl border border-white/[0.14] shadow-[0_16px_48px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.15)] py-2 z-50 divide-y divide-white/[0.08] font-sans origin-top-right"
                  onMouseLeave={() => setIsUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2.5">
                    <p className="text-[11px] text-[#94A3B8] font-mono">Authenticated Session</p>
                    <p className="text-xs font-bold text-[#F1F5F9] truncate">{user.email}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Badge variant={isAdmin ? 'violet' : 'cyan'} size="sm">
                        {user.role.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] text-[#94A3B8] font-mono">ID: {user.uid.slice(0, 8)}</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/[0.06] transition-colors"
                    >
                      <Laptop className="w-3.5 h-3.5 text-[#00E5FF]" />
                      <span>Customer Dashboard</span>
                    </Link>
                    <Link
                      href="/dashboard/tickets"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/[0.06] transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-[#8B5CF6]" />
                      <span>My Support Tickets</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#8B5CF6] font-bold hover:bg-[#8B5CF6]/15 transition-colors"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Admin Control Center</span>
                      </Link>
                    )}
                  </div>

                  {/* Fast Demo Persona Switcher */}
                  <div className="p-3 bg-white/[0.02]">
                    <p className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-mono mb-2 flex items-center gap-1">
                      <Sliders className="w-3 h-3 text-[#00E5FF]" />
                      <span>Quick Demo Switcher</span>
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => {
                          switchDemoRole('customer');
                          setIsUserDropdownOpen(false);
                        }}
                        className={`text-[10px] sm:text-[11px] py-1 px-1.5 sm:px-2 rounded-lg font-mono font-bold transition-all border truncate text-center ${
                          !isAdmin 
                            ? 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/40 shadow-[0_0_8px_rgba(0,229,255,0.2)]' 
                            : 'bg-white/[0.05] text-[#94A3B8] border-white/[0.10] hover:text-white'
                        }`}
                      >
                        Gamer View
                      </button>
                      <button
                        onClick={() => {
                          switchDemoRole('admin');
                          setIsUserDropdownOpen(false);
                        }}
                        className={`text-[10px] sm:text-[11px] py-1 px-1.5 sm:px-2 rounded-lg font-mono font-bold transition-all border truncate text-center ${
                          isAdmin 
                            ? 'bg-[#8B5CF6]/20 text-[#C4B5FD] border-[#8B5CF6]/40 shadow-[0_0_8px_rgba(139,92,246,0.2)]' 
                            : 'bg-white/[0.05] text-[#94A3B8] border-white/[0.10] hover:text-white'
                        }`}
                      >
                        Admin View
                      </button>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.12] text-[#94A3B8] hover:text-[#F1F5F9] backdrop-blur-md transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#080D1A]/95 backdrop-blur-2xl border-b border-white/[0.12] px-4 pt-3 pb-6 space-y-2 shadow-2xl">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2.5 text-sm font-bold uppercase tracking-wider rounded-xl transition-all ${
                  isActive(link.href)
                    ? 'text-[#00E5FF] bg-white/[0.08] border border-[#00E5FF]/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/[0.05]'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-3 border-t border-white/[0.10] flex flex-col gap-2">
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full"
              >
                <Button variant="secondary" size="md" className="w-full justify-start">
                  <Laptop className="w-4 h-4 mr-2 text-[#00E5FF]" />
                  <span>Customer Dashboard</span>
                </Button>
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="violet" size="md" className="w-full justify-start">
                    <ShieldAlert className="w-4 h-4 mr-2" />
                    <span>Admin Control Center</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
