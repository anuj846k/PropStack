import { NextRequest } from 'next/server';
import { verifyAuth, proxyToFastAPI } from '@/lib/api/proxy';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ callId: string }> }
) {
  const user = await verifyAuth(request);
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { callId } = await params;

  let body: object | undefined;
  try {
    const text = await request.text();
    body = text ? JSON.parse(text) : undefined;
  } catch {
    body = undefined;
  }

  try {
    const res = await proxyToFastAPI(`/api/v1/calls/${callId}/analysis`, 'POST', body, user.id);
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch analysis';
    return new Response(message, { status: 500 });
  }
}
