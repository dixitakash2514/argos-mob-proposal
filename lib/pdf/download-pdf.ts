import type { ProposalState } from '@/types/proposal';

export async function downloadProposalPDF(proposal: ProposalState): Promise<void> {
  const res = await fetch('/api/pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ proposalData: proposal }),
  });

  if (!res.ok) {
    throw new Error('Failed to generate PDF');
  }

  // Derive filename from the server's Content-Disposition header (reliable across browsers)
  const disposition = res.headers.get('content-disposition') ?? '';
  const match = disposition.match(/filename="([^"]+)"/);
  const filename = match?.[1] ??
    `ArgosMob-Proposal-${proposal.clientName || 'Draft'}.pdf`.replace(/\s+/g, '-');

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Delay revocation so Chrome has time to start the download before the URL is invalidated
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
