import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import ProposalModel from '@/lib/db/models/Proposal';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import type { SectionKey } from '@/types/proposal';

type Params = { params: Promise<{ id: string }> };

// POST /api/proposal/[id]/revise — fork a proposal into a new versioned draft
export async function POST(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const parent = await ProposalModel.findById(id);
    if (!parent) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    const parentObj = parent.toObject();
    const newVersion = (parentObj.version ?? 1) + 1;

    // Deep-copy and reset each section
    const sections = JSON.parse(JSON.stringify(parentObj.sections ?? {}));
    for (const key of Object.keys(sections) as SectionKey[]) {
      if (sections[key]) {
        sections[key].status = 'pending';
        sections[key].aiGenerated = false;
        sections[key].userModified = false;
      }
    }

    // Update cover page version string and date for the revision
    if (sections.coverPage?.data) {
      sections.coverPage.data.version = `${newVersion}.0`;
      sections.coverPage.data.date = format(new Date(), 'dd MMMM yyyy');
    }

    const sessionId = uuidv4();
    const revisionDoc = new ProposalModel({
      sessionId,
      clientName: parentObj.clientName ?? '',
      projectTitle: parentObj.projectTitle ?? '',
      projectBrief: parentObj.projectBrief ?? '',
      status: 'draft',
      currentSection: 'coverPage',
      confirmedSections: [],
      theme: parentObj.theme ?? 'default',
      version: newVersion,
      parentId: parent._id.toString(),
      sections,
    });
    await revisionDoc.save();

    return NextResponse.json(
      { id: revisionDoc._id.toString(), sessionId },
      { status: 201 }
    );
  } catch (err) {
    console.error(`[POST /api/proposal/${id}/revise]`, err);
    return NextResponse.json({ error: 'Failed to create revision' }, { status: 500 });
  }
}
