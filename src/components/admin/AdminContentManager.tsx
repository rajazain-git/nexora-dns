'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Save, 
  Upload, 
  Globe, 
  ShieldCheck, 
  Smartphone, 
  HelpCircle, 
  Phone,
  MessageSquare
} from 'lucide-react';
import { SiteSettings, SiteContent, SeoConfig } from '@/types';
import { DEFAULT_SITE_CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';

interface Props {
  settings: SiteSettings;
  onSaveDraft: (draft: SiteSettings) => void;
  onPublish: (note?: string) => void;
}

export function AdminContentManager({
  settings,
  onSaveDraft,
  onPublish
}: Props) {
  const { showToast } = useToast();
  const [content, setContent] = useState<SiteContent>(() => {
    return settings.content ? { ...settings.content } : { ...DEFAULT_SITE_CONFIG.content };
  });

  const [seo, setSeo] = useState<SeoConfig>(() => {
    return settings.seo ? { ...settings.seo } : { ...DEFAULT_SITE_CONFIG.seo };
  });

  const [activeTab, setActiveTab] = useState<'general' | 'guides' | 'troubleshoot' | 'policies' | 'seo'>('general');

  const handleSaveDraft = () => {
    const updated: SiteSettings = {
      ...settings,
      content,
      seo,
      whatsappNumber: content.whatsappNumber,
      whatsappDisplay: content.whatsappDisplay,
      supportEmail: content.supportEmail,
      discordUrl: content.discordUrl,
    };
    onSaveDraft(updated);
    showToast({
      type: 'success',
      title: 'Content Draft Saved',
      message: 'Draft content updated. Click Publish to push live.',
      duration: 3000,
    });
  };

  const handlePublish = () => {
    const updated: SiteSettings = {
      ...settings,
      content,
      seo,
      whatsappNumber: content.whatsappNumber,
      whatsappDisplay: content.whatsappDisplay,
      supportEmail: content.supportEmail,
      discordUrl: content.discordUrl,
    };
    onSaveDraft(updated);
    onPublish('Published content and SEO metadata updates');
    showToast({
      type: 'success',
      title: 'Content Published Live',
      message: 'New contact channels, policies, and SEO tags are now broadcasting.',
      duration: 4000,
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.04] border border-[#00E5FF]/30 text-xs font-mono text-[#00E5FF] mb-2 font-bold shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <FileText className="w-3.5 h-3.5" />
            <span>CONTENT & SEO MANAGER • METADATA & GUIDES</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-[#F1F5F9] tracking-tight">
            CONTENT & SEO STUDIO
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-xl mt-1 leading-relaxed">
            Configure contact channels (WhatsApp, Discord, Telegram), official Android & iOS setup guides, legal compliance terms, and search engine metadata.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="glass" size="sm" onClick={handleSaveDraft} className="text-xs font-mono text-[#00E5FF]">
            <Save className="w-3.5 h-3.5 mr-1" />
            <span>Save Draft</span>
          </Button>

          <Button variant="glass-cyan" size="sm" onClick={handlePublish} className="text-xs font-mono font-bold shadow-[0_0_15px_rgba(0,229,255,0.25)]">
            <Upload className="w-3.5 h-3.5 mr-1" />
            <span>Publish to Live</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08]">
        {[
          { id: 'general', label: 'About & Support Channels' },
          { id: 'guides', label: 'Android & iOS Setup Guides' },
          { id: 'troubleshoot', label: 'Troubleshooting & Diagnostics' },
          { id: 'policies', label: 'Legal & Fair Play Terms' },
          { id: 'seo', label: 'SEO Metadata & OpenGraph' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all ${
              activeTab === tab.id
                ? 'bg-[#00E5FF] text-[#080D1A] font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/[0.04]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: General & Contact */}
      {activeTab === 'general' && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono">
            Brand Story & Direct Support Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">About Us Description</label>
              <textarea
                rows={3}
                value={content.aboutText}
                onChange={(e) => setContent(prev => ({ ...prev, aboutText: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Support Email</label>
              <input
                type="email"
                value={content.supportEmail}
                onChange={(e) => setContent(prev => ({ ...prev, supportEmail: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">WhatsApp Phone Number</label>
              <input
                type="text"
                value={content.whatsappNumber}
                onChange={(e) => setContent(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Discord Community Invite</label>
              <input
                type="text"
                value={content.discordUrl}
                onChange={(e) => setContent(prev => ({ ...prev, discordUrl: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Telegram Support Channel</label>
              <input
                type="text"
                value={content.telegramUrl}
                onChange={(e) => setContent(prev => ({ ...prev, telegramUrl: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Setup Guides */}
      {activeTab === 'guides' && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono">
            Mobile Setup Guide Instructions
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-[#00E5FF] font-bold block mb-1.5">
                Android Private DNS Setup Instructions
              </label>
              <textarea
                rows={4}
                value={content.androidGuideInstructions}
                onChange={(e) => setContent(prev => ({ ...prev, androidGuideInstructions: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#8B5CF6] font-bold block mb-1.5">
                Apple iOS .mobileconfig Profile Installation Instructions
              </label>
              <textarea
                rows={4}
                value={content.iosGuideInstructions}
                onChange={(e) => setContent(prev => ({ ...prev, iosGuideInstructions: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Troubleshooting & Diagnostics */}
      {activeTab === 'troubleshoot' && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono">
            Diagnostic Guides & Carrier Network Advisories
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-[#00E5FF] font-bold block mb-1.5">
                Android Private DNS Connection Error Notice
              </label>
              <textarea
                rows={3}
                defaultValue="Verify that your network allows outbound TCP traffic on Port 853. Do not include https:// in the hostname field."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#8B5CF6] font-bold block mb-1.5">
                Apple iOS Safari Profile Download Guidance
              </label>
              <textarea
                rows={3}
                defaultValue="Apple requires configuration profiles to be downloaded strictly through Safari browser. Third-party iOS browsers (Chrome/Firefox) cannot register system encrypted profiles."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-amber-400 font-bold block mb-1.5">
                Pakistani Carrier Peering Status Advisory (Jazz, Zong, Telenor, Ufone)
              </label>
              <textarea
                rows={2}
                defaultValue="All regional 4G LTE edges currently reporting green health on Port 853 DoT and Port 443 DoH."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Policies */}
      {activeTab === 'policies' && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono">
            Compliance & Legal Policies
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Terms and Conditions</label>
              <textarea
                rows={3}
                value={content.termsText}
                onChange={(e) => setContent(prev => ({ ...prev, termsText: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Zero-Log Privacy Policy</label>
              <textarea
                rows={3}
                value={content.privacyText}
                onChange={(e) => setContent(prev => ({ ...prev, privacyText: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Refund & Incompatibility Policy</label>
              <textarea
                rows={3}
                value={content.refundText}
                onChange={(e) => setContent(prev => ({ ...prev, refundText: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: SEO Metadata */}
      {activeTab === 'seo' && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono">
            Search Engine Optimization (SEO) & Social Graph
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Page Meta Title</label>
              <input
                type="text"
                value={seo.metaTitle}
                onChange={(e) => setSeo(prev => ({ ...prev, metaTitle: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Meta Description</label>
              <textarea
                rows={2}
                value={seo.metaDescription}
                onChange={(e) => setSeo(prev => ({ ...prev, metaDescription: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Keywords (Comma separated)</label>
              <input
                type="text"
                value={seo.keywords}
                onChange={(e) => setSeo(prev => ({ ...prev, keywords: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">OpenGraph Share Image URL</label>
              <input
                type="text"
                value={seo.ogImageUrl || ''}
                onChange={(e) => setSeo(prev => ({ ...prev, ogImageUrl: e.target.value }))}
                placeholder="https://example.com/images/og-share.png"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
