"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building2,
  MapPin,
  Phone,
  ArrowLeft,
  Clock,
  MessageSquare,
  User,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getTenantDetail, getTenantCalls, type Tenant, type TenantDetail as TenantDetailType, type PaginatedCallHistory } from "@/lib/api";
import { useLoading, InlineLoader } from "@/components/loading-provider";

interface TranscriptPart {
  speaker: string;
  text: string;
  is_final: boolean;
}

interface TenantDetailPageProps {
  tenant: Tenant;
  onBack: () => void;
}

function TenantDetailContent({ tenant, onBack }: TenantDetailPageProps) {
  const { startLoading, stopLoading } = useLoading();
  const [detail, setDetail] = useState<TenantDetailType | null>(null);
  const [callsData, setCallsData] = useState<PaginatedCallHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedCall, setExpandedCall] = useState<string | null>(null);
  const [calling, setCalling] = useState(false);
  const pageSize = 10;

  const loadCalls = useCallback(async (page: number) => {
    startLoading();
    try {
      const data = await getTenantCalls(tenant.tenant_id, page, pageSize);
      setCallsData(data);
    } catch (err) {
      console.error("Failed to load calls:", err);
    } finally {
      stopLoading();
    }
  }, [tenant.tenant_id, pageSize, startLoading, stopLoading]);

  useEffect(() => {
    async function loadDetail() {
      startLoading();
      try {
        const [detailData, callsResult] = await Promise.all([
          getTenantDetail(tenant.tenant_id),
          getTenantCalls(tenant.tenant_id, 1, pageSize),
        ]);
        setDetail(detailData);
        setCallsData(callsResult);
      } catch (err) {
        console.error("Failed to load tenant detail:", err);
      } finally {
        setLoading(false);
        stopLoading();
      }
    }
    loadDetail();
  }, [tenant.tenant_id, startLoading, stopLoading]);

  const handlePageChange = (newPage: number) => {
    if (callsData && newPage >= 1 && newPage <= callsData.total_pages) {
      loadCalls(newPage);
    }
  };

  const handleCall = async () => {
    setCalling(true);
    try {
      const { initiateCall } = await import("@/lib/api");
      const result = await initiateCall(tenant.tenant_id);
      if (result.status === "initiated" || result.status === "queued") {
        alert(`Call initiated to ${tenant.tenant_name}!`);
      } else {
        alert(`Failed: ${result.message}`);
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "Failed to call"}`);
    } finally {
      setCalling(false);
    }
  };

  const parseTranscript = (transcript: string | null): TranscriptPart[] => {
    if (!transcript) return [];
    try {
      return JSON.parse(transcript);
    } catch {
      return [];
    }
  };

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return "—";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const getOutcomeBadge = (outcome: string | null) => {
    switch (outcome) {
      case "promise":
        return <Badge variant="success">Payment Promised</Badge>;
      case "no_answer":
        return <Badge variant="warning">No Answer</Badge>;
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      default:
        return <Badge variant="outline">{outcome || "—"}</Badge>;
    }
  };

  return (
    <ScrollArea className="flex-1 bg-gray-50/30">
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{detail?.tenant_name || tenant.tenant_name}</h1>
            <p className="text-sm text-gray-500">
              {detail?.unit_number || tenant.unit_number} · {detail?.property_name || tenant.property_name}
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCall} disabled={calling}>
            <Phone className="h-4 w-4 mr-2" />
            {calling ? "Calling..." : "Call Tenant"}
          </Button>
        </div>

        {loading ? (
          <InlineLoader size={48} />
        ) : (
          <div className="space-y-6">
            {/* Tenant Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="shadow-sm border-gray-200/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <User className="h-4 w-4" /> Contact Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{detail?.tenant_phone || "No phone"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{detail?.tenant_email || "No email"}</span>
                  </div>
                  {detail?.preferred_language && (
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium capitalize">{detail.preferred_language}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-sm border-gray-200/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="h-4 w-4" /> Property Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{detail?.property_name || tenant.property_name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">Unit {detail?.unit_number || tenant.unit_number}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-900">₹{(detail?.rent_amount || tenant.rent_amount).toLocaleString()}/mo</span>
                    {tenant.is_overdue && (
                      <Badge variant="destructive" className="text-[10px]">Overdue</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Payments */}
            {detail?.recent_payments && detail.recent_payments.length > 0 && (
              <Card className="shadow-sm border-gray-200/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Recent Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs">Amount</TableHead>
                        <TableHead className="text-xs">Period</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detail.recent_payments.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="text-sm">
                            {p.paid_at ? new Date(p.paid_at).toLocaleDateString("en-IN") : "—"}
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            ₹{p.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm">{p.period_month}</TableCell>
                          <TableCell>
                            <Badge variant="success" className="text-[10px]">{p.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Call History with Pagination */}
            <Card className="shadow-sm border-gray-200/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  Call History {callsData && `(${callsData.total})`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!callsData || callsData.calls.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No calls yet</p>
                ) : (
                  <>
                    <div className="space-y-3">
                      {callsData.calls.map((call) => (
                        <div
                          key={call.id}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <div
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                            onClick={() => setExpandedCall(expandedCall === call.id ? null : call.id)}
                          >
                            <div className="flex items-center gap-3">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium">
                                {formatDate(call.created_at)}
                              </span>
                              {getOutcomeBadge(call.outcome)}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500">
                                {formatDuration(call.duration_seconds)}
                              </span>
                            </div>
                          </div>

                          {expandedCall === call.id && (
                            <div className="border-t border-gray-200 p-3 bg-gray-50">
                              {call.transcript ? (
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                  {parseTranscript(call.transcript).map((part, idx) => (
                                    <div
                                      key={idx}
                                      className={`text-sm p-2 rounded ${
                                        part.speaker === "sara"
                                          ? "bg-blue-50 ml-4"
                                          : part.speaker === "user"
                                          ? "bg-green-50 mr-4"
                                          : "bg-gray-100 text-gray-500 text-xs"
                                      }`}
                                    >
                                      <span className="font-semibold text-xs uppercase">
                                        {part.speaker === "sara" ? "Sara" : part.speaker === "user" ? "Tenant" : "System"}:
                                      </span>{" "}
                                      {part.text}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">No transcript available</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {callsData.total_pages > 1 && (
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          Page {callsData.page} of {callsData.total_pages}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(callsData.page - 1)}
                            disabled={callsData.page <= 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(callsData.page + 1)}
                            disabled={callsData.page >= callsData.total_pages}
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

function TenantDetailFallback() {
  return (
    <ScrollArea className="flex-1 bg-gray-50/30">
      <InlineLoader size={48} />
    </ScrollArea>
  );
}

export function TenantDetailPage(props: TenantDetailPageProps) {
  return (
    <Suspense fallback={<TenantDetailFallback />}>
      <TenantDetailContent {...props} />
    </Suspense>
  );
}
