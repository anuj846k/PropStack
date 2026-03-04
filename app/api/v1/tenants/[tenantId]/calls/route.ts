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
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const pageSize = searchParams.get('page_size') || '10';

  try {
    const res = await proxyToFastAPI(
      `/api/v1/tenants/${tenantId}/calls?page=${page}&page_size=${pageSize}`,
      'GET',
      undefined,
      user.id
    );
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch calls';
    return new Response(message, { status: 500 });
  }
}
