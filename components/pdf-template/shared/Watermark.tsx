import { View, Text } from '@react-pdf/renderer';

export function Watermark() {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.04,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'rotate(-45deg)',
      }}
      fixed
    >
      <Text style={{ fontSize: 72, color: '#0B1220', fontWeight: 'bold' }}>ArgosMob</Text>
    </View>
  );
}
