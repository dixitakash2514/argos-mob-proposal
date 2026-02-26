'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

interface ProposalListItem {
  id: string;
  clientName: string;
  projectTitle: string;
  status: 'draft' | 'complete';
  version?: number;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export function HistoryClient() {
  const router = useRouter();
  const [proposals, setProposals] = useState<ProposalListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [revisingId, setRevisingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/proposal')
      .then((r) => r.json())
      .then(({ proposals: list }) => setProposals(list ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRevise = async (id: string) => {
    setRevisingId(id);
    try {
      const res = await fetch(`/api/proposal/${id}/revise`, { method: 'POST' });
      if (!res.ok) throw new Error('Revise failed');
      const { id: newId } = await res.json();
      router.push(`/builder?id=${newId}`);
    } catch {
      setRevisingId(null);
    }
  };

  // Client-side group by clientName (insert header when name changes)
  let lastClient = '';

  return (
    <div className="min-h-screen bg-[#0B1220]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#E85D2B] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">AM</span>
          </div>
          <span className="text-white font-semibold text-sm">ArgosMob Proposals</span>
        </Link>
        <Link
          href="/builder"
          className="bg-[#E85D2B] hover:bg-[#d4521f] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          New Proposal →
        </Link>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-white font-bold text-xl mb-1">Proposal History</h1>
        <p className="text-gray-400 text-sm mb-8">All proposals, sorted by most recent</p>

        {loading ? (
          <div className="text-center py-20 text-gray-400 text-sm">Loading…</div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm mb-4">No proposals yet.</p>
            <Link
              href="/builder"
              className="inline-block bg-[#E85D2B] hover:bg-[#d4521f] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Create your first proposal →
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            {proposals.map((p) => {
              const showGroupHeader = p.clientName !== lastClient;
              lastClient = p.clientName;
              return (
                <div key={p.id}>
                  {showGroupHeader && (
                    <div className="pt-5 pb-2 first:pt-0">
                      <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                        {p.clientName || 'Unknown Client'}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl px-4 py-3.5 transition-colors group">
                    {/* Left info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white text-sm font-medium truncate">
                          {p.projectTitle || 'Untitled Proposal'}
                        </span>
                        <span className={`flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          (p.version ?? 1) > 1
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-white/10 text-gray-400'
                        }`}>
                          v{p.version ?? 1}
                        </span>
                        <span className={`flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                          p.status === 'complete'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {p.createdAt ? format(new Date(p.createdAt), 'dd MMM yyyy, HH:mm') : '—'}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      <Link
                        href={`/preview/${p.id}`}
                        className="text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 px-3 py-1.5 rounded-lg transition-all"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleRevise(p.id)}
                        disabled={revisingId === p.id}
                        className="text-xs text-[#E85D2B] hover:text-white hover:bg-[#E85D2B] border border-[#E85D2B]/40 hover:border-[#E85D2B] px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                      >
                        {revisingId === p.id ? 'Creating…' : 'Revise'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
