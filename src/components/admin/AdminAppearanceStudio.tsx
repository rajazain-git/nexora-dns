'use client';

import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  Save, 
  Upload, 
  RotateCcw, 
  Eye, 
  Check, 
  Sliders, 
  Smartphone, 
  Monitor, 
  Layout, 
  Type, 
  Layers, 
  Sun,
  ShieldCheck,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { SiteSettings, SiteTheme } from '@/types';
import { THEME_PRESETS, DEFAULT_SITE_CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/context/ToastContext';

interface Props {
  settings: SiteSettings;
  onSaveDraft: (draft: SiteSettings) => void;
  onPublish: (note?: string) => void;
  onRestoreVersion: () => void;
}

export function AdminAppearanceStudio({
  settings,
  onSaveDraft,
  onPublish,
  onRestoreVersion
}: Props) {
  const { showToast } = useToast();
  const [theme, setTheme] = useState<SiteTheme>(() => {
    return settings.theme ? { ...settings.theme } : { ...DEFAULT_SITE_CONFIG.theme };
  });

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [activeSection, setActiveSection] = useState<'presets' | 'colors' | 'typography' | 'shapes' | 'branding'>('presets');
  const [publishNote, setPublishNote] = useState('');

  const handleApplyPreset = (presetId: string) => {
    const found = THEME_PRESETS.find(p => p.id === presetId);
    if (!found) return;

    setTheme(prev => ({
      ...prev,
      activePreset: found.id,
      primaryColor: found.primaryColor,
      secondaryColor: found.secondaryColor,
      backgroundColor: found.backgroundColor,
      cardColor: found.cardColor,
      borderColor: found.borderColor,
      textColor: found.textColor,
      mutedColor: found.mutedColor,
      buttonRadius: found.buttonRadius,
      cardRadius: found.cardRadius,
      fontFamily: found.fontFamily,
    }));

    showToast({
      type: 'info',
      title: 'Theme Preset Applied',
      message: `Loaded ${found.name}. Preview updated.`,
      duration: 2500,
    });
  };

  const handleColorChange = (key: keyof SiteTheme, value: string) => {
    setTheme(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveDraft = () => {
    const updatedSettings: SiteSettings = {
      ...settings,
      theme,
      brandName: theme.brandName || settings.brandName,
      tagline: theme.tagline || settings.tagline,
    };
    onSaveDraft(updatedSettings);
    showToast({
      type: 'success',
      title: 'Draft Saved',
      message: 'Appearance draft saved to storage. Changes are not yet live to visitors.',
      duration: 3000,
    });
  };

  const handlePublish = () => {
    const updatedSettings: SiteSettings = {
      ...settings,
      theme,
      brandName: theme.brandName || settings.brandName,
      tagline: theme.tagline || settings.tagline,
    };
    onSaveDraft(updatedSettings);
    onPublish(publishNote || 'Published theme updates from Appearance Studio');
    showToast({
      type: 'success',
      title: 'Theme Published to Live Website',
      message: 'New colors, typography, and styles are now broadcasting to all visitors.',
      duration: 4000,
    });
    setPublishNote('');
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Publishing Controls */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.04] border border-[#00E5FF]/30 text-xs font-mono text-[#00E5FF] mb-2 font-bold shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Palette className="w-3.5 h-3.5" />
            <span>VISUAL WEBSITE CUSTOMIZER • DRAFT / PUBLISHED ENGINE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-[#F1F5F9] tracking-tight">
            APPEARANCE STUDIO
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-xl mt-1 leading-relaxed">
            Customize colors, typography, button curvature, and brand identity in draft mode. When ready, publish changes to the live store with zero code rebuilding.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
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

          <Button 
            variant="glass" 
            size="sm"
            onClick={onRestoreVersion}
            className="text-xs font-mono text-[#94A3B8]"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>Versions</span>
          </Button>
        </div>
      </div>

      {/* Main Studio Workspace: Left Controls / Right Live Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Customizer Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Sub-Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08]">
            {[
              { id: 'presets', label: 'Preset Themes', icon: Sparkles },
              { id: 'colors', label: 'Colors & Gradients', icon: Palette },
              { id: 'typography', label: 'Typography', icon: Type },
              { id: 'shapes', label: 'Borders & Curves', icon: Layers },
              { id: 'branding', label: 'Brand & Logos', icon: Sliders },
            ].map(tab => {
              const Icon = tab.icon;
              const active = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono transition-all ${
                    active 
                      ? 'bg-[#00E5FF] text-[#080D1A] font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)]' 
                      : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Preset Themes */}
          {activeSection === 'presets' && (
            <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] space-y-4 shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono">
                Select a One-Click Theme Preset
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Presets configure the entire palette, button shapes, font family, and card curvature automatically.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {THEME_PRESETS.map(preset => {
                  const isSelected = theme.activePreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset.id)}
                      className={`p-4 rounded-2xl text-left border transition-all relative overflow-hidden group backdrop-blur-md ${
                        isSelected 
                          ? 'border-[#00E5FF] bg-white/[0.10] shadow-[0_0_20px_rgba(0,229,255,0.20)]' 
                          : 'border-white/[0.08] bg-white/[0.04] hover:border-white/[0.20]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-[#F1F5F9]">
                          {preset.name}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-[#00E5FF] text-[#080D1A] flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </span>
                        )}
                      </div>

                      {/* Color Palette Preview Swatches */}
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <div className="w-6 h-6 rounded-lg shadow-sm border border-white/20" style={{ backgroundColor: preset.primaryColor }} title="Primary Accent" />
                        <div className="w-6 h-6 rounded-lg shadow-sm border border-white/20" style={{ backgroundColor: preset.secondaryColor }} title="Secondary Accent" />
                        <div className="w-6 h-6 rounded-lg shadow-sm border border-white/20" style={{ backgroundColor: preset.backgroundColor }} title="Background" />
                        <div className="w-6 h-6 rounded-lg shadow-sm border border-white/20" style={{ backgroundColor: preset.cardColor }} title="Card Surface" />
                      </div>

                      <div className="text-[10px] font-mono text-[#94A3B8]">
                        Font: {preset.fontFamily.toUpperCase()} • Radius: {preset.buttonRadius}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Colors & Gradients */}
          {activeSection === 'colors' && (
            <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] space-y-6 shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono">
                  Custom Color Palette
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1">
                  Adjust hex values or use the color pickers to fine-tune your brand colors.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Primary Accent */}
                <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] space-y-2">
                  <label className="text-xs font-mono text-[#94A3B8] block">Primary Accent (Cyan / Main)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={theme.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                    />
                    <input 
                      type="text" 
                      value={theme.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>
                </div>

                {/* Secondary Accent */}
                <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] space-y-2">
                  <label className="text-xs font-mono text-[#94A3B8] block">Secondary Accent (Violet)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={theme.secondaryColor}
                      onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                    />
                    <input 
                      type="text" 
                      value={theme.secondaryColor}
                      onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>
                </div>

                {/* Background Surface */}
                <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] space-y-2">
                  <label className="text-xs font-mono text-[#94A3B8] block">Main Background (Midnight Navy)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={theme.backgroundColor}
                      onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                    />
                    <input 
                      type="text" 
                      value={theme.backgroundColor}
                      onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>
                </div>

                {/* Card Surface */}
                <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] space-y-2">
                  <label className="text-xs font-mono text-[#94A3B8] block">Card / Surface (Deep Slate)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={theme.cardColor}
                      onChange={(e) => handleColorChange('cardColor', e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                    />
                    <input 
                      type="text" 
                      value={theme.cardColor}
                      onChange={(e) => handleColorChange('cardColor', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>
                </div>

                {/* Border Color */}
                <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] space-y-2">
                  <label className="text-xs font-mono text-[#94A3B8] block">Border Stroke Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={theme.borderColor}
                      onChange={(e) => handleColorChange('borderColor', e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                    />
                    <input 
                      type="text" 
                      value={theme.borderColor}
                      onChange={(e) => handleColorChange('borderColor', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>
                </div>

                {/* Primary Text Color */}
                <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] space-y-2">
                  <label className="text-xs font-mono text-[#94A3B8] block">Ice White Main Text</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={theme.textColor}
                      onChange={(e) => handleColorChange('textColor', e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                    />
                    <input 
                      type="text" 
                      value={theme.textColor}
                      onChange={(e) => handleColorChange('textColor', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Typography */}
          {activeSection === 'typography' && (
            <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] space-y-4 shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono">
                Font Family Selection
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Select the typographic voice for the store and headlines.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { id: 'inter', name: 'Inter (Clean Technical)', sample: 'Clean, balanced readability for esports metrics.' },
                  { id: 'space-grotesk', name: 'Space Grotesk (Futuristic)', sample: 'Sharp tech geometry with modern SaaS edge.' },
                  { id: 'rajdhani', name: 'Rajdhani (Esports Combat)', sample: 'Condensed, aggressive gaming typography.' },
                  { id: 'orbitron', name: 'Orbitron (Sci-Fi Cyber)', sample: 'Heavy cybernetic aesthetic for high-tech gear.' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setTheme(prev => ({ ...prev, fontFamily: f.id as any }))}
                    className={`p-4 rounded-2xl text-left border transition-all backdrop-blur-md ${
                      theme.fontFamily === f.id
                        ? 'border-[#00E5FF] bg-white/[0.10] shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                        : 'border-white/[0.08] bg-white/[0.04] hover:border-white/[0.20]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#F1F5F9] mb-1">{f.name}</div>
                    <div className="text-[11px] text-[#94A3B8] leading-relaxed">{f.sample}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Shapes & Curves */}
          {activeSection === 'shapes' && (
            <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] space-y-6 shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono">
                Corner Radii & Component Shapes
              </h3>

              {/* Button Curvature */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#94A3B8] block">Button Border Radius</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'sharp', label: 'Sharp (0px)' },
                    { id: 'rounded-md', label: 'Medium (6px)' },
                    { id: 'rounded-lg', label: 'Large (10px)' },
                    { id: 'pill', label: 'Full Pill (9999px)' },
                  ].map(r => (
                    <button
                      key={r.id}
                      onClick={() => setTheme(prev => ({ ...prev, buttonRadius: r.id as any }))}
                      className={`p-2.5 rounded-xl text-xs font-mono text-center border transition-all ${
                        theme.buttonRadius === r.id
                          ? 'border-[#00E5FF] bg-white/[0.10] text-[#00E5FF] font-bold shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                          : 'border-white/[0.08] bg-white/[0.04] text-[#94A3B8]'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Curvature */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#94A3B8] block">Card / Surface Radius</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'none', label: 'Square (0px)' },
                    { id: 'rounded-lg', label: 'Compact (10px)' },
                    { id: 'rounded-xl', label: 'Standard (16px)' },
                    { id: 'rounded-2xl', label: 'Soft 2XL (24px)' },
                  ].map(r => (
                    <button
                      key={r.id}
                      onClick={() => setTheme(prev => ({ ...prev, cardRadius: r.id as any }))}
                      className={`p-2.5 rounded-xl text-xs font-mono text-center border transition-all ${
                        theme.cardRadius === r.id
                          ? 'border-[#8B5CF6] bg-white/[0.10] text-[#8B5CF6] font-bold shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                          : 'border-white/[0.08] bg-white/[0.04] text-[#94A3B8]'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Header Style & Animation Intensity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-[#94A3B8] block">Header Appearance</label>
                  <select
                    value={theme.headerStyle}
                    onChange={(e) => setTheme(prev => ({ ...prev, headerStyle: e.target.value as any }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                  >
                    <option value="glass" className="bg-[#0B1224]">Glassmorphism (Frosted Blur)</option>
                    <option value="solid" className="bg-[#0B1224]">Solid Midnight</option>
                    <option value="floating" className="bg-[#0B1224]">Floating Modern Nav</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-[#94A3B8] block">Animation Intensity</label>
                  <select
                    value={theme.animationIntensity}
                    onChange={(e) => setTheme(prev => ({ ...prev, animationIntensity: e.target.value as any }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                  >
                    <option value="none" className="bg-[#0B1224]">None (Reduced Motion)</option>
                    <option value="subtle" className="bg-[#0B1224]">Subtle</option>
                    <option value="normal" className="bg-[#0B1224]">Normal (Standard Esports)</option>
                    <option value="energetic" className="bg-[#0B1224]">Energetic (High Glow)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Branding & Logos */}
          {activeSection === 'branding' && (
            <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] space-y-4 shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono">
                Brand Name, Tagline & Media
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Brand Name</label>
                  <input
                    type="text"
                    value={theme.brandName || ''}
                    onChange={(e) => setTheme(prev => ({ ...prev, brandName: e.target.value }))}
                    placeholder="NEXORA DNS"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Brand Tagline</label>
                  <input
                    type="text"
                    value={theme.tagline || ''}
                    onChange={(e) => setTheme(prev => ({ ...prev, tagline: e.target.value }))}
                    placeholder="FREE FIRE MOBILE DNS. BUILT FOR YOUR DEVICE."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Custom Logo Image URL (Optional)</label>
                  <input
                    type="text"
                    value={theme.logoUrl || ''}
                    onChange={(e) => setTheme(prev => ({ ...prev, logoUrl: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Favicon URL (Optional)</label>
                  <input
                    type="text"
                    value={theme.faviconUrl || ''}
                    onChange={(e) => setTheme(prev => ({ ...prev, faviconUrl: e.target.value }))}
                    placeholder="https://example.com/favicon.ico"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Publishing Note Drawer */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] space-y-2">
            <label className="text-xs font-mono text-[#94A3B8] block">
              Version Note (Saved into Backup History on Publish)
            </label>
            <input 
              type="text"
              value={publishNote}
              onChange={(e) => setPublishNote(e.target.value)}
              placeholder="e.g. Switched primary button curvature and refined cyan lighting"
              className="w-full px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
            />
          </div>

        </div>

        {/* Right Column: Live Interactive Preview Sandbox (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] font-mono flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Live Interactive Sandbox</span>
            </h3>

            {/* Desktop vs Mobile Toggle */}
            <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/[0.08]">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  previewDevice === 'desktop' ? 'bg-[#00E5FF] text-[#080D1A] shadow-[0_0_10px_rgba(0,229,255,0.3)]' : 'text-[#94A3B8]'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  previewDevice === 'mobile' ? 'bg-[#00E5FF] text-[#080D1A] shadow-[0_0_10px_rgba(0,229,255,0.3)]' : 'text-[#94A3B8]'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Simulation Frame */}
          <div 
            style={{
              backgroundColor: theme.backgroundColor,
              color: theme.textColor,
            }}
            className={`rounded-3xl border border-white/[0.15] p-5 shadow-glass-strong backdrop-blur-xl transition-all duration-300 ${
              previewDevice === 'mobile' ? 'max-w-xs mx-auto border-[#00E5FF]/40' : 'w-full'
            }`}
          >
            {/* Simulated Header */}
            <div 
              style={{
                backgroundColor: theme.cardColor,
                borderColor: theme.borderColor,
              }}
              className="p-3 rounded-2xl border flex items-center justify-between mb-4 shadow-sm backdrop-blur-md"
            >
              <div className="flex items-center gap-2">
                <div 
                  style={{ backgroundColor: theme.primaryColor }}
                  className="w-3 h-3 rounded-full animate-pulse shadow-sm"
                />
                <span className="text-xs font-black uppercase tracking-wider" style={{ color: theme.textColor }}>
                  {theme.brandName || 'NEXORA DNS'}
                </span>
              </div>
              <div 
                style={{
                  backgroundColor: `${theme.primaryColor}20`,
                  color: theme.primaryColor,
                  borderColor: `${theme.primaryColor}40`,
                }}
                className="px-2 py-0.5 rounded-lg text-[10px] font-mono border font-bold"
              >
                ACTIVE
              </div>
            </div>

            {/* Simulated Product Card */}
            <div 
              style={{
                backgroundColor: theme.cardColor,
                borderColor: theme.borderColor,
                borderRadius: theme.cardRadius === 'none' ? '0px' : theme.cardRadius === 'rounded-lg' ? '10px' : theme.cardRadius === 'rounded-xl' ? '16px' : '24px',
              }}
              className="p-4 border space-y-3 mb-4 shadow-md backdrop-blur-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span 
                    style={{
                      color: theme.primaryColor,
                      borderColor: `${theme.primaryColor}30`,
                      backgroundColor: `${theme.primaryColor}15`,
                    }}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-lg border uppercase block mb-1 w-fit"
                  >
                    ANDROID DNS • FREE FIRE
                  </span>
                  <h4 className="text-xs font-black uppercase" style={{ color: theme.textColor }}>
                    NEXORA FF Elite (30 Days)
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold" style={{ color: theme.primaryColor }}>
                    Rs. 350
                  </span>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed" style={{ color: theme.mutedColor }}>
                Configured with native Android Private DNS (DoT Port 853) for Samsung, Poco, Xiaomi and Infinix.
              </p>

              {/* Action Buttons with selected Button Radius */}
              <div className="flex gap-2 pt-1">
                <button
                  style={{
                    backgroundColor: theme.primaryColor,
                    color: theme.backgroundColor,
                    borderRadius: theme.buttonRadius === 'sharp' ? '0px' : theme.buttonRadius === 'rounded-md' ? '6px' : theme.buttonRadius === 'rounded-lg' ? '10px' : '9999px',
                  }}
                  className="flex-1 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm hover:brightness-110"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Buy Now</span>
                </button>

                <button
                  style={{
                    backgroundColor: `${theme.secondaryColor}25`,
                    color: theme.secondaryColor,
                    borderColor: `${theme.secondaryColor}50`,
                    borderRadius: theme.buttonRadius === 'sharp' ? '0px' : theme.buttonRadius === 'rounded-md' ? '6px' : theme.buttonRadius === 'rounded-lg' ? '10px' : '9999px',
                  }}
                  className="px-3 py-2 text-xs font-bold border flex items-center justify-center hover:brightness-110"
                >
                  <Zap className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Color Swatch Telemetry */}
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono space-y-1 text-[#94A3B8]">
              <div className="flex justify-between">
                <span>Primary:</span>
                <span className="font-bold text-[#F1F5F9]">{theme.primaryColor}</span>
              </div>
              <div className="flex justify-between">
                <span>Secondary:</span>
                <span className="font-bold text-[#F1F5F9]">{theme.secondaryColor}</span>
              </div>
              <div className="flex justify-between">
                <span>Radius:</span>
                <span className="font-bold text-[#F1F5F9]">{theme.buttonRadius}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
