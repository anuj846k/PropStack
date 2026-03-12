"use client";

import { useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStatusBadge, getStatusLabel } from "@/lib/utils/dashboard";
import {
  Wrench,
  Snowflake,
  Lightbulb,
  Lock,
  ImageIcon,
} from "lucide-react";
import type { MaintenanceTicket } from "@/lib/api";
import { TicketImageLightbox } from "./TicketImageLightbox";

const ticketIconMap: Record<string, ElementType> = {
  plumbing: Wrench,
  electrical: Lightbulb,
  carpentry: Lock,
  hvac: Snowflake,
};

function TicketIcon({ issueCategory }: { issueCategory: string | null }) {
  const Icon = ticketIconMap[issueCategory ?? ""] || Wrench;
  return <Icon size={22} className="text-gray-600" />;
}

function formatRelative(dateString: string | null): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

export function TicketsSection() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [hasMore, setHasMore] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState<string>("Maintenance photo");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (statusFilter !== "all") {
          params.set("status", statusFilter);
        }
        params.set("page", String(page));
        params.set("page_size", String(pageSize));

        const res = await fetch(
          `/api/v1/maintenance/tickets?${params.toString()}`,
        );
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const data: MaintenanceTicket[] = await res.json();
        if (isMounted) {
          setTickets(data);
          setHasMore(data.length === pageSize);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load maintenance tickets",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    void load();
    return () => {
      isMounted = false;
    };
  }, [statusFilter, page, pageSize]);

  const filteredTickets = useMemo(() => tickets, [tickets]);

  return (
    <div className="flex-1 flex overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-8 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Maintenance Tickets
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                View AI-triaged tickets and vendor dispatch status.
              </p>
            </div>
            <Button className="font-semibold shadow-sm rounded-xl px-5" disabled>
              New Ticket
            </Button>
          </div>

          <Tabs
            defaultValue="all"
            className="mb-6"
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading && (
            <p className="text-sm text-gray-500">Loading tickets…</p>
          )}
          {error && (
            <p className="text-sm text-red-500">
              {error || "Failed to load tickets"}
            </p>
          )}

          <div className="grid gap-4">
            {!loading &&
              !error &&
              filteredTickets.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="p-5 flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border bg-gray-50 border-gray-100">
                      <TicketIcon issueCategory={t.issue_category} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-bold text-gray-900 truncate">
                          {t.title || t.ai_summary || "Maintenance ticket"}
                        </h3>
                        {t.priority && (
                          <Badge
                            variant={
                              t.priority === "high"
                                ? "destructive"
                                : t.priority === "medium"
                                  ? "warning"
                                  : "outline"
                            }
                            className="text-[10px] uppercase font-bold tracking-widest"
                          >
                            {t.priority}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {t.ai_summary || t.issue_description}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t.unit?.unit_number
                          ? `Unit ${t.unit.unit_number}`
                          : "Unassigned unit"}
                        {t.tenant?.name
                          ? ` · ${t.tenant.name}`
                          : ""}
                        {t.unit?.property_name
                          ? ` · ${t.unit.property_name}`
                          : ""}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t.latest_dispatch_status
                          ? `Vendor dispatch: ${t.latest_dispatch_status}`
                          : "No vendor dispatch yet"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge
                        variant={getStatusBadge(t.status || "open")}
                        className="capitalize px-2.5"
                      >
                        {getStatusLabel(t.status || "open")}
                      </Badge>
                      <span className="text-[11px] text-gray-400 font-semibold tracking-wider uppercase">
                        {formatRelative(t.created_at)}
                      </span>
                      {t.image_proxy_url && (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700"
                          onClick={() => {
                            setLightboxImageUrl(t.image_url ?? "");
                            setLightboxAlt(
                              t.title ||
                                t.ai_summary ||
                                "Maintenance ticket photo",
                            );
                          }}
                        >
                          <ImageIcon size={12} />
                          View photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex items-center justify-between mt-6">
            <span className="text-xs text-gray-400">
              Page {page}
              {loading ? " · Loading…" : ""}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!hasMore || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
      <TicketImageLightbox
        imageUrl={lightboxImageUrl ?? ""}
        alt={lightboxAlt}
        isOpen={!!lightboxImageUrl}
        onClose={() => setLightboxImageUrl(null)}
      />
    </div>
  );
}
