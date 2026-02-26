import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { ProposalDocument } from '@/components/pdf-template/ProposalDocument';
import type { ProposalState } from '@/types/proposal';

const PDFRequestSchema = z.object({
  proposalData: z.record(z.string(), z.unknown()),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = PDFRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const proposal = parsed.data.proposalData as unknown as ProposalState;

    // renderToBuffer expects a ReactElement<DocumentProps>
    const element = React.createElement(ProposalDocument, { proposal });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(element as any);

    const filename = `ArgosMob-Proposal-${proposal.clientName || 'Draft'}-${Date.now()}.pdf`
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9\-_.]/g, '');

    // Convert Node.js Buffer to Uint8Array for the Web Response API
    const uint8 = new Uint8Array(buffer);

    return new Response(uint8, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': uint8.byteLength.toString(),
      },
    });
  } catch (err) {
    console.error('[POST /api/pdf]', err);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
