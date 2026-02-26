import { Page, View, Text } from '@react-pdf/renderer';
import { Watermark } from '../shared/Watermark';
import type { CoverPageData } from '@/types/proposal';

interface Props {
  data: CoverPageData;
}

export function CoverPage({ data }: Props) {
  return (
    <Page
      size="A4"
      style={{ backgroundColor: '#0B1220', padding: 0, fontFamily: 'Helvetica' }}
    >
      <Watermark />

      {/* Top accent bar */}
      <View style={{ height: 6, backgroundColor: '#E85D2B' }} />

      {/* Main content */}
      <View
        style={{
          flex: 1,
          padding: 56,
          justifyContent: 'space-between',
        }}
      >
        {/* Logo area */}
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <View
              style={{
                width: 56,
                height: 56,
                backgroundColor: '#E85D2B',
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>AM</Text>
            </View>
            <View
              style={{
                height: 56,
                backgroundColor: '#E85D2B',
                borderRadius: 8,
                paddingLeft: 16,
                paddingRight: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>ARGOS MOB TECH & AI PVT. LTD.</Text>
            </View>
          </View>
          <Text style={{ color: '#E85D2B', fontSize: 11, letterSpacing: 3, marginBottom: 12 }}>
            SCOPE OF WORK / PROPOSAL
          </Text>
          <Text style={{ color: 'white', fontSize: 36, fontWeight: 'bold', lineHeight: 1.2 }}>
            {data.projectTitle || 'Project Proposal'}
          </Text>
        </View>

        {/* Client info */}
        <View>
          <View style={{ borderLeft: '3px solid #E85D2B', paddingLeft: 16, marginBottom: 40 }}>
            <Text style={{ color: '#999', fontSize: 9, marginBottom: 4 }}>PREPARED FOR</Text>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
              {data.clientName || 'Client'}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 40 }}>
            <View>
              <Text style={{ color: '#999', fontSize: 8, marginBottom: 2 }}>PREPARED BY</Text>
              <Text style={{ color: 'white', fontSize: 10 }}>{data.preparedBy}</Text>
            </View>
            <View>
              <Text style={{ color: '#999', fontSize: 8, marginBottom: 2 }}>DATE</Text>
              <Text style={{ color: 'white', fontSize: 10 }}>{data.date}</Text>
            </View>
            <View>
              <Text style={{ color: '#999', fontSize: 8, marginBottom: 2 }}>VERSION</Text>
              <Text style={{ color: 'white', fontSize: 10 }}>{data.version}</Text>
            </View>
          </View>
        </View>

        {/* Footer line */}
        <View>
          <View style={{ borderTop: '1px solid #333', paddingTop: 16 }}>
            <Text style={{ color: '#555', fontSize: 8 }}>
              Argos Mob Tech & AI Pvt. Ltd. · https://www.argosmob.in/ · This document is confidential.
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom accent bar */}
      <View style={{ height: 4, backgroundColor: '#E85D2B' }} />
    </Page>
  );
}
