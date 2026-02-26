import mongoose, { Schema, Model } from 'mongoose';
import type { ProposalState, SectionKey } from '@/types/proposal';

const ProposalSchema = new Schema<ProposalState>(
  {
    sessionId: { type: String, required: true, index: true },
    clientName: { type: String, default: '' },
    projectTitle: { type: String, default: '' },
    projectBrief: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'complete'], default: 'draft' },
    currentSection: { type: String, default: 'coverPage' },
    confirmedSections: { type: [String], default: [] },
    theme: { type: String, enum: ['default', 'dark', 'minimal'], default: 'default' },
    sections: { type: Schema.Types.Mixed, default: {} },
    version: { type: Number, default: 1 },
    parentId: { type: Schema.Types.ObjectId, ref: 'Proposal', default: null },
    createdBy: {
      userId: { type: String, default: null },
      email:  { type: String, default: null },
      name:   { type: String, default: null },
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

// Prevent model re-compilation during HMR
const ProposalModel: Model<ProposalState> =
  (mongoose.models.Proposal as Model<ProposalState>) ||
  mongoose.model<ProposalState>('Proposal', ProposalSchema);

export default ProposalModel;
