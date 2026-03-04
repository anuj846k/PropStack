import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8001';
const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET || 'propstack-internal-secret';

export async function verifyAuth(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function proxyToFastAPI(
  endpoint: string,
  method: string = 'GET',
  body?: object,
  userId?: string
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-internal-secret': INTERNAL_SECRET,
  };

  if (userId) {
    headers['x-landlord-id'] = userId;
  }

  const res = await fetch(`${AI_SERVICE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `FastAPI error: ${res.status}`);
  }

  return res;
}

export async function handleFastAPIProxy(
  request: NextRequest,
  endpoint: string,
  method: string = 'GET'
) {
  const user = await verifyAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: object | undefined;
  if (method !== 'GET' && method !== 'HEAD') {
    body = await request.json();
  }

  try {
    const res = await proxyToFastAPI(endpoint, method, body, user.id);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Proxy error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
