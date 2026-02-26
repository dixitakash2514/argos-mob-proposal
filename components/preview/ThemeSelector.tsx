'use client';

import { useProposalStore } from '@/lib/store/proposal-store';
import clsx from 'clsx';

const THEMES = [
  { value: 'default', label: 'Classic' },
  { value: 'dark', label: 'Dark' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'lightBlue', label: 'Light Blue' },
  { value: 'darkBlue', label: 'Dark Blue' },
] as const;

export function ThemeSelector() {
  const proposal = useProposalStore((s) => s.proposal);
  const setProposalField = useProposalStore((s) => s.setProposalField);

  if (!proposal) return null;

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      {THEMES.map((theme) => (
        <button
          key={theme.value}
          onClick={() => setProposalField('theme', theme.value)}
          className={clsx(
            'px-3 py-1 text-xs font-medium rounded-md transition-all',
            proposal.theme === theme.value
              ? 'bg-white text-[#0B1220] shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          {theme.label}
        </button>
      ))}
    </div>
  );
}
