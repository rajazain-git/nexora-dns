'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Activity, Play, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

export function RouteTesterTeaser() {
  const [selectedGame, setSelectedGame] = useState('PUBG Mobile');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{
    game: string;
    ispLookup: number;
    nexoraLookup: number;
    difference: number;
  }>({
    game: 'PUBG Mobile',
    ispLookup: 58,
    nexoraLookup: 6,
    difference: 52,
  });

  const games = [
    { name: 'PUBG Mobile', host: 'gpubgm.game.qq.com', ispBase: 64, nexoraBase: 5 },
    { name: 'VALORANT (Riot Direct)', host: 'valorant.live.pvp.net', ispBase: 52, nexoraBase: 6 },
    { name: 'Free Fire', host: 'client.freefiremobile.com', ispBase: 71, nexoraBase: 7 },
    { name: 'Call of Duty: Warzone', host: 'prod.demonware.net', ispBase: 68, nexoraBase: 8 },
  ];

  const runTest = (gameName: string) => {
    const target = games.find((g) => g.name === gameName) || games[0];
    setSelectedGame(gameName);
    setIsRunning(true);

    setTimeout(() => {
      const isp = target.ispBase + Math.floor(Math.random() * 8) - 4;
      const nex = target.nexoraBase + Math.floor(Math.random() * 3) - 1;
      setResult({
        game: target.name,
        ispLookup: isp,
        nexoraLookup: nex,
        difference: isp - nex,
      });
      setIsRunning(false);
    }, 600);
  };

  return (
    <section className="py-20 bg-[#080D1A] border-t border-white/[0.10] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-3xl bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] p-8 sm:p-12 relative overflow-hidden shadow-[0_12px_40px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00E5FF]/10 blur-3xl pointer-events-none rounded-full" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Description */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.12] backdrop-blur-md text-[#00E5FF] text-xs font-mono font-bold uppercase tracking-wider shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
                <Activity className="w-3.5 h-3.5" />
                <span>Simulated Lookup Benchmarker</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#F1F5F9] tracking-tight leading-tight">
                COMPARE DNS LOOKUP OVERHEAD
              </h3>

              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                When a match connects or transitions lobbies, your device performs rapid DNS lookups. See the estimated resolution overhead difference between unoptimized ISP default DNS vs NEXORA edge caching.
              </p>

              {/* Game Selector Buttons */}
              <div className="pt-2">
                <span className="text-[11px] font-mono uppercase text-[#94A3B8] block mb-2 font-medium">
                  Select Game Title:
                </span>
                <div className="flex flex-wrap gap-2">
                  {games.map((g) => (
                    <button
                      key={g.name}
                      onClick={() => runTest(g.name)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-mono font-bold transition-all border ${
                        selectedGame === g.name
                          ? 'bg-[#00E5FF] text-[#080D1A] border-[#00E5FF] shadow-glow-cyan'
                          : 'bg-white/[0.05] text-[#94A3B8] border-white/[0.12] hover:text-[#F1F5F9] hover:bg-white/[0.10]'
                      }`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Link href="/ping-test">
                  <Button variant="outline" size="sm">
                    <span>Open Multi-Region Benchmark Tool</span>
                    <ArrowRight className="w-4 h-4 ml-1.5 text-[#00E5FF]" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Comparison Monitor */}
            <div className="lg:col-span-7 bg-white/[0.04] rounded-2xl border border-white/[0.10] p-6 font-mono text-xs space-y-6 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <span className="text-[#94A3B8]">TARGET: {result.game}</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>SIMULATED PROBE SUCCESS</span>
                </span>
              </div>

              {/* Metric 1: Standard ISP DNS */}
              <div className="space-y-2">
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Standard Regional ISP DNS (Recursive):</span>
                  <span className="font-bold text-[#94A3B8] text-sm">{isRunning ? '...' : `${result.ispLookup} ms`}</span>
                </div>
                <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/[0.08]">
                  <div
                    className="bg-white/20 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (result.ispLookup / 100) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#94A3B8]/70 block">
                  Typical recursive resolver with high cache misses and multiple upstream hops.
                </span>
              </div>

              {/* Metric 2: NEXORA Anycast Edge */}
              <div className="space-y-2">
                <div className="flex justify-between text-[#F1F5F9]">
                  <span className="text-[#00E5FF] font-bold">NEXORA Anycast Edge (Optimized):</span>
                  <span className="font-bold text-[#00E5FF] text-base">{isRunning ? '...' : `${result.nexoraLookup} ms`}</span>
                </div>
                <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/[0.08]">
                  <div
                    className="bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] h-full rounded-full transition-all duration-500 shadow-glow-cyan"
                    style={{ width: `${Math.max(8, (result.nexoraLookup / 100) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#94A3B8]/70 block">
                  Edge cache hit with localized BGP routing directly from Asia-South gateway.
                </span>
              </div>

              {/* Net Difference Callout */}
              <div className="p-4 rounded-xl bg-white/[0.05] border border-white/[0.12] backdrop-blur-md flex items-center justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
                <div>
                  <span className="text-[10px] uppercase text-[#94A3B8] block">Lookup Delay Reduced</span>
                  <span className="text-[#00E5FF] font-bold text-sm">
                    {isRunning ? 'Calculating...' : `~${result.difference} ms Saved Per Domain Resolution`}
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => runTest(selectedGame)}
                  disabled={isRunning}
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1 text-[#00E5FF] ${isRunning ? 'animate-spin' : ''}`} />
                  <span>Re-test</span>
                </Button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
