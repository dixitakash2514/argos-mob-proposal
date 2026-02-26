import { Page, View, Text } from '@react-pdf/renderer';
import { PageHeader } from '../shared/PageHeader';
import { PageFooter } from '../shared/PageFooter';
import { Watermark } from '../shared/Watermark';
import type { SLAData } from '@/types/proposal';

export function SLA({ data }: { data: SLAData }) {
  return (
    <Page size="A4" style={{ padding: 40, paddingBottom: 60, fontFamily: 'Helvetica' }}>
      <Watermark />
      <PageHeader />

      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0B1220', marginBottom: 4 }}>
        Service Level Agreement (SLA)
      </Text>
      <View style={{ width: 40, height: 3, backgroundColor: '#E85D2B', marginBottom: 20 }} />

      <View style={{ flexDirection: 'row', backgroundColor: '#0B1220', padding: '6 8', marginBottom: 0 }}>
        <Text style={{ flex: 2, color: 'white', fontSize: 8, fontWeight: 'bold' }}>SEVERITY</Text>
        <Text style={{ flex: 1.5, color: 'white', fontSize: 8, fontWeight: 'bold', textAlign: 'center' }}>RESPONSE TIME</Text>
        <Text style={{ flex: 1.5, color: 'white', fontSize: 8, fontWeight: 'bold', textAlign: 'center' }}>RESOLUTION TIME</Text>
      </View>

      {data.tiers.map((tier, i) => (
        <View
          key={i}
          style={{
            flexDirection: 'row',
            padding: '7 8',
            backgroundColor: i % 2 === 0 ? '#F9FAFB' : 'white',
            borderBottom: '1px solid #E5E7EB',
            alignItems: 'center',
          }}
        >
          <Text style={{ flex: 2, fontSize: 9, color: '#111', fontWeight: i === 0 ? 'bold' : 'normal' }}>
            {tier.severity}
          </Text>
          <Text style={{ flex: 1.5, fontSize: 9, color: '#555', textAlign: 'center' }}>{tier.responseTime}</Text>
          <Text style={{ flex: 1.5, fontSize: 9, color: '#555', textAlign: 'center' }}>{tier.resolutionTime}</Text>
        </View>
      ))}

      {(data.uptime || data.maintenanceWindow) && (
        <View style={{ flexDirection: 'row', gap: 16, marginTop: 20 }}>
          {data.uptime && (
            <View style={{ flex: 1, backgroundColor: '#F9FAFB', padding: 12, borderRadius: 6, border: '1px solid #E5E7EB' }}>
              <Text style={{ fontSize: 9, color: '#888', marginBottom: 2 }}>TARGET UPTIME</Text>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#16A34A' }}>{data.uptime}</Text>
            </View>
          )}
          {data.maintenanceWindow && (
            <View style={{ flex: 2, backgroundColor: '#F9FAFB', padding: 12, borderRadius: 6, border: '1px solid #E5E7EB' }}>
              <Text style={{ fontSize: 9, color: '#888', marginBottom: 2 }}>MAINTENANCE WINDOW</Text>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#0B1220' }}>{data.maintenanceWindow}</Text>
            </View>
          )}
        </View>
      )}

      <PageFooter />
    </Page>
  );
}
