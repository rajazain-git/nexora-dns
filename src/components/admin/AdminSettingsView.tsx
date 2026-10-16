'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Wrench, 
  Save, 
  ShieldCheck, 
  Globe, 
  Phone, 
  Mail, 
  Send, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { SiteSettings, MaintenanceConfig } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/context/ToastContext';

interface Props {
  settings: SiteSettings;
  onSaveDraft: (draft: SiteSettings) => void;
  onPublish: (note?: string) => void;
}

export function AdminSettingsView({
  settings,
  onSaveDraft,
  onPublish
}: Props) {
  const { showToast } = useToast();

  const [brandName, setBrandName] = useState(settings.brandName || 'NEXORA DNS');
  const [tagline, setTagline] = useState(settings.tagline || 'Next-Gen Anycast Gaming DNS for Free Fire');
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail || 'support@nexoradns.com');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '+92 300 1234567');
  const [whatsappDisplay, setWhatsappDisplay] = useState(settings.whatsappDisplay || '+92 300 1234567');
  const [discordUrl, setDiscordUrl] = useState(settings.discordUrl || 'https://discord.gg/nexora');

  const [maintenance, setMaintenance] = useState<MaintenanceConfig>(() => {
    return settings.maintenance || {
      enabled: false,
      title: 'Scheduled Anycast Network Maintenance',
      message: 'Core DNS resolution remains active. Store purchasing will resume shortly.',
      estimatedDuration: '20-30 Minutes',
      allowAdminBypass: true,
    };
  });

  const handleToggleMaintenance = () => {
    const nextState = !maintenance.enabled;
    const updated: MaintenanceConfig = { ...maintenance, enabled: nextState };
    setMaintenance(updated);

    const updatedSettings: SiteSettings = {
      ...settings,
      brandName,
      tagline,
      supportEmail,
      whatsappNumber,
      whatsappDisplay,
      discordUrl,
      maintenance: updated,
    };

    onSaveDraft(updatedSettings);
    onPublish(`Maintenance mode ${nextState ? 'ACTIVATED' : 'DEACTIVATED'}`);

    showToast({
      type: nextState ? 'info' : 'success',
      title: nextState ? 'Maintenance Mode Active' : 'Storefront Live',
      message: nextState 
        ? 'Public visitors now see the maintenance screen. Admins retain full bypass.'
        : 'Maintenance screen removed. Public storefront is live.',
      duration: 3500
    });
  };

  const handleSaveAllSettings = () => {
    const updatedSettings: SiteSettings = {
      ...settings,
      brandName: brandName.trim(),
      tagline: tagline.trim(),
      supportEmail: supportEmail.trim(),
      whatsappNumber: whatsappNumber.trim(),
      whatsappDisplay: whatsappDisplay.trim(),
      discordUrl: discordUrl.trim(),
      maintenance,
    };

    onSaveDraft(updatedSettings);
    onPublish('Updated core website & support settings');

    showToast({
      type: 'success',
      title: 'Settings Published Live',
      message: 'All updated configuration values are now active across the website.',
      duration: 3500
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.04] border border-[#00E5FF]/30 text-xs font-mono text-[#00E5FF] mb-2 font-bold shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Settings className="w-3.5 h-3.5" />
            <span>GLOBAL SYSTEM CONFIGURATION & CHANNELS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-[#F1F5F9] tracking-tight">
            WEBSITE & OPERATIONS SETTINGS
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-xl mt-1 leading-relaxed">
            Manage store metadata, official customer contact channels, and infrastructure maintenance status.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleSaveAllSettings} className="font-bold">
          <Save className="w-4 h-4 mr-1.5" />
          <span>Publish All Settings</span>
        </Button>
      </div>

      {/* Maintenance Mode Emergency Controls */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>Maintenance Mode Control</span>
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Display emergency notice to public visitors while allowing verified staff full administrative bypass
            </p>
          </div>

          <button
            onClick={handleToggleMaintenance}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Notice Heading</label>
            <input
              type="text"
              value={maintenance.title}
              onChange={(e) => setMaintenance(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Estimated Duration Display</label>
            <input
              type="text"
              value={maintenance.estimatedDuration}
              onChange={(e) => setMaintenance(prev => ({ ...prev, estimatedDuration: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Customer Explanatory Message</label>
            <textarea
              rows={2}
              value={maintenance.message}
              onChange={(e) => setMaintenance(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] cursor-pointer hover:bg-white/[0.06] transition-colors">
              <input
                type="checkbox"
                checked={maintenance.allowAdminBypass}
                onChange={(e) => setMaintenance(prev => ({ ...prev, allowAdminBypass: e.target.checked }))}
                className="w-4 h-4 rounded text-[#00E5FF] bg-black/40 border-white/20"
              />
              <span className="text-xs font-mono text-[#F1F5F9]">
                Allow Administrator Bypass (Authenticated administrators can browse store and admin panel normally)
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Core Brand & Support Channels */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#00E5FF]" />
          <span>Brand Identity & Contact Channels</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Brand Name</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Official Support Email</label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">WhatsApp Number (International Format)</label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="+923001234567"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">WhatsApp Display Text</label>
            <input
              type="text"
              value={whatsappDisplay}
              onChange={(e) => setWhatsappDisplay(e.target.value)}
              placeholder="+92 300 1234567"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Discord Community URL</label>
            <input
              type="text"
              value={discordUrl}
              onChange={(e) => setDiscordUrl(e.target.value)}
              placeholder="https://discord.gg/..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-white/[0.08]">
          <Button variant="primary" size="sm" onClick={handleSaveAllSettings} className="font-bold">
            <Save className="w-4 h-4 mr-1.5" />
            <span>Save & Apply Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
