import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateSectionStream } from '@/lib/ai/proposal-generator';
import type { SectionKey } from '@/types/proposal';

const ChatRequestSchema = z.object({
  proposalId: z.string().min(1),
  sectionKey: z.enum([
    'coverPage', 'introduction', 'keyModules', 'techStack',
    'deliveryComponents', 'costEstimation', 'proposedTeam',
    'amc', 'sla', 'changeRequest', 'acceptanceCriteria',
    'warranty', 'legalSignOff',
  ]),
  userMessage: z.string().min(1).max(4000),
  proposalContext: z.record(z.string(), z.unknown()).optional(),
  conversationHistory: z.array(
    z.object({ role: z.enum(['user', 'assistant']), content: z.string() })
  ).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ChatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { sectionKey, userMessage, proposalContext, conversationHistory } = parsed.data;

    const stream = await generateSectionStream(
      sectionKey as SectionKey,
      userMessage,
      proposalContext ?? {},
      conversationHistory ?? []
    );

    // Convert Groq stream to ReadableStream for SSE
    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? '';
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Stream error';
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    console.error('[/api/chat] Error:', msg, err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
