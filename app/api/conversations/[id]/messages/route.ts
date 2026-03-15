import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/** GET /api/conversations/[id]/messages — fetch all messages for a conversation */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  if (id === 'new') {
    return NextResponse.json([]);
  }

  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://127.0.0.1:8001';
    const response = await fetch(
      `${backendUrl}/api/v1/chat/sessions/${id}/history`,
      {
        method: 'GET',
        headers: {
          'x-landlord-id': user.id,
          'x-internal-secret':
            process.env.INTERNAL_API_SECRET || 'dev_secret_key',
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      console.error(
        'Failed to fetch chat history from backend:',
        response.status,
      );
      return NextResponse.json(
        { error: 'Failed to fetch chat history from AI backend' },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Error fetching chat history:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
