'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  HelpCircle, 
  Search, 
  Smartphone, 
  Apple, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  ChevronRight, 
  ChevronDown, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  Info,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { 
  TROUBLESHOOTING_ARTICLES, 
  DIAGNOSTIC_FLOW, 
  TroubleshootingArticle 
} from '@/lib/troubleshooting-data';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DEFAULT_SITE_CONFIG } from '@/lib/config';
import { useSiteConfig } from '@/context/SiteConfigContext';

export default function TroubleshootPage() {
  const { settings } = useSiteConfig();
  const whatsappNum = settings.content?.whatsappNumber || settings.whatsappNumber || DEFAULT_SITE_CONFIG.whatsappNumber;

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [platformCategory, setPlatformCategory] = useState<'all' | 'android' | 'ios' | 'general'>('all');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);

  // Guided Diagnostic Flow State
  const [currentStepId, setCurrentStepId] = useState<string>('start');
  const [historySteps, setHistorySteps] = useState<string[]>([]);
  const [recommendedArticle, setRecommendedArticle] = useState<TroubleshootingArticle | null>(null);
  const [solutionNote, setSolutionNote] = useState<string | null>(null);
  const [orderRefInput, setOrderRefInput] = useState('');

  // Diagnostic Flow Navigation
  const handleSelectOption = (opt: { nextStepId?: string; recommendedArticleId?: string; solutionNote?: string }) => {
    if (opt.recommendedArticleId) {
      const art = TROUBLESHOOTING_ARTICLES.find(a => a.id === opt.recommendedArticleId);
      if (art) {
        setRecommendedArticle(art);
        setSolutionNote(null);
      }
    } else if (opt.solutionNote) {
      setSolutionNote(opt.solutionNote);
      setRecommendedArticle(null);
    } else if (opt.nextStepId) {
      setHistorySteps(prev => [...prev, currentStepId]);
      setCurrentStepId(opt.nextStepId);
    }
  };

  const handleResetDiagnostic = () => {
    setCurrentStepId('start');
    setHistorySteps([]);
    setRecommendedArticle(null);
    setSolutionNote(null);
  };

  const currentQuestion = DIAGNOSTIC_FLOW[currentStepId];

  // Filtered Articles
  const filteredArticles = TROUBLESHOOTING_ARTICLES.filter(art => {
    const matchesPlatform = platformCategory === 'all' || art.platform === platformCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesPlatform;
    const matchesSearch = 
      art.title.toLowerCase().includes(q) ||
      art.summary.toLowerCase().includes(q) ||
      art.symptoms.some(s => s.toLowerCase().includes(q)) ||
      art.steps.some(st => st.toLowerCase().includes(q));
    return matchesPlatform && matchesSearch;
  });

  const whatsappEscalationUrl = `https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hello NEXORA Support, I need assistance with my DNS setup${orderRefInput ? ` (Order Ref: ${orderRefInput.trim()})` : ''}.`
  )}`;

  return (
    <div className="py-16 sm:py-24 min-h-screen relative overflow-hidden bg-[#080D1A]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="cyan" size="md">
            EXPERT DIAGNOSTIC ENGINE
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-[#F1F5F9] tracking-tight">
            SMART TROUBLESHOOTING CENTER
          </h1>
          <p className="text-[#94A3B8] text-xs sm:text-sm leading-relaxed">
            Resolve mobile DNS connectivity, profile activation, and carrier peering issues in minutes with guided decision trees and safe revert steps.
          </p>
        </div>

        {/* Guided Support Assistant Wizard */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.12)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#F1F5F9]">
                  Guided Diagnostic Assistant
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Answer a few simple questions to pinpoint the exact root cause
                </p>
              </div>
            </div>

            {(historySteps.length > 0 || recommendedArticle || solutionNote) && (
              <button
                type="button"
                onClick={handleResetDiagnostic}
                className="text-xs font-mono text-[#00E5FF] hover:underline flex items-center gap-1.5 self-end sm:self-center"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart Diagnostic</span>
              </button>
            )}
          </div>

          {/* Active Question or Recommendation */}
          {!recommendedArticle && !solutionNote && currentQuestion && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="text-base sm:text-lg font-bold text-[#F1F5F9]">
                {currentQuestion.text}
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-[#00E5FF]/40 text-left transition-all flex items-center justify-between group"
                  >
                    <span className="text-xs sm:text-sm text-[#CBD5E1] group-hover:text-[#F1F5F9] font-medium">
                      {opt.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#00E5FF] group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Solution Article from Wizard */}
          {recommendedArticle && (
            <div className="p-6 rounded-2xl bg-[#00E5FF]/[0.06] border border-[#00E5FF]/30 space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00E5FF]">
                <CheckCircle2 className="w-4 h-4" />
                <span>RECOMMENDED RESOLUTION IDENTIFIED</span>
              </div>
              <h4 className="text-lg font-black text-[#F1F5F9]">
                {recommendedArticle.title}
              </h4>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                {recommendedArticle.summary}
              </p>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-mono font-bold uppercase text-[#CBD5E1]">
                  Actionable Resolution Steps:
                </div>
                {recommendedArticle.steps.map((st, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-2.5 text-xs text-[#CBD5E1] p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <span className="w-5 h-5 rounded-full bg-white/[0.08] text-[#00E5FF] flex items-center justify-center font-mono font-bold shrink-0 mt-0.5 text-[10px]">
                      {sIdx + 1}
                    </span>
                    <span className="leading-relaxed">{st}</span>
                  </div>
                ))}
              </div>

              {/* Safe Revert Box */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-1">
                <span className="font-bold flex items-center gap-1.5 font-mono text-amber-300">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Safe Revert &amp; Reset Instructions:</span>
                </span>
                <p className="text-[#94A3B8] leading-relaxed">
                  {recommendedArticle.revertInstructions}
                </p>
              </div>
            </div>
          )}

          {/* Simple Note Solution */}
          {solutionNote && (
            <div className="p-6 rounded-2xl bg-white/[0.05] border border-white/[0.12] space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#A78BFA]">
                <Info className="w-4 h-4" />
                <span>DIAGNOSTIC ADVISORY</span>
              </div>
              <p className="text-sm text-[#F1F5F9] leading-relaxed">
                {solutionNote}
              </p>
            </div>
          )}
        </div>

        {/* Searchable Knowledgebase Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-[#F1F5F9] tracking-tight">
                COMMON CONFIGURATION ERRORS &amp; FIXES
              </h3>
              <p className="text-xs text-[#94A3B8] mt-1">
                Browse tested solutions for Android Private DNS and Apple iOS profiles
              </p>
            </div>

            {/* Platform filter tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.05] border border-white/[0.08]">
              <button
                type="button"
                onClick={() => setPlatformCategory('all')}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                  platformCategory === 'all' ? 'bg-white/[0.12] text-[#F1F5F9]' : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setPlatformCategory('android')}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                  platformCategory === 'android' ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                Android
              </button>
              <button
                type="button"
                onClick={() => setPlatformCategory('ios')}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                  platformCategory === 'ios' ? 'bg-[#8B5CF6]/20 text-[#A78BFA]' : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                iOS
              </button>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by symptom or keyword (e.g. 'couldnt connect', 'safari', 'jazz', 'ping')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#0B1224] border border-white/[0.12] text-sm text-[#F1F5F9] placeholder:text-[#94A3B8]/50 focus:outline-none focus:border-[#00E5FF] transition-all"
            />
          </div>

          {/* Articles Accordion List */}
          <div className="space-y-4">
            {filteredArticles.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center text-xs text-[#94A3B8]">
                No troubleshooting articles matched your search query. Try different keywords or contact WhatsApp support.
              </div>
            ) : (
              filteredArticles.map(art => {
                const isOpen = expandedArticleId === art.id;
                return (
                  <div
                    key={art.id}
                    className={`rounded-2xl border transition-all ${
                      isOpen
                        ? 'bg-white/[0.06] border-white/[0.18] shadow-glass-strong'
                        : 'bg-white/[0.03] hover:bg-white/[0.05] border-white/[0.08]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedArticleId(isOpen ? null : art.id)}
                      className="w-full p-5 text-left flex items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={art.platform === 'android' ? 'cyan' : art.platform === 'ios' ? 'violet' : 'outline'} size="sm">
                            {art.platform.toUpperCase()}
                          </Badge>
                          <span className="text-xs font-mono uppercase text-[#94A3B8]">
                            {art.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm sm:text-base text-[#F1F5F9]">
                          {art.title}
                        </h4>
                      </div>

                      <div className="p-1 rounded-lg bg-white/[0.05] text-[#94A3B8] shrink-0 mt-1 sm:mt-0">
                        {isOpen ? <ChevronDown className="w-4 h-4 text-[#00E5FF]" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-6 pt-2 border-t border-white/[0.08] space-y-4 animate-fadeIn text-xs sm:text-sm">
                        <p className="text-[#CBD5E1] leading-relaxed">
                          {art.summary}
                        </p>

                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                          <span className="font-mono text-[11px] uppercase text-[#94A3B8] block">
                            Recognized Symptoms:
                          </span>
                          <ul className="space-y-1 text-xs text-[#94A3B8]">
                            {art.symptoms.map((sym, sIdx) => (
                              <li key={sIdx} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                                <span>{sym}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2 pt-1">
                          <span className="font-mono text-[11px] uppercase text-[#F1F5F9] font-bold block">
                            Step-by-Step Resolution:
                          </span>
                          {art.steps.map((st, stIdx) => (
                            <div key={stIdx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-[#CBD5E1]">
                              <span className="w-4 h-4 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center font-mono font-bold shrink-0 mt-0.5 text-[10px]">
                                {stIdx + 1}
                              </span>
                              <span className="leading-relaxed">{st}</span>
                            </div>
                          ))}
                        </div>

                        {/* Revert instructions */}
                        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                          <span className="font-mono font-bold block mb-1 text-amber-300">
                            Safe Reset Instructions:
                          </span>
                          <span className="text-[#94A3B8] leading-relaxed">
                            {art.revertInstructions}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Support Escalation Card with Order Reference */}
        <div className="p-8 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.12] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#F1F5F9]">
                  Still Need Direct Assistance?
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Our network support engineers are available on WhatsApp for live Pakistani mobile carrier guidance.
                </p>
              </div>
            </div>

            <a
              href={whatsappEscalationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <Button variant="glass-cyan" size="md" className="font-bold">
                <span>Chat on WhatsApp</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center gap-3">
            <span className="text-xs font-mono text-[#94A3B8] shrink-0">
              Have an Order Reference?
            </span>
            <input
              type="text"
              placeholder="e.g. NX-20261016-XXXX"
              value={orderRefInput}
              onChange={(e) => setOrderRefInput(e.target.value)}
              className="px-4 py-2 rounded-xl bg-[#0B1224] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] w-full sm:w-64"
            />
            {orderRefInput && (
              <Link href={`/track-order`}>
                <Button variant="ghost" size="sm" className="text-xs text-[#00E5FF]">
                  <span>Track This Order &rarr;</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Ethical Diagnostic Disclosure */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3 text-[11px] text-[#94A3B8]">
          <ShieldCheck className="w-4 h-4 text-[#00E5FF] shrink-0" />
          <span>
            NEXORA Troubleshooting Assistant is an informational diagnostic tool. We never inspect your device storage, read personal messages, or request account credentials.
          </span>
        </div>

      </div>
    </div>
  );
}
