import { Page, View, Text } from '@react-pdf/renderer';
import { PageHeader } from '../shared/PageHeader';
import { PageFooter } from '../shared/PageFooter';
import { Watermark } from '../shared/Watermark';
import type { DeliveryComponentsData } from '@/types/proposal';

export function DeliveryComponents({ data }: { data: DeliveryComponentsData }) {
  return (
    <Page size="A4" style={{ padding: 40, paddingBottom: 60, fontFamily: 'Helvetica' }}>
      <Watermark />
      <PageHeader />

      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0B1220', marginBottom: 4 }}>
        Delivery Components
      </Text>
      <View style={{ width: 40, height: 3, backgroundColor: '#E85D2B', marginBottom: 20 }} />

      <Text style={{ fontSize: 10, color: '#555', marginBottom: 16, lineHeight: 1.5 }}>
        The following components will be delivered as part of this engagement:
      </Text>

      {/* Table */}
      <View style={{ flexDirection: 'row', backgroundColor: '#0B1220', padding: '6 8' }}>
        <Text style={{ flex: 2, color: 'white', fontSize: 8, fontWeight: 'bold' }}>DELIVERABLE</Text>
        <Text style={{ flex: 1, color: 'white', fontSize: 8, fontWeight: 'bold', textAlign: 'center' }}>INCLUDED</Text>
      </View>

      {data.components.map((comp, i) => (
        <View
          key={comp.name}
          style={{
            flexDirection: 'row',
            padding: '7 8',
            backgroundColor: i % 2 === 0 ? '#F9FAFB' : 'white',
            borderBottom: '1px solid #E5E7EB',
            alignItems: 'center',
          }}
        >
          <Text style={{ flex: 2, fontSize: 9, color: '#111' }}>{comp.name}</Text>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 9, color: comp.included ? '#16A34A' : '#DC2626', fontWeight: 'bold' }}>
              {comp.included ? '✓ Yes' : '✗ No'}
            </Text>
          </View>
        </View>
      ))}

      <PageFooter />
    </Page>
  );
}
