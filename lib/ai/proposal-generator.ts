import { groq, MODEL } from './groq-client';
import { getSystemPrompt } from './section-prompts';
import type { SectionKey, ProposalState } from '@/types/proposal';

export async function generateSectionStream(
  sectionKey: SectionKey,
  userMessage: string,
  proposal: Partial<ProposalState>,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
) {
  const systemPrompt = getSystemPrompt(sectionKey, proposal);

  const stream = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ],
    temperature: 0.7,
    max_completion_tokens: 8192,
    stream: true,
  });

  return stream;
}

// Non-streaming version for server-side pre-generation
export async function generateSectionContent(
  sectionKey: SectionKey,
  userMessage: string,
  proposal: Partial<ProposalState>,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<string> {
  const systemPrompt = getSystemPrompt(sectionKey, proposal);

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ],
    temperature: 0.7,
    max_completion_tokens: 8192,
    stream: false,
  });

  return completion.choices[0]?.message?.content ?? '';
}
