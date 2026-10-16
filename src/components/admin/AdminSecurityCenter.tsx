'use client';

import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Key, 
  Users, 
  FileCode, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';
import { AuditLog, UserProfile } from '@/types';
import { ADMIN_WHITELIST } from '@/lib/admin-auth';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/context/ToastContext';

interface Props {
  user: UserProfile | null;
  auditLogs: AuditLog[];
  onLogout: () => void;
}

export function AdminSecurityCenter({
  user,
  auditLogs,
  onLogout
}: Props) {
  const { showToast } = useToast();
  const [logSearch, setLogSearch] = useState('');
  const [logFilter, setLogFilter] = useState<string>('all');
  const [activeRulesTab, setActiveRulesTab] = useState<'firestore' | 'storage'>('firestore');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(l => {
      if (logFilter !== 'all' && l.targetType !== logFilter) return false;
      if (logSearch.trim()) {
        const q = logSearch.toLowerCase();
        return l.action.toLowerCase().includes(q) ||
               l.details.toLowerCase().includes(q) ||
               l.adminEmail.toLowerCase().includes(q) ||
               l.targetId.toLowerCase().includes(q);
      }
      return true;
    });
  }, [auditLogs, logFilter, logSearch]);

  const firestoreRulesSnippet = `// Production Firebase Cloud Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && (
        request.auth.token.email.matches('(?i)(admin@nexoradns\\\\.com|zain@nexoradns\\\\.com)') ||
        request.auth.token.role == 'admin'
      );
    }
    match /products/{id} { allow read: if true; allow write: if isAdmin(); }
    match /settings/{id} { allow read: if true; allow write: if isAdmin(); }
    match /settings_versions/{id} { allow read, write: if isAdmin(); }
    match /coupons/{id} { allow read: if true; allow write: if isAdmin(); }
    match /orders/{id} {
      allow create: if request.resource.data.paymentStatus in ['pending', 'verified'];
      allow read: if isAdmin() || (request.auth != null && request.auth.uid == resource.data.customerId);
      allow update, delete: if isAdmin();
    }
    match /audit_logs/{id} { allow read, write: if isAdmin(); }
  }
}`;

  const storageRulesSnippet = `// Production Firebase Cloud Storage Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAdmin() {
      return request.auth != null && request.auth.token.email.matches('(?i)(admin@nexoradns\\\\.com|zain@nexoradns\\\\.com)');
    }
    match /public/{allPaths=**} { allow read: if true; allow write: if isAdmin(); }
    match /profiles/{id} { allow read: if true; allow write: if isAdmin(); }
    match /payment_proofs/{orderId}/{file} {
      allow create: if request.resource.size < 4 * 1024 * 1024;
      allow read, delete: if isAdmin();
    }
  }
}`;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.04] border border-emerald-500/30 text-xs font-mono text-emerald-400 mb-2 font-bold shadow-[0_0_12px_rgba(16,185,129,0.15)]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ROLE-BASED AUTHORIZATION • ZERO PUBLIC REGISTRATION</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-[#F1F5F9] tracking-tight">
            SECURITY & AUDIT CENTER
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-xl mt-1 leading-relaxed">
            Enforces server-verified administrator access, inspects production Firebase rules, audits sensitive changes, and manages active credentials.
          </p>
        </div>

        <Button variant="danger" size="sm" onClick={onLogout} className="font-mono text-xs">
          <LogOut className="w-3.5 h-3.5 mr-1.5" />
          <span>Secure Sign Out</span>
        </Button>
      </div>

      {/* Security Health Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-emerald-500/30 space-y-2 shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
            <span className="font-bold">ADMIN ACCESS SHIELD</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-[#F1F5F9] font-mono">
            {user?.email || 'admin@nexoradns.com'}
          </div>
          <div className="text-[11px] text-[#94A3B8] font-mono">
            Verified Administrator via Whitelist
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-[#00E5FF]/30 space-y-2 shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
          <div className="flex items-center justify-between text-xs font-mono text-[#00E5FF]">
            <span className="font-bold">GUEST CHECKOUT ISOLATION</span>
            <Lock className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-[#F1F5F9] font-mono">
            Zero Public Admin Routes
          </div>
          <div className="text-[11px] text-[#94A3B8] font-mono">
            Customers purchase without accounts
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-[#8B5CF6]/30 space-y-2 shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
          <div className="flex items-center justify-between text-xs font-mono text-[#8B5CF6]">
            <span className="font-bold">RATE LIMITING & HEADERS</span>
            <Key className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-[#F1F5F9] font-mono">
            API Endpoints Protected
          </div>
          <div className="text-[11px] text-[#94A3B8] font-mono">
            Bearer authentication enforced
          </div>
        </div>
      </div>

      {/* Authorized Administrator Whitelist */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono flex items-center gap-2">
            <Users className="w-4 h-4 text-[#00E5FF]" />
            <span>Authorized Administrator Whitelist</span>
          </h3>
          <span className="text-xs font-mono text-[#94A3B8]">
            Defined in server security rules
          </span>
        </div>

        <div className="space-y-2">
          {ADMIN_WHITELIST.map((email, idx) => (
            <div 
              key={email}
              className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] flex items-center justify-between text-xs font-mono"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="text-[#F1F5F9] font-bold">{email}</span>
                {idx === 0 && (
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 font-bold">
                    PRIMARY SUPERADMIN
                  </span>
                )}
              </div>
              <span className="text-[#94A3B8]">Full Permissions Granted</span>
            </div>
          ))}
        </div>
      </div>

      {/* Production Firebase Security Rules Viewer */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#8B5CF6]" />
            <span>Firebase Security Rules Enforcement</span>
          </h3>

          <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/[0.08]">
            <button
              onClick={() => setActiveRulesTab('firestore')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeRulesTab === 'firestore' ? 'bg-[#8B5CF6] text-white font-bold shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'text-[#94A3B8]'
              }`}
            >
              firestore.rules
            </button>
            <button
              onClick={() => setActiveRulesTab('storage')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeRulesTab === 'storage' ? 'bg-[#8B5CF6] text-white font-bold shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'text-[#94A3B8]'
              }`}
            >
              storage.rules
            </button>
          </div>
        </div>

        <pre className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-[#00E5FF] overflow-x-auto leading-relaxed max-h-64">
          <code>{activeRulesTab === 'firestore' ? firestoreRulesSnippet : storageRulesSnippet}</code>
        </pre>
      </div>

      {/* Comprehensive Audit Logs */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono">
              Administrative Mutation Audit Log
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              All price changes, order status overrides, theme publishes, and fulfillment actions are permanently timestamped.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              placeholder="Search audit trail..."
              className="px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] w-full sm:w-48 backdrop-blur-md"
            />
            <select
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00E5FF] backdrop-blur-md"
            >
              <option value="all" className="bg-[#0B1224]">All Targets</option>
              <option value="order" className="bg-[#0B1224]">Orders</option>
              <option value="product" className="bg-[#0B1224]">Products</option>
              <option value="coupon" className="bg-[#0B1224]">Coupons</option>
              <option value="settings" className="bg-[#0B1224]">Settings</option>
              <option value="backup" className="bg-[#0B1224]">Backups</option>
            </select>
          </div>
        </div>

        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#94A3B8] font-mono">
              No audit records match your query.
            </div>
          ) : (
            filteredLogs.map(l => (
              <div 
                key={l.id}
                className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] text-xs font-mono space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#00E5FF] font-bold uppercase text-[10px] tracking-wider">
                      [{l.targetType.toUpperCase()}] {l.action.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[#94A3B8]">• target: {l.targetId}</span>
                  </div>
                  <span className="text-[10px] text-[#94A3B8]">
                    {new Date(l.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-[#F1F5F9] text-[11px]">{l.details}</p>
                <p className="text-[10px] text-[#94A3B8]">Admin: {l.adminEmail}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
