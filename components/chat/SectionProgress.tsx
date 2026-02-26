'use client';

import { SECTION_ORDER } from '@/types/proposal';
import type { SectionKey } from '@/types/proposal';
import clsx from 'clsx';

interface SectionProgressProps {
  currentSection: SectionKey;
  confirmedSections: SectionKey[];
  onSectionClick?: (key: SectionKey) => void;
}

export function SectionProgress({ currentSection, confirmedSections, onSectionClick }: SectionProgressProps) {
  return (
    <div className="w-full px-4 py-3 border-b border-gray-200 bg-white">
      {/* Section label */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#0B1220] uppercase tracking-wider">
          Proposal Progress
        </span>
        <span className="text-xs text-gray-500">
          {confirmedSections.length} / {SECTION_ORDER.length} sections
        </span>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {SECTION_ORDER.map((section, idx) => {
          const isConfirmed = confirmedSections.includes(section.key);
          const isCurrent = section.key === currentSection;

          return (
            <div key={section.key} className="flex items-center gap-1 flex-shrink-0">
              {idx > 0 && (
                <div
                  className={clsx(
                    'h-0.5 w-3',
                    isConfirmed || confirmedSections.includes(SECTION_ORDER[idx - 1]?.key)
                      ? 'bg-[#E85D2B]'
                      : 'bg-gray-200'
                  )}
                />
              )}
              <div
                title={isConfirmed ? `Go back to ${section.title}` : section.title}
                onClick={isConfirmed ? () => onSectionClick?.(section.key) : undefined}
                className={clsx(
                  'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all',
                  isConfirmed
                    ? 'bg-[#E85D2B] text-white cursor-pointer hover:opacity-80'
                    : isCurrent
                    ? 'bg-[#0B1220] text-white ring-2 ring-[#0B1220] ring-offset-1'
                    : 'bg-gray-100 text-gray-400'
                )}
              >
                {isConfirmed ? '✓' : section.order}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current section title */}
      <p className="mt-2 text-xs text-gray-600">
        Current:{' '}
        <span className="font-medium text-[#0B1220]">
          {SECTION_ORDER.find((s) => s.key === currentSection)?.title ?? currentSection}
        </span>
      </p>
    </div>
  );
}
