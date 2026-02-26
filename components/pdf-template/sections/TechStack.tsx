import { Page, View, Text } from '@react-pdf/renderer';
import { PageHeader } from '../shared/PageHeader';
import { PageFooter } from '../shared/PageFooter';
import { Watermark } from '../shared/Watermark';
import type { TechStackData } from '@/types/proposal';

export function TechStack({ data }: { data: TechStackData }) {
  const included = data.items.filter((i) => i.checked);
  const categories = [...new Set(included.map((i) => i.category))];

  return (
    <Page size="A4" style={{ padding: 40, paddingBottom: 60, fontFamily: 'Helvetica' }}>
      <Watermark />
      <PageHeader />

      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0B1220', marginBottom: 4 }}>
        Proposed Tech Stack
      </Text>
      <View style={{ width: 40, height: 3, backgroundColor: '#E85D2B', marginBottom: 20 }} />

      {/* Table header */}
      <View style={{ flexDirection: 'row', backgroundColor: '#0B1220', padding: '6 8', borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
        <Text style={{ flex: 1, color: 'white', fontSize: 8, fontWeight: 'bold' }}>CATEGORY</Text>
        <Text style={{ flex: 2, color: 'white', fontSize: 8, fontWeight: 'bold' }}>TECHNOLOGY</Text>
      </View>

      {categories.map((cat, ci) => {
        const items = included.filter((i) => i.category === cat);
        return items.map((item, ii) => (
          <View
            key={`${cat}-${ii}`}
            style={{
              flexDirection: 'row',
              padding: '6 8',
              backgroundColor: (ci + ii) % 2 === 0 ? '#F9FAFB' : 'white',
              borderBottom: '1px solid #E5E7EB',
            }}
          >
            <Text style={{ flex: 1, fontSize: 9, color: '#666' }}>{ii === 0 ? cat : ''}</Text>
            <Text style={{ flex: 2, fontSize: 9, color: '#111' }}>{item.technology}</Text>
          </View>
        ));
      })}

      <PageFooter />
    </Page>
  );
}
