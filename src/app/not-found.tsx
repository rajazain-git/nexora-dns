'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-[#080D1A] relative overflow-hidden">
      {/* Background Cyber Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E5FF]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative z-10 space-y-6 max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#111C32] border border-[#00E5FF]/30 text-[#00E5FF] shadow-[0_0_25px_rgba(0,229,255,0.2)] mx-auto">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <Badge variant="cyan" size="md">
            DNS RESOLUTION TIMEOUT • 404
          </Badge>
          <h1 className="text-5xl sm:text-6xl font-black uppercase text-[#F1F5F9] font-mono tracking-tight">
            NODE 404
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] font-mono leading-relaxed">
            The requested hostname, endpoint, or routing path does not exist on our Anycast cluster.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link href="/">
            <Button variant="primary" size="md">
              <Home className="w-4 h-4 mr-2" />
              <span>Return Home</span>
            </Button>
          </Link>

          <Link href="/store">
            <Button variant="secondary" size="md">
              <ShoppingBag className="w-4 h-4 mr-2" />
              <span>DNS Store</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
