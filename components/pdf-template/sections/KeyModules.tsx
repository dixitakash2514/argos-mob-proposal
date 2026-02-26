import { Page, View, Text } from '@react-pdf/renderer';
import { PageHeader } from '../shared/PageHeader';
import { PageFooter } from '../shared/PageFooter';
import { Watermark } from '../shared/Watermark';
import type { KeyModulesData } from '@/types/proposal';

export function KeyModules({ data }: { data: KeyModulesData }) {
  return (
    <Page size="A4" style={{ padding: 40, paddingBottom: 60, fontFamily: 'Helvetica' }}>
      <Watermark />
      <PageHeader />

      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0B1220', marginBottom: 4 }}>
        Key Modules & Features
      </Text>
      <View style={{ width: 40, height: 3, backgroundColor: '#E85D2B', marginBottom: 20 }} />

      {data.groups.map((group) => (
        <View key={group.id} style={{ marginBottom: 16 }}>
          <View
            style={{
              backgroundColor: '#0B1220',
              padding: '6 10',
              borderRadius: 4,
              marginBottom: 6,
            }}
          >
            <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>{group.groupName.toUpperCase()}</Text>
          </View>
          <View style={{ paddingLeft: 8 }}>
            {group.features.filter((f) => f.checked).map((feature) => (
              <View
                key={feature.id}
                wrap={false}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 4,
                }}
              >
                <View style={{ width: 6, height: 6, backgroundColor: '#E85D2B', borderRadius: 3, flexShrink: 0 }} />
                <Text style={{ fontSize: 9, color: '#374151' }}>{feature.label}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      {data.customFeatures.filter(Boolean).length > 0 && (
        <View style={{ marginTop: 8 }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#0B1220', marginBottom: 6 }}>
            Additional Features
          </Text>
          {data.customFeatures.filter(Boolean).map((f, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <View style={{ width: 4, height: 4, backgroundColor: '#E85D2B', borderRadius: 2 }} />
              <Text style={{ fontSize: 9, color: '#374151' }}>{f}</Text>
            </View>
          ))}
        </View>
      )}

      <PageFooter />
    </Page>
  );
}
