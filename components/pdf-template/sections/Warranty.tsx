import { Page, View, Text } from '@react-pdf/renderer';
import { PageHeader } from '../shared/PageHeader';
import { PageFooter } from '../shared/PageFooter';
import { Watermark } from '../shared/Watermark';
import type { WarrantyData } from '@/types/proposal';

export function Warranty({ data }: { data: WarrantyData }) {
  return (
    <Page size="A4" style={{ padding: 40, paddingBottom: 60, fontFamily: 'Helvetica' }}>
      <Watermark />
      <PageHeader />

      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0B1220', marginBottom: 4 }}>
        Warranty
      </Text>
      <View style={{ width: 40, height: 3, backgroundColor: '#E85D2B', marginBottom: 20 }} />

      {/* Warranty period badge */}
      <View
        style={{
          backgroundColor: '#0B1220',
          borderRadius: 8,
          padding: '16 24',
          marginBottom: 24,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <Text style={{ color: '#E85D2B', fontSize: 36, fontWeight: 'bold' }}>{data.periodDays}</Text>
        <View>
          <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>Day Warranty</Text>
          <Text style={{ color: '#888', fontSize: 9 }}>Post-delivery support included</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 16 }}>
        {/* Inclusions */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: '#ECFDF5',
              padding: '6 10',
              borderTopLeftRadius: 4, borderTopRightRadius: 4,
              borderBottom: '2px solid #16A34A',
            }}
          >
            <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#15803D' }}>INCLUDED</Text>
          </View>
          {data.inclusions.map((item, i) => (
            <View
              key={i}
              wrap={false}
              style={{
                flexDirection: 'row',
                gap: 6,
                padding: '5 8',
                backgroundColor: i % 2 === 0 ? '#F0FDF4' : 'white',
                borderBottom: '1px solid #E5E7EB',
              }}
            >
              <View style={{ width: 8, height: 8, backgroundColor: '#16A34A', borderRadius: 4, marginTop: 1 }} />
              <Text style={{ fontSize: 9, color: '#333', flex: 1 }}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Exclusions */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: '#FEF2F2',
              padding: '6 10',
              borderTopLeftRadius: 4, borderTopRightRadius: 4,
              borderBottom: '2px solid #DC2626',
            }}
          >
            <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#B91C1C' }}>EXCLUDED</Text>
          </View>
          {data.exclusions.map((item, i) => (
            <View
              key={i}
              wrap={false}
              style={{
                flexDirection: 'row',
                gap: 6,
                padding: '5 8',
                backgroundColor: i % 2 === 0 ? '#FFF5F5' : 'white',
                borderBottom: '1px solid #E5E7EB',
              }}
            >
              <View style={{ width: 8, height: 8, backgroundColor: '#DC2626', borderRadius: 4, marginTop: 1 }} />
              <Text style={{ fontSize: 9, color: '#333', flex: 1 }}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      <PageFooter />
    </Page>
  );
}
