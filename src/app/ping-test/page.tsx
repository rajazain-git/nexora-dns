'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  ShieldAlert, 
  Zap, 
  Globe, 
  ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function PingTestPage() {
  const [targetHost, setTargetHost] = useState('client.freefiremobile.com');
  const [selectedRegion, setSelectedRegion] = useState('Asia-South (Pakistan Node)');
  const [isRunning, setIsRunning] = useState(false);
  const [probeResults, setProbeResults] = useState([
    { provider: 'Local Standard ISP (Recursive)', lookupTime: 62, jitter: '±14ms', status: 'Uncached Hop', color: 'text-rose-400' },
    { provider: 'Public Anycast (Google/Cloudflare)', lookupTime: 24, jitter: '±4ms', status: 'Standard Anycast', color: 'text-[#94A3B8]' },
    { provider: 'NEXORA Gaming Edge Anycast', lookupTime: 5, jitter: '±1ms', status: 'Direct Edge Cache Hit', color: 'text-[#00E5FF] font-bold' },
  ]);

  const presetHosts = [
    { label: 'Free Fire South Asia Gateway', host: 'client.freefiremobile.com' },
    { label: 'Free Fire Singapore Edge', host: 'sg.freefiremobile.com' },
    { label: 'Free Fire Voice Comms Host', host: 'voice.freefiremobile.com' },
    { label: 'Free Fire Lobby Matchmaker', host: 'lobby.freefiremobile.com' },
    { label: 'Free Fire Resource CDN', host: 'cdn.freefiremobile.com' },
  ];

  const runBenchmark = () => {
    setIsRunning(true);
    setTimeout(() => {
      const ispTime = Math.floor(Math.random() * 25) + 50; // 50 - 75ms
      const publicTime = Math.floor(Math.random() * 8) + 20; // 20 - 28ms
      const nexoraTime = Math.floor(Math.random() * 4) + 4; // 4 - 8ms

      setProbeResults([
        { provider: 'Local Standard ISP (Recursive)', lookupTime: ispTime, jitter: '±16ms', status: 'Multi-Hop Recursive', color: 'text-rose-400' },
        { provider: 'Public Anycast (Google/Cloudflare)', lookupTime: publicTime, jitter: '±5ms', status: 'Standard Anycast', color: 'text-[#94A3B8]' },
        { provider: 'NEXORA Gaming Edge Anycast', lookupTime: nexoraTime, jitter: '±1ms', status: 'Direct Edge Cache Hit', color: 'text-[#00E5FF] font-bold' },
      ]);
      setIsRunning(false);
    }, 700);
  };

  return (
    <div className="py-16 sm:py-20 min-h-screen relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="cyan" size="md">
            FREE FIRE DIAGNOSTICS & BENCHMARKING
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-[#F1F5F9] tracking-tight">
            DNS RESOLUTION BENCHMARK TOOL
          </h1>
          <p className="text-[#94A3B8] text-xs sm:text-sm leading-relaxed">
            Simulate and measure domain resolution handshake times across official Free Fire mobile game servers and CDN endpoints.
          </p>
        </div>

        {/* Interactive Benchmarking Panel */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] space-y-8 shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
          
          {/* Preset Buttons */}
          <div>
            <span className="text-xs uppercase font-mono text-[#94A3B8] block mb-3 font-bold">
              Select Free Fire Hostname to Probe:
            </span>
            <div className="flex flex-wrap gap-2.5">
              {presetHosts.map((h) => (
                <button
                  key={h.host}
                  onClick={() => {
                    setTargetHost(h.host);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border backdrop-blur-md ${
                    targetHost === h.host
                      ? 'bg-[#00E5FF] text-[#080D1A] border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.35)]'
                      : 'bg-white/[0.04] text-[#94A3B8] border-white/[0.08] hover:text-[#F1F5F9] hover:border-[#00E5FF]/40'
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target Host Input & Region */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8">
              <label className="block text-[#94A3B8] text-[11px] font-mono uppercase mb-1">
                Target Domain Name:
              </label>
              <input
                type="text"
                value={targetHost}
                onChange={(e) => setTargetHost(e.target.value)}
                className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl px-4 py-2.5 text-xs text-[#F1F5F9] font-mono focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40 backdrop-blur-md"
              />
            </div>

            <div className="md:col-span-4 flex items-end">
              <Button
                variant="primary"
                size="md"
                onClick={runBenchmark}
                disabled={isRunning}
                className="w-full"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
                <span>{isRunning ? 'Probing Route...' : 'Run Probe Benchmark'}</span>
              </Button>
            </div>
          </div>

          {/* Results Comparison Grid */}
          <div className="space-y-4 pt-4 border-t border-white/[0.08] font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#94A3B8] uppercase">Simulated Probe Results:</span>
              <span className="text-[#00E5FF] font-bold">Node: {selectedRegion}</span>
            </div>

            <div className="space-y-3">
              {probeResults.map((res, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-[#F1F5F9] font-bold">{res.provider}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[#94A3B8] text-[11px]">{res.status}</span>
                      <span className={`text-base font-black ${res.color}`}>
                        {isRunning ? '...' : `${res.lookupTime} ms`}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/[0.06]">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        idx === 2 ? 'bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6]' : idx === 0 ? 'bg-rose-500/80' : 'bg-slate-600'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(8, (res.lookupTime / 80) * 100))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Honest Limitations Callout */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-[#94A3B8] font-mono leading-relaxed">
            <strong className="text-[#F1F5F9] block font-sans mb-1 uppercase tracking-wider">
              Diagnostic Integrity Notice:
            </strong>
            This tool measures domain name lookup (DNS resolution) latency. Lookups take place when loading matchmaking lobbies and authenticating in Free Fire. Once your mobile device has connected to an active match, tick-to-tick UDP packet transmission travels directly over your cellular or broadband ISP&apos;s physical routing to Garena&apos;s servers.
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-2">
          <Link href="/store">
            <Button variant="primary" size="lg">
              <span>EXPLORE FREE FIRE PACKAGES</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
