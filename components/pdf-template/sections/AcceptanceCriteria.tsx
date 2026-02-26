import { Page, View, Text } from '@react-pdf/renderer';
import { PageHeader } from '../shared/PageHeader';
import { PageFooter } from '../shared/PageFooter';
import { Watermark } from '../shared/Watermark';
import type { AcceptanceCriteriaData } from '@/types/proposal';

export function AcceptanceCriteria({ data }: { data: AcceptanceCriteriaData }) {
  return (
    <Page size="A4" style={{ padding: 40, paddingBottom: 60, fontFamily: 'Helvetica' }}>
      <Watermark />
      <PageHeader />

      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0B1220', marginBottom: 4 }}>
        Acceptance Criteria
      </Text>
      <View style={{ width: 40, height: 3, backgroundColor: '#E85D2B', marginBottom: 20 }} />

      <Text style={{ fontSize: 10, color: '#555', marginBottom: 16, lineHeight: 1.5 }}>
        {data.introText || 'The project will be considered complete and ready for handover when all of the following criteria are met:'}
      </Text>

      {data.criteria.map((item, i) => (
        <View
          key={i}
          wrap={false}
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 10,
            marginBottom: 10,
            padding: '8 12',
            backgroundColor: i % 2 === 0 ? '#F9FAFB' : 'white',
            borderRadius: 4,
            border: '1px solid #E5E7EB',
          }}
        >
          <View
            style={{
              width: 14,
              height: 14,
              backgroundColor: '#E85D2B',
              borderRadius: 3,
              flexShrink: 0,
              marginTop: 2,
            }}
          />
          <Text style={{ fontSize: 9.5, color: '#333', flex: 1, lineHeight: 1.5 }}>{item}</Text>
        </View>
      ))}

      {data.conclusionText && (
        <Text style={{ fontSize: 10, color: '#555', marginTop: 16, lineHeight: 1.5 }}>
          {data.conclusionText}
        </Text>
      )}

      <PageFooter />
    </Page>
  );
}
