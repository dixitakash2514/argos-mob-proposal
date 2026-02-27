'use client';

import { useEffect, useState } from 'react';
import { SECTION_ORDER } from '@/types/proposal';
import type { SectionKey } from '@/types/proposal';

// ─── Local row types ────────────────────────────────────────────────────────────
type TechStackRow = { category: string; technology: string; checked: boolean };
type DeliveryRow = { name: string; included: boolean };
type CostRow = { product: string; estimatedTime: string; estimatedCost: string };
type TeamRow = { role: string; count: number };
type SLATierRow = { severity: string; responseTime: string; resolutionTime: string };

// ─── Props ──────────────────────────────────────────────────────────────────────
interface OfflineModalProps {
  open: boolean;
  sectionKey: SectionKey;
  initialData: Record<string, unknown>;
  trigger: 'offline' | 'error';
  onSubmit: (data: Record<string, unknown>) => void;
  onClose: () => void;
}

// ─── Shared atoms ───────────────────────────────────────────────────────────────
function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#E85D2B] transition-colors"
      />
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#E85D2B] transition-colors"
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  rows = 8,
  placeholder,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div className="mb-3">
      {label && <label className="block text-xs text-gray-400 mb-1">{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E85D2B] transition-colors resize-y font-mono"
        spellCheck={false}
      />
    </div>
  );
}

function BulletListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs text-gray-400">{label}</label>
        <button
          type="button"
          onClick={() => onChange([...items, ''])}
          className="text-xs text-[#E85D2B] hover:text-[#d4521f] transition-colors"
        >
          + Add
        </button>
      </div>
      <div className="space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[#E85D2B] text-xs flex-shrink-0">•</span>
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const updated = [...items];
                updated[i] = e.target.value;
                onChange(updated);
              }}
              className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#E85D2B] transition-colors"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="text-gray-500 hover:text-red-400 transition-colors text-base leading-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NumberedListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs text-gray-400">{label}</label>
        <button
          type="button"
          onClick={() => onChange([...items, ''])}
          className="text-xs text-[#E85D2B] hover:text-[#d4521f] transition-colors"
        >
          + Add
        </button>
      </div>
      <div className="space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-gray-500 text-xs flex-shrink-0 w-4">{i + 1}.</span>
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const updated = [...items];
                updated[i] = e.target.value;
                onChange(updated);
              }}
              className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#E85D2B] transition-colors"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="text-gray-500 hover:text-red-400 transition-colors text-base leading-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section-specific forms ─────────────────────────────────────────────────────
function CoverPageForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  return (
    <>
      <InputField
        label="Client Name"
        value={(data.clientName as string) || ''}
        onChange={(v) => onChange({ ...data, clientName: v })}
        placeholder="e.g. Acme Corp"
      />
      <InputField
        label="Project Title"
        value={(data.projectTitle as string) || ''}
        onChange={(v) => onChange({ ...data, projectTitle: v })}
        placeholder="e.g. Mobile App Development"
      />
    </>
  );
}

function TechStackForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  const items = (data.items as TechStackRow[]) || [];

  const updateItem = (i: number, field: keyof TechStackRow, value: string | boolean) => {
    onChange({ ...data, items: items.map((row, j) => (j === i ? { ...row, [field]: value } : row)) });
  };
  const addRow = () =>
    onChange({ ...data, items: [...items, { category: '', technology: '', checked: true }] });
  const deleteRow = (i: number) =>
    onChange({ ...data, items: items.filter((_, j) => j !== i) });

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs text-gray-400">Tech Stack Items</label>
        <button
          type="button"
          onClick={addRow}
          className="text-xs text-[#E85D2B] hover:text-[#d4521f] transition-colors"
        >
          + Add Row
        </button>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-gray-500">
            <th className="text-left pb-1 pr-2 font-normal">Category</th>
            <th className="text-left pb-1 pr-2 font-normal">Technology</th>
            <th className="text-center pb-1 pr-2 font-normal">Include</th>
            <th className="pb-1 w-6" />
          </tr>
        </thead>
        <tbody>
          {items.map((row, i) => (
            <tr key={i}>
              <td className="pr-2 pb-1">
                <input
                  type="text"
                  value={row.category}
                  onChange={(e) => updateItem(i, 'category', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#E85D2B]"
                />
              </td>
              <td className="pr-2 pb-1">
                <input
                  type="text"
                  value={row.technology}
                  onChange={(e) => updateItem(i, 'technology', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#E85D2B]"
                />
              </td>
              <td className="pr-2 pb-1 text-center">
                <button
                  type="button"
                  onClick={() => updateItem(i, 'checked', !row.checked)}
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    width: '2rem',
                    height: '1.25rem',
                    borderRadius: '9999px',
                    backgroundColor: row.checked ? '#E85D2B' : '#4B5563',
                    transition: 'background-color 0.2s',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      width: '1rem',
                      height: '1rem',
                      borderRadius: '9999px',
                      backgroundColor: 'white',
                      margin: '0.125rem',
                      transform: row.checked ? 'translateX(0.75rem)' : 'translateX(0)',
                      transition: 'transform 0.2s',
                    }}
                  />
                </button>
              </td>
              <td className="pb-1">
                <button
                  type="button"
                  onClick={() => deleteRow(i)}
                  className="text-gray-500 hover:text-red-400 text-base"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DeliveryComponentsForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  const components = (data.components as DeliveryRow[]) || [];

  const toggle = (i: number) =>
    onChange({
      ...data,
      components: components.map((c, j) => (j === i ? { ...c, included: !c.included } : c)),
    });
  const updateName = (i: number, name: string) =>
    onChange({
      ...data,
      components: components.map((c, j) => (j === i ? { ...c, name } : c)),
    });
  const addRow = () =>
    onChange({ ...data, components: [...components, { name: '', included: true }] });
  const deleteRow = (i: number) =>
    onChange({ ...data, components: components.filter((_, j) => j !== i) });

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs text-gray-400">Delivery Components</label>
        <button
          type="button"
          onClick={addRow}
          className="text-xs text-[#E85D2B] hover:text-[#d4521f] transition-colors"
        >
          + Add
        </button>
      </div>
      <div className="space-y-1">
        {components.map((comp, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={comp.name}
              onChange={(e) => updateName(i, e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#E85D2B]"
            />
            <button
              type="button"
              onClick={() => toggle(i)}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors flex-shrink-0 ${
                comp.included
                  ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                  : 'bg-red-600/20 text-red-400 border border-red-600/30'
              }`}
            >
              {comp.included ? '✓ In' : '✗ Out'}
            </button>
            <button
              type="button"
              onClick={() => deleteRow(i)}
              className="text-gray-500 hover:text-red-400 text-base"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function parseCostAmount(s: string): number {
  const num = parseFloat(s.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 0 : num;
}

function computeLineItemsTotal(items: CostRow[]): string {
  const total = items.reduce((sum, row) => sum + parseCostAmount(row.estimatedCost), 0);
  if (total === 0) return '';
  return `₹${total.toLocaleString('en-IN')}`;
}

function CostEstimationForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  const lineItems = (data.lineItems as CostRow[]) || [];

  const updateWithTotal = (newItems: CostRow[]) => {
    const total = computeLineItemsTotal(newItems);
    onChange({ ...data, lineItems: newItems, ...(total ? { totalProjectCost: total } : {}) });
  };

  const updateRow = (i: number, field: keyof CostRow, value: string) =>
    updateWithTotal(lineItems.map((row, j) => (j === i ? { ...row, [field]: value } : row)));
  const addRow = () =>
    updateWithTotal([...lineItems, { product: '', estimatedTime: '', estimatedCost: '' }]);
  const deleteRow = (i: number) =>
    updateWithTotal(lineItems.filter((_, j) => j !== i));

  const computedTotal = computeLineItemsTotal(lineItems);

  return (
    <>
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-gray-400">Line Items</label>
          <button
            type="button"
            onClick={addRow}
            className="text-xs text-[#E85D2B] hover:text-[#d4521f] transition-colors"
          >
            + Add Row
          </button>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-500">
              <th className="text-left pb-1 pr-2 font-normal">Product / Module</th>
              <th className="text-left pb-1 pr-2 w-24 font-normal">Time</th>
              <th className="text-left pb-1 pr-2 w-24 font-normal">Cost</th>
              <th className="pb-1 w-6" />
            </tr>
          </thead>
          <tbody>
            {lineItems.map((row, i) => (
              <tr key={i}>
                <td className="pr-2 pb-1">
                  <input
                    type="text"
                    value={row.product}
                    onChange={(e) => updateRow(i, 'product', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#E85D2B]"
                  />
                </td>
                <td className="pr-2 pb-1">
                  <input
                    type="text"
                    value={row.estimatedTime}
                    onChange={(e) => updateRow(i, 'estimatedTime', e.target.value)}
                    placeholder="4 weeks"
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#E85D2B]"
                  />
                </td>
                <td className="pr-2 pb-1">
                  <input
                    type="text"
                    value={row.estimatedCost}
                    onChange={(e) => updateRow(i, 'estimatedCost', e.target.value)}
                    placeholder="₹50,000"
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#E85D2B]"
                  />
                </td>
                <td className="pb-1">
                  <button
                    type="button"
                    onClick={() => deleteRow(i)}
                    className="text-gray-500 hover:text-red-400 text-base"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Auto-computed total */}
        <div className="mt-2 flex items-center justify-between px-2 py-1.5 bg-white/5 border border-white/10 rounded">
          <span className="text-xs text-gray-400">Total Estimated Cost</span>
          <span className="text-sm font-semibold text-white">{computedTotal || '—'}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <NumberInput
          label="GST (%)"
          value={(data.gst as number) ?? 18}
          onChange={(v) => onChange({ ...data, gst: v })}
        />
      </div>
      <InputField
        label="Payment Terms"
        value={(data.paymentTerms as string) || ''}
        onChange={(v) => onChange({ ...data, paymentTerms: v })}
        placeholder="e.g. 40% advance, 60% on delivery"
      />
      <NumberInput
        label="Validity (days)"
        value={(data.validityDays as number) ?? 30}
        onChange={(v) => onChange({ ...data, validityDays: v })}
      />
    </>
  );
}

function ProposedTeamForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  const members = (data.members as TeamRow[]) || [];

  const updateMember = (i: number, field: 'role' | 'count', value: string | number) =>
    onChange({ ...data, members: members.map((m, j) => (j === i ? { ...m, [field]: value } : m)) });
  const addRow = () => onChange({ ...data, members: [...members, { role: '', count: 1 }] });
  const deleteRow = (i: number) =>
    onChange({ ...data, members: members.filter((_, j) => j !== i) });

  return (
    <>
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-gray-400">Team Members</label>
          <button
            type="button"
            onClick={addRow}
            className="text-xs text-[#E85D2B] hover:text-[#d4521f] transition-colors"
          >
            + Add Row
          </button>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-500">
              <th className="text-left pb-1 pr-2 font-normal">Role</th>
              <th className="text-left pb-1 pr-2 w-20 font-normal">Count</th>
              <th className="pb-1 w-6" />
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={i}>
                <td className="pr-2 pb-1">
                  <input
                    type="text"
                    value={m.role}
                    onChange={(e) => updateMember(i, 'role', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#E85D2B]"
                  />
                </td>
                <td className="pr-2 pb-1">
                  <input
                    type="number"
                    value={m.count}
                    min={1}
                    onChange={(e) => updateMember(i, 'count', Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#E85D2B]"
                  />
                </td>
                <td className="pb-1">
                  <button
                    type="button"
                    onClick={() => deleteRow(i)}
                    className="text-gray-500 hover:text-red-400 text-base"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AMCForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <NumberInput
          label="Percentage (%)"
          value={(data.percentage as number) ?? 15}
          onChange={(v) => onChange({ ...data, percentage: v })}
        />
        <InputField
          label="Period"
          value={(data.period as string) || ''}
          onChange={(v) => onChange({ ...data, period: v })}
          placeholder="e.g. 12 months"
        />
      </div>
      <BulletListEditor
        label="Inclusions"
        items={(data.inclusions as string[]) || []}
        onChange={(v) => onChange({ ...data, inclusions: v })}
      />
      <InputField
        label="Note (optional)"
        value={(data.note as string) || ''}
        onChange={(v) => onChange({ ...data, note: v })}
        placeholder="Any additional note..."
      />
    </>
  );
}

function SLAForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  const tiers = (data.tiers as SLATierRow[]) || [];

  const updateTier = (i: number, field: keyof SLATierRow, value: string) =>
    onChange({ ...data, tiers: tiers.map((t, j) => (j === i ? { ...t, [field]: value } : t)) });
  const addRow = () =>
    onChange({ ...data, tiers: [...tiers, { severity: '', responseTime: '', resolutionTime: '' }] });
  const deleteRow = (i: number) =>
    onChange({ ...data, tiers: tiers.filter((_, j) => j !== i) });

  return (
    <>
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-gray-400">SLA Tiers</label>
          <button
            type="button"
            onClick={addRow}
            className="text-xs text-[#E85D2B] hover:text-[#d4521f] transition-colors"
          >
            + Add Row
          </button>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-500">
              <th className="text-left pb-1 pr-2 font-normal">Severity</th>
              <th className="text-left pb-1 pr-2 font-normal">Response Time</th>
              <th className="text-left pb-1 pr-2 font-normal">Resolution Time</th>
              <th className="pb-1 w-6" />
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier, i) => (
              <tr key={i}>
                <td className="pr-2 pb-1">
                  <input
                    type="text"
                    value={tier.severity}
                    onChange={(e) => updateTier(i, 'severity', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#E85D2B]"
                  />
                </td>
                <td className="pr-2 pb-1">
                  <input
                    type="text"
                    value={tier.responseTime}
                    onChange={(e) => updateTier(i, 'responseTime', e.target.value)}
                    placeholder="e.g. 2 hours"
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#E85D2B]"
                  />
                </td>
                <td className="pr-2 pb-1">
                  <input
                    type="text"
                    value={tier.resolutionTime}
                    onChange={(e) => updateTier(i, 'resolutionTime', e.target.value)}
                    placeholder="e.g. 8 hours"
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#E85D2B]"
                  />
                </td>
                <td className="pb-1">
                  <button
                    type="button"
                    onClick={() => deleteRow(i)}
                    className="text-gray-500 hover:text-red-400 text-base"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="Uptime"
          value={(data.uptime as string) || ''}
          onChange={(v) => onChange({ ...data, uptime: v })}
          placeholder="e.g. 99.9%"
        />
        <InputField
          label="Maintenance Window"
          value={(data.maintenanceWindow as string) || ''}
          onChange={(v) => onChange({ ...data, maintenanceWindow: v })}
          placeholder="e.g. Sundays 2–4 AM"
        />
      </div>
    </>
  );
}

function ChangeRequestForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  return (
    <>
      <NumberedListEditor
        label="Process Steps"
        items={(data.process as string[]) || []}
        onChange={(v) => onChange({ ...data, process: v })}
      />
      <InputField
        label="Lead Time"
        value={(data.leadTime as string) || ''}
        onChange={(v) => onChange({ ...data, leadTime: v })}
        placeholder="e.g. 5 business days"
      />
      <InputField
        label="Costing Note"
        value={(data.costingNote as string) || ''}
        onChange={(v) => onChange({ ...data, costingNote: v })}
        placeholder="e.g. Billed at standard hourly rate..."
      />
    </>
  );
}

function AcceptanceCriteriaForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  return (
    <>
      <InputField
        label="Intro Text (optional)"
        value={(data.introText as string) || ''}
        onChange={(v) => onChange({ ...data, introText: v })}
        placeholder="Opening sentence..."
      />
      <BulletListEditor
        label="Criteria"
        items={(data.criteria as string[]) || []}
        onChange={(v) => onChange({ ...data, criteria: v })}
      />
      <InputField
        label="Conclusion Text (optional)"
        value={(data.conclusionText as string) || ''}
        onChange={(v) => onChange({ ...data, conclusionText: v })}
        placeholder="Closing sentence..."
      />
    </>
  );
}

function WarrantyForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  return (
    <>
      <NumberInput
        label="Warranty Period (days)"
        value={(data.periodDays as number) ?? 90}
        onChange={(v) =>
          onChange({
            ...data,
            periodDays: v,
            inclusions: [`${v} Days Warranty for Bug Fixes`],
          })
        }
      />
      <div className="mb-3 px-2 py-1.5 bg-white/5 border border-white/10 rounded">
        <span className="text-xs text-gray-400">Inclusions (auto-generated)</span>
        <p className="text-sm text-gray-300 mt-1">
          • {(data.periodDays as number) ?? 90} Days Warranty for Bug Fixes
        </p>
      </div>
      <BulletListEditor
        label="Exclusions"
        items={(data.exclusions as string[]) || []}
        onChange={(v) => onChange({ ...data, exclusions: v })}
      />
    </>
  );
}

function LegalSignOffForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  return (
    <>
      <TextareaField
        label="Compliance Statement"
        value={(data.complianceStatement as string) || ''}
        onChange={(v) => onChange({ ...data, complianceStatement: v })}
        rows={5}
        placeholder="This proposal is confidential..."
      />
      <InputField
        label="Client Signature Name"
        value={(data.clientSignatureName as string) || ''}
        onChange={(v) => onChange({ ...data, clientSignatureName: v })}
        placeholder="e.g. John Smith"
      />
      <InputField
        label="ArgosMob Signature Name"
        value={(data.argosmobSignatureName as string) || ''}
        onChange={(v) => onChange({ ...data, argosmobSignatureName: v })}
        placeholder="e.g. Jane Doe"
      />
    </>
  );
}

// ─── Main Modal ─────────────────────────────────────────────────────────────────
export function OfflineModal({
  open,
  sectionKey,
  initialData,
  trigger,
  onSubmit,
  onClose,
}: OfflineModalProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(initialData);

  // Reset form each time the modal opens with fresh data
  useEffect(() => {
    if (open) {
      setFormData(initialData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const sectionTitle = SECTION_ORDER.find((s) => s.key === sectionKey)?.title ?? sectionKey;

  const renderForm = () => {
    switch (sectionKey) {
      case 'coverPage':
        return <CoverPageForm data={formData} onChange={setFormData} />;
      case 'introduction':
        return (
          <>
            <p className="text-xs text-gray-500 mb-2">
              Supports <span className="text-white font-medium">Markdown</span> — use{' '}
              <code className="bg-white/10 px-1 rounded">## Heading</code>,{' '}
              <code className="bg-white/10 px-1 rounded">**bold**</code>,{' '}
              <code className="bg-white/10 px-1 rounded">- bullet</code> etc.
            </p>
            <TextareaField
              value={(formData.content as string) || ''}
              onChange={(v) => setFormData({ ...formData, content: v })}
              rows={12}
              placeholder={'## Overview\n\nWrite your introduction here...\n\n**Key points:**\n- Point 1\n- Point 2'}
            />
          </>
        );
      case 'keyModules':
        return (
          <>
            <p className="text-xs text-gray-500 mb-2">
              Supports <span className="text-white font-medium">Markdown</span> — use{' '}
              <code className="bg-white/10 px-1 rounded">## Module Name</code> for section headers and{' '}
              <code className="bg-white/10 px-1 rounded">- feature</code> for bullets.
            </p>
            <TextareaField
              value={(formData.content as string) || ''}
              onChange={(v) => setFormData({ ...formData, content: v })}
              rows={12}
              placeholder={'## User Management\n- Registration & login\n- Role-based access\n\n## Dashboard\n- Analytics overview\n- Real-time charts'}
            />
          </>
        );
      case 'techStack':
        return <TechStackForm data={formData} onChange={setFormData} />;
      case 'deliveryComponents':
        return <DeliveryComponentsForm data={formData} onChange={setFormData} />;
      case 'costEstimation':
        return <CostEstimationForm data={formData} onChange={setFormData} />;
      case 'proposedTeam':
        return <ProposedTeamForm data={formData} onChange={setFormData} />;
      case 'amc':
        return <AMCForm data={formData} onChange={setFormData} />;
      case 'sla':
        return <SLAForm data={formData} onChange={setFormData} />;
      case 'changeRequest':
        return <ChangeRequestForm data={formData} onChange={setFormData} />;
      case 'acceptanceCriteria':
        return <AcceptanceCriteriaForm data={formData} onChange={setFormData} />;
      case 'warranty':
        return <WarrantyForm data={formData} onChange={setFormData} />;
      case 'legalSignOff':
        return <LegalSignOffForm data={formData} onChange={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-2xl bg-[#0B1220] border border-white/10 rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-white font-bold text-base">
              {trigger === 'offline' ? 'Edit Section Content' : 'Paste Content Manually'}
            </h2>
            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
              {sectionTitle}
            </span>
            {trigger === 'offline' && (
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                Offline
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors text-xl leading-none ml-2"
          >
            ×
          </button>
        </div>

        {/* Description */}
        <p className="px-6 pt-3 pb-1 text-gray-400 text-xs flex-shrink-0">
          {trigger === 'offline' ? (
            <>
              Fill in the fields for{' '}
              <span className="text-[#E85D2B] font-semibold">{sectionTitle}</span>. Changes apply
              to the live preview — review there and click{' '}
              <strong className="text-white">Confirm &amp; Continue</strong> when ready.
            </>
          ) : (
            <>
              AI is unavailable. Fill in the fields for{' '}
              <span className="text-[#E85D2B] font-semibold">{sectionTitle}</span> to continue.
            </>
          )}
        </p>

        {/* Scrollable form */}
        <div className="px-6 py-4 overflow-y-auto flex-1">{renderForm()}</div>

        {/* Actions */}
        <div className="px-6 pb-5 pt-3 border-t border-white/10 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 border border-white/10 hover:border-white/30 text-gray-400 hover:text-white font-medium py-2.5 rounded-xl text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(formData)}
            className="flex-1 bg-[#E85D2B] hover:bg-[#d4521f] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
          >
            {trigger === 'offline' ? 'Apply to Preview →' : 'Apply & Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
}
