'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProposalStore } from '@/lib/store/proposal-store';
import { ProposalPreview } from '@/components/preview/ProposalPreview';
import { downloadProposalPDF } from '@/lib/pdf/download-pdf';
import { downloadProposalWord } from '@/lib/word/download-word';

export function PreviewClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { loadProposal, proposal } = useProposalStore();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isRevising, setIsRevising] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/proposal/${id}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) loadProposal({ ...data, id: data.id });
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleRevise = async () => {
    setIsRevising(true);
    try {
      const res = await fetch(`/api/proposal/${id}/revise`, { method: 'POST' });
      if (!res.ok) throw new Error('Revise failed');
      const { id: newId } = await res.json();
      router.push(`/builder?id=${newId}`);
    } catch {
      setIsRevising(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!proposal) return;
    setIsDownloading(true);
    try { await downloadProposalPDF(proposal); } finally { setIsDownloading(false); }
  };

  const handleDownloadWord = async () => {
    if (!proposal) return;
    setIsDownloadingWord(true);
    try { await downloadProposalWord(proposal); } finally { setIsDownloadingWord(false); }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B1220]">
        <div className="w-10 h-10 bg-[#E85D2B] rounded-full animate-pulse flex items-center justify-center">
          <span className="text-white font-bold text-xs">AM</span>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B1220]">
        <div className="text-center">
          <p className="text-white font-semibold mb-2">Proposal not found</p>
          <Link href="/history" className="text-[#E85D2B] text-sm hover:underline">← Back to History</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0B1220]">
      {/* Page header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/history"
            className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            ← History
          </Link>
          {proposal && (
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-medium">
                {proposal.clientName ? `${proposal.clientName} — ` : ''}{proposal.projectTitle || 'Untitled'}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                (proposal.version ?? 1) > 1
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-white/10 text-gray-400'
              }`}>
                v{proposal.version ?? 1}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadWord}
            disabled={isDownloadingWord || !proposal}
            className="text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-all disabled:opacity-40"
          >
            {isDownloadingWord ? 'Generating…' : 'Word'}
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading || !proposal}
            className="text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-all disabled:opacity-40"
          >
            {isDownloading ? 'Generating…' : 'PDF'}
          </button>
          <button
            onClick={handleRevise}
            disabled={isRevising}
            className="text-xs font-semibold text-white bg-[#E85D2B] hover:bg-[#d4521f] px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {isRevising ? 'Creating revision…' : 'Start Revision →'}
          </button>
        </div>
      </header>

      {/* Read-only preview fills remaining height */}
      <div className="flex-1 overflow-hidden">
        <ProposalPreview readOnly />
      </div>
    </div>
  );
}
