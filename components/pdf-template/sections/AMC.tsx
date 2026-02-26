import { Page, View, Text } from '@react-pdf/renderer';
import { PageHeader } from '../shared/PageHeader';
import { PageFooter } from '../shared/PageFooter';
import { Watermark } from '../shared/Watermark';
import type { AMCData } from '@/types/proposal';

export function AMC({ data }: { data: AMCData }) {
  return (
    <Page size="A4" style={{ padding: 40, paddingBottom: 60, fontFamily: 'Helvetica' }}>
      <Watermark />
      <PageHeader />

      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0B1220', marginBottom: 4 }}>
        Annual Maintenance Contract (AMC)
      </Text>
      <View style={{ width: 40, height: 3, backgroundColor: '#E85D2B', marginBottom: 20 }} />

      <View
        style={{
          flexDirection: 'row',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: '#0B1220',
            borderRadius: 8,
            padding: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#E85D2B', fontSize: 28, fontWeight: 'bold' }}>{data.percentage}%</Text>
          <Text style={{ color: '#999', fontSize: 8, marginTop: 4 }}>OF PROJECT COST</Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: '#F9FAFB',
            borderRadius: 8,
            padding: 16,
            alignItems: 'center',
            border: '1px solid #E5E7EB',
          }}
        >
          <Text style={{ color: '#0B1220', fontSize: 20, fontWeight: 'bold' }}>{data.period}</Text>
          <Text style={{ color: '#888', fontSize: 8, marginTop: 4 }}>CONTRACT PERIOD</Text>
        </View>
      </View>

      <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#0B1220', marginBottom: 10 }}>
        What's Included
      </Text>
      {data.inclusions.map((item, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
          <View style={{ width: 6, height: 6, backgroundColor: '#E85D2B', borderRadius: 3, marginTop: 3 }} />
          <Text style={{ fontSize: 10, color: '#444', flex: 1 }}>{item}</Text>
        </View>
      ))}

      {data.note && (
        <Text style={{ fontSize: 8, color: '#888', marginTop: 8, fontStyle: 'italic' }}>{data.note}</Text>
      )}

      <PageFooter />
    </Page>
  );
}
