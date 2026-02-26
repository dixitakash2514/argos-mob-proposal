import { Page, View, Text } from '@react-pdf/renderer';
import { PageHeader } from '../shared/PageHeader';
import { PageFooter } from '../shared/PageFooter';
import { Watermark } from '../shared/Watermark';
import type { KeyModulesData } from '@/types/proposal';

export function KeyModules({ data }: { data: KeyModulesData }) {
  const lines = (data.content || '').split('\n');

  return (
    <Page size="A4" style={{ padding: 40, paddingBottom: 60, fontFamily: 'Helvetica' }}>
      <Watermark />
      <PageHeader />

      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0B1220', marginBottom: 4 }}>
        Key Modules & Features
      </Text>
      <View style={{ width: 40, height: 3, backgroundColor: '#E85D2B', marginBottom: 20 }} />

      {lines.map((line, i) => {
        const isGroupHeader = line.trim().endsWith(':') && !line.startsWith('•');
        const isBullet = line.trim().startsWith('•');
        const text = isBullet ? line.trim().slice(1).trim() : line.trim();

        if (!text) return <View key={i} style={{ height: 6 }} />;

        if (isGroupHeader) {
          return (
            <View key={i} style={{ backgroundColor: '#0B1220', padding: '6 10', borderRadius: 4, marginBottom: 6, marginTop: 4 }}>
              <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>{text.toUpperCase()}</Text>
            </View>
          );
        }

        if (isBullet) {
          return (
            <View key={i} wrap={false} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4, paddingLeft: 8 }}>
              <View style={{ width: 6, height: 6, backgroundColor: '#E85D2B', borderRadius: 3, flexShrink: 0 }} />
              <Text style={{ fontSize: 9, color: '#374151' }}>{text}</Text>
            </View>
          );
        }

        return (
          <Text key={i} style={{ fontSize: 9, color: '#374151', marginBottom: 3 }}>{line}</Text>
        );
      })}

      <PageFooter />
    </Page>
  );
}
