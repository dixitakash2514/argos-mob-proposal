'use client';

import { useState } from 'react';
import { useProposalStore } from '@/lib/store/proposal-store';
import { downloadProposalPDF } from '@/lib/pdf/download-pdf';
import { downloadProposalWord } from '@/lib/word/download-word';
import { PreviewSection, WhyChooseUsPreview } from './PreviewSection';
import { ThemeSelector } from './ThemeSelector';
import { SECTION_ORDER } from '@/types/proposal';
import clsx from 'clsx';

interface ProposalPreviewProps {
  readOnly?: boolean;
}

export function ProposalPreview({ readOnly = false }: ProposalPreviewProps) {
  const proposal = useProposalStore((s) => s.proposal);
  const isSaving = useProposalStore((s) => s.isSaving);
  const isStreaming = useProposalStore((s) => s.isStreaming);
  const confirmSection = useProposalStore((s) => s.confirmSection);
  const setNextSectionPending = useProposalStore((s) => s.setNextSectionPending);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  const handleDownload = async () => {
    if (!proposal) return;
    setIsDownloading(true);
    setDownloadError('');
    try {
      await downloadProposalPDF(proposal);
    } catch {
      setDownloadError('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadWord = async () => {
    if (!proposal) return;
    setIsDownloadingWord(true);
    setDownloadError('');
    try {
      await downloadProposalWord(proposal);
    } catch {
      setDownloadError('Failed to generate Word document. Please try again.');
    } finally {
      setIsDownloadingWord(false);
    }
  };

  const handleConfirmSection = () => {
    if (!proposal || isStreaming) return;
    const key = proposal.currentSection;
    confirmSection(key);
    // Trigger the next section in chat unless this was the last one
    if (key !== 'legalSignOff') {
      setNextSectionPending(true);
    }
  };

  if (!proposal) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Loading preview...
      </div>
    );
  }

  const currentSection = proposal.currentSection;
  const isCurrentConfirmed = proposal.confirmedSections.includes(currentSection);
  const isLastSection = currentSection === 'legalSignOff';
  const currentSectionMeta = SECTION_ORDER.find((s) => s.key === currentSection);
  const nextSectionMeta = SECTION_ORDER[SECTION_ORDER.findIndex((s) => s.key === currentSection) + 1];

  const confirmedSections = SECTION_ORDER.filter(
    (s) => proposal.confirmedSections.includes(s.key) && s.key !== 'coverPage'
  );

  const themeClasses: Record<string, string> = {
    default: 'bg-white',
    dark: 'bg-gray-950 text-white',
    minimal: 'bg-gray-50',
    lightBlue: 'bg-slate-50',
    darkBlue: 'bg-slate-950 text-white',
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-white gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-600 hidden sm:block">Preview</span>
          {!readOnly && isSaving && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-[#E85D2B] rounded-full animate-pulse" />
              Saving...
            </span>
          )}
          {readOnly && (
            <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              Read-only
            </span>
          )}
        </div>

        {!readOnly && <ThemeSelector />}

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadWord}
            disabled={isDownloadingWord || proposal.confirmedSections.length === 0}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              proposal.confirmedSections.length === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isDownloadingWord
                ? 'bg-[#0B1220]/70 text-white cursor-wait'
                : 'bg-[#0B1220] hover:bg-[#1a2535] text-white shadow-sm'
            )}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {isDownloadingWord ? 'Generating...' : 'Download Word'}
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading || proposal.confirmedSections.length === 0}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              proposal.confirmedSections.length === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isDownloading
                ? 'bg-[#E85D2B]/70 text-white cursor-wait'
                : 'bg-[#E85D2B] hover:bg-[#d4521f] text-white shadow-sm'
            )}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {isDownloading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {downloadError && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-xs text-red-600">
          {downloadError}
        </div>
      )}

      {/* Scrollable preview content */}
      <div className={clsx('flex-1 overflow-y-auto', themeClasses[proposal.theme])}>
        {/* Sticky ArgosMob header */}
        <div className="sticky top-0 z-10 px-4 py-2 border-b border-gray-200 bg-inherit flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#0B1220] rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">AM</span>
            </div>
            <span className={clsx('text-xs font-bold', proposal.theme === 'dark' ? 'text-gray-200' : 'text-[#0B1220]')}>
              ARGOSMOB TECH & AI PVT LTD
            </span>
            {(proposal.version ?? 1) > 1 && (
              <span className="text-[10px] font-bold bg-blue-500/20 text-blue-600 border border-blue-500/30 px-1.5 py-0.5 rounded-full">
                v{proposal.version}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400">CONFIDENTIAL</span>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Cover page — always shown */}
          <PreviewSection sectionKey="coverPage" sections={proposal.sections} theme={proposal.theme} />

          {/* Why Choose Us — always shown (static branding) */}
          <div className="border-t border-gray-100 pt-4">
            <WhyChooseUsPreview />
          </div>

          {/* Confirm button for cover page */}
          {!readOnly && !isCurrentConfirmed && currentSection === 'coverPage' && (
            <button
              onClick={handleConfirmSection}
              disabled={isStreaming}
              className={clsx(
                'w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2',
                isStreaming
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#0B1220] hover:bg-[#1a2535] text-white shadow-sm active:scale-[0.99]'
              )}
            >
              {isStreaming ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                  AI is responding...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>✅  Cover Page Looks Good — Confirm & Continue</span>
                  <span className="opacity-50 text-xs font-normal">→ Introduction</span>
                </span>
              )}
            </button>
          )}

          {/* Confirmed sections */}
          {confirmedSections.map((s) => (
            <div
              key={s.key}
              className={clsx(
                'border-t pt-4',
                proposal.theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
              )}
            >
              <PreviewSection sectionKey={s.key} sections={proposal.sections} />
            </div>
          ))}

          {/* ── Current in-progress section (sections 2–13) ── live preview before confirmation */}
          {!readOnly && !isCurrentConfirmed && currentSection !== 'coverPage' && (
            <div className="border-t border-dashed border-[#E85D2B]/50 pt-4">
              {/* Awaiting review label */}
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-[#E85D2B] bg-[#E85D2B]/10 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-[#E85D2B] rounded-full animate-pulse" />
                  Awaiting your review
                </span>
                <span className="text-[10px] text-gray-400">{currentSectionMeta?.title}</span>
              </div>

              {/* Section content with ring */}
              <div className="ring-1 ring-[#E85D2B]/20 rounded-lg overflow-hidden">
                <PreviewSection sectionKey={currentSection} sections={proposal.sections} />
              </div>

              {/* Confirm & Continue button */}
              <button
                onClick={handleConfirmSection}
                disabled={isStreaming}
                className={clsx(
                  'mt-3 w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2',
                  isStreaming
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[#0B1220] hover:bg-[#1a2535] text-white shadow-sm active:scale-[0.99]'
                )}
              >
                {isStreaming ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                    AI is responding...
                  </span>
                ) : isLastSection ? (
                  '✅  Confirm & Complete Proposal'
                ) : (
                  <span className="flex items-center gap-2">
                    <span>✅  Looks Good — Confirm & Continue</span>
                    {nextSectionMeta && (
                      <span className="opacity-50 text-xs font-normal">
                        → {nextSectionMeta.title}
                      </span>
                    )}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Proposal complete state */}
          {isCurrentConfirmed && isLastSection && (
            <div className="text-center py-8">
              <div className="text-3xl mb-3">🎉</div>
              <p className="text-sm font-semibold text-[#0B1220]">Proposal Complete!</p>
              <p className="text-xs text-gray-400 mt-1">Click Download PDF above to get your branded proposal.</p>
            </div>
          )}

          {/* Empty state — nothing started yet */}
          {proposal.confirmedSections.length === 0 && currentSection === 'coverPage' && (
            <div className="text-center py-10 text-gray-400">
              <div className="text-sm">Start the chat to build your proposal</div>
              <div className="text-xs mt-1 text-gray-300">Sections appear here as the AI fills them in</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-300">
            Argos Mob Tech & AI Pvt. Ltd. · https://www.argosmob.in/
          </p>
        </div>
      </div>
    </div>
  );
}
