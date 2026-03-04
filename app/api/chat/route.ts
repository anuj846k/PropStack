import { type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 30;

const AI_SERVICE_URL =
  process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8001';
const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET || 'propstack-internal-secret';

type UIMessagePart = { type: string; text?: string };
type UIMessage = {
  role: string;
  parts?: UIMessagePart[];
  content?: string;
};

function extractLastUserText(messages: UIMessage[]): string {
  const lastUser = [...(messages ?? [])]
    .filter((m) => m.role === 'user')
    .pop();
  if (!lastUser) return '';
  if (lastUser.parts?.length) {
    return lastUser.parts
      .filter((p): p is UIMessagePart & { text: string } => p.type === 'text' && typeof p.text === 'string')
      .map((p) => p.text)
      .join(' ')
      .trim();
  }
  if (typeof lastUser.content === 'string') return lastUser.content.trim();
  return '';
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return new Response('Unauthorized - Please log in', { status: 401 });
  }

  const body = await req.json();
  const { messages, id: sessionId } = body;
  const text = extractLastUserText(messages ?? []);

  if (!text) {
    return new Response('Missing message', { status: 400 });
  }

  const res = await fetch(`${AI_SERVICE_URL}/api/v1/chat`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-internal-secret': INTERNAL_SECRET,
      'x-landlord-id': user.id,
    },
    body: JSON.stringify({
      user_id: user.id,
      landlord_id: user.id,
      session_id: sessionId ?? undefined,
      message: text,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(err || 'Chat failed', { status: res.status });
  }

  return new Response(res.body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
