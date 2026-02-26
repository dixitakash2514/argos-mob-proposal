import { Page, View, Text } from '@react-pdf/renderer';
import { PageHeader } from '../shared/PageHeader';
import { PageFooter } from '../shared/PageFooter';
import { Watermark } from '../shared/Watermark';
import type { ProposedTeamData } from '@/types/proposal';

export function ProposedTeam({ data }: { data: ProposedTeamData }) {
  return (
    <Page size="A4" style={{ padding: 40, paddingBottom: 60, fontFamily: 'Helvetica' }}>
      <Watermark />
      <PageHeader />

      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0B1220', marginBottom: 4 }}>
        Proposed Team
      </Text>
      <View style={{ width: 40, height: 3, backgroundColor: '#E85D2B', marginBottom: 20 }} />

      <View style={{ flexDirection: 'row', backgroundColor: '#0B1220', padding: '6 8' }}>
        <Text style={{ flex: 3, color: 'white', fontSize: 8, fontWeight: 'bold' }}>ROLE</Text>
        <Text style={{ flex: 1, color: 'white', fontSize: 8, fontWeight: 'bold', textAlign: 'center' }}>COUNT</Text>
      </View>

      {data.members.map((member, i) => (
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
          <Text style={{ flex: 3, fontSize: 9, color: '#111' }}>{member.role}</Text>
          <Text style={{ flex: 1, fontSize: 9, color: '#555', textAlign: 'center' }}>{member.count}</Text>
        </View>
      ))}

      <PageFooter />
    </Page>
  );
}
