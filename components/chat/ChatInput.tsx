'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import clsx from 'clsx';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled = false, placeholder = 'Type your reply...' }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={clsx(
            'flex-1 resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-[#E85D2B]/30 focus:border-[#E85D2B]',
            'placeholder:text-gray-400 leading-relaxed transition-all',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-50'
          )}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className={clsx(
            'w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0',
            input.trim() && !disabled
              ? 'bg-[#E85D2B] hover:bg-[#d4521f] text-white shadow-sm'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          )}
          aria-label="Send message"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
      <p className="text-[10px] text-gray-400 mt-1.5 ml-1">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
