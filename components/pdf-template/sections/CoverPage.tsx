import { Page, View, Text } from '@react-pdf/renderer';
import { Watermark } from '../shared/Watermark';
import type { CoverPageData } from '@/types/proposal';

const COVER_STYLES: Record<string, { bg: string; accent: string; subtext: string }> = {
  default:   { bg: '#0B1220', accent: '#E85D2B', subtext: '#9CA3AF' },
  dark:      { bg: '#0B1220', accent: '#E85D2B', subtext: '#9CA3AF' },
  minimal:   { bg: '#1E3A5F', accent: '#E85D2B', subtext: '#93C5FD' },
  lightBlue: { bg: '#1E3A5F', accent: '#E85D2B', subtext: '#93C5FD' },
  darkBlue:  { bg: '#0A1628', accent: '#3B82F6', subtext: '#60A5FA' },
};

interface Props {
  data: CoverPageData;
  theme?: string;
}

export function CoverPage({ data, theme }: Props) {
  const styles = COVER_STYLES[theme ?? 'default'] ?? COVER_STYLES.default;
  return (
    <Page
      size="A4"
      style={{ backgroundColor: styles.bg, padding: 0, fontFamily: 'Helvetica' }}
    >
      <Watermark />

      {/* Top accent bar */}
      <View style={{ height: 6, backgroundColor: styles.accent }} />

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
                backgroundColor: styles.accent,
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
                backgroundColor: styles.accent,
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
          <Text style={{ color: styles.accent, fontSize: 11, letterSpacing: 3, marginBottom: 12 }}>
            SCOPE OF WORK / PROPOSAL
          </Text>
          <Text style={{ color: 'white', fontSize: 36, fontWeight: 'bold', lineHeight: 1.2 }}>
            {data.projectTitle || 'Project Proposal'}
          </Text>
        </View>

        {/* Client info */}
        <View>
          <View style={{ borderLeft: `3px solid ${styles.accent}`, paddingLeft: 16, marginBottom: 40 }}>
            <Text style={{ color: styles.subtext, fontSize: 9, marginBottom: 4 }}>PREPARED FOR</Text>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
              {data.clientName || 'Client'}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 40 }}>
            <View>
              <Text style={{ color: styles.subtext, fontSize: 8, marginBottom: 2 }}>PREPARED BY</Text>
              <Text style={{ color: 'white', fontSize: 10 }}>{data.preparedBy}</Text>
            </View>
            <View>
              <Text style={{ color: styles.subtext, fontSize: 8, marginBottom: 2 }}>DATE</Text>
              <Text style={{ color: 'white', fontSize: 10 }}>{data.date}</Text>
            </View>
            <View>
              <Text style={{ color: styles.subtext, fontSize: 8, marginBottom: 2 }}>VERSION</Text>
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
      <View style={{ height: 4, backgroundColor: styles.accent }} />
    </Page>
  );
}
