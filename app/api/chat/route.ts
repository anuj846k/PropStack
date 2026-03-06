import { createClient } from '@/lib/supabase/server';
import { createTextStreamResponse } from 'ai';
import { type NextRequest } from 'next/server';

export const maxDuration = 30;

const AI_SERVICE_URL =
  process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8001';
const INTERNAL_SECRET =
  process.env.INTERNAL_API_SECRET || 'propstack-internal-secret';

type UIMessagePart = { type: string; text?: string };
type UIMessage = {
  role: string;
  parts?: UIMessagePart[];
  content?: string;
};

function extractLastUserText(messages: UIMessage[]): string {
  const lastUser = [...(messages ?? [])].filter((m) => m.role === 'user').pop();
  if (!lastUser) return '';
  if (lastUser.parts?.length) {
    return lastUser.parts
      .filter(
        (p): p is UIMessagePart & { text: string } =>
          p.type === 'text' && typeof p.text === 'string',
      )
      .map((p) => p.text)
      .join(' ')
      .trim();
  }
  if (typeof lastUser.content === 'string') return lastUser.content.trim();
  return '';
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return new Response('Unauthorized - Please log in', { status: 401 });
  }

  const body = await req.json();
  const { messages, id: sessionId } = body;
  const text = extractLastUserText(messages ?? []);

  if (!text) return new Response('Missing message', { status: 400 });

  // ── Resolve conversation ID ─────────────────────────────────
  // If the frontend passed "new" or undefined, we just pass undefined to Python ADK.
  // ADK will auto-generate a true UUID and return it via headers.
  let conversationId: string | undefined =
    sessionId === 'new' ? undefined : sessionId;

  // ── Call Python ADK backend ─────────────────────────────────
  const response = await fetch(`${AI_SERVICE_URL}/api/v1/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-secret': INTERNAL_SECRET,
      'x-landlord-id': user.id,
    },
    body: JSON.stringify({
      user_id: user.id,
      landlord_id: user.id,
      session_id: conversationId,
      message: text,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return new Response(err || 'Chat failed', { status: response.status });
  }

  // ── Stream back using AI SDK v6 helpers ───────────────────
  let aiText = '';
  const textStream = new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          aiText += chunk;
          controller.enqueue(chunk);
        }
      } finally {
        controller.close();
      }
    },
  });

  return createTextStreamResponse({
    textStream,
    headers: {
      'X-Conversation-Id':
        conversationId ?? response.headers.get('x-conversation-id') ?? '',
    },
  });
}
