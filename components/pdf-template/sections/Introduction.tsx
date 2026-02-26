import { Page, View, Text } from '@react-pdf/renderer';
import { PageHeader } from '../shared/PageHeader';
import { PageFooter } from '../shared/PageFooter';
import { Watermark } from '../shared/Watermark';
import { renderMarkdownToPdf } from '@/lib/pdf/render-markdown';
import type { IntroductionData } from '@/types/proposal';

export function Introduction({ data }: { data: IntroductionData }) {
  const nodes = renderMarkdownToPdf(data.content || '', '#E85D2B', 10);

  return (
    <Page size="A4" style={{ padding: 40, paddingBottom: 60, fontFamily: 'Helvetica', fontSize: 10 }}>
      <Watermark />
      <PageHeader />

      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0B1220', marginBottom: 4 }}>
        Introduction
      </Text>
      <View style={{ width: 40, height: 3, backgroundColor: '#E85D2B', marginBottom: 20 }} />

      {nodes.length > 0 ? (
        nodes
      ) : (
        <Text style={{ fontSize: 10, color: '#444', lineHeight: 1.7 }}>
          Introduction content will appear here.
        </Text>
      )}

      <PageFooter />
    </Page>
  );
}
