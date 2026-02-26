'use client';

import type { ChatMessage } from '@/types/proposal';
import clsx from 'clsx';

// Strip JSON code blocks and bare lone JSON objects from AI messages so the
// chat stays non-technical. The raw JSON is still processed by ChatPanel for
// the preview — this only affects what the user sees.
function cleanAIContent(content: string): string {
  // Remove ```json { ... } ``` fenced blocks
  let cleaned = content.replace(/```(?:json)?\s*\{[\s\S]*?\}\s*```/g, '').trim();
  // If the entire remaining message is a lone bare JSON object, suppress it
  const trimmed = cleaned.trim();
  if (/^\{[\s\S]*\}$/.test(trimmed)) {
    try { JSON.parse(trimmed); return ''; } catch { /* not JSON, keep as-is */ }
  }
  return cleaned.trim();
}

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAI = message.role === 'assistant';

  return (
    <div className={clsx('flex gap-3 mb-4', isAI ? 'justify-start' : 'justify-end')}>
      {isAI && (
        <div className="w-8 h-8 rounded-full bg-[#0B1220] flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-white text-xs font-bold">AM</span>
        </div>
      )}

      <div
        className={clsx(
          'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isAI
            ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
            : 'bg-[#0B1220] text-white rounded-tr-sm'
        )}
      >
        {/* Render markdown-like content; strip JSON from AI messages */}
        <MessageContent content={isAI ? cleanAIContent(message.content) : message.content} />
        <span
          className={clsx(
            'block text-[10px] mt-1.5',
            isAI ? 'text-gray-400' : 'text-gray-300'
          )}
        >
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  // Simple markdown-to-JSX renderer (handles bold, lists, code blocks)
  const lines = content.split('\n');

  return (
    <div className="prose prose-sm max-w-none">
      {lines.map((line, i) => {
        if (line.startsWith('### ')) {
          return <h3 key={i} className="font-bold text-sm mt-2 mb-1">{line.slice(4)}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={i} className="font-bold text-base mt-2 mb-1">{line.slice(3)}</h2>;
        }
        if (line.startsWith('# ')) {
          return <h1 key={i} className="font-bold text-lg mt-2 mb-1">{line.slice(2)}</h1>;
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-[#E85D2B] mt-0.5">•</span>
              <span>{renderInline(line.slice(2))}</span>
            </div>
          );
        }
        if (line.match(/^\d+\. /)) {
          const num = line.match(/^(\d+)\. /)?.[1];
          return (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-[#E85D2B] font-mono text-xs mt-0.5">{num}.</span>
              <span>{renderInline(line.replace(/^\d+\. /, ''))}</span>
            </div>
          );
        }
        if (line.startsWith('```')) {
          return null; // handled by block below
        }
        if (line === '') {
          return <div key={i} className="h-2" />;
        }
        return <p key={i} className="my-0.5">{renderInline(line)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  // Bold: **text** → <strong>
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    // Inline code: `text`
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-gray-100 px-1 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
}
