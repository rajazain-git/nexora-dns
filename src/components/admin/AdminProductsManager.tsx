'use client';

import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Trash2, 
  Edit3, 
  Smartphone, 
  Apple, 
  Check, 
  X, 
  AlertTriangle,
  ShieldCheck,
  Zap,
  Clock,
  DollarSign
} from 'lucide-react';
import { Product, MobilePlatform, DurationType } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/context/ToastContext';

interface Props {
  products: Product[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export function AdminProductsManager({
  products,
  onSaveProduct,
  onDeleteProduct
}: Props) {
  const { showToast } = useToast();
  const [platformFilter, setPlatformFilter] = useState<'all' | 'android' | 'ios'>('all');
  
  // Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Form Fields
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [platform, setPlatform] = useState<MobilePlatform>('android');
  const [pricePKR, setPricePKR] = useState<number>(350);
  const [duration, setDuration] = useState<DurationType>('1-month');
  const [durationLabel, setDurationLabel] = useState('30 Days');
  const [availability, setAvailability] = useState<'in-stock' | 'limited' | 'out-of-stock'>('in-stock');
  const [compatibleDevices, setCompatibleDevices] = useState('');
  const [configMethod, setConfigMethod] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [dotHost, setDotHost] = useState('');
  const [dohUrl, setDohUrl] = useState('');
  const [primaryIP, setPrimaryIP] = useState('');
  const [secondaryIP, setSecondaryIP] = useState('');

  const filteredProducts = products.filter(p => {
    if (platformFilter === 'android') return p.platform === 'android';
    if (platformFilter === 'ios') return p.platform === 'ios';
    return true;
  });

  const handleOpenAddModal = () => {
    setId(`ff-pkg-${Date.now()}`);
    setName('');
    setSlug('');
    setPlatform('android');
    setPricePKR(350);
    setDuration('1-month');
    setDurationLabel('30 Days');
    setAvailability('in-stock');
    setCompatibleDevices('Samsung, Xiaomi, Poco, Infinix, Tecno (Android 9-15)');
    setConfigMethod('Android Private DNS (DoT Port 853)');
    setDescription('High-performance DNS routing for Garena Free Fire mobile.');
    setShortDescription('Encrypted low-jitter DNS resolution for Free Fire.');
    setDotHost('ff-asia.nexoradns.com');
    setDohUrl('https://doh.nexoradns.com/dns-query');
    setPrimaryIP('104.28.16.88');
    setSecondaryIP('104.28.17.88');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setId(p.id);
    setName(p.name);
    setSlug(p.slug);
    setPlatform(p.platform);
    setPricePKR(p.pricePKR);
    setDuration(p.duration);
    setDurationLabel(p.durationLabel);
    setAvailability(p.availability);
    setCompatibleDevices(p.compatibleDevices || '');
    setConfigMethod(p.configMethod || '');
    setDescription(p.description);
    setShortDescription(p.shortDescription || '');
    setDotHost(p.dnsConfig?.dotHost || '');
    setDohUrl(p.dnsConfig?.dohUrl || '');
    setPrimaryIP(p.dnsConfig?.primaryIP || '');
    setSecondaryIP(p.dnsConfig?.secondaryIP || '');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) {
      showToast({ type: 'error', title: 'Missing Name', message: 'Package name is required.' });
      return;
    }

    const generatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const existingProduct = products.find(p => p.id === id);

    const updatedProduct: Product = {
      id: id || `ff-pkg-${Date.now()}`,
      name: name.trim(),
      slug: generatedSlug,
      category: platform === 'ios' ? 'ios' : 'android',
      platform: platform,
      pricePKR: pricePKR,
      priceUSD: Math.round(pricePKR / 278),
      duration: duration,
      durationLabel: durationLabel.trim(),
      isRecurring: false,
      availability: availability,
      coverImage: existingProduct?.coverImage || '/images/products/freefire-dns.png',
      description: description.trim(),
      shortDescription: shortDescription.trim(),
      compatibleDevices: compatibleDevices.trim(),
      configMethod: configMethod.trim(),
      supportedGames: ['Garena Free Fire', 'Free Fire MAX'],
      supportedPlatforms: platform === 'ios' ? ['iOS'] : ['Android'],
      features: [
        'Dedicated Anycast VIP PoP Resolution',
        'TLS 1.3 Transport Layer Encryption',
        'Direct Auth & Matchmaking Routing',
        'Strict No-Logging Architecture',
        'Works across Wi-Fi & 4G/5G Cellular'
      ],
      limitations: [
        'Does not alter in-game UDP routing physics',
        'Requires compatible Android 9+ or iOS 14+'
      ],
      dnsConfig: {
        dotHost: dotHost.trim() || 'ff-asia.nexoradns.com',
        dohUrl: dohUrl.trim() || 'https://doh.nexoradns.com/dns-query',
        primaryIP: primaryIP.trim() || '104.28.16.88',
        secondaryIP: secondaryIP.trim() || '104.28.17.88',
      },
      specs: {
        protocol: platform === 'ios' ? 'DoH (DNS-over-HTTPS)' : 'DoT (DNS-over-TLS)',
        encryption: 'TLS 1.3 / AES-256-GCM',
        targetRegion: 'Asia South / Pakistan Edge',
        routingOptimization: 'Tier-1 BGP Peering',
      },
      faqs: [
        {
          question: 'Does this violate Free Fire Fair Play policies?',
          answer: 'No. NEXORA strictly manages standard domain-name lookups and does not alter game files, memory, hitboxes, or inject client payloads.'
        },
        {
          question: 'How fast is delivery?',
          answer: 'Your credentials unlock instantly in your dashboard upon payment verification.'
        }
      ],
      createdAt: existingProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveProduct(updatedProduct);
    showToast({
      type: 'success',
      title: 'Package Saved',
      message: `${name} has been saved to the database.`,
      duration: 3000
    });
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedProductId) {
      onDeleteProduct(selectedProductId);
      showToast({
        type: 'info',
        title: 'Package Deleted',
        message: 'The package has been removed from the catalog.',
        duration: 3000
      });
      setIsDeleteModalOpen(false);
      setSelectedProductId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.04] border border-[#00E5FF]/30 text-xs font-mono text-[#00E5FF] mb-2 font-bold shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Package className="w-3.5 h-3.5" />
            <span>FREE FIRE MOBILE PACKAGES ONLY • STRICT VALIDATION</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-[#F1F5F9] tracking-tight">
            PRODUCT & PRICING CONTROL
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-xl mt-1 leading-relaxed">
            Manage packages exclusively for Free Fire on Android & iOS devices. Price adjustments apply immediately to new checkouts while preserving historical purchase amounts.
          </p>
        </div>

        <Button variant="glass-cyan" size="sm" onClick={handleOpenAddModal} className="font-bold">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>New Free Fire Package</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] w-fit">
        <button
          onClick={() => setPlatformFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
            platformFilter === 'all' ? 'bg-[#00E5FF] text-[#080D1A] font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)]' : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          All Packages ({products.length})
        </button>
        <button
          onClick={() => setPlatformFilter('android')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
            platformFilter === 'android' ? 'bg-[#00E5FF] text-[#080D1A] font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)]' : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          Android DNS ({products.filter(p => p.platform === 'android').length})
        </button>
        <button
          onClick={() => setPlatformFilter('ios')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
            platformFilter === 'ios' ? 'bg-[#8B5CF6] text-white font-bold shadow-[0_0_12px_rgba(139,92,246,0.3)]' : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          Apple iOS DNS ({products.filter(p => p.platform === 'ios').length})
        </button>
      </div>

      {/* Products Table */}
      <div className="rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] overflow-hidden shadow-glass-strong">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.04] border-b border-white/[0.08] text-[#94A3B8] uppercase">
              <tr>
                <th className="py-4 px-5">Package Name</th>
                <th className="py-4 px-5">Platform</th>
                <th className="py-4 px-5">Price (PKR)</th>
                <th className="py-4 px-5">Duration</th>
                <th className="py-4 px-5">Config Method</th>
                <th className="py-4 px-5">Availability</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-[#F1F5F9]">
              {filteredProducts.map((p) => {
                const isIos = p.platform === 'ios';
                return (
                  <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-4 px-5 font-bold font-sans">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${isIos ? 'bg-[#8B5CF6] text-[#8B5CF6]' : 'bg-[#00E5FF] text-[#00E5FF]'}`} />
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                        isIos ? 'bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30' : 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30'
                      }`}>
                        {isIos ? 'Apple iOS' : 'Android'}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-bold text-[#00E5FF]">
                      {p.pricePKR === 0 ? 'FREE TRIAL' : `Rs. ${p.pricePKR}`}
                    </td>
                    <td className="py-4 px-5 text-[#94A3B8]">
                      {p.durationLabel}
                    </td>
                    <td className="py-4 px-5 text-[#94A3B8] max-w-[180px] truncate">
                      {p.configMethod || (isIos ? 'DoH .mobileconfig' : 'DoT Port 853')}
                    </td>
                    <td className="py-4 px-5">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                        p.availability === 'in-stock' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {p.availability}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#00E5FF] hover:bg-white/[0.06] transition-colors"
                        title="Edit Package"
                      >
                        <Edit3 className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProductId(p.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-[#94A3B8] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Package"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full p-7 rounded-3xl bg-[#0B1224]/90 backdrop-blur-2xl border border-white/[0.16] shadow-glass-strong space-y-5 my-8">
            <h3 className="text-base font-bold uppercase tracking-wider text-[#F1F5F9] font-mono flex items-center gap-2.5">
              <Package className="w-5 h-5 text-[#00E5FF]" />
              <span>{name ? `Edit ${name}` : 'Create Free Fire DNS Package'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Package Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="NEXORA Free Fire Android Elite"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">
                  Mobile Platform (Strict: Android or iOS)
                </label>
                <select
                  value={platform}
                  onChange={(e) => {
                    const nextPlat = e.target.value as MobilePlatform;
                    setPlatform(nextPlat);
                    if (nextPlat === 'ios') {
                      setConfigMethod('Apple DoH Profile (.mobileconfig)');
                      setCompatibleDevices('iPhone 11-16, iPad (iOS 14-18)');
                    } else {
                      setConfigMethod('Android Private DNS (DoT Port 853)');
                      setCompatibleDevices('Samsung, Xiaomi, Poco, Infinix, Tecno (Android 9-15)');
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                >
                  <option value="android" className="bg-[#0B1224]">Android (Private DNS DoT)</option>
                  <option value="ios" className="bg-[#0B1224]">Apple iOS (DoH Profile)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Price (PKR)</label>
                <input
                  type="number"
                  min="0"
                  value={pricePKR}
                  onChange={(e) => setPricePKR(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Duration & Label</label>
                <div className="flex gap-2">
                  <select
                    value={duration}
                    onChange={(e) => {
                      const dur = e.target.value as DurationType;
                      setDuration(dur);
                      if (dur === 'trial-3d') setDurationLabel('3-Day Trial');
                      else if (dur === '1-month') setDurationLabel('30 Days');
                      else if (dur === '3-months') setDurationLabel('90 Days');
                      else if (dur === '1-year') setDurationLabel('365 Days');
                    }}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                  >
                    <option value="trial-3d" className="bg-[#0B1224]">3-Day Trial</option>
                    <option value="1-month" className="bg-[#0B1224]">1 Month (30 Days)</option>
                    <option value="3-months" className="bg-[#0B1224]">3 Months (90 Days)</option>
                    <option value="1-year" className="bg-[#0B1224]">1 Year (365 Days)</option>
                  </select>
                  <input
                    type="text"
                    value={durationLabel}
                    onChange={(e) => setDurationLabel(e.target.value)}
                    className="w-28 px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Compatible Device Models</label>
                <input
                  type="text"
                  value={compatibleDevices}
                  onChange={(e) => setCompatibleDevices(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Configuration Setup Method</label>
                <input
                  type="text"
                  value={configMethod}
                  onChange={(e) => setConfigMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Anycast DoT Hostname</label>
                <input
                  type="text"
                  value={dotHost}
                  onChange={(e) => setDotHost(e.target.value)}
                  placeholder="ff-dot.nexoradns.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Encrypted DoH URL</label>
                <input
                  type="text"
                  value={dohUrl}
                  onChange={(e) => setDohUrl(e.target.value)}
                  placeholder="https://doh.nexoradns.com/dns-query"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-mono text-[#94A3B8] block mb-1.5">Package Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-white/[0.08]">
              <Button variant="glass" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="glass-cyan" size="sm" onClick={handleSave}>
                Save Package
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full p-7 rounded-3xl bg-[#0B1224]/90 backdrop-blur-2xl border border-rose-500/40 shadow-glass-strong space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono">
                Confirm Package Deletion
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Are you sure you want to delete this Free Fire package? Historical customer orders referencing this package will preserve their original records, but new customers won't be able to buy it.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <Button variant="glass" size="sm" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleConfirmDelete}>
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
