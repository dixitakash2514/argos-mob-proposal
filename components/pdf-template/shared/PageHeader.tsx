import { View, Text, Image } from '@react-pdf/renderer';

export function PageHeader() {
  return (
    <View
      fixed
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 8,
        marginBottom: 16,
        borderBottom: '2px solid #E85D2B',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View
          style={{
            width: 32,
            height: 32,
            backgroundColor: '#0B1220',
            borderRadius: 4,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>AM</Text>
        </View>
        <View>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#0B1220' }}>
            ARGOSMOB TECH & AI PVT LTD
          </Text>
          <Text style={{ fontSize: 7, color: '#666' }}>www.argosmob.in</Text>
        </View>
      </View>
      <Text style={{ fontSize: 8, color: '#999' }}>CONFIDENTIAL</Text>
    </View>
  );
}
