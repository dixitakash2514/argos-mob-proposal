'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { useProposalStore } from '@/lib/store/proposal-store';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { ProposalPreview } from '@/components/preview/ProposalPreview';
import Link from 'next/link';
import clsx from 'clsx';
import { format } from 'date-fns';

interface ProposalListItem {
  id: string;
  clientName: string;
  projectTitle: string;
  status: string;
  version?: number;
  createdAt: string;
}

type PickerMode = 'idle' | 'new' | 'revise';

export function BuilderClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const proposalId = searchParams.get('id');
  const { proposal, initProposal, loadProposal } = useProposalStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const [activePanel, setActivePanel] = useState<'chat' | 'preview'>('chat');

  // Picker state — only shown when no ?id= param
  const [pickerMode, setPickerMode] = useState<PickerMode>('idle');
  const [proposals, setProposals] = useState<ProposalListItem[]>([]);
  const [isFetchingList, setIsFetchingList] = useState(false);
  const [isRevisingId, setIsRevisingId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      setIsInitializing(true);

      if (proposalId) {
        // Load existing proposal — skip picker entirely
        try {
          const res = await fetch(`/api/proposal/${proposalId}`);
          if (res.ok) {
            const data = await res.json();
            loadProposal({ ...data, id: data.id });
            setIsInitializing(false);
            return;
          }
        } catch {
          // fall through to picker
        }
      }

      // No id param — show the picker (don't create anything yet)
      setPickerMode('idle');
      setIsInitializing(false);
    }

    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── "New Proposal" chosen ────────────────────────────────────────────────────
  const handleNewProposal = async () => {
    setPickerMode('new');
    const sessionId = uuidv4();
    try {
      const res = await fetch('/api/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      if (res.ok) {
        const { id } = await res.json();
        initProposal(id, sessionId);
        const url = new URL(window.location.href);
        url.searchParams.set('id', id);
        window.history.replaceState({}, '', url.toString());
      } else {
        initProposal(uuidv4(), sessionId);
      }
    } catch {
      initProposal(uuidv4(), sessionId);
    }
  };

  // ── "Revise Existing" chosen — fetch list ────────────────────────────────────
  const handleReviseClick = async () => {
    setPickerMode('revise');
    setIsFetchingList(true);
    try {
      const res = await fetch('/api/proposal');
      if (res.ok) {
        const { proposals: list } = await res.json();
        setProposals(list ?? []);
      }
    } catch {
      // show empty list
    } finally {
      setIsFetchingList(false);
    }
  };

  // ── User picks a proposal to revise ─────────────────────────────────────────
  const handleSelectRevision = async (id: string) => {
    setIsRevisingId(id);
    try {
      const res = await fetch(`/api/proposal/${id}/revise`, { method: 'POST' });
      if (!res.ok) throw new Error('Revise failed');
      const { id: newId } = await res.json();
      router.push(`/builder?id=${newId}`);
    } catch {
      setIsRevisingId(null);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Loading spinner
  if (isInitializing) {
    return (
      <div className="flex h-full items-center justify-center bg-[#0B1220]">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#E85D2B] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold">AM</span>
          </div>
          <p className="text-white text-sm">Initializing proposal builder...</p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Picker overlay — shown when no ?id= was in the URL
  if (!proposal && (pickerMode === 'idle' || pickerMode === 'revise')) {
    return (
      <div className="flex h-full items-center justify-center bg-[#0B1220] p-6">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-[#E85D2B] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">AM</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">What would you like to do?</h1>
              <p className="text-gray-400 text-xs mt-0.5">Choose an option to get started</p>
            </div>
          </div>

          {pickerMode === 'idle' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* New Proposal card */}
              <button
                onClick={handleNewProposal}
                className="group text-left bg-white/5 hover:bg-[#E85D2B]/10 border border-white/10 hover:border-[#E85D2B]/40 rounded-2xl p-6 transition-all"
              >
                <div className="text-3xl mb-4">📄</div>
                <div className="text-white font-semibold text-base mb-1.5 group-hover:text-[#E85D2B] transition-colors">New Proposal</div>
                <div className="text-gray-400 text-sm leading-relaxed">Start fresh from scratch. The AI will guide you through all 13 sections.</div>
              </button>

              {/* Revise Existing card */}
              <button
                onClick={handleReviseClick}
                className="group text-left bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/40 rounded-2xl p-6 transition-all"
              >
                <div className="text-3xl mb-4">🔄</div>
                <div className="text-white font-semibold text-base mb-1.5 group-hover:text-blue-400 transition-colors">Revise Existing</div>
                <div className="text-gray-400 text-sm leading-relaxed">Pick a past proposal and create v2, v3… with all previous data pre-loaded.</div>
              </button>
            </div>
          )}

          {pickerMode === 'revise' && (
            <div>
              <button
                onClick={() => setPickerMode('idle')}
                className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-5 transition-colors"
              >
                ← Back
              </button>
              <h2 className="text-white font-semibold text-sm mb-3">Select a proposal to revise</h2>
              {isFetchingList ? (
                <div className="text-center py-10 text-gray-400 text-sm">Loading proposals…</div>
              ) : proposals.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">No proposals found. Create a new one first.</div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {proposals.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectRevision(p.id)}
                      disabled={isRevisingId === p.id}
                      className="w-full text-left flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 transition-all group disabled:opacity-50"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-medium truncate">
                            {p.clientName || 'Unnamed Client'} — {p.projectTitle || 'Untitled'}
                          </span>
                          <span className="flex-shrink-0 text-[10px] font-bold bg-white/10 text-gray-300 px-1.5 py-0.5 rounded-full">
                            v{p.version ?? 1}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {p.createdAt ? format(new Date(p.createdAt), 'dd MMM yyyy') : ''} · {p.status}
                        </div>
                      </div>
                      <span className="text-gray-400 group-hover:text-white text-xs ml-3 flex-shrink-0 transition-colors">
                        {isRevisingId === p.id ? 'Creating…' : 'Revise →'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/history" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              View all proposals →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // "New Proposal" chosen but proposal not yet created — brief loading
  if (!proposal) {
    return (
      <div className="flex h-full items-center justify-center bg-[#0B1220]">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#E85D2B] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold">AM</span>
          </div>
          <p className="text-white text-sm">Creating proposal…</p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Main builder
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Top nav */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#0B1220] border-b border-white/10 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#E85D2B] rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">AM</span>
          </div>
          <span className="text-white font-semibold text-sm hidden sm:block">
            Proposal Builder
          </span>
        </Link>

        {/* Proposal title */}
        <div className="flex-1 text-center px-4">
          {proposal && (
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-white/70 truncate">
                {proposal.projectTitle
                  ? `${proposal.clientName ? proposal.clientName + ' — ' : ''}${proposal.projectTitle}`
                  : 'New Proposal'}
              </span>
              {(proposal.version ?? 1) > 1 && (
                <span className="flex-shrink-0 text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded-full">
                  v{proposal.version}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right side: History link + mobile panel toggle */}
        <div className="flex items-center gap-3">
          <Link href="/history" className="text-xs text-white/50 hover:text-white/80 transition-colors hidden sm:block">
            History
          </Link>

          {/* Mobile panel toggle */}
          <div className="flex lg:hidden items-center gap-1 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setActivePanel('chat')}
              className={clsx(
                'px-3 py-1 text-xs font-medium rounded-md transition-all',
                activePanel === 'chat' ? 'bg-white text-[#0B1220]' : 'text-white/70'
              )}
            >
              Chat
            </button>
            <button
              onClick={() => setActivePanel('preview')}
              className={clsx(
                'px-3 py-1 text-xs font-medium rounded-md transition-all',
                activePanel === 'preview' ? 'bg-white text-[#0B1220]' : 'text-white/70'
              )}
            >
              Preview
            </button>
          </div>
        </div>
      </header>

      {/* Main 2-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat panel — 55% on desktop */}
        <div
          className={clsx(
            'flex flex-col border-r border-gray-200 overflow-hidden',
            'lg:flex lg:w-[55%]',
            activePanel === 'chat' ? 'flex w-full' : 'hidden'
          )}
        >
          <ChatPanel />
        </div>

        {/* Preview panel — 45% on desktop */}
        <div
          className={clsx(
            'flex flex-col overflow-hidden',
            'lg:flex lg:w-[45%]',
            activePanel === 'preview' ? 'flex w-full' : 'hidden'
          )}
        >
          <ProposalPreview />
        </div>
      </div>
    </div>
  );
}
