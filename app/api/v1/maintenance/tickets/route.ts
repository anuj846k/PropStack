import { NextRequest } from 'next/server';
import { proxyToFastAPI, verifyAuth } from '@/lib/api/proxy';

export async function GET(request: NextRequest) {
  const user = await verifyAuth(request);
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const page = searchParams.get('page');
  const pageSize = searchParams.get('page_size');

  const params = new URLSearchParams();
  if (status != null) {
    params.set('status', status);
  }
  if (page != null) {
    params.set('page', page);
  }
  if (pageSize != null) {
    params.set('page_size', pageSize);
  }

  const endpoint = `/api/v1/maintenance/tickets${
    params.toString() ? `?${params.toString()}` : ''
  }`;

  try {
    const res = await proxyToFastAPI(endpoint, 'GET', undefined, user.id);
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch maintenance tickets';
    return new Response(message, { status: 500 });
  }
}

