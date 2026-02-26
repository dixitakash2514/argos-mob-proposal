/**
 * Lightweight markdown → react-pdf renderer.
 * Handles: # h1, ## h2 (dark box), ### h3, **bold** inline,
 * - bullets, 1. numbered lists, blank lines, HR, plain paragraphs.
 * Backward compatible: "Group Name:" legacy format still renders as dark header.
 */
import { Text, View } from '@react-pdf/renderer';
import type { Style } from '@react-pdf/types';
import type { ReactNode } from 'react';

// ─── Inline parser ─────────────────────────────────────────────────────────────
type Seg = { text: string; bold?: boolean };

/**
 * Split a line into plain/bold segments.
 * Uses String.split with a capture group — more reliable than regex.exec.
 */
function parseInline(raw: string): Seg[] {
  // Normalise *** → ** and strip backtick code spans and *italic*
  const pre = raw
    .replace(/\*\*\*([^*]+)\*\*\*/g, '**$1**')  // ***bold italic*** → **bold**
    .replace(/`([^`\n]+)`/g, '$1')               // `code` → plain
    .replace(/(?<!\*)\*(?!\*)([^*\n]+)\*(?!\*)/g, '$1'); // *italic* → plain

  // Split on **...** — odd-indexed parts are bold
  const parts = pre.split(/\*\*([^*\n]+)\*\*/);
  const segs: Seg[] = [];
  for (let i = 0; i < parts.length; i++) {
    const t = parts[i];
    if (!t) continue;
    segs.push(i % 2 === 1 ? { text: t, bold: true } : { text: t });
  }
  // Fallback: strip ** markers if split produced nothing useful
  return segs.length > 0 ? segs : [{ text: raw.replace(/\*\*/g, '') }];
}

/** Renders a text run with optional inline bold as react-pdf <Text> */
function InlineText({ raw, style }: { raw: string; style: Style }): ReactNode {
  const segs = parseInline(raw);
  const hasBold = segs.some((s) => s.bold);
  if (!hasBold) {
    return <Text style={style}>{segs.map((s) => s.text).join('')}</Text>;
  }
  return (
    <Text style={style}>
      {segs.map((seg, idx) =>
        seg.bold ? (
          <Text key={idx} style={{ fontFamily: 'Helvetica-Bold' }}>
            {seg.text}
          </Text>
        ) : (
          <Text key={idx}>{seg.text}</Text>
        )
      )}
    </Text>
  );
}

/** Strip bold/italic markers from heading text extracted after removing the heading prefix. */
function stripMarkers(text: string): string {
  return text.replace(/\*\*/g, '').replace(/(?<!\*)\*(?!\*)/g, '').trim();
}

// ─── Main renderer ─────────────────────────────────────────────────────────────
export function renderMarkdownToPdf(
  content: string,
  accent = '#E85D2B',
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

    // ── Horizontal rule ─────────────────────────────────────────────────────
    if (/^[-*]{3,}$/.test(trimmed)) {
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
          style={{ fontFamily: 'Helvetica-Bold', fontSize: 14, color: '#0B1220', marginBottom: 6, marginTop: 10 }}
        >
          {stripMarkers(trimmed.replace(/^# /, ''))}
        </Text>
      );
      continue;
    }

    // ── H2 — dark section header ─────────────────────────────────────────────
    if (/^## /.test(trimmed)) {
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
          <Text style={{ fontFamily: 'Helvetica-Bold', color: 'white', fontSize: 9 }}>
            {stripMarkers(trimmed.replace(/^## /, '')).toUpperCase()}
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
          style={{ fontFamily: 'Helvetica-Bold', fontSize: 11, color: '#0B1220', marginBottom: 4, marginTop: 6 }}
        >
          {stripMarkers(trimmed.replace(/^### /, ''))}
        </Text>
      );
      continue;
    }

    // ── H4 ──────────────────────────────────────────────────────────────────
    if (/^#### /.test(trimmed)) {
      nodes.push(
        <Text
          key={`h4-${i}`}
          style={{ fontFamily: 'Helvetica-Bold', fontSize: 10, color: '#374151', marginBottom: 3, marginTop: 4 }}
        >
          {stripMarkers(trimmed.replace(/^#### /, ''))}
        </Text>
      );
      continue;
    }

    // ── Standalone **bold** line (full line is **text**) ────────────────────
    // Treat as a sub-heading (common in LLM-generated markdown)
    const boldLineMatch = trimmed.match(/^\*\*([^*]+)\*\*$/);
    if (boldLineMatch) {
      nodes.push(
        <Text
          key={`bh-${i}`}
          style={{ fontFamily: 'Helvetica-Bold', fontSize: 10, color: '#0B1220', marginBottom: 3, marginTop: 6 }}
        >
          {boldLineMatch[1]}
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
          style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 3, paddingLeft: 8 }}
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
          <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9, color: accent, width: 16 }}>
            {numMatch[1]}.
          </Text>
          <View style={{ flex: 1 }}>
            {InlineText({ raw: numMatch[2], style: smallStyle })}
          </View>
        </View>
      );
      continue;
    }

    // ── Legacy format: "Group Name:" → dark section header ─────────────────
    if (trimmed.endsWith(':') && !trimmed.startsWith('-') && trimmed.length < 80) {
      nodes.push(
        <View
          key={`legacy-${i}`}
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
          <Text style={{ fontFamily: 'Helvetica-Bold', color: 'white', fontSize: 9 }}>
            {trimmed.slice(0, -1).toUpperCase()}
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
