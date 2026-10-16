'use client';

import React, { useState } from 'react';
import { 
  Download, 
  RotateCcw, 
  Plus, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  FileJson, 
  Eye,
  Check
} from 'lucide-react';
import { SettingsVersion, SiteSettings } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/context/ToastContext';

interface Props {
  versions: SettingsVersion[];
  currentSettings: SiteSettings;
  onRestoreVersion: (versionId: string) => void;
  onCreateSnapshot: (note: string) => void;
}

export function AdminBackupsManager({
  versions,
  currentSettings,
  onRestoreVersion,
  onCreateSnapshot
}: Props) {
  const { showToast } = useToast();
  const [newNote, setNewNote] = useState('');
  const [selectedVersionForRestore, setSelectedVersionForRestore] = useState<SettingsVersion | null>(null);
  const [previewVersion, setPreviewVersion] = useState<SettingsVersion | null>(null);

  const handleCreate = () => {
    if (!newNote.trim()) {
      showToast({ type: 'error', title: 'Note Required', message: 'Please provide a version description note.' });
      return;
    }
    onCreateSnapshot(newNote.trim());
    showToast({
      type: 'success',
      title: 'Snapshot Created',
      message: `Version ${versions.length + 1} backup snapshot created.`,
      duration: 3500
    });
    setNewNote('');
  };

  const handleConfirmRestore = () => {
    if (!selectedVersionForRestore) return;
    onRestoreVersion(selectedVersionForRestore.id);
    showToast({
      type: 'success',
      title: 'Version Restored Successfully',
      message: `Restored to version ${selectedVersionForRestore.versionNumber} and published live.`,
      duration: 4000
    });
    setSelectedVersionForRestore(null);
  };

  const handleExportJSON = (v: SettingsVersion) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(v.settings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nexora_backup_v${v.versionNumber}_${v.timestamp.slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-xs font-mono text-[#00E5FF] mb-2 font-bold backdrop-blur-md">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>VERSIONED BACKUPS & RESTORATION ENGINE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-[#F1F5F9] tracking-tight">
            BACKUPS & VERSION HISTORY
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-xl mt-1">
            Every published change creates a versioned snapshot. Preview past configuration states, restore previous versions with one click, or export JSON backups.
          </p>
        </div>
      </div>

      {/* Create Manual Snapshot Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F5F9] font-mono flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#00E5FF]" />
          <span>Create Manual Configuration Snapshot</span>
        </h3>
        <p className="text-xs text-[#94A3B8]">
          Snapshot current live colors, homepage copy, FAQ entries, and site settings into the history log.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="e.g. Pre-tournament visual configuration before Free Fire Cup"
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-xs font-mono text-[#F1F5F9] placeholder:text-[#94A3B8]/60 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40 backdrop-blur-md"
          />
          <Button variant="primary" size="sm" onClick={handleCreate} className="font-bold shrink-0">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Capture Snapshot</span>
          </Button>
        </div>
      </div>

      {/* Version History Table */}
      <div className="rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] overflow-hidden shadow-glass-strong shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.03] border-b border-white/[0.08] text-[#94A3B8] uppercase">
              <tr>
                <th className="py-4 px-5">Version</th>
                <th className="py-4 px-5">Timestamp</th>
                <th className="py-4 px-5">Admin Author</th>
                <th className="py-4 px-5">Description Note</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-[#F1F5F9]">
              {versions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#94A3B8]">
                    No backup versions recorded yet. Publish changes or create a snapshot above.
                  </td>
                </tr>
              ) : (
                versions.map((v) => (
                  <tr key={v.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-4 px-5 font-bold text-[#00E5FF]">
                      v{v.versionNumber}
                    </td>
                    <td className="py-4 px-5 text-[#94A3B8]">
                      {new Date(v.timestamp).toLocaleString()}
                    </td>
                    <td className="py-4 px-5 font-sans font-bold">
                      {v.adminEmail}
                    </td>
                    <td className="py-4 px-5 text-[#F1F5F9] max-w-xs truncate">
                      {v.note || 'Regular publish snapshot'}
                    </td>
                    <td className="py-4 px-5 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExportJSON(v)}
                        className="text-[11px] py-1 px-2.5 text-[#94A3B8] hover:text-[#00E5FF] hover:bg-white/[0.05]"
                        title="Download JSON"
                      >
                        <FileJson className="w-3.5 h-3.5 inline mr-1" />
                        <span>JSON</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewVersion(v)}
                        className="text-[11px] py-1 px-2.5"
                        title="Inspect Data"
                      >
                        <Eye className="w-3.5 h-3.5 inline mr-1 text-[#00E5FF]" />
                        <span>Inspect</span>
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedVersionForRestore(v)}
                        className="text-[11px] py-1 px-2.5 font-bold"
                        title="Restore"
                      >
                        <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                        <span>Restore</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restore Confirmation Modal */}
      {selectedVersionForRestore && (
        <div className="fixed inset-0 z-50 bg-[#080D1A]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 sm:p-7 rounded-3xl bg-[#0B1224]/90 backdrop-blur-2xl border border-white/[0.16] shadow-glass-strong space-y-4">
            <div className="flex items-center gap-3 text-[#00E5FF]">
              <RotateCcw className="w-6 h-6 shrink-0" />
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono">
                Confirm Version Restoration
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Are you sure you want to restore to <strong>Version {selectedVersionForRestore.versionNumber}</strong>? The live storefront will immediately read this configuration, updating colors, copy, and layout.
            </p>
            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-[#F1F5F9]">
              Note: {selectedVersionForRestore.note || 'None'}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedVersionForRestore(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmRestore}>
                Confirm & Publish
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect JSON Modal */}
      {previewVersion && (
        <div className="fixed inset-0 z-50 bg-[#080D1A]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xl w-full p-6 sm:p-7 rounded-3xl bg-[#0B1224]/90 backdrop-blur-2xl border border-white/[0.16] shadow-glass-strong space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-[#00E5FF]">
                Snapshot v{previewVersion.versionNumber} Payload
              </h3>
              <button onClick={() => setPreviewVersion(null)} className="text-[#94A3B8] hover:text-[#F1F5F9] transition-colors">✕</button>
            </div>

            <pre className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-[#00E5FF] max-h-80 overflow-y-auto">
              <code>{JSON.stringify(previewVersion.settings, null, 2)}</code>
            </pre>

            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setPreviewVersion(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
