import { Page, View, Text } from '@react-pdf/renderer';
import { PageHeader } from '../shared/PageHeader';
import { PageFooter } from '../shared/PageFooter';
import { Watermark } from '../shared/Watermark';
import type { IntroductionData } from '@/types/proposal';

const styles = {
  page: { padding: 40, paddingBottom: 60, fontFamily: 'Helvetica', fontSize: 10 },
  sectionTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#0B1220', marginBottom: 4,
  },
  accent: { width: 40, height: 3, backgroundColor: '#E85D2B', marginBottom: 20 },
  body: { fontSize: 10, color: '#444', lineHeight: 1.7 },
};

function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')           // ## headings
    .replace(/\*\*([^*]+)\*\*/g, '$1')     // **bold**
    .replace(/\*([^*]+)\*/g, '$1')         // *italic*
    .replace(/^[-*•]\s+/gm, '• ')          // list items → bullet
    .replace(/^\d+\.\s+/gm, '')            // numbered lists
    .replace(/^>\s+/gm, '')                // blockquotes
    .replace(/`{1,3}[^`\n]*`{1,3}/g, '')  // inline/block code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [link text](url)
    .replace(/---+/g, '')                  // horizontal rules
    .replace(/^\s*\n/gm, '\n')             // collapse blank lines
    .trim();
}

export function Introduction({ data }: { data: IntroductionData }) {
  const cleaned = stripMarkdown(data.content);
  const paragraphs = cleaned.split('\n\n').filter((p) => p.trim().length > 0);

  return (
    <Page size="A4" style={styles.page}>
      <Watermark />
      <PageHeader />

      <Text style={styles.sectionTitle}>Introduction</Text>
      <View style={styles.accent} />

      {paragraphs.length > 0 ? (
        paragraphs.map((para, i) => (
          <Text key={i} style={{ ...styles.body, marginBottom: 12 }}>
            {para.trim()}
          </Text>
        ))
      ) : (
        <Text style={styles.body}>Introduction content will appear here.</Text>
      )}

      <PageFooter />
    </Page>
  );
}
