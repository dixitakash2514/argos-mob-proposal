import { NextRequest, NextResponse } from 'next/server';
import { generateWordDocument } from '@/lib/word/generate-word';
import type { ProposalState } from '@/types/proposal';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const proposalData: ProposalState = body.proposalData;

    if (!proposalData) {
      return NextResponse.json({ error: 'Missing proposalData' }, { status: 400 });
    }

    const buffer = await generateWordDocument(proposalData);
    const uint8 = new Uint8Array(buffer);

    const clientName = proposalData.clientName || 'Draft';
    const filename = `ArgosMob-Proposal-${clientName}.docx`.replace(/\s+/g, '-');

    return new Response(uint8, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': uint8.byteLength.toString(),
      },
    });
  } catch (err) {
    console.error('Word generation error:', err);
    return NextResponse.json({ error: 'Failed to generate Word document', message: String(err) }, { status: 500 });
  }
}
