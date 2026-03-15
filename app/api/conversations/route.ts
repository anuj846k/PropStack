import { createClient } from '@/lib/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';

/** GET /api/conversations — list conversations for the logged-in landlord */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://127.0.0.1:8001';
    const response = await fetch(`${backendUrl}/api/v1/chat/sessions`, {
      method: 'GET',
      headers: {  
        'x-landlord-id': user.id,
        'x-internal-secret':
          process.env.INTERNAL_API_SECRET || 'dev_secret_key',
      },
      // Do not cache to always get the latest sessions
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch sessions from backend:', response.status);
      return NextResponse.json(
        { error: 'Failed to fetch sessions from AI backend' },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Error fetching sessions:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/** POST /api/conversations — create a new conversation, return its id */
export async function POST(_req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // ADK creates the backing session on first message.
  // We still provide a real UUID immediately so UI state remains stable.
  return NextResponse.json({
    id: randomUUID(),
    title: 'New conversation',
    last_message_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  });
}
