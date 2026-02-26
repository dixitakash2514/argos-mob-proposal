import type { ProposalState } from '@/types/proposal';

export async function downloadProposalWord(proposal: ProposalState): Promise<void> {
  const res = await fetch('/api/word', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ proposalData: proposal }),
  });

  if (!res.ok) {
    throw new Error('Failed to generate Word document');
  }

  const disposition = res.headers.get('content-disposition') ?? '';
  const match = disposition.match(/filename="([^"]+)"/);
  const filename = match?.[1] ??
    `ArgosMob-Proposal-${proposal.clientName || 'Draft'}.docx`.replace(/\s+/g, '-');

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
