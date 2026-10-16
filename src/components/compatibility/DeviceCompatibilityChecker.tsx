'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Smartphone, 
  Apple, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  Shield, 
  ExternalLink,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { COMPATIBILITY_RULES, CompatibilityRule, checkDeviceCompatibility } from '@/lib/compatibility-data';
import { getStoredProducts } from '@/lib/store-db';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface DeviceCompatibilityCheckerProps {
  initialPlatform?: 'android' | 'ios';
  compactMode?: boolean;
}

export function DeviceCompatibilityChecker({
  initialPlatform = 'android',
  compactMode = false
}: DeviceCompatibilityCheckerProps) {
  const [platform, setPlatform] = useState<'android' | 'ios'>(initialPlatform);
  const [osVersion, setOsVersion] = useState<string>(
    initialPlatform === 'android' ? 'Android 14' : 'iOS 17'
  );
  const [lang, setLang] = useState<'en' | 'ur'>('en');

  const products = getStoredProducts();

  const handlePlatformSwitch = (p: 'android' | 'ios') => {
    setPlatform(p);
    if (p === 'android') {
      setOsVersion('Android 14');
    } else {
      setOsVersion('iOS 17');
    }
  };

  const isUnlisted = osVersion === 'unlisted';
  const matchedRule: CompatibilityRule | null = isUnlisted 
    ? null 
    : checkDeviceCompatibility(platform, osVersion);

  const compatibleProducts = matchedRule 
    ? products.filter(prod => matchedRule.compatibleProductIds.includes(prod.id))
    : [];

  return (
    <div className="w-full rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.12] p-6 sm:p-8 lg:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.12)]">
      
      {/* Header with Title and Language Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[11px] font-mono text-[#00E5FF] mb-2">
            <Sparkles className="w-3 h-3" />
            <span>NEXORA DEVICE ENGINE</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#F1F5F9] tracking-tight">
            Smart Device Compatibility Checker
          </h3>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Verify native DNS protocol support and get tailored setup instructions for your Free Fire mobile device.
          </p>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-white/[0.06] border border-white/[0.10] self-end sm:self-center">
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              lang === 'en'
                ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLang('ur')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all font-sans ${
              lang === 'ur'
                ? 'bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30 shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            اردو (Urdu)
          </button>
        </div>
      </div>

      {/* Interactive Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 pb-8 border-b border-white/[0.08]">
        
        {/* Step 1: Select Platform */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] font-mono flex items-center gap-2">
            <span>1. Target Mobile Operating System</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handlePlatformSwitch('android')}
              className={`p-4 rounded-2xl flex flex-col items-center gap-2.5 border transition-all text-center ${
                platform === 'android'
                  ? 'bg-gradient-to-b from-[#00E5FF]/15 to-transparent border-[#00E5FF]/50 shadow-[0_0_20px_rgba(0,229,255,0.2)] text-[#F1F5F9]'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.08] text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              <Smartphone className={`w-7 h-7 ${platform === 'android' ? 'text-[#00E5FF]' : 'text-[#94A3B8]'}`} />
              <div>
                <div className="font-bold text-sm">Android</div>
                <div className="text-[10px] text-[#94A3B8] font-mono">Private DNS (DoT)</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handlePlatformSwitch('ios')}
              className={`p-4 rounded-2xl flex flex-col items-center gap-2.5 border transition-all text-center ${
                platform === 'ios'
                  ? 'bg-gradient-to-b from-[#8B5CF6]/15 to-transparent border-[#8B5CF6]/50 shadow-[0_0_20px_rgba(139,92,246,0.2)] text-[#F1F5F9]'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.08] text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              <Apple className={`w-7 h-7 ${platform === 'ios' ? 'text-[#A78BFA]' : 'text-[#94A3B8]'}`} />
              <div>
                <div className="font-bold text-sm">Apple iOS</div>
                <div className="text-[10px] text-[#94A3B8] font-mono">DoH (.mobileconfig)</div>
              </div>
            </button>
          </div>
        </div>

        {/* Step 2: Select OS Version */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] font-mono flex items-center justify-between">
            <span>2. Device Operating System Version</span>
            <span className="text-[10px] text-[#00E5FF] normal-case">Check Settings &gt; About Phone</span>
          </label>
          
          <select
            value={osVersion}
            onChange={(e) => setOsVersion(e.target.value)}
            className="w-full px-4 py-3.5 rounded-2xl bg-[#0B1224] border border-white/[0.14] text-sm text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
          >
            {platform === 'android' ? (
              <>
                <option value="Android 15">Android 15 (Latest)</option>
                <option value="Android 14">Android 14 (HyperOS, One UI 6, Pixel)</option>
                <option value="Android 13">Android 13 (Tiramisu)</option>
                <option value="Android 12">Android 12 (Snow Cone)</option>
                <option value="Android 11">Android 11 (Red Velvet)</option>
                <option value="Android 10">Android 10 (Quince)</option>
                <option value="Android 9.0 (Pie)">Android 9.0 (Pie - First with Private DNS)</option>
                <option value="Android 8.1 (Oreo) and below">Android 8.1 (Oreo) and below (Legacy)</option>
                <option value="unlisted">Custom ROM / Other Unlisted Model</option>
              </>
            ) : (
              <>
                <option value="iOS 18">iOS 18 (iPhone 16 / Latest)</option>
                <option value="iOS 17">iOS 17 (iPhone 15, 14, 13, 12, 11)</option>
                <option value="iOS 16">iOS 16 (iPhone 14 / 8 Plus)</option>
                <option value="iOS 15">iOS 15 (iPhone 7 / 6s)</option>
                <option value="iOS 14">iOS 14 (First with Apple Encrypted DNS)</option>
                <option value="iOS 13 and below">iOS 13 and below (Legacy)</option>
                <option value="unlisted">Other / Unlisted Apple Device</option>
              </>
            )}
          </select>

          <p className="text-[11px] text-[#94A3B8] flex items-center gap-1.5 pt-1">
            <Info className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
            <span>
              {platform === 'android' 
                ? 'Compatible with Samsung, Xiaomi, Redmi, Poco, Infinix, Tecno, Realme, Vivo, Oppo, Google Pixel.' 
                : 'Compatible with iPhone 11-16 series, iPhone SE 2/3, iPad Pro, iPad Air, iPad Mini.'}
            </span>
          </p>
        </div>
      </div>

      {/* Results Section */}
      <div className="pt-8 space-y-6">
        
        {/* State A: Unverified / Custom ROM */}
        {isUnlisted && (
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
              <h4 className="font-bold text-base text-[#F1F5F9]">Compatibility Not Yet Verified</h4>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              We cannot guarantee native Private DNS support for custom or unlisted firmware without manual verification. Please inspect your phone&apos;s Network Settings for a &quot;Private DNS&quot; menu option, or reach out to our WhatsApp support team for live assistance.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link href="/contact">
                <Button variant="outline" size="sm" className="text-xs">
                  Request Device Verification
                </Button>
              </Link>
              <Link href="/troubleshoot">
                <Button variant="ghost" size="sm" className="text-xs text-[#00E5FF]">
                  View Diagnostic Guides &rarr;
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* State B: Incompatible */}
        {matchedRule && matchedRule.status === 'incompatible' && (
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 space-y-3">
            <div className="flex items-center gap-2.5">
              <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
              <h4 className="font-bold text-base text-[#F1F5F9]">
                {matchedRule.statusLabel[lang]}
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              {matchedRule.summary[lang]}
            </p>
            <div className="pt-2">
              <Link href="/setup-guides">
                <Button variant="outline" size="sm" className="text-xs">
                  View Alternative Setup Guides
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* State C: Verified Compatible or Partially Compatible */}
        {matchedRule && matchedRule.status !== 'incompatible' && (
          <div className="space-y-6">
            
            {/* Status Callout Card */}
            <div className={`p-6 rounded-2xl border ${
              matchedRule.status === 'verified_compatible'
                ? 'bg-[#00E5FF]/[0.06] border-[#00E5FF]/30 shadow-[0_0_25px_rgba(0,229,255,0.15)]'
                : 'bg-amber-500/[0.06] border-amber-500/30'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className={`w-6 h-6 ${
                    matchedRule.status === 'verified_compatible' ? 'text-[#00E5FF]' : 'text-amber-400'
                  }`} />
                  <span className="font-black text-base sm:text-lg text-[#F1F5F9]">
                    {matchedRule.statusLabel[lang]}
                  </span>
                </div>
                <Badge variant={matchedRule.status === 'verified_compatible' ? 'cyan' : 'outline'} size="sm">
                  {platform.toUpperCase()} NATIVE PROTOCOL
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                {matchedRule.summary[lang]}
              </p>
            </div>

            {/* Prerequisites & Instructions Dual Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Prerequisites Card */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#00E5FF] font-mono flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Required Prerequisites</span>
                </h5>
                <ul className="space-y-2 text-xs text-[#94A3B8]">
                  {matchedRule.prerequisites[lang].map((prereq, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] mt-1.5 shrink-0" />
                      <span>{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Known Limitations Card */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Honest Operational Scope</span>
                </h5>
                <ul className="space-y-2 text-xs text-[#94A3B8]">
                  {matchedRule.limitations[lang].map((limit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{limit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step-by-Step Setup Walkthrough */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#F1F5F9] font-mono flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#8B5CF6]" />
                <span>Step-by-Step Configuration Method</span>
              </h5>
              <div className="space-y-2.5">
                {matchedRule.setupSteps[lang].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <span className="w-5 h-5 rounded-full bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-[10px] font-mono text-[#00E5FF] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compatible Product Packages */}
            {compatibleProducts.length > 0 && (
              <div className="pt-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#F1F5F9] font-mono">
                    Compatible Free Fire Packages
                  </h5>
                  <Link href={`/store?platform=${platform}`} className="text-xs text-[#00E5FF] hover:underline flex items-center gap-1">
                    <span>View all {platform} packages</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {compatibleProducts.map(prod => (
                    <div 
                      key={prod.id}
                      className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.10] hover:border-[#00E5FF]/40 transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <Badge variant={prod.platform === 'android' ? 'cyan' : 'violet'} size="sm">
                            {prod.durationLabel}
                          </Badge>
                          <span className="text-xs font-mono font-bold text-[#F1F5F9]">
                            Rs. {prod.pricePKR}
                          </span>
                        </div>
                        <h6 className="font-bold text-xs text-[#F1F5F9] line-clamp-1">
                          {prod.name}
                        </h6>
                        <p className="text-[11px] text-[#94A3B8] mt-1 line-clamp-2">
                          {prod.shortDescription}
                        </p>
                      </div>

                      <Link href={`/store/${prod.id}`}>
                        <Button variant="glass-cyan" size="sm" className="w-full text-xs py-1.5">
                          Configure Package
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Safety Notice Footer */}
      <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center gap-2 text-[11px] text-[#94A3B8]">
        <Shield className="w-4 h-4 text-[#00E5FF] shrink-0" />
        <span>
          NEXORA DNS provides RFC standard encrypted routing. We never request device passwords, IMEI numbers, or Google/Apple credentials.
        </span>
      </div>
    </div>
  );
}
