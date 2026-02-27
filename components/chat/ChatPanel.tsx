'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useProposalStore } from '@/lib/store/proposal-store';
import { SectionProgress } from './SectionProgress';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import type { ChatMessage, SectionKey } from '@/types/proposal';
import { SECTION_ORDER } from '@/types/proposal';
import { OfflineModal } from './OfflineModal';

// ─── Extract JSON from AI response (handles ```json blocks OR bare { } objects) ─
function extractJsonBlock(content: string): Record<string, unknown> | null {
  // Try fenced code block first
  const fenced = content.match(/```json\s*([\s\S]*?)```/);
  if (fenced) {
    try { return JSON.parse(fenced[1].trim()); } catch { /* fall through */ }
  }
  // Try bare JSON object — find the outermost { ... }
  const bare = content.match(/\{[\s\S]*\}/);
  if (bare) {
    try { return JSON.parse(bare[0]); } catch { /* fall through */ }
  }
  return null;
}

export function ChatPanel() {
  const {
    proposal,
    messages,
    isStreaming,
    nextSectionPending,
    addMessage,
    updateLastMessage,
    setIsStreaming,
    updateSectionData,
    setProposalField,
    setIsSaving,
    setNextSectionPending,
    confirmSection,
    setCurrentSection,
  } = useProposalStore();

  // Online / Offline mode toggle
  const [offlineMode, setOfflineMode] = useState(false);

  // Manual input modal — used by both offline mode and error fallback
  const [manualOpen, setManualOpen] = useState(false);
  const [manualInitialData, setManualInitialData] = useState<Record<string, unknown>>({});
  const manualSectionRef = useRef<SectionKey | null>(null);
  // 'offline' = user-initiated, no auto-advance | 'error' = API failed, auto-advance
  const manualTriggerRef = useRef<'offline' | 'error'>('error');

  /** Opens the manual input modal pre-filled with the section's current data */
  function openManualModal(sectionKey: SectionKey, trigger: 'offline' | 'error') {
    const latest = useProposalStore.getState().proposal;
    const data = (latest?.sections[sectionKey]?.data ?? {}) as Record<string, unknown>;
    manualSectionRef.current = sectionKey;
    manualTriggerRef.current = trigger;
    setManualInitialData(data);
    setManualOpen(true);
  }

  const sendMessage = useCallback(
    async (userText: string) => {
      if (!proposal || isStreaming) return;

      const currentSection = proposal.currentSection;

      const userMsg: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content: userText,
        timestamp: new Date(),
        sectionKey: currentSection,
      };
      addMessage(userMsg);

      // Placeholder AI message
      const aiMsg: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        sectionKey: currentSection,
      };
      addMessage(aiMsg);

      // ── Offline mode: skip API entirely, open manual input modal ──────────────
      if (offlineMode) {
        const sectionTitle = SECTION_ORDER.find((s) => s.key === currentSection)?.title ?? currentSection;
        updateLastMessage(`Offline mode — paste your content for **${sectionTitle}** below.`);
        openManualModal(currentSection, 'offline');
        return;
      }

      setIsStreaming(true);

      try {
        // Build conversation history for this section from prior messages.
        // Read from store directly to get latest state (closure may be stale).
        // Exclude the user message just added (last non-empty message) so it
        // isn't sent twice — it goes separately as `userMessage`.
        const allMessages = useProposalStore.getState().messages;
        const sectionHistory = allMessages
          .filter((m) => m.sectionKey === currentSection && m.content.trim() !== '')
          .slice(0, -1) // drop the just-added user message
          .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            proposalId: proposal.id,
            sectionKey: currentSection,
            userMessage: userText,
            proposalContext: {
              clientName: proposal.clientName,
              projectTitle: proposal.projectTitle,
              projectBrief: proposal.projectBrief,
              confirmedSections: proposal.confirmedSections,
              currentSection,
              // Ground truth: the current live state of this section in the store.
              // The AI must apply changes ON TOP of this, never regenerate from scratch.
              currentSectionData: proposal.sections[currentSection].data,
            },
            conversationHistory: sectionHistory,
          }),
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody?.error ?? `Chat API error (${res.status})`);
        }
        if (!res.body) throw new Error('No response body');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (data === '[DONE]') break;

            try {
              const parsed = JSON.parse(data);
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.text) {
                fullContent += parsed.text;
                updateLastMessage(fullContent);
              }
            } catch (parseErr) {
              if (parseErr instanceof Error && parseErr.message !== 'Unexpected token') {
                throw parseErr;
              }
              // ignore partial chunk parse errors
            }
          }
        }

        // Parse JSON from AI response and update section data in store for live preview
        applyJsonToStore(fullContent, currentSection);

        // Auto-save to DB
        await autoSave(proposal.id);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error('Chat error:', errMsg);
        updateLastMessage(`AI is unavailable right now (${errMsg}). You can paste content manually to continue, or retry.`);
        openManualModal(currentSection, 'error');
      } finally {
        setIsStreaming(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [proposal, isStreaming, offlineMode, addMessage, updateLastMessage, setIsStreaming]
  );

  // When the user clicks "Confirm & Continue" in the preview panel, this flag
  // is set. We pick it up here and send the next section's opening message.
  useEffect(() => {
    if (!nextSectionPending || isStreaming) return;
    const latest = useProposalStore.getState().proposal;
    if (!latest) return;
    setNextSectionPending(false);
    const section = SECTION_ORDER.find((s) => s.key === latest.currentSection);
    if (section) {
      const isRevision = !!latest.parentId;
      const msg = isRevision
        ? `We're revising v${(latest.version ?? 2) - 1}. The ${section.title} data from the previous version is loaded. Review it and tell me what to change, or approve it as-is.`
        : `Let's work on Section ${section.order}: ${section.title}`;
      sendMessage(msg);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextSectionPending, isStreaming]);

  // Apply extracted JSON to the Zustand store for real-time preview updates
  const applyJsonToStore = (content: string, sectionKey: SectionKey) => {
    const data = extractJsonBlock(content);

    // For cover page: also sync top-level proposal fields so the header updates
    if (sectionKey === 'coverPage') {
      const src = data ?? extractCoverPageFromText(content);
      if (src) {
        if (typeof src.clientName === 'string') setProposalField('clientName', src.clientName);
        if (typeof src.projectTitle === 'string') setProposalField('projectTitle', src.projectTitle);
        updateSectionData('coverPage', src);
      }
      return;
    }

    // For introduction: capture prose if no JSON block present (backward compat)
    if (sectionKey === 'introduction' && !data) {
      const prose = content
        .replace(/\*?does this introduction look good[^]*$/im, '')
        .replace(/\*?would you like any changes[^]*$/im, '')
        .trim();
      if (prose.length > 100) {
        updateSectionData('introduction', { content: prose });
      }
      return;
    }

    if (!data) return;
    // For sections that return { confirmed: true } — no data to merge
    if (data.confirmed === true) return;

    updateSectionData(sectionKey, data);
  };

  // Fallback: extract clientName / projectTitle from plain-text AI response
  const extractCoverPageFromText = (content: string): Record<string, string> | null => {
    const clientMatch = content.match(/"clientName"\s*:\s*"([^"]+)"/);
    const titleMatch = content.match(/"projectTitle"\s*:\s*"([^"]+)"/);
    if (clientMatch && titleMatch) {
      return { clientName: clientMatch[1], projectTitle: titleMatch[1] };
    }

    // Secondary fallback: if clientName still unknown, try to pick it from projectBrief in the store
    const latestProposal = useProposalStore.getState().proposal;
    if (latestProposal?.projectBrief && (!latestProposal.clientName || latestProposal.clientName === '')) {
      // Look for "for <CompanyName>" or "<CompanyName> app" patterns in the brief
      const forMatch = latestProposal.projectBrief.match(/\bfor\s+([A-Z][A-Za-z0-9\s&.,-]{1,40}?)(?:\s+(?:company|client|platform|app|website|portal|project)|[,.\n]|$)/);
      if (forMatch) {
        return { clientName: forMatch[1].trim(), projectTitle: latestProposal.projectTitle || '' };
      }
    }
    return null;
  };

  const autoSave = async (proposalId: string) => {
    const latest = useProposalStore.getState().proposal;
    if (!latest) return;
    try {
      setIsSaving(true);
      await fetch(`/api/proposal/${proposalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: latest.clientName,
          projectTitle: latest.projectTitle,
          projectBrief: latest.projectBrief,
          currentSection: latest.currentSection,
          confirmedSections: latest.confirmedSections,
          sections: latest.sections,
          theme: latest.theme,
        }),
      });
    } catch {
      // Silent fail for auto-save
    } finally {
      setIsSaving(false);
    }
  };

  const handleOfflineSubmit = async (data: Record<string, unknown>) => {
    const sectionKey = manualSectionRef.current;
    if (!sectionKey || !proposal) return;

    // Apply form data directly to store → live preview updates
    if (sectionKey === 'coverPage') {
      if (typeof data.clientName === 'string') setProposalField('clientName', data.clientName);
      if (typeof data.projectTitle === 'string') setProposalField('projectTitle', data.projectTitle);
    }
    updateSectionData(sectionKey, data);
    updateLastMessage(`[Section updated offline: ${SECTION_ORDER.find((s) => s.key === sectionKey)?.title ?? sectionKey}]`);

    if (manualTriggerRef.current === 'error') {
      // Error fallback: auto-confirm and advance to next section
      confirmSection(sectionKey);
      setNextSectionPending(true);
    }
    // Offline mode: just apply — user reviews in preview and manually confirms

    await autoSave(proposal.id);
    manualSectionRef.current = null;
    setManualOpen(false);
  };

  const handleStart = async () => {
    if (!proposal || messages.length > 0) return;
    const isRevision = !!proposal.parentId;
    const startMsg = isRevision
      ? `We're revising v${(proposal.version ?? 2) - 1} of this proposal. The Cover Page data from the previous version is loaded. Review it and tell me what to change, or approve it as-is.`
      : proposal.projectBrief
        ? `My project brief: ${proposal.projectBrief}`
        : `Let's start building the proposal. I'll give you my project details as we go.`;
    await sendMessage(startMsg);
  };

  // On mount: retroactively apply any section data that was missed
  useEffect(() => {
    if (!proposal) return;
    const aiMessages = messages.filter((m) => m.role === 'assistant');
    for (const msg of aiMessages) {
      if (msg.sectionKey) {
        applyJsonToStore(msg.content, msg.sectionKey);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!proposal) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Loading proposal...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Online / Offline toggle */}
      <div className="flex items-center justify-end gap-2 px-4 py-2 border-b border-gray-200 bg-white">
        <span className={`text-xs font-medium ${offlineMode ? 'text-gray-400' : 'text-[#E85D2B]'}`}>
          {offlineMode ? 'Offline' : 'Online'}
        </span>
        <button
          onClick={() => setOfflineMode((v) => !v)}
          className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${offlineMode ? 'bg-gray-300' : 'bg-[#E85D2B]'}`}
          title={offlineMode ? 'Switch to Online (AI) mode' : 'Switch to Offline (manual paste) mode'}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ${offlineMode ? 'translate-x-0' : 'translate-x-4'}`} />
        </button>
      </div>

      <SectionProgress
        currentSection={proposal.currentSection}
        confirmedSections={proposal.confirmedSections}
        onSectionClick={(key) => setCurrentSection(key)}
      />

      <MessageList messages={messages} isStreaming={isStreaming} />

      {messages.length === 0 && (
        <div className="px-4 pb-3">
          <button
            onClick={handleStart}
            disabled={isStreaming}
            className="w-full bg-[#E85D2B] hover:bg-[#d4521f] text-white font-semibold py-3 rounded-xl transition-colors shadow-sm"
          >
            Start Building Proposal →
          </button>
        </div>
      )}

      <ChatInput
        onSend={sendMessage}
        disabled={isStreaming}
        placeholder={
          isStreaming
            ? 'ArgosMob AI is thinking...'
            : `Reply to Section ${SECTION_ORDER.find((s) => s.key === proposal.currentSection)?.order ?? ''}: ${SECTION_ORDER.find((s) => s.key === proposal.currentSection)?.title ?? ''}`
        }
      />

      <OfflineModal
        open={manualOpen}
        sectionKey={manualSectionRef.current ?? 'coverPage'}
        initialData={manualInitialData}
        trigger={manualTriggerRef.current}
        onSubmit={handleOfflineSubmit}
        onClose={() => setManualOpen(false)}
      />
    </div>
  );
}
