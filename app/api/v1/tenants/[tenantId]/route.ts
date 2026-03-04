import { NextRequest } from 'next/server';
import { verifyAuth, proxyToFastAPI } from '@/lib/api/proxy';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  const user = await verifyAuth(request);
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { tenantId } = await params;

  try {
    const res = await proxyToFastAPI(`/api/v1/tenants/${tenantId}`, 'GET', undefined, user.id);
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch tenant';
    return new Response(message, { status: 500 });
  }
}
