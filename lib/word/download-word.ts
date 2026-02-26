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

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `ArgosMob-Proposal-${proposal.clientName || 'Draft'}.docx`.replace(/\s+/g, '-');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
