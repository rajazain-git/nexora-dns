'use client';

import React, { useState } from 'react';
import { 
  Wrench, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  Save, 
  Upload, 
  Check, 
  Eye,
  Lock
} from 'lucide-react';
import { SiteSettings, MaintenanceConfig } from '@/types';
import { DEFAULT_SITE_CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/context/ToastContext';

interface Props {
  settings: SiteSettings;
  onSaveDraft: (draft: SiteSettings) => void;
  onPublish: (note?: string) => void;
}

export function AdminMaintenanceManager({
  settings,
  onSaveDraft,
  onPublish
}: Props) {
  const { showToast } = useToast();
  const [maintenance, setMaintenance] = useState<MaintenanceConfig>(() => {
    return settings.maintenance || { ...DEFAULT_SITE_CONFIG.maintenance };
  });

  const handleToggle = () => {
    const nextState = !maintenance.enabled;
    const updated: MaintenanceConfig = { ...maintenance, enabled: nextState };
    setMaintenance(updated);

    const updatedSettings: SiteSettings = {
      ...settings,
      maintenance: updated,
    };
    onSaveDraft(updatedSettings);
    onPublish(`Maintenance mode ${nextState ? 'ACTIVATED' : 'DEACTIVATED'}`);

    showToast({
      type: nextState ? 'info' : 'success',
      title: nextState ? 'Maintenance Mode Active' : 'Store Reopened to Public',
      message: nextState 
        ? 'Public visitors will now see the maintenance screen. Staff retain full access.'
        : 'Maintenance screen removed. Public storefront is live.',
      duration: 4000
    });
  };

  const handleSaveDetails = () => {
    const updatedSettings: SiteSettings = {
      ...settings,
      maintenance,
    };
    onSaveDraft(updatedSettings);
    onPublish('Updated maintenance copy & duration settings');
    showToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Maintenance details updated.',
      duration: 3000
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-mono text-amber-400 mb-2 font-bold backdrop-blur-md">
            <Wrench className="w-3.5 h-3.5" />
            <span>MAINTENANCE MODE • SECURE ADMIN BYPASS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-[#F1F5F9] tracking-tight">
            MAINTENANCE CONTROL
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-xl mt-1">
            Display a scheduled maintenance screen to public storefront visitors during infrastructure upgrades. Authorized staff retain complete administrative access.
          </p>
        </div>

        {/* Master Toggle Button */}
        <button
          onClick={handleToggle}
          className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 shrink-0 ${
            maintenance.enabled
              ? 'bg-rose-500 text-white shadow-rose-500/25 hover:bg-rose-600'
              : 'bg-emerald-500 text-black shadow-emerald-500/25 hover:bg-emerald-400'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-current animate-pulse" />
          <span>{maintenance.enabled ? 'MAINTENANCE ACTIVE (CLICK TO DISABLE)' : 'STOREFRONT ONLINE (CLICK TO ENABLE)'}</span>
        </button>
      </div>

      {/* Configuration Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono">
          Public Maintenance Screen Customization
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono text-[#94A3B8] block mb-1">Notice Title</label>
            <input
              type="text"
              value={maintenance.title}
              onChange={(e) => setMaintenance(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Scheduled Anycast Network Maintenance"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] placeholder:text-[#94A3B8]/60 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40 backdrop-blur-md"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#94A3B8] block mb-1">Detailed Message to Customers</label>
            <textarea
              rows={3}
              value={maintenance.message}
              onChange={(e) => setMaintenance(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Core DNS servers remain operational. Store purchases will resume shortly..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] placeholder:text-[#94A3B8]/60 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40 backdrop-blur-md"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#94A3B8] block mb-1">Estimated Duration Display</label>
            <input
              type="text"
              value={maintenance.estimatedDuration}
              onChange={(e) => setMaintenance(prev => ({ ...prev, estimatedDuration: e.target.value }))}
              placeholder="20-30 Minutes"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] placeholder:text-[#94A3B8]/60 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40 backdrop-blur-md"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] cursor-pointer hover:bg-white/[0.06] transition-colors">
              <input
                type="checkbox"
                checked={maintenance.allowAdminBypass}
                onChange={(e) => setMaintenance(prev => ({ ...prev, allowAdminBypass: e.target.checked }))}
                className="w-4 h-4 rounded text-[#00E5FF] bg-black/40 border-white/20 focus:ring-0"
              />
              <span className="text-xs font-mono text-[#F1F5F9]">
                Allow Administrator Bypass (Admins can view full store and admin panel)
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-white/[0.08]">
          <Button variant="primary" size="sm" onClick={handleSaveDetails} className="font-bold">
            <Save className="w-4 h-4 mr-1.5" />
            <span>Save Notice Details</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
