import { View, Text } from '@react-pdf/renderer';

export function PageFooter() {
  return (
    <View
      fixed
      style={{
        position: 'absolute',
        bottom: 24,
        left: 40,
        right: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid #E5E7EB',
        paddingTop: 6,
      }}
    >
      <Text style={{ fontSize: 7, color: '#999' }}>
        Argos Mob Tech & AI Pvt. Ltd. · https://www.argosmob.in/
      </Text>
      <Text
        style={{ fontSize: 7, color: '#999' }}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
      />
    </View>
  );
}
