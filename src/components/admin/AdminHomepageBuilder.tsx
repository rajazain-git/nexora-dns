'use client';

import React, { useState } from 'react';
import { 
  Layout, 
  Eye, 
  Save, 
  Upload, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  MoveUp, 
  MoveDown, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles,
  Zap,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { SiteSettings, HomepageConfig, HomepageFeatureItem, HomepageFaqItem } from '@/types';
import { DEFAULT_SITE_CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/context/ToastContext';

interface Props {
  settings: SiteSettings;
  onSaveDraft: (draft: SiteSettings) => void;
  onPublish: (note?: string) => void;
}

export function AdminHomepageBuilder({
  settings,
  onSaveDraft,
  onPublish
}: Props) {
  const { showToast } = useToast();
  const [config, setConfig] = useState<HomepageConfig>(() => {
    return settings.homepage ? { ...settings.homepage } : { ...DEFAULT_SITE_CONFIG.homepage };
  });

  const [activeTab, setActiveTab] = useState<'hero' | 'announcement' | 'sections' | 'features' | 'faqs'>('hero');

  // FAQ Modal
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<HomepageFaqItem | null>(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState('General');

  const handleSaveDraft = () => {
    const updated: SiteSettings = {
      ...settings,
      homepage: config,
      announcementActive: config.announcementActive,
      announcementText: config.announcementText,
    };
    onSaveDraft(updated);
    showToast({
      type: 'success',
      title: 'Homepage Draft Saved',
      message: 'Draft changes saved. Click Publish when you are ready to update the live store.',
      duration: 3000,
    });
  };

  const handlePublish = () => {
    const updated: SiteSettings = {
      ...settings,
      homepage: config,
      announcementActive: config.announcementActive,
      announcementText: config.announcementText,
    };
    onSaveDraft(updated);
    onPublish('Published homepage content and section updates');
    showToast({
      type: 'success',
      title: 'Published to Live Website',
      message: 'New homepage sections and copy are now live.',
      duration: 4000,
    });
  };

  const handleToggleSection = (sectionKey: string) => {
    setConfig(prev => ({
      ...prev,
      enabledSections: {
        ...prev.enabledSections,
        [sectionKey]: !prev.enabledSections[sectionKey]
      }
    }));
  };

  const handleOpenAddFaq = () => {
    setEditingFaq(null);
    setFaqQuestion('');
    setFaqAnswer('');
    setFaqCategory('Performance');
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (faq: HomepageFaqItem) => {
    setEditingFaq(faq);
    setFaqQuestion(faq.question);
    setFaqAnswer(faq.answer);
    setFaqCategory(faq.category);
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = () => {
    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      showToast({ type: 'error', title: 'Missing fields', message: 'Question and answer are required.' });
      return;
    }

    if (editingFaq) {
      setConfig(prev => ({
        ...prev,
        faqs: prev.faqs.map(f => f.id === editingFaq.id ? { ...f, question: faqQuestion, answer: faqAnswer, category: faqCategory } : f)
      }));
    } else {
      const newFaq: HomepageFaqItem = {
        id: `faq-${Date.now()}`,
        question: faqQuestion,
        answer: faqAnswer,
        category: faqCategory,
      };
      setConfig(prev => ({ ...prev, faqs: [...prev.faqs, newFaq] }));
    }

    setIsFaqModalOpen(false);
  };

  const handleDeleteFaq = (id: string) => {
    setConfig(prev => ({
      ...prev,
      faqs: prev.faqs.filter(f => f.id !== id)
    }));
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.04] border border-[#00E5FF]/30 text-xs font-mono text-[#00E5FF] mb-2 font-bold shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Layout className="w-3.5 h-3.5" />
            <span>HOMEPAGE BUILDER • SECTION MANAGER</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-[#F1F5F9] tracking-tight">
            HOMEPAGE SECTION BUILDER
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-xl mt-1 leading-relaxed">
            Configure headline copy, CTA destinations, announcement banners, low-jitter feature cards, and FAQ items.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button 
            variant="glass" 
            size="sm"
            onClick={handleSaveDraft}
            className="text-xs font-mono text-[#00E5FF]"
          >
            <Save className="w-3.5 h-3.5 mr-1" />
            <span>Save Draft</span>
          </Button>

          <Button 
            variant="glass-cyan" 
            size="sm"
            onClick={handlePublish}
            className="text-xs font-mono font-bold shadow-[0_0_15px_rgba(0,229,255,0.25)]"
          >
            <Upload className="w-3.5 h-3.5 mr-1" />
            <span>Publish to Live</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08]">
        {[
          { id: 'hero', label: 'Hero Section Copy' },
          { id: 'announcement', label: 'Announcement Banner' },
          { id: 'sections', label: 'Section Visibility' },
          { id: 'features', label: 'Feature Highlights' },
          { id: 'faqs', label: 'Homepage FAQs' },
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

      {/* Tab 1: Hero Section */}
      {activeTab === 'hero' && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono">
            Hero Headline & Call-to-Action Controls
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">
                Main Hero Headline (Large Banner)
              </label>
              <input
                type="text"
                value={config.heroHeadline}
                onChange={(e) => setConfig(prev => ({ ...prev, heroHeadline: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-sm font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">
                Supporting Subheadline (Network Routing Explanation)
              </label>
              <textarea
                rows={3}
                value={config.heroSubheadline}
                onChange={(e) => setConfig(prev => ({ ...prev, heroSubheadline: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">
                Top Trust Pill / Network Badge Text
              </label>
              <input
                type="text"
                value={config.heroBadgeText}
                onChange={(e) => setConfig(prev => ({ ...prev, heroBadgeText: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">
                  Primary Android CTA Button Text
                </label>
                <input
                  type="text"
                  value={config.heroAndroidCta}
                  onChange={(e) => setConfig(prev => ({ ...prev, heroAndroidCta: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">
                  Primary iOS CTA Button Text
                </label>
                <input
                  type="text"
                  value={config.heroIosCta}
                  onChange={(e) => setConfig(prev => ({ ...prev, heroIosCta: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Announcement Banner */}
      {activeTab === 'announcement' && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono">
                Top Announcement Telemetry Bar
              </h3>
              <p className="text-xs text-[#94A3B8] mt-1">
                Displays real-time status notices across the top of all pages.
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.announcementActive}
                onChange={(e) => setConfig(prev => ({ ...prev, announcementActive: e.target.checked }))}
                className="w-4 h-4 rounded accent-[#00E5FF] focus:ring-0"
              />
              <span className="text-xs font-mono text-[#F1F5F9] font-bold">Banner Enabled</span>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Banner Announcement Text</label>
              <input
                type="text"
                value={config.announcementText}
                onChange={(e) => setConfig(prev => ({ ...prev, announcementText: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Action Destination Link</label>
              <input
                type="text"
                value={config.announcementLink || '/store'}
                onChange={(e) => setConfig(prev => ({ ...prev, announcementLink: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Section Visibility */}
      {activeTab === 'sections' && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono">
            Enable or Disable Homepage Sections
          </h3>
          <p className="text-xs text-[#94A3B8]">
            Toggle individual sections on or off to adjust the storefront focus.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { id: 'hero', name: '1. Hero Section & Smartphone Preview', desc: 'Main headline, CTAs, and interactive network HUD' },
              { id: 'products_catalog', name: '2. Free Fire DNS Catalog Preview', desc: 'Featured Android and iOS packages preview' },
              { id: 'features', name: '3. Features & Anycast Architecture', desc: 'Clean domain resolution and encryption benefits' },
              { id: 'device_comparison', name: '4. Device Comparison & Truth Policy', desc: 'Honest technical limitations and DoT/DoH explanation' },
              { id: 'faq', name: '5. Route Tester Benchmarker Teaser', desc: 'Live simulated edge node ping latency test' },
              { id: 'cta_banner', name: '6. Pre-Footer Call to Action', desc: 'Conversion banner leading into store and setup guides' },
            ].map(sec => {
              const isEnabled = config.enabledSections[sec.id] !== false;
              return (
                <div 
                  key={sec.id}
                  className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-xs font-bold text-[#F1F5F9]">{sec.name}</h4>
                    <p className="text-[11px] text-[#94A3B8]">{sec.desc}</p>
                  </div>

                  <button
                    onClick={() => handleToggleSection(sec.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      isEnabled 
                        ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]' 
                        : 'bg-white/[0.04] text-[#94A3B8] border border-white/[0.08]'
                    }`}
                  >
                    {isEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Features */}
      {activeTab === 'features' && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono">
            Feature Highlights (4 Pillars)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.features.map((feat, idx) => (
              <div key={feat.id} className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#00E5FF] font-bold">PILLAR {idx + 1}</span>
                  <span className="text-xs font-mono text-[#94A3B8]">{feat.icon}</span>
                </div>
                <div>
                  <label className="text-[11px] font-mono text-[#94A3B8] block mb-1">Title</label>
                  <input
                    type="text"
                    value={feat.title}
                    onChange={(e) => {
                      const updated = [...config.features];
                      updated[idx].title = e.target.value;
                      setConfig(prev => ({ ...prev, features: updated }));
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-[#94A3B8] block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={feat.description}
                    onChange={(e) => {
                      const updated = [...config.features];
                      updated[idx].description = e.target.value;
                      setConfig(prev => ({ ...prev, features: updated }));
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: FAQs */}
      {activeTab === 'faqs' && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono">
                Homepage FAQ Manager
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Provide clear answers to customer questions about ping, bans, and device compatibility.
              </p>
            </div>
            <Button variant="glass-cyan" size="sm" onClick={handleOpenAddFaq}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add FAQ</span>
            </Button>
          </div>

          <div className="space-y-3 pt-2">
            {config.faqs.map((faq) => (
              <div 
                key={faq.id}
                className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30">
                      {faq.category}
                    </span>
                    <h4 className="text-xs font-bold text-[#F1F5F9]">{faq.question}</h4>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed pl-1">{faq.answer}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEditFaq(faq)}
                    className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#00E5FF] hover:bg-white/[0.06] transition-colors"
                    title="Edit FAQ"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="p-1.5 rounded-lg text-[#94A3B8] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit FAQ Modal */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full p-7 rounded-3xl bg-[#0B1224]/90 backdrop-blur-2xl border border-white/[0.16] shadow-glass-strong space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono">
              {editingFaq ? 'Edit FAQ Item' : 'Add FAQ Item'}
            </h3>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Category</label>
                <input
                  type="text"
                  value={faqCategory}
                  onChange={(e) => setFaqCategory(e.target.value)}
                  placeholder="Performance, Security, Setup"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Question</label>
                <input
                  type="text"
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  placeholder="Does this guarantee lower ping?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Answer</label>
                <textarea
                  rows={4}
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  placeholder="Detailed, honest explanation..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
              <Button variant="glass" size="sm" onClick={() => setIsFaqModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="glass-cyan" size="sm" onClick={handleSaveFaq}>
                Save FAQ
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
