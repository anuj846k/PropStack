import { NextRequest } from 'next/server';
import { verifyAuth, proxyToFastAPI } from '@/lib/api/proxy';

export async function GET(request: NextRequest) {
  const user = await verifyAuth(request);
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const res = await proxyToFastAPI('/api/v1/calls', 'GET', undefined, user.id);
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch calls';
    return new Response(message, { status: 500 });
  }
}
