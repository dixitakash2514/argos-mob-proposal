import { Page, View, Text } from '@react-pdf/renderer';
import { PageHeader } from '../shared/PageHeader';
import { PageFooter } from '../shared/PageFooter';
import { Watermark } from '../shared/Watermark';
import type { ChangeRequestData } from '@/types/proposal';

export function ChangeRequest({ data }: { data: ChangeRequestData }) {
  return (
    <Page size="A4" style={{ padding: 40, paddingBottom: 60, fontFamily: 'Helvetica' }}>
      <Watermark />
      <PageHeader />

      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0B1220', marginBottom: 4 }}>
        Change Request Process
      </Text>
      <View style={{ width: 40, height: 3, backgroundColor: '#E85D2B', marginBottom: 20 }} />

      {data.process.map((step, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: '#E85D2B',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>{i + 1}</Text>
          </View>
          <Text style={{ fontSize: 10, color: '#444', flex: 1, lineHeight: 1.5, paddingTop: 4 }}>{step}</Text>
        </View>
      ))}

      <View
        style={{
          marginTop: 16,
          backgroundColor: '#FFF7F5',
          padding: 12,
          borderRadius: 4,
          borderLeft: '3px solid #E85D2B',
        }}
      >
        <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#0B1220', marginBottom: 4 }}>Lead Time</Text>
        <Text style={{ fontSize: 9, color: '#555', marginBottom: 8 }}>{data.leadTime}</Text>
        <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#0B1220', marginBottom: 4 }}>Important Note</Text>
        <Text style={{ fontSize: 9, color: '#555' }}>{data.costingNote}</Text>
      </View>

      <PageFooter />
    </Page>
  );
}
