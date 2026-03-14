const API_BASE_URL = '/api';

export interface Property {
  id: string;
  name: string;
  address: string | null;
  total_units: number;
  occupied_units: number;
  vacant_units: number;
}

export interface Unit {
  id: string;
  unit_number: string;
  rent_amount: number;
  occupancy_status: 'occupied' | 'vacant';
  tenant_id: string | null;
  tenant_name: string | null;
  tenancy_status: string | null;
}

export interface Tenant {
  tenant_id: string;
  tenant_name: string;
  tenant_phone: string | null;
  tenant_email: string | null;
  unit_id: string | null;
  unit_number: string;
  property_name: string;
  property_address: string | null;
  rent_amount: number;
  days_overdue: number;
  is_overdue: boolean;
  payment_status: string;
}

export interface TenantDetail extends Tenant {
  preferred_language: string | null;
  property_id: string | null;
  recent_payments: Payment[];
  recent_calls: CallLog[];
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  paid_at: string;
  provider: string;
  status: string;
  period_month: string;
}

export interface CallLog {
  id: string;
  outcome: string | null;
  transcript: string | null;
  duration_seconds: number | null;
  created_at: string | null;
}

export interface PaginatedCallHistory {
  calls: CallLog[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/** Rent call list item (landlord-scoped). */
export interface RentCallListItem {
  id: string;
  tenant_name: string;
  unit_number: string;
  property_name: string;
  outcome: string | null;
  created_at: string | null;
  duration_seconds: number | null;
  language_used: string | null;
}

export interface RentCallListResponse {
  calls: RentCallListItem[];
}

/** Full call detail for the dashboard. Stored AI analysis when present. */
export interface RentCallDetail {
  id: string;
  tenant_id: string;
  tenant_name: string;
  unit_number: string;
  property_name: string;
  outcome: string | null;
  summary: string | null;
  transcript: string | null;
  created_at: string | null;
  duration_seconds: number | null;
  language_used: string | null;
  ai_summary: string | null;
  promise_amount: string | null;
  promise_date: string | null;
  sentiment: string | null;
}

/** Sara's analysis (AI-generated from transcript / event_data). */
export interface CallAnalysis {
  summary: string;
  promise_amount: string | null;
  promise_date: string | null;
  sentiment: string;
}

export interface CallInitiationResponse {
  call_id: string | null;
  status: string;
  message: string;
  provider_status: string | null;
  error_message?: string | null;
}

export interface MaintenanceTicketUnit {
  id: string;
  unit_number: string | null;
  property_id: string | null;
  property_name: string | null;
  property_address: string | null;
}

export interface MaintenanceTicketTenant {
  id: string;
  name: string | null;
  phone: string | null;
}

export interface MaintenanceTicketVendor {
  id: string;
  name: string | null;
  phone: string | null;
  specialty: string | null;
}

export interface MaintenanceTicketImage {
  id: string;
  image_url: string;
  uploaded_at: string | null;
  image_proxy_url: string;
}

export interface MaintenanceTicket {
  id: string;
  title: string | null;
  issue_category: string | null;
  issue_description: string | null;
  priority: string | null;
  status: string | null;
  ai_severity_score: number | null;
  ai_summary: string | null;
  scheduled_at: string | null;
  resolved_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  unit: MaintenanceTicketUnit | null;
  tenant: MaintenanceTicketTenant | null;
  assigned_vendor: MaintenanceTicketVendor | null;
  image_url: string | null;
  image_proxy_url: string | null;
  images: MaintenanceTicketImage[];
  latest_dispatch_status: string | null;
}

export interface VacancyUnit {
  unit_id: string;
  unit_number: string | null;
  property_id: string | null;
  property_name: string | null;
  property_address: string | null;
  rent_amount: number;
  days_vacant: number;
  vacancy_cost: number;
}

export interface VacancyCostSummary {
  total_vacant_units: number;
  total_days_vacant: number;
  total_vacancy_cost: number;
  as_of_date: string;
  month_start: string;
  units: VacancyUnit[];
}

export interface RentIntelUnit {
  unit_id: string;
  unit_number: string | null;
  property_id: string | null;
  property_name: string | null;
  property_address: string | null;
  city: string | null;
  state: string | null;
  rent_amount: number;
  market_rent_estimate: number;
  delta: number;
  delta_pct: number;
  is_underpriced: boolean;
}



async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text || `Failed to fetch ${endpoint}`;
    try {
      const data = JSON.parse(text) as { error_message?: string; error?: string };
      if (data.error_message) message = data.error_message;
      else if (data.error) message = data.error;
    } catch {
      // use text as message
    }
    throw new Error(message);
  }

  return res.json();
}

export async function getProperties(): Promise<Property[]> {
  // Landlord is determined on the backend from Supabase auth in Next.js API.
  return fetchApi<Property[]>(`/v1/properties`);
}

export async function getPropertyUnits(propertyId: string): Promise<Unit[]> {
  return fetchApi<Unit[]>(`/v1/properties/${propertyId}/units`);
}

export async function getTenants(): Promise<Tenant[]> {
  // Landlord is determined on the backend from Supabase auth in Next.js API.
  return fetchApi<Tenant[]>(`/v1/tenants`);
}

export async function getTenantDetail(tenantId: string): Promise<TenantDetail> {
  return fetchApi<TenantDetail>(`/v1/tenants/${tenantId}`);
}

export async function getTenantCalls(tenantId: string, page = 1, pageSize = 10): Promise<PaginatedCallHistory> {
  return fetchApi<PaginatedCallHistory>(`/v1/tenants/${tenantId}/calls?page=${page}&page_size=${pageSize}`);
}

/** List all rent calls for the authenticated landlord. */
export async function getRentCalls(): Promise<RentCallListResponse> {
  return fetchApi<RentCallListResponse>('/v1/calls');
}

/** Get one rent call's full detail. */
export async function getCallDetail(callId: string): Promise<RentCallDetail> {
  return fetchApi<RentCallDetail>(`/v1/calls/${callId}`);
}

/** Get Sara's analysis for a call (optional event_data for ADK event context). */
export async function getCallAnalysis(
  callId: string,
  eventData?: Record<string, unknown> | null
): Promise<CallAnalysis> {
  return fetchApi<CallAnalysis>(`/v1/calls/${callId}/analysis`, {
    method: 'POST',
    body: JSON.stringify({ event_data: eventData ?? undefined }),
  });
}

export async function initiateCall(tenantId: string): Promise<CallInitiationResponse> {
  // Landlord identity comes from Supabase auth in the Next.js API route.
  return fetchApi<CallInitiationResponse>(`/v1/tenants/${tenantId}/call`, {
    method: 'POST',
  });
}

export async function getMaintenanceTickets(status?: string): Promise<MaintenanceTicket[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return fetchApi<MaintenanceTicket[]>(`/v1/maintenance/tickets${query}`);
}

export async function getVacancyCost(): Promise<VacancyCostSummary> {
  return fetchApi<VacancyCostSummary>('/v1/analytics/vacancy-cost');
}

