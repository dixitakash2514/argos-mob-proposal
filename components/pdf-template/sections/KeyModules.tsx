import { Page, View, Text } from '@react-pdf/renderer';
import { PageHeader } from '../shared/PageHeader';
import { PageFooter } from '../shared/PageFooter';
import { Watermark } from '../shared/Watermark';
import { renderMarkdownToPdf } from '@/lib/pdf/render-markdown';
import type { KeyModulesData } from '@/types/proposal';

export function KeyModules({ data }: { data: KeyModulesData }) {
  const nodes = renderMarkdownToPdf(data.content || '', '#E85D2B', 9);

  return (
    <Page size="A4" style={{ padding: 40, paddingBottom: 60, fontFamily: 'Helvetica' }}>
      <Watermark />
      <PageHeader />

      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0B1220', marginBottom: 4 }}>
        Key Modules & Features
      </Text>
      <View style={{ width: 40, height: 3, backgroundColor: '#E85D2B', marginBottom: 20 }} />

      {nodes}

      <PageFooter />
    </Page>
  );
}
