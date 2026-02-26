import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth, currentUser } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db/mongoose';
import ProposalModel from '@/lib/db/models/Proposal';
import { v4 as uuidv4 } from 'uuid';

const CreateProposalSchema = z.object({
  sessionId: z.string().optional(),
  clientName: z.string().optional(),
  projectTitle: z.string().optional(),
  projectBrief: z.string().optional(),
});

// POST /api/proposal — create new proposal
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = CreateProposalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { userId } = await auth();
    const user = userId ? await currentUser() : null;

    const sessionId = parsed.data.sessionId ?? uuidv4();
    const proposal = await ProposalModel.create({
      sessionId,
      clientName: parsed.data.clientName ?? '',
      projectTitle: parsed.data.projectTitle ?? '',
      projectBrief: parsed.data.projectBrief ?? '',
      status: 'draft',
      currentSection: 'coverPage',
      confirmedSections: [],
      theme: 'default',
      sections: {},
      createdBy: {
        userId: userId ?? null,
        email: user?.emailAddresses[0]?.emailAddress ?? null,
        name: user?.fullName ?? null,
      },
    });

    return NextResponse.json({ id: proposal._id.toString(), sessionId }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/proposal]', err);
    return NextResponse.json({ error: 'Failed to create proposal' }, { status: 500 });
  }
}

// GET /api/proposal — list proposals (recent 20)
export async function GET() {
  try {
    await connectDB();
    const proposals = await ProposalModel.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .select('_id sessionId clientName projectTitle status createdAt updatedAt version parentId');

    return NextResponse.json({ proposals: proposals.map((p) => ({ ...p.toObject(), id: p._id.toString() })) });
  } catch (err) {
    console.error('[GET /api/proposal]', err);
    return NextResponse.json({ error: 'Failed to list proposals' }, { status: 500 });
  }
}
