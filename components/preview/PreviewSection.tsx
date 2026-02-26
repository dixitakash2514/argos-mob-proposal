'use client';

import ReactMarkdown from 'react-markdown';
import type {
  SectionKey,
  ProposalSections,
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

export function WhyChooseUsPreview() {
  const strengths = [
    'Industry Expertise — Years of experience across mobile, web, and AI solutions.',
    'End-to-End Delivery — From ideation to deployment, we own the full lifecycle.',
    'Scalable Architecture — Built to grow with your user base.',
    'Business-Oriented Approach — Every decision is driven by business impact.',
    'Transparent Process — Regular updates and clear milestones throughout.',
    'Post-Launch Support — AMC, SLA-backed support, and continuous improvements.',
    'Premium UI/UX Design — User-first interfaces that drive engagement.',
    'Client-Centric Culture — Your success is our success, from day one.',
  ];
  return (
    <div className="mb-4">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#0B1220]">Why Choose Argos Mob Tech & AI Pvt. Ltd.</h3>
        <div className="w-10 h-0.5 bg-[#E85D2B] mt-1 mb-4" />
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {strengths.map((s, i) => (
          <div key={i} className="border-l-2 border-[#E85D2B] pl-2 py-1 bg-gray-50 rounded text-xs text-gray-700">
            {s}
          </div>
        ))}
      </div>
      <div className="bg-[#0B1220] text-white rounded-lg p-4">
        <div className="text-[#E85D2B] text-xs font-bold mb-2">Our Commitment</div>
        <p className="text-xs text-gray-300 leading-relaxed">
          At ArgosMob Tech & AI Pvt. Ltd., we are committed to transforming your ideas into secure, scalable, and
          high-performing digital platforms. We combine technical excellence with a deep understanding of your
          business goals to deliver solutions that create real value.
        </p>
      </div>
    </div>
  );
}

interface Props {
  sectionKey: SectionKey;
  sections: ProposalSections;
  theme?: string;
}

export function PreviewSection({ sectionKey, sections, theme }: Props) {
  const section = sections[sectionKey];

  switch (sectionKey) {
    case 'coverPage':
      return <CoverPreview data={section.data as CoverPageData} theme={theme} />;
    case 'introduction':
      return <IntroPreview data={section.data as IntroductionData} />;
    case 'keyModules':
      return <KeyModulesPreview data={section.data as KeyModulesData} />;
    case 'techStack':
      return <TechStackPreview data={section.data as TechStackData} />;
    case 'deliveryComponents':
      return <DeliveryPreview data={section.data as DeliveryComponentsData} />;
    case 'costEstimation':
      return <CostPreview data={section.data as CostEstimationData} />;
    case 'proposedTeam':
      return <TeamPreview data={section.data as ProposedTeamData} />;
    case 'amc':
      return <AMCPreview data={section.data as AMCData} />;
    case 'sla':
      return <SLAPreview data={section.data as SLAData} />;
    case 'changeRequest':
      return <ChangeRequestPreview data={section.data as ChangeRequestData} />;
    case 'acceptanceCriteria':
      return <AcceptancePreview data={section.data as AcceptanceCriteriaData} />;
    case 'warranty':
      return <WarrantyPreview data={section.data as WarrantyData} />;
    case 'legalSignOff':
      return <LegalPreview data={section.data as LegalSignOffData} />;
    default:
      return null;
  }
}

// ─── Section Previews ─────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-base font-bold text-[#0B1220]">{title}</h3>
      <div className="w-10 h-0.5 bg-[#E85D2B] mt-1" />
    </div>
  );
}

const COVER_STYLES: Record<string, { bg: string; accent: string; subtext: string }> = {
  default:   { bg: '#0B1220', accent: '#E85D2B', subtext: '#9CA3AF' },
  dark:      { bg: '#0B1220', accent: '#E85D2B', subtext: '#9CA3AF' },
  minimal:   { bg: '#1E3A5F', accent: '#E85D2B', subtext: '#93C5FD' },
  lightBlue: { bg: '#1E3A5F', accent: '#E85D2B', subtext: '#93C5FD' },
  darkBlue:  { bg: '#0A1628', accent: '#3B82F6', subtext: '#60A5FA' },
};

function CoverPreview({ data, theme }: { data: CoverPageData; theme?: string }) {
  const styles = COVER_STYLES[theme ?? 'default'] ?? COVER_STYLES.default;
  return (
    <div className="rounded-lg p-6 mb-4 text-white" style={{ backgroundColor: styles.bg }}>
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: styles.accent }}
        >
          <span className="font-bold text-sm text-white">AM</span>
        </div>
        <div
          className="h-10 rounded-md px-4 flex items-center justify-center"
          style={{ backgroundColor: styles.accent }}
        >
          <span className="font-bold text-sm text-white">ARGOS MOB TECH & AI PVT. LTD.</span>
        </div>
      </div>
      <div className="text-xs tracking-widest uppercase mb-2" style={{ color: styles.accent }}>
        Scope of Work / Proposal
      </div>
      <h2 className="text-xl font-bold mb-6">{data.projectTitle || 'Project Title'}</h2>
      <div className="pl-3 mb-6" style={{ borderLeft: `2px solid ${styles.accent}` }}>
        <div className="text-xs mb-1" style={{ color: styles.subtext }}>PREPARED FOR</div>
        <div className="text-lg font-bold">{data.clientName || 'Client Name'}</div>
      </div>
      <div className="flex gap-6 text-xs">
        <div>
          <div style={{ color: styles.subtext }}>PREPARED BY</div>
          <div>{data.preparedBy}</div>
        </div>
        <div>
          <div style={{ color: styles.subtext }}>DATE</div>
          <div>{data.date}</div>
        </div>
        <div>
          <div style={{ color: styles.subtext }}>VERSION</div>
          <div>{data.version}</div>
        </div>
      </div>
    </div>
  );
}

function MarkdownPreview({ content, placeholder }: { content: string; placeholder: string }) {
  if (!content) return <p className="text-xs text-gray-400 italic">{placeholder}</p>;
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="text-base font-bold text-[#0B1220] mt-3 mb-1">{children}</h1>
        ),
        h2: ({ children }) => (
          <div className="bg-[#0B1220] text-white text-xs font-bold px-2 py-1 rounded mb-2 mt-4 first:mt-0 uppercase tracking-wide">
            {children}
          </div>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-bold text-[#0B1220] mt-3 mb-1">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-xs font-bold text-gray-700 mt-2 mb-0.5">{children}</h4>
        ),
        p: ({ children }) => (
          <p className="text-sm text-gray-700 leading-relaxed mb-2">{children}</p>
        ),
        ul: ({ children }) => <ul className="mb-2 space-y-0.5">{children}</ul>,
        ol: ({ children }) => <ol className="mb-2 space-y-0.5 pl-1">{children}</ol>,
        li: ({ children }) => (
          <li className="flex items-start gap-1.5 text-sm text-gray-700">
            <span className="text-[#E85D2B] mt-0.5 flex-shrink-0 font-bold leading-4">•</span>
            <span className="flex-1">{children}</span>
          </li>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-[#0B1220]">{children}</strong>
        ),
        em: ({ children }) => <em className="italic text-gray-600">{children}</em>,
        hr: () => <hr className="my-3 border-gray-200" />,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-[#E85D2B] pl-3 text-sm text-gray-600 italic my-2">
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="bg-gray-100 text-gray-800 text-xs px-1 py-0.5 rounded font-mono">
            {children}
          </code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function IntroPreview({ data }: { data: IntroductionData }) {
  return (
    <div className="mb-4">
      <SectionHeader title="Introduction" />
      <MarkdownPreview content={data.content} placeholder="Introduction will appear here..." />
    </div>
  );
}

function KeyModulesPreview({ data }: { data: KeyModulesData }) {
  return (
    <div className="mb-4">
      <SectionHeader title="Key Modules & Features" />
      <MarkdownPreview content={data.content} placeholder="Key modules & features will appear here..." />
    </div>
  );
}

function TechStackPreview({ data }: { data: TechStackData }) {
  const included = data.items.filter((i) => i.checked);
  const categories = [...new Set(included.map((i) => i.category))];

  return (
    <div className="mb-4">
      <SectionHeader title="Tech Stack" />
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-[#0B1220] text-white">
            <th className="text-left px-2 py-1.5">Category</th>
            <th className="text-left px-2 py-1.5">Technology</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) =>
            included
              .filter((i) => i.category === cat)
              .map((item, ii) => (
                <tr key={`${cat}-${ii}`} className="border-b border-gray-100 odd:bg-gray-50">
                  <td className="px-2 py-1.5 text-gray-500">{ii === 0 ? cat : ''}</td>
                  <td className="px-2 py-1.5 font-medium">{item.technology}</td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function DeliveryPreview({ data }: { data: DeliveryComponentsData }) {
  return (
    <div className="mb-4">
      <SectionHeader title="Delivery Components" />
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-[#0B1220] text-white">
            <th className="text-left px-2 py-1.5">Deliverable</th>
            <th className="text-center px-2 py-1.5">Included</th>
          </tr>
        </thead>
        <tbody>
          {data.components.map((comp, i) => (
            <tr key={comp.name} className="border-b border-gray-100 odd:bg-gray-50">
              <td className="px-2 py-1.5">{comp.name}</td>
              <td className={`px-2 py-1.5 text-center font-bold ${comp.included ? 'text-green-600' : 'text-red-500'}`}>
                {comp.included ? '✓' : '✗'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CostPreview({ data }: { data: CostEstimationData }) {
  return (
    <div className="mb-4">
      <SectionHeader title="Cost & Estimation" />
      <table className="w-full text-xs border-collapse mb-3">
        <thead>
          <tr className="bg-[#0B1220] text-white">
            <th className="text-left px-2 py-1.5">Product</th>
            <th className="text-right px-2 py-1.5">Est. Time</th>
            <th className="text-right px-2 py-1.5">Est. Cost</th>
          </tr>
        </thead>
        <tbody>
          {data.lineItems.map((item, i) => (
            <tr key={i} className="border-b border-gray-100 odd:bg-gray-50">
              <td className="px-2 py-1.5 whitespace-pre-wrap">{item.product}</td>
              <td className="px-2 py-1.5 text-right text-gray-500">{item.estimatedTime}</td>
              <td className="px-2 py-1.5 text-right font-medium">{item.estimatedCost}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="bg-[#0B1220] text-white flex justify-between px-3 py-2 rounded text-sm font-bold">
        <span>Total Estimated Cost</span>
        <span className="text-[#E85D2B]">₹{data.totalProjectCost} + {data.gst}% GST</span>
      </div>
      <p className="text-xs text-gray-500 mt-2">{data.paymentTerms}</p>
    </div>
  );
}

function TeamPreview({ data }: { data: ProposedTeamData }) {
  return (
    <div className="mb-4">
      <SectionHeader title="Proposed Team" />
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-[#0B1220] text-white">
            <th className="text-left px-2 py-1.5">Role</th>
            <th className="text-center px-2 py-1.5">Count</th>
          </tr>
        </thead>
        <tbody>
          {data.members.map((m, i) => (
            <tr key={i} className="border-b border-gray-100 odd:bg-gray-50">
              <td className="px-2 py-1.5">{m.role}</td>
              <td className="px-2 py-1.5 text-center">{m.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AMCPreview({ data }: { data: AMCData }) {
  return (
    <div className="mb-4">
      <SectionHeader title="Annual Maintenance Contract" />
      <div className="flex gap-3 mb-3">
        <div className="bg-[#0B1220] text-white rounded-lg p-3 flex-1 text-center">
          <div className="text-[#E85D2B] text-2xl font-bold">{data.percentage}%</div>
          <div className="text-gray-400 text-xs">of project cost</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex-1 text-center">
          <div className="text-[#0B1220] text-lg font-bold">{data.period}</div>
          <div className="text-gray-400 text-xs">contract period</div>
        </div>
      </div>
      <div className="space-y-1">
        {data.inclusions.map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
            <span className="text-[#E85D2B] mt-0.5">•</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
      {data.note && (
        <p className="text-xs text-gray-400 italic mt-2">{data.note}</p>
      )}
    </div>
  );
}

function SLAPreview({ data }: { data: SLAData }) {
  return (
    <div className="mb-4">
      <SectionHeader title="Service Level Agreement" />
      <table className="w-full text-xs border-collapse mb-3">
        <thead>
          <tr className="bg-[#0B1220] text-white">
            <th className="text-left px-2 py-1.5">Severity</th>
            <th className="text-center px-2 py-1.5">Response</th>
            <th className="text-center px-2 py-1.5">Resolution</th>
          </tr>
        </thead>
        <tbody>
          {data.tiers.map((tier, i) => (
            <tr key={i} className="border-b border-gray-100 odd:bg-gray-50">
              <td className="px-2 py-1.5 font-medium">{tier.severity}</td>
              <td className="px-2 py-1.5 text-center text-gray-600">{tier.responseTime}</td>
              <td className="px-2 py-1.5 text-center text-gray-600">{tier.resolutionTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {(data.uptime || data.maintenanceWindow) && (
        <div className="flex gap-3 text-xs">
          {data.uptime && (
            <div className="bg-green-50 border border-green-200 rounded px-3 py-2 flex-1">
              <div className="text-gray-500">Uptime</div>
              <div className="font-bold text-green-700 text-sm">{data.uptime}</div>
            </div>
          )}
          {data.maintenanceWindow && (
            <div className="bg-gray-50 border border-gray-200 rounded px-3 py-2 flex-1">
              <div className="text-gray-500">Maintenance</div>
              <div className="font-medium">{data.maintenanceWindow}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChangeRequestPreview({ data }: { data: ChangeRequestData }) {
  return (
    <div className="mb-4">
      <SectionHeader title="Change Request Process" />
      <div className="space-y-2">
        {data.process.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-6 h-6 bg-[#E85D2B] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{i + 1}</span>
            </div>
            <p className="text-xs text-gray-700 pt-1">{step}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs bg-orange-50 border-l-2 border-[#E85D2B] px-3 py-2 rounded">
        {data.costingNote}
      </div>
    </div>
  );
}

function AcceptancePreview({ data }: { data: AcceptanceCriteriaData }) {
  return (
    <div className="mb-4">
      <SectionHeader title="Acceptance Criteria" />
      {data.introText && (
        <p className="text-xs text-gray-600 mb-3">{data.introText}</p>
      )}
      <div className="space-y-1.5">
        {data.criteria.map((item, i) => (
          <div key={i} className="flex items-start gap-2 p-2 bg-gray-50 border border-gray-100 rounded text-xs">
            <span className="text-[#E85D2B] font-bold mt-0.5">✓</span>
            <span className="text-gray-700">{item}</span>
          </div>
        ))}
      </div>
      {data.conclusionText && (
        <p className="text-xs text-gray-600 mt-3 italic">{data.conclusionText}</p>
      )}
    </div>
  );
}

function WarrantyPreview({ data }: { data: WarrantyData }) {
  return (
    <div className="mb-4">
      <SectionHeader title="Warranty" />
      <div className="bg-[#0B1220] text-white rounded-lg p-4 flex items-center gap-4 mb-4">
        <span className="text-[#E85D2B] text-3xl font-bold">{data.periodDays}</span>
        <div>
          <div className="font-bold">Day Warranty</div>
          <div className="text-xs text-gray-400">Post-delivery support</div>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <div className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-t border-b-2 border-green-500">INCLUDED</div>
          {data.inclusions.map((item, i) => (
            <div key={i} className="text-xs text-gray-700 px-2 py-1 bg-green-50/50 border-b border-gray-100">✓ {item}</div>
          ))}
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded-t border-b-2 border-red-500">EXCLUDED</div>
          {data.exclusions.map((item, i) => (
            <div key={i} className="text-xs text-gray-700 px-2 py-1 bg-red-50/50 border-b border-gray-100">✗ {item}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LegalPreview({ data }: { data: LegalSignOffData }) {
  return (
    <div className="mb-4">
      <SectionHeader title="Legal & Sign Off" />
      <div className="text-xs text-gray-700 bg-gray-50 border-l-2 border-[#0B1220] px-3 py-3 rounded mb-6 leading-relaxed">
        {data.complianceStatement}
      </div>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-8">CLIENT</div>
          <div className="border-b-2 border-[#0B1220] mb-1" />
          <div className="text-xs font-bold">{data.clientSignatureName || 'Authorized Signatory'}</div>
        </div>
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-8">ARGOSMOB TECH & AI PVT LTD</div>
          <div className="border-b-2 border-[#E85D2B] mb-1" />
          <div className="text-xs font-bold">{data.argosmobSignatureName}</div>
        </div>
      </div>
    </div>
  );
}
