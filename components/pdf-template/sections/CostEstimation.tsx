import { Page, View, Text } from '@react-pdf/renderer';
import { PageHeader } from '../shared/PageHeader';
import { PageFooter } from '../shared/PageFooter';
import { Watermark } from '../shared/Watermark';
import type { CostEstimationData } from '@/types/proposal';

export function CostEstimation({ data }: { data: CostEstimationData }) {
  return (
    <Page size="A4" style={{ padding: 40, paddingBottom: 60, fontFamily: 'Helvetica' }}>
      <Watermark />
      <PageHeader />

      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0B1220', marginBottom: 4 }}>
        Cost & Estimation
      </Text>
      <View style={{ width: 40, height: 3, backgroundColor: '#E85D2B', marginBottom: 20 }} />

      {/* Line items table header — 3 columns */}
      <View style={{ flexDirection: 'row', backgroundColor: '#0B1220', padding: '6 8' }}>
        <Text style={{ flex: 3, color: 'white', fontSize: 8, fontWeight: 'bold' }}>PRODUCT</Text>
        <Text style={{ flex: 1.2, color: 'white', fontSize: 8, fontWeight: 'bold', textAlign: 'right' }}>EST. TIME</Text>
        <Text style={{ flex: 1.5, color: 'white', fontSize: 8, fontWeight: 'bold', textAlign: 'right' }}>EST. COST</Text>
      </View>

      {data.lineItems.map((item, i) => (
        <View
          key={i}
          wrap={false}
          style={{
            flexDirection: 'row',
            padding: '6 8',
            backgroundColor: i % 2 === 0 ? '#F9FAFB' : 'white',
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <Text style={{ flex: 3, fontSize: 9, color: '#111' }}>{item.product}</Text>
          <Text style={{ flex: 1.2, fontSize: 9, color: '#555', textAlign: 'right' }}>{item.estimatedTime}</Text>
          <Text style={{ flex: 1.5, fontSize: 9, color: '#111', textAlign: 'right', fontWeight: 'bold' }}>
            {item.estimatedCost}
          </Text>
        </View>
      ))}

      {/* Total footer */}
      <View style={{ marginTop: 12, paddingTop: 8, borderTop: '2px solid #E85D2B' }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            backgroundColor: '#0B1220',
            padding: '6 8',
            borderRadius: 4,
          }}
        >
          <Text style={{ fontSize: 11, color: 'white', fontWeight: 'bold', textAlign: 'right' }}>
            Total Estimated Cost:{' '}
          </Text>
          <Text style={{ fontSize: 11, color: '#E85D2B', fontWeight: 'bold', textAlign: 'right' }}>
            ₹{data.totalProjectCost} + {data.gst}% GST
          </Text>
        </View>
      </View>

      {/* Terms */}
      <View style={{ marginTop: 20, backgroundColor: '#F9FAFB', padding: 12, borderRadius: 4, borderLeft: '3px solid #E85D2B' }}>
        <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#0B1220', marginBottom: 4 }}>Payment Terms</Text>
        <Text style={{ fontSize: 9, color: '#555' }}>{data.paymentTerms}</Text>
        <Text style={{ fontSize: 8, color: '#888', marginTop: 4 }}>
          This quote is valid for {data.validityDays} days from the date of issue.
        </Text>
      </View>

      <PageFooter />
    </Page>
  );
}
