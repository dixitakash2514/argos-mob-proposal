import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  WidthType,
  BorderStyle,
  ShadingType,
  convertInchesToTwip,
} from 'docx';
import type { ProposalState } from '@/types/proposal';

const BRAND_DARK = '0B1220';
const BRAND_ORANGE = 'E85D2B';

function heading(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BRAND_ORANGE, space: 4 } },
  });
}

function subheading(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 22, color: BRAND_DARK })],
    spacing: { before: 200, after: 80 },
  });
}

function bodyParagraph(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 20 })],
    spacing: { after: 120 },
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 20 })],
    bullet: { level: 0 },
    spacing: { after: 60 },
  });
}

function sectionDivider(): Paragraph {
  return new Paragraph({ text: '', spacing: { after: 100 } });
}

function makeTableRow(cells: string[], isHeader = false): TableRow {
  return new TableRow({
    tableHeader: isHeader,
    children: cells.map(
      (text) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text, bold: isHeader, size: isHeader ? 18 : 20, color: isHeader ? 'FFFFFF' : '111111' })],
            }),
          ],
          shading: isHeader ? { fill: BRAND_DARK, type: ShadingType.SOLID, color: BRAND_DARK } : undefined,
          margins: { top: convertInchesToTwip(0.05), bottom: convertInchesToTwip(0.05), left: convertInchesToTwip(0.1), right: convertInchesToTwip(0.1) },
        })
    ),
  });
}

export async function generateWordDocument(proposal: ProposalState): Promise<Buffer> {
  const { sections } = proposal;
  const children: (Paragraph | Table)[] = [];

  // ── Cover Page ──────────────────────────────────────────────────────────────
  children.push(
    new Paragraph({
      children: [new TextRun({ text: 'ArgosMob Tech & AI Pvt. Ltd.', bold: true, size: 32, color: BRAND_ORANGE })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 120 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'SCOPE OF WORK / PROPOSAL', size: 22, color: '888888' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
    }),
    new Paragraph({
      children: [new TextRun({ text: sections.coverPage.data.projectTitle || 'Project Proposal', bold: true, size: 40, color: BRAND_DARK })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Prepared for: ${sections.coverPage.data.clientName || 'Client'}`, size: 24 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Date: ${sections.coverPage.data.date}`, size: 20, color: '555555' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Version: ${sections.coverPage.data.version}`, size: 20, color: '555555' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 },
    }),
    sectionDivider()
  );

  // ── Introduction ────────────────────────────────────────────────────────────
  if (sections.introduction.data.content) {
    children.push(heading('Introduction'));
    sections.introduction.data.content.split('\n\n').forEach((para) => {
      if (para.trim()) children.push(bodyParagraph(para.trim()));
    });
    children.push(sectionDivider());
  }

  // ── Key Modules ─────────────────────────────────────────────────────────────
  if (sections.keyModules.data.content) {
    children.push(heading('Key Modules & Features'));
    const lines = sections.keyModules.data.content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.endsWith(':') && !trimmed.startsWith('•')) {
        children.push(subheading(trimmed.slice(0, -1)));
      } else if (trimmed.startsWith('•')) {
        children.push(bullet(trimmed.slice(1).trim()));
      } else {
        children.push(bodyParagraph(trimmed));
      }
    }
    children.push(sectionDivider());
  }

  // ── Tech Stack ──────────────────────────────────────────────────────────────
  if (sections.techStack.data.items?.length > 0) {
    children.push(heading('Technology Stack'));
    const included = sections.techStack.data.items.filter((i) => i.checked);
    const table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        makeTableRow(['Category', 'Technology'], true),
        ...included.map((item) => makeTableRow([item.category, item.technology])),
      ],
    });
    children.push(table, sectionDivider());
  }

  // ── Delivery Components ─────────────────────────────────────────────────────
  if (sections.deliveryComponents.data.components?.length > 0) {
    children.push(heading('Delivery Components'));
    const table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        makeTableRow(['Deliverable', 'Included'], true),
        ...sections.deliveryComponents.data.components.map((c) =>
          makeTableRow([c.name, c.included ? 'Yes' : 'No'])
        ),
      ],
    });
    children.push(table, sectionDivider());
  }

  // ── Cost Estimation ─────────────────────────────────────────────────────────
  if (sections.costEstimation.data.lineItems?.length > 0) {
    children.push(heading('Cost & Estimation'));
    const costData = sections.costEstimation.data;
    const table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        makeTableRow(['Product', 'Est. Time', 'Est. Cost'], true),
        ...costData.lineItems.map((item) =>
          makeTableRow([item.product, item.estimatedTime, item.estimatedCost])
        ),
      ],
    });
    children.push(table);
    children.push(new Paragraph({
      children: [new TextRun({ text: `Total Estimated Cost: ₹${costData.totalProjectCost} + ${costData.gst}% GST`, bold: true, size: 24, color: BRAND_ORANGE })],
      spacing: { before: 80, after: 80 },
    }));
    children.push(bodyParagraph(`Payment Terms: ${costData.paymentTerms}`));
    children.push(sectionDivider());
  }

  // ── Proposed Team ────────────────────────────────────────────────────────────
  if (sections.proposedTeam.data.members?.length > 0) {
    children.push(heading('Proposed Team'));
    const table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        makeTableRow(['Role', 'Count'], true),
        ...sections.proposedTeam.data.members.map((m) =>
          makeTableRow([m.role, String(m.count)])
        ),
      ],
    });
    children.push(table);
    children.push(sectionDivider());
  }

  // ── AMC ──────────────────────────────────────────────────────────────────────
  children.push(heading('Annual Maintenance Contract (AMC)'));
  children.push(bodyParagraph(`AMC Rate: ${sections.amc.data.percentage}% of project cost per year (${sections.amc.data.period})`));
  children.push(subheading('Inclusions'));
  sections.amc.data.inclusions.forEach((item) => children.push(bullet(item)));
  if (sections.amc.data.note) children.push(bodyParagraph(sections.amc.data.note));
  children.push(sectionDivider());

  // ── SLA ──────────────────────────────────────────────────────────────────────
  children.push(heading('Service Level Agreement'));
  const slaTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      makeTableRow(['Severity', 'Response Time', 'Resolution Time'], true),
      ...sections.sla.data.tiers.map((t) => makeTableRow([t.severity, t.responseTime, t.resolutionTime])),
    ],
  });
  children.push(slaTable);
  if (sections.sla.data.uptime) children.push(bodyParagraph(`Uptime SLA: ${sections.sla.data.uptime}`));
  if (sections.sla.data.maintenanceWindow) children.push(bodyParagraph(`Maintenance Window: ${sections.sla.data.maintenanceWindow}`));
  children.push(sectionDivider());

  // ── Change Request ───────────────────────────────────────────────────────────
  children.push(heading('Change Request Process'));
  sections.changeRequest.data.process.forEach((step, i) => children.push(bullet(`${i + 1}. ${step}`)));
  children.push(bodyParagraph(sections.changeRequest.data.costingNote));
  children.push(sectionDivider());

  // ── Acceptance Criteria ──────────────────────────────────────────────────────
  children.push(heading('Acceptance Criteria'));
  if (sections.acceptanceCriteria.data.introText) {
    children.push(bodyParagraph(sections.acceptanceCriteria.data.introText));
  }
  sections.acceptanceCriteria.data.criteria.forEach((item) => children.push(bullet(item)));
  if (sections.acceptanceCriteria.data.conclusionText) {
    children.push(bodyParagraph(sections.acceptanceCriteria.data.conclusionText));
  }
  children.push(sectionDivider());

  // ── Warranty ─────────────────────────────────────────────────────────────────
  children.push(heading('Warranty'));
  children.push(bodyParagraph(`Warranty Period: ${sections.warranty.data.periodDays} days post-delivery`));
  children.push(subheading('Inclusions'));
  sections.warranty.data.inclusions.forEach((item) => children.push(bullet(item)));
  children.push(subheading('Exclusions'));
  sections.warranty.data.exclusions.forEach((item) => children.push(bullet(item)));
  children.push(sectionDivider());

  // ── Legal & Sign Off ─────────────────────────────────────────────────────────
  children.push(heading('Legal & Sign Off'));
  children.push(bodyParagraph(sections.legalSignOff.data.complianceStatement));
  children.push(sectionDivider());
  children.push(new Paragraph({ children: [new TextRun({ text: 'CLIENT', bold: true, size: 18, color: '888888' })], spacing: { after: 400 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: '___________________________________', size: 20 })], spacing: { after: 40 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: sections.legalSignOff.data.clientSignatureName || 'Authorized Signatory', bold: true, size: 20 })], spacing: { after: 200 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: 'ARGOSMOB TECH & AI PVT. LTD.', bold: true, size: 18, color: '888888' })], spacing: { after: 400 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: '___________________________________', size: 20 })], spacing: { after: 40 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: sections.legalSignOff.data.argosmobSignatureName, bold: true, size: 20 })] }));

  const doc = new Document({
    creator: 'ArgosMob Tech & AI Pvt. Ltd.',
    title: `${sections.coverPage.data.projectTitle || 'Proposal'} — ${sections.coverPage.data.clientName || 'Client'}`,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1.2),
              right: convertInchesToTwip(1.2),
            },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
}
