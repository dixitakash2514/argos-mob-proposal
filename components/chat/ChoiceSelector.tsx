'use client';

import { useState } from 'react';
import type { ChoiceGroup } from '@/types/proposal';
import clsx from 'clsx';

interface ChoiceSelectorProps {
  groups: ChoiceGroup[];
  onConfirm: (groups: ChoiceGroup[], customText: string) => void;
}

export function ChoiceSelector({ groups: initialGroups, onConfirm }: ChoiceSelectorProps) {
  const [groups, setGroups] = useState<ChoiceGroup[]>(initialGroups);
  const [customText, setCustomText] = useState('');

  const toggleItem = (groupIdx: number, itemIdx: number) => {
    setGroups((prev) => {
      const next = prev.map((g, gi) =>
        gi !== groupIdx
          ? g
          : {
              ...g,
              items: g.items.map((item, ii) =>
                ii !== itemIdx ? item : { ...item, checked: !item.checked }
              ),
            }
      );
      return next;
    });
  };

  return (
    <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {groups.map((group, gi) => (
        <div key={group.groupLabel} className={clsx(gi > 0 && 'border-t border-gray-100')}>
          <div className="px-3 py-2 bg-gray-50">
            <span className="text-xs font-semibold text-[#0B1220] uppercase tracking-wider">
              {group.groupLabel}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1 p-2">
            {group.items.map((item, ii) => (
              <label
                key={item.id}
                className={clsx(
                  'flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer text-xs transition-colors',
                  item.checked ? 'bg-[#0B1220]/5 text-[#0B1220]' : 'hover:bg-gray-50 text-gray-600'
                )}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItem(gi, ii)}
                  className="w-3.5 h-3.5 rounded accent-[#E85D2B]"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Free-text */}
      <div className="border-t border-gray-100 p-3">
        <input
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Anything else to add? (optional)"
          className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E85D2B]/30 focus:border-[#E85D2B]"
        />
      </div>

      <div className="border-t border-gray-100 p-3 bg-gray-50">
        <button
          onClick={() => onConfirm(groups, customText)}
          className="w-full bg-[#E85D2B] hover:bg-[#d4521f] text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
}
