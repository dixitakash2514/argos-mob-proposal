import { Document } from '@react-pdf/renderer';
import type { ProposalState } from '@/types/proposal';
import { CoverPage } from './sections/CoverPage';
import { Introduction } from './sections/Introduction';
import { KeyModules } from './sections/KeyModules';
import { TechStack } from './sections/TechStack';
import { DeliveryComponents } from './sections/DeliveryComponents';
import { CostEstimation } from './sections/CostEstimation';
import { ProposedTeam } from './sections/ProposedTeam';
import { AMC } from './sections/AMC';
import { SLA } from './sections/SLA';
import { ChangeRequest } from './sections/ChangeRequest';
import { AcceptanceCriteria } from './sections/AcceptanceCriteria';
import { Warranty } from './sections/Warranty';
import { LegalSignOff } from './sections/LegalSignOff';
import { WhyChooseUs } from './sections/WhyChooseUs';

interface Props {
  proposal: ProposalState;
}

export function ProposalDocument({ proposal }: Props) {
  const { sections, confirmedSections } = proposal;
  const isConfirmed = (key: string) => confirmedSections.includes(key as never);

  return (
    <Document
      title={proposal.projectTitle || 'Proposal'}
      author="ArgosMob Tech & AI Pvt. Ltd."
      creator="ArgosMob Proposal Builder"
      keywords="proposal, argosmob, software development"
    >
      {/* Cover Page — always included */}
      <CoverPage data={sections.coverPage.data} theme={proposal.theme} />

      {/* Why Choose Us — always included */}
      <WhyChooseUs />

      {isConfirmed('introduction') && (
        <Introduction data={sections.introduction.data} />
      )}

      {isConfirmed('keyModules') && (
        <KeyModules data={sections.keyModules.data} />
      )}

      {isConfirmed('techStack') && (
        <TechStack data={sections.techStack.data} />
      )}

      {isConfirmed('deliveryComponents') && (
        <DeliveryComponents data={sections.deliveryComponents.data} />
      )}

      {isConfirmed('costEstimation') && (
        <CostEstimation data={sections.costEstimation.data} />
      )}

      {isConfirmed('proposedTeam') && (
        <ProposedTeam data={sections.proposedTeam.data} />
      )}

      {isConfirmed('amc') && (
        <AMC data={sections.amc.data} />
      )}

      {isConfirmed('sla') && (
        <SLA data={sections.sla.data} />
      )}

      {isConfirmed('changeRequest') && (
        <ChangeRequest data={sections.changeRequest.data} />
      )}

      {isConfirmed('acceptanceCriteria') && (
        <AcceptanceCriteria data={sections.acceptanceCriteria.data} />
      )}

      {isConfirmed('warranty') && (
        <Warranty data={sections.warranty.data} />
      )}

      {isConfirmed('legalSignOff') && (
        <LegalSignOff data={sections.legalSignOff.data} />
      )}
    </Document>
  );
}
