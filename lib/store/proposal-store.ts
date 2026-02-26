import { create } from 'zustand';
import { format } from 'date-fns';
import type {
  ProposalState,
  ProposalSections,
  SectionKey,
  ChatMessage,
  CoverPageData,
  IntroductionData,
  KeyModulesData,
  TechStackData,
  DeliveryComponentsData,
  CostEstimationData,
  ProposedTeamData,
  AMCData,
  SLAData,
  ChangeRequestData,
  AcceptanceCriteriaData,
  WarrantyData,
  LegalSignOffData,
} from '@/types/proposal';

// ─── Default section data ──────────────────────────────────────────────────────
function makeDefaultSections(): ProposalSections {
  return {
    coverPage: {
      status: 'pending',
      aiGenerated: false,
      userModified: false,
      data: {
        clientName: '',
        projectTitle: '',
        date: format(new Date(), 'dd MMMM yyyy'),
        preparedBy: 'Team Argos Mob',
        version: '1.0',
      } as CoverPageData,
    },
    introduction: {
      status: 'pending',
      aiGenerated: false,
      userModified: false,
      data: { content: '' } as IntroductionData,
    },
    keyModules: {
      status: 'pending',
      aiGenerated: false,
      userModified: false,
      data: { content: '' } as KeyModulesData,
    },
    techStack: {
      status: 'pending',
      aiGenerated: false,
      userModified: false,
      data: {
        items: [
          { category: 'Frontend', technology: 'React Native', checked: true },
          { category: 'Backend', technology: 'Node.js, Express.js', checked: true },
          { category: 'Database', technology: 'MongoDB / MySQL', checked: true },
          { category: 'Cloud & DevOps', technology: 'AWS / Digital Ocean', checked: true },
          { category: 'Cloud & DevOps', technology: 'CI/CD Integration', checked: true },
          { category: 'Cloud & DevOps', technology: 'NGINX / Apache', checked: true },
          { category: 'Cloud & DevOps', technology: 'SSL Certification', checked: true },
        ],
      } as TechStackData,
    },
    deliveryComponents: {
      status: 'pending',
      aiGenerated: false,
      userModified: false,
      data: {
        components: [
          { name: 'UI/UX Design', included: true },
          { name: 'Android Application', included: true },
          { name: 'iOS Application', included: true },
          { name: 'Admin Panel', included: true },
          { name: 'Backend APIs', included: true },
          { name: 'Database', included: true },
          { name: 'Source Code', included: true },
          { name: 'Deployment Support', included: true },
        ],
      } as DeliveryComponentsData,
    },
    costEstimation: {
      status: 'pending',
      aiGenerated: false,
      userModified: false,
      data: {
        currency: 'INR',
        lineItems: [
          { product: 'App', estimatedTime: '50-60 Days', estimatedCost: '3,50,000' },
          {
            product: 'Google Map API\nPayment gateway\nNotification (Google Firebase)\nHosting Server, MongoDB\nPlay Store Account, App Store Account\nSSL Certificate, Open AI tool\nAny other API, Domain',
            estimatedTime: '',
            estimatedCost: 'Shared By Client',
          },
        ],
        totalProjectCost: '3,50,000',
        gst: 18,
        paymentTerms: '40% Advance, 30% mid-delivery, 20% beta-testing, 10% completion',
        validityDays: 30,
      } as CostEstimationData,
    },
    proposedTeam: {
      status: 'pending',
      aiGenerated: false,
      userModified: false,
      data: {
        members: [
          { role: 'Project Manager', count: 1 },
          { role: 'UI/UX Designer', count: 1 },
          { role: 'Frontend Developer', count: 2 },
          { role: 'Backend Developer', count: 2 },
          { role: 'QA Tester', count: 1 },
          { role: 'DevOps Engineer', count: 1 },
        ],
        totalDuration: 'To be defined',
      } as ProposedTeamData,
    },
    amc: {
      status: 'pending',
      aiGenerated: false,
      userModified: false,
      data: {
        percentage: 20,
        period: 'Annual',
        inclusions: [
          'Performance Monitoring',
          'Security Updates',
          'Minor Enhancements',
          'Technical Support',
          'Server Monitoring',
        ],
        note: 'AMC starts after warranty period.',
      } as AMCData,
    },
    sla: {
      status: 'pending',
      aiGenerated: false,
      userModified: false,
      data: {
        tiers: [
          { severity: 'High', responseTime: '2 Hours', resolutionTime: '5 Business Hours' },
          { severity: 'Medium', responseTime: '2 Hours', resolutionTime: '1 Working Day' },
          { severity: 'Normal', responseTime: '2 Hours', resolutionTime: '2 Working Days' },
        ],
        uptime: '',
        maintenanceWindow: '',
      } as SLAData,
    },
    changeRequest: {
      status: 'pending',
      aiGenerated: false,
      userModified: false,
      data: {
        process: [
          'Client submits a written Change Request (CR) document',
          'ArgosMob reviews and provides impact analysis within 3 business days',
          'Revised timeline and cost estimate presented for client approval',
          'Upon written approval, CR is incorporated into the project scope',
          'Original delivery milestones adjusted accordingly',
        ],
        leadTime: '3 business days for impact analysis',
        costingNote: 'All changes are costed at standard rates and require written sign-off before implementation.',
      } as ChangeRequestData,
    },
    acceptanceCriteria: {
      status: 'pending',
      aiGenerated: false,
      userModified: false,
      data: {
        introText: 'You agree that the app will be deemed to be accepted on whichever is the earliest of:',
        criteria: [
          'You give us written notice of acceptance of the app',
          'The app being submitted to Play Store / App Store',
          'Use of the app by you in the normal course of your business',
        ],
        conclusionText: 'Once the app has been accepted, you agree to pay all outstanding fees for the app, and the warranty period will begin.',
      } as AcceptanceCriteriaData,
    },
    warranty: {
      status: 'pending',
      aiGenerated: false,
      userModified: false,
      data: {
        periodDays: 30,
        inclusions: ['30 Days Warranty for Bug Fixes'],
        exclusions: ['Post-warranty changes will be billed separately'],
      } as WarrantyData,
    },
    legalSignOff: {
      status: 'pending',
      aiGenerated: false,
      userModified: false,
      data: {
        complianceStatement:
          'This proposal is confidential and intended solely for the named recipient. All intellectual property developed under this engagement remains the property of the client upon full payment. ArgosMob Tech & AI Pvt. Ltd. adheres to applicable Indian IT laws and data protection regulations.',
        clientSignatureName: '',
        argosmobSignatureName: 'Authorized Signatory, ArgosMob Tech & AI Pvt. Ltd.',
      } as LegalSignOffData,
    },
  };
}

// ─── Store Shape ───────────────────────────────────────────────────────────────
interface ProposalStoreState {
  proposal: ProposalState | null;
  messages: ChatMessage[];
  isStreaming: boolean;
  isSaving: boolean;
  nextSectionPending: boolean;

  // Actions
  initProposal: (id: string, sessionId: string) => void;
  loadProposal: (data: ProposalState) => void;
  setProposalField: (field: keyof Pick<ProposalState, 'clientName' | 'projectTitle' | 'projectBrief' | 'theme'>, value: string) => void;
  updateSectionData: (key: SectionKey, data: Record<string, unknown>) => void;
  confirmSection: (key: SectionKey) => void;
  setCurrentSection: (key: SectionKey) => void;
  setNextSectionPending: (v: boolean) => void;
  addMessage: (msg: ChatMessage) => void;
  updateLastMessage: (content: string) => void;
  setIsStreaming: (v: boolean) => void;
  setIsSaving: (v: boolean) => void;
  reset: () => void;
}

export const useProposalStore = create<ProposalStoreState>((set) => ({
  proposal: null,
  messages: [],
  isStreaming: false,
  isSaving: false,
  nextSectionPending: false,

  initProposal: (id, sessionId) =>
    set({
      proposal: {
        id,
        sessionId,
        clientName: '',
        projectTitle: '',
        projectBrief: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        currentSection: 'coverPage',
        confirmedSections: [],
        theme: 'default',
        status: 'draft',
        version: 1,
        parentId: null,
        sections: makeDefaultSections(),
      },
    }),

  loadProposal: (data) => set({
    proposal: { ...data, sections: { ...makeDefaultSections(), ...data.sections } },
  }),

  setProposalField: (field, value) =>
    set((state) => {
      if (!state.proposal) return state;
      return { proposal: { ...state.proposal, [field]: value, updatedAt: new Date() } };
    }),

  updateSectionData: (key, data) =>
    set((state) => {
      if (!state.proposal) return state;
      return {
        proposal: {
          ...state.proposal,
          updatedAt: new Date(),
          sections: {
            ...state.proposal.sections,
            [key]: {
              ...state.proposal.sections[key],
              data: { ...state.proposal.sections[key].data, ...data },
              status: 'in_progress' as const,
              userModified: true,
            },
          },
        },
      };
    }),

  confirmSection: (key) =>
    set((state) => {
      if (!state.proposal) return state;
      const confirmedSections = state.proposal.confirmedSections.includes(key)
        ? state.proposal.confirmedSections
        : [...state.proposal.confirmedSections, key];

      const sectionOrder = ['coverPage', 'introduction', 'keyModules', 'techStack', 'deliveryComponents', 'costEstimation', 'proposedTeam', 'amc', 'sla', 'changeRequest', 'acceptanceCriteria', 'warranty', 'legalSignOff'] as SectionKey[];
      const currentIdx = sectionOrder.indexOf(key);
      const nextSection = sectionOrder[currentIdx + 1] ?? key;

      return {
        proposal: {
          ...state.proposal,
          confirmedSections,
          currentSection: nextSection,
          updatedAt: new Date(),
          sections: {
            ...state.proposal.sections,
            [key]: {
              ...state.proposal.sections[key],
              status: 'confirmed' as const,
            },
          },
        },
      };
    }),

  setCurrentSection: (key) =>
    set((state) => {
      if (!state.proposal) return state;
      return { proposal: { ...state.proposal, currentSection: key } };
    }),

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  updateLastMessage: (content) =>
    set((state) => {
      const messages = [...state.messages];
      if (messages.length === 0) return state;
      messages[messages.length - 1] = { ...messages[messages.length - 1], content };
      return { messages };
    }),

  setIsStreaming: (v) => set({ isStreaming: v }),
  setIsSaving: (v) => set({ isSaving: v }),
  setNextSectionPending: (v) => set({ nextSectionPending: v }),
  reset: () => set({ proposal: null, messages: [], isStreaming: false, isSaving: false, nextSectionPending: false }),
}));
