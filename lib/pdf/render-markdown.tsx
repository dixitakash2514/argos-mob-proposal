/**
 * Lightweight markdown → react-pdf renderer.
 * Handles: # headings, ## section headers, bullet lists, numbered lists,
 * **bold** inline, blank lines, horizontal rules, plain paragraphs.
 */
import { Text, View } from '@react-pdf/renderer';
import type { Style } from '@react-pdf/types';
import type { ReactNode } from 'react';

// ─── Inline bold parsing ───────────────────────────────────────────────────────
type Seg = { text: string; bold?: boolean };

function parseInline(raw: string): Seg[] {
  // Normalise ***bold italic*** → **bold**, strip *italic*, strip `code`
  const cleaned = raw
    .replace(/\*\*\*([^*]+)\*\*\*/g, '**$1**')
    .replace(/(?<!\*)\*(?!\*)([^*\n]+)(?<!\*)\*(?!\*)/g, '$1')
    .replace(/`([^`\n]+)`/g, '$1');

  const re = /(\*\*[^*\n]+\*\*)/g;
  const segs: Seg[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(cleaned)) !== null) {
    if (m.index > last) segs.push({ text: cleaned.slice(last, m.index) });
    segs.push({ text: m[0].slice(2, -2), bold: true });
    last = m.index + m[0].length;
  }
  if (last < cleaned.length) segs.push({ text: cleaned.slice(last) });
  return segs.length > 0 ? segs : [{ text: raw }];
}

/** Renders a text run with optional **bold** spans as a react-pdf <Text> node */
function InlineText({ raw, style }: { raw: string; style: Style }): ReactNode {
  const segs = parseInline(raw);
  const hasBold = segs.some((s) => s.bold);
  if (!hasBold) {
    return <Text style={style}>{segs.map((s) => s.text).join('')}</Text>;
  }
  return (
    <Text style={style}>
      {segs.map((seg, i) =>
        seg.bold ? (
          <Text key={i} style={{ fontWeight: 'bold' }}>
            {seg.text}
          </Text>
        ) : (
          <Text key={i}>{seg.text}</Text>
        )
      )}
    </Text>
  );
}

// ─── Main renderer ─────────────────────────────────────────────────────────────
export function renderMarkdownToPdf(
  content: string,
  /** accent colour for bullets / h2 backgrounds */
  accent = '#E85D2B',
  /** body font size */
  bodySize = 10,
): ReactNode[] {
  const paraStyle: Style = { fontSize: bodySize, color: '#444444', lineHeight: 1.7 };
  const smallStyle: Style = { fontSize: 9, color: '#374151' };

  const lines = content.split('\n');
  const nodes: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    i++;

    // ── Blank line ──────────────────────────────────────────────────────────
    if (!trimmed) {
      nodes.push(<View key={`blank-${i}`} style={{ height: 5 }} />);
      continue;
    }

    // ── HR ──────────────────────────────────────────────────────────────────
    if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
      nodes.push(
        <View
          key={`hr-${i}`}
          style={{ borderTop: 1, borderColor: '#E5E7EB', marginTop: 6, marginBottom: 6 }}
        />
      );
      continue;
    }

    // ── H1 ──────────────────────────────────────────────────────────────────
    if (/^# /.test(trimmed)) {
      nodes.push(
        <Text
          key={`h1-${i}`}
          style={{ fontSize: 14, fontWeight: 'bold', color: '#0B1220', marginBottom: 6, marginTop: 10 }}
        >
          {trimmed.replace(/^# /, '')}
        </Text>
      );
      continue;
    }

    // ── H2 — dark-bg section header (Key Modules style) ────────────────────
    if (/^## /.test(trimmed)) {
      const text = trimmed.replace(/^## /, '');
      nodes.push(
        <View
          key={`h2-${i}`}
          style={{
            backgroundColor: '#0B1220',
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 8,
            paddingRight: 8,
            borderRadius: 4,
            marginBottom: 6,
            marginTop: 8,
          }}
        >
          <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>
            {text.toUpperCase()}
          </Text>
        </View>
      );
      continue;
    }

    // ── H3 ──────────────────────────────────────────────────────────────────
    if (/^### /.test(trimmed)) {
      nodes.push(
        <Text
          key={`h3-${i}`}
          style={{ fontSize: 11, fontWeight: 'bold', color: '#0B1220', marginBottom: 4, marginTop: 6 }}
        >
          {trimmed.replace(/^### /, '')}
        </Text>
      );
      continue;
    }

    // ── H4 ──────────────────────────────────────────────────────────────────
    if (/^#### /.test(trimmed)) {
      nodes.push(
        <Text
          key={`h4-${i}`}
          style={{ fontSize: 10, fontWeight: 'bold', color: '#374151', marginBottom: 3, marginTop: 4 }}
        >
          {trimmed.replace(/^#### /, '')}
        </Text>
      );
      continue;
    }

    // ── Bullet list (-, *, •) ───────────────────────────────────────────────
    if (/^[-*•] /.test(trimmed)) {
      const text = trimmed.replace(/^[-*•] /, '');
      nodes.push(
        <View
          key={`bullet-${i}`}
          wrap={false}
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 3,
            paddingLeft: 8,
          }}
        >
          <View
            style={{
              width: 5,
              height: 5,
              backgroundColor: accent,
              borderRadius: 3,
              flexShrink: 0,
              marginTop: 2,
              marginRight: 6,
            }}
          />
          <View style={{ flex: 1 }}>
            {InlineText({ raw: text, style: smallStyle })}
          </View>
        </View>
      );
      continue;
    }

    // ── Numbered list ───────────────────────────────────────────────────────
    const numMatch = trimmed.match(/^(\d+)\. (.+)/);
    if (numMatch) {
      nodes.push(
        <View
          key={`num-${i}`}
          wrap={false}
          style={{ flexDirection: 'row', marginBottom: 3, paddingLeft: 8 }}
        >
          <Text style={{ fontSize: 9, color: accent, fontWeight: 'bold', width: 16 }}>
            {numMatch[1]}.
          </Text>
          <View style={{ flex: 1 }}>
            {InlineText({ raw: numMatch[2], style: smallStyle })}
          </View>
        </View>
      );
      continue;
    }

    // ── Legacy Key Modules format: "Group Name:" → dark bg header ──────────
    if (trimmed.endsWith(':') && !trimmed.startsWith('-') && trimmed.length < 80) {
      const text = trimmed.slice(0, -1);
      nodes.push(
        <View
          key={`legacy-h-${i}`}
          style={{
            backgroundColor: '#0B1220',
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 8,
            paddingRight: 8,
            borderRadius: 4,
            marginBottom: 6,
            marginTop: 8,
          }}
        >
          <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>
            {text.toUpperCase()}
          </Text>
        </View>
      );
      continue;
    }

    // ── Paragraph ───────────────────────────────────────────────────────────
    nodes.push(
      <View key={`p-${i}`} style={{ marginBottom: 8 }}>
        {InlineText({ raw: trimmed, style: paraStyle })}
      </View>
    );
  }

  return nodes;
}
