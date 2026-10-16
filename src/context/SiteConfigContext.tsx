'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteSettings, SiteTheme, HomepageConfig, SiteContent, MaintenanceConfig } from '@/types';
import { getPublishedSettings } from '@/lib/store-db';
import { DEFAULT_SITE_CONFIG } from '@/lib/config';
import { useAuth } from './AuthContext';
import { Shield, Wrench, Clock, MessageSquare, ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface SiteConfigContextType {
  settings: SiteSettings;
  theme: SiteTheme;
  homepage: HomepageConfig;
  content: SiteContent;
  maintenance: MaintenanceConfig;
  refreshSettings: () => void;
  isMaintenanceActive: boolean;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    if (typeof window !== 'undefined') {
      return getPublishedSettings();
    }
    return DEFAULT_SITE_CONFIG;
  });

  const { isAdmin } = useAuth();

  const refreshSettings = () => {
    if (typeof window !== 'undefined') {
      const live = getPublishedSettings();
      setSettings(live);
      applyThemeVariables(live.theme);
    }
  };

  const applyThemeVariables = (theme: SiteTheme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    if (theme.primaryColor) root.style.setProperty('--color-primary', theme.primaryColor);
    if (theme.secondaryColor) root.style.setProperty('--color-secondary', theme.secondaryColor);
    if (theme.backgroundColor) root.style.setProperty('--bg-main', theme.backgroundColor);
    if (theme.cardColor) root.style.setProperty('--bg-card', theme.cardColor);
    if (theme.borderColor) root.style.setProperty('--border-main', theme.borderColor);
    if (theme.textColor) root.style.setProperty('--text-main', theme.textColor);
    if (theme.mutedColor) root.style.setProperty('--text-muted', theme.mutedColor);

    // Button Radii
    const btnRadMap = {
      'sharp': '0px',
      'rounded-md': '6px',
      'rounded-lg': '10px',
      'pill': '9999px',
    };
    root.style.setProperty('--radius-btn', btnRadMap[theme.buttonRadius] || '10px');

    // Card Radii
    const cardRadMap = {
      'none': '0px',
      'rounded-lg': '10px',
      'rounded-xl': '16px',
      'rounded-2xl': '24px',
    };
    root.style.setProperty('--radius-card', cardRadMap[theme.cardRadius] || '16px');
  };

  useEffect(() => {
    refreshSettings();

    const handleCustomUpdate = (e: any) => {
      if (e.detail) {
        setSettings(e.detail);
        applyThemeVariables(e.detail.theme);
      } else {
        refreshSettings();
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'nexora_published_settings') {
        refreshSettings();
      }
    };

    window.addEventListener('nexora-settings-updated', handleCustomUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('nexora-settings-updated', handleCustomUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const isMaintenanceActive = Boolean(
    settings.maintenance?.enabled && 
    (!isAdmin || !settings.maintenance?.allowAdminBypass)
  );

  return (
    <SiteConfigContext.Provider
      value={{
        settings,
        theme: settings.theme || DEFAULT_SITE_CONFIG.theme,
        homepage: settings.homepage || DEFAULT_SITE_CONFIG.homepage,
        content: settings.content || DEFAULT_SITE_CONFIG.content,
        maintenance: settings.maintenance || DEFAULT_SITE_CONFIG.maintenance,
        refreshSettings,
        isMaintenanceActive,
      }}
    >
      {/* If Maintenance Mode is Active and visitor is not an authorized administrator on admin route */}
      {isMaintenanceActive && typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin') && !window.location.pathname.startsWith('/login') ? (
        <div className="fixed inset-0 z-50 bg-[#080D1A] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-2xl bg-[#111C32] border border-[#00E5FF]/30 shadow-[0_0_40px_rgba(0,229,255,0.15)] space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#182642] border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] mx-auto animate-pulse">
              <Wrench className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 text-[11px] font-mono font-bold tracking-wider uppercase">
                SCHEDULED MAINTENANCE
              </span>
              <h1 className="text-2xl font-black uppercase text-[#F1F5F9] tracking-tight">
                {settings.maintenance.title || 'System Maintenance Underway'}
              </h1>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {settings.maintenance.message}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#080D1A] border border-[#24324A] flex items-center justify-between text-xs font-mono">
              <span className="text-[#94A3B8] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
                Estimated Duration:
              </span>
              <span className="text-[#00E5FF] font-bold">
                {settings.maintenance.estimatedDuration || '15-30 Minutes'}
              </span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a 
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1"
              >
                <Button variant="secondary" size="sm" className="w-full text-xs">
                  <MessageSquare className="w-3.5 h-3.5 mr-1 text-[#10B981]" />
                  WhatsApp Support
                </Button>
              </a>
              <Link href="/login" className="flex-1">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <Lock className="w-3.5 h-3.5 mr-1 text-[#00E5FF]" />
                  Staff Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
}
