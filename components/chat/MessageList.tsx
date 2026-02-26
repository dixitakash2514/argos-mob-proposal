'use client';

import { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/types/proposal';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming: boolean;
}

export function MessageList({ messages, isStreaming }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 gap-3">
          <div className="w-16 h-16 rounded-full bg-[#0B1220] flex items-center justify-center">
            <span className="text-white text-2xl font-bold">AM</span>
          </div>
          <p className="text-sm font-medium text-gray-600">ArgosMob Proposal Builder</p>
          <p className="text-xs max-w-xs">
            I'll guide you through building a professional proposal section by section.
            <br />
            Click <strong>Start</strong> to begin.
          </p>
        </div>
      )}

      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {isStreaming && (
        <div className="flex gap-3 mb-4 justify-start">
          <div className="w-8 h-8 rounded-full bg-[#0B1220] flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-white text-xs font-bold">AM</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
            <div className="flex gap-1 items-center">
              <span className="w-2 h-2 bg-[#E85D2B] rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-[#E85D2B] rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-[#E85D2B] rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
