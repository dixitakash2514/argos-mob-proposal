// ─── Section Keys & Status ────────────────────────────────────────────────────
export type SectionKey =
  | 'coverPage'
  | 'introduction'
  | 'keyModules'
  | 'techStack'
  | 'deliveryComponents'
  | 'costEstimation'
  | 'proposedTeam'
  | 'amc'
  | 'sla'
  | 'changeRequest'
  | 'acceptanceCriteria'
  | 'warranty'
  | 'legalSignOff';

export type SectionStatus = 'pending' | 'in_progress' | 'confirmed' | 'skipped';
export type SectionType = 'static' | 'semi_dynamic' | 'dynamic';

export interface SectionMeta {
  key: SectionKey;
  title: string;
  type: SectionType;
  order: number;
}

export const SECTION_ORDER: SectionMeta[] = [
  { key: 'coverPage', title: 'Cover Page', type: 'semi_dynamic', order: 1 },
  { key: 'introduction', title: 'Introduction', type: 'dynamic', order: 2 },
  { key: 'keyModules', title: 'Key Modules', type: 'dynamic', order: 3 },
  { key: 'techStack', title: 'Tech Stack', type: 'semi_dynamic', order: 4 },
  { key: 'deliveryComponents', title: 'Delivery Components', type: 'semi_dynamic', order: 5 },
  { key: 'costEstimation', title: 'Cost & Estimation', type: 'dynamic', order: 6 },
  { key: 'proposedTeam', title: 'Proposed Team', type: 'semi_dynamic', order: 7 },
  { key: 'amc', title: 'AMC', type: 'static', order: 8 },
  { key: 'sla', title: 'SLA', type: 'static', order: 9 },
  { key: 'changeRequest', title: 'Change Request', type: 'static', order: 10 },
  { key: 'acceptanceCriteria', title: 'Acceptance Criteria', type: 'static', order: 11 },
  { key: 'warranty', title: 'Warranty', type: 'static', order: 12 },
  { key: 'legalSignOff', title: 'Legal & Sign Off', type: 'static', order: 13 },
];

// ─── Section Data Types ────────────────────────────────────────────────────────
export interface CoverPageData {
  clientName: string;
  projectTitle: string;
  date: string;
  preparedBy: string;
  version: string;
}

export interface IntroductionData {
  content: string;
}

export interface KeyModuleFeature {
  id: string;
  label: string;
  checked: boolean;
}

export interface KeyModuleGroup {
  id: string;
  groupName: string;
  features: KeyModuleFeature[];
}

export interface KeyModulesData {
  groups: KeyModuleGroup[];
  customFeatures: string[];
}

export interface TechStackItem {
  category: string;
  technology: string;
  checked: boolean;
}

export interface TechStackData {
  items: TechStackItem[];
}

export interface DeliveryComponentItem {
  name: string;
  included: boolean;
}

export interface DeliveryComponentsData {
  components: DeliveryComponentItem[];
}

export interface CostLineItem {
  product: string;
  estimatedTime: string;
  estimatedCost: string;
}

export interface CostEstimationData {
  currency: string;
  lineItems: CostLineItem[];
  totalProjectCost: string;
  gst: number;
  paymentTerms: string;
  validityDays: number;
}

export interface TeamMember {
  role: string;
  count: number;
}

export interface ProposedTeamData {
  members: TeamMember[];
  totalDuration: string;
}

export interface AMCData {
  percentage: number;
  period: string;
  inclusions: string[];
  note?: string;
}

export interface SLATier {
  severity: string;
  responseTime: string;
  resolutionTime: string;
}

export interface SLAData {
  tiers: SLATier[];
  uptime: string;
  maintenanceWindow: string;
}

export interface ChangeRequestData {
  process: string[];
  leadTime: string;
  costingNote: string;
}

export interface AcceptanceCriteriaData {
  introText?: string;
  criteria: string[];
  conclusionText?: string;
}

export interface WarrantyData {
  periodDays: number;
  inclusions: string[];
  exclusions: string[];
}

export interface LegalSignOffData {
  complianceStatement: string;
  clientSignatureName: string;
  argosmobSignatureName: string;
}

// ─── Generic Section Wrapper ───────────────────────────────────────────────────
export interface ProposalSection<T = Record<string, unknown>> {
  status: SectionStatus;
  data: T;
  aiGenerated: boolean;
  userModified: boolean;
}

// ─── Full Proposal State ───────────────────────────────────────────────────────
export interface ProposalSections {
  coverPage: ProposalSection<CoverPageData>;
  introduction: ProposalSection<IntroductionData>;
  keyModules: ProposalSection<KeyModulesData>;
  techStack: ProposalSection<TechStackData>;
  deliveryComponents: ProposalSection<DeliveryComponentsData>;
  costEstimation: ProposalSection<CostEstimationData>;
  proposedTeam: ProposalSection<ProposedTeamData>;
  amc: ProposalSection<AMCData>;
  sla: ProposalSection<SLAData>;
  changeRequest: ProposalSection<ChangeRequestData>;
  acceptanceCriteria: ProposalSection<AcceptanceCriteriaData>;
  warranty: ProposalSection<WarrantyData>;
  legalSignOff: ProposalSection<LegalSignOffData>;
}

export interface ProposalState {
  id: string;
  sessionId: string;
  clientName: string;
  projectTitle: string;
  projectBrief: string;
  createdAt: Date;
  updatedAt: Date;
  currentSection: SectionKey;
  confirmedSections: SectionKey[];
  theme: 'default' | 'dark' | 'minimal';
  status: 'draft' | 'complete';
  sections: ProposalSections;
  version?: number;
  parentId?: string | null;
  createdBy?: {
    userId: string | null;
    email: string | null;
    name: string | null;
  } | null;
}

// ─── Chat Message ──────────────────────────────────────────────────────────────
export type MessageRole = 'assistant' | 'user';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  sectionKey?: SectionKey;
  choices?: ChoiceGroup[];
}

export interface ChoiceGroup {
  groupLabel: string;
  items: ChoiceItem[];
}

export interface ChoiceItem {
  id: string;
  label: string;
  checked: boolean;
}

// ─── API Payloads ──────────────────────────────────────────────────────────────
export interface ChatRequestPayload {
  proposalId: string;
  sectionKey: SectionKey;
  userMessage: string;
  proposalContext: Partial<ProposalState>;
}

export interface PDFRequestPayload {
  proposalId: string;
  proposalData: ProposalState;
}
