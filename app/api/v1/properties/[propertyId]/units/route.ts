import { NextRequest } from 'next/server';
import { verifyAuth, proxyToFastAPI } from '@/lib/api/proxy';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const user = await verifyAuth(request);
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { propertyId } = await params;

  try {
    const res = await proxyToFastAPI(`/api/v1/properties/${propertyId}/units`, 'GET', undefined, user.id);
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch units';
    return new Response(message, { status: 500 });
  }
}
