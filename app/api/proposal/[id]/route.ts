import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db/mongoose';
import ProposalModel from '@/lib/db/models/Proposal';
import mongoose from 'mongoose';

const UpdateProposalSchema = z.object({
  clientName: z.string().optional(),
  projectTitle: z.string().optional(),
  projectBrief: z.string().optional(),
  currentSection: z.string().optional(),
  confirmedSections: z.array(z.string()).optional(),
  theme: z.enum(['default', 'dark', 'minimal']).optional(),
  status: z.enum(['draft', 'complete']).optional(),
  sections: z.record(z.string(), z.unknown()).optional(),
});

type Params = { params: Promise<{ id: string }> };

// GET /api/proposal/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    const proposal = await ProposalModel.findById(id);
    if (!proposal) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const obj = proposal.toObject();
    return NextResponse.json({ ...obj, id: proposal._id.toString() });
  } catch (err) {
    console.error(`[GET /api/proposal/${id}]`, err);
    return NextResponse.json({ error: 'Failed to fetch proposal' }, { status: 500 });
  }
}

// PATCH /api/proposal/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await req.json();
    const parsed = UpdateProposalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
    }

    const proposal = await ProposalModel.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true }
    );
    if (!proposal) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const obj = proposal.toObject();
    return NextResponse.json({ ...obj, id: proposal._id.toString() });
  } catch (err) {
    console.error(`[PATCH /api/proposal/${id}]`, err);
    return NextResponse.json({ error: 'Failed to update proposal' }, { status: 500 });
  }
}

// DELETE /api/proposal/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    await ProposalModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`[DELETE /api/proposal/${id}]`, err);
    return NextResponse.json({ error: 'Failed to delete proposal' }, { status: 500 });
  }
}
