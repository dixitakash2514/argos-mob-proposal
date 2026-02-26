import { Page, View, Text } from '@react-pdf/renderer';
import { PageHeader } from '../shared/PageHeader';
import { PageFooter } from '../shared/PageFooter';
import { Watermark } from '../shared/Watermark';
import type { LegalSignOffData } from '@/types/proposal';

export function LegalSignOff({ data }: { data: LegalSignOffData }) {
  return (
    <Page size="A4" style={{ padding: 40, paddingBottom: 60, fontFamily: 'Helvetica' }}>
      <Watermark />
      <PageHeader />

      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0B1220', marginBottom: 4 }}>
        Legal & Sign Off
      </Text>
      <View style={{ width: 40, height: 3, backgroundColor: '#E85D2B', marginBottom: 20 }} />

      {/* Compliance statement */}
      <View
        style={{
          backgroundColor: '#F9FAFB',
          padding: 16,
          borderRadius: 6,
          borderLeft: '3px solid #0B1220',
          marginBottom: 32,
        }}
      >
        <Text style={{ fontSize: 9.5, color: '#444', lineHeight: 1.7 }}>
          {data.complianceStatement}
        </Text>
      </View>

      {/* Signature blocks */}
      <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#0B1220', marginBottom: 16 }}>
        Agreement & Authorization
      </Text>

      <View style={{ flexDirection: 'row', gap: 24 }}>
        {/* Client signature */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 8, color: '#888', marginBottom: 48 }}>CLIENT</Text>
          <View style={{ borderBottom: '1.5px solid #0B1220', marginBottom: 6 }} />
          <Text style={{ fontSize: 9, color: '#111', fontWeight: 'bold' }}>
            {data.clientSignatureName || 'Authorized Signatory'}
          </Text>
          <Text style={{ fontSize: 8, color: '#888', marginTop: 2 }}>Signature & Date</Text>
        </View>

        {/* ArgosMob signature */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 8, color: '#888', marginBottom: 48 }}>ARGOSMOB TECH & AI PVT LTD</Text>
          <View style={{ borderBottom: '1.5px solid #E85D2B', marginBottom: 6 }} />
          <Text style={{ fontSize: 9, color: '#111', fontWeight: 'bold' }}>
            {data.argosmobSignatureName}
          </Text>
          <Text style={{ fontSize: 8, color: '#888', marginTop: 2 }}>Signature & Date</Text>
        </View>
      </View>

      {/* ArgosMob branding footer */}
      <View
        style={{
          marginTop: 40,
          borderTop: '2px solid #E85D2B',
          paddingTop: 16,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0B1220', marginBottom: 4 }}>
          ArgosMob Tech & AI Pvt. Ltd.
        </Text>
        <Text style={{ fontSize: 9, color: '#888' }}>https://www.argosmob.in/</Text>
        <Text style={{ fontSize: 8, color: '#AAA', marginTop: 4 }}>
          Delivering high-velocity, enterprise-grade digital solutions
        </Text>
      </View>

      <PageFooter />
    </Page>
  );
}
