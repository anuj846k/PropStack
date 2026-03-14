"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MailX, MapPin, Phone, Radio, Sparkles } from "lucide-react";

import {
  getCallAnalysis,
  getCallDetail,
  getRentCalls,
  initiateCall,
  type CallAnalysis,
  type RentCallDetail,
  type RentCallListItem,
} from "@/lib/api";
import {
  getOutcomeBadge,
  getOutcomeLabel,
  getSentimentIcon,
} from "@/lib/utils/dashboard";
import { useCallback, useEffect, useState } from "react";
import { ContentLoader } from "../loading-provider";

function formatCallTime(createdAt: string | null): string {
  if (!createdAt) return "—";
  const d = new Date(createdAt);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const isYesterday =
    new Date(now.getTime() - 86400000).toDateString() === d.toDateString();
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  if (isToday) return `Today, ${time}`;
  if (isYesterday) return `Yesterday, ${time}`;
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    `, ${time}`
  );
}

function formatDuration(seconds: number | null): string {
  if (seconds == null || seconds < 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function parseTranscript(
  transcript: string | null,
): { role: "sara" | "tenant"; text: string }[] {
  if (!transcript?.trim()) return [];
  try {
    const parts = JSON.parse(transcript) as {
      speaker?: string;
      text?: string;
    }[];
    if (!Array.isArray(parts)) return [];
    return parts
      .filter((p) => p?.text)
      .map((p) => ({
        role: (p.speaker === "sara" ? "sara" : "tenant") as "sara" | "tenant",
        text: String(p.text ?? ""),
      }));
  } catch {
    return [];
  }
}

export function AgentsSection() {
  const [calls, setCalls] = useState<RentCallListItem[]>([]);
  const [loadingCalls, setLoadingCalls] = useState(true);
  const [callsError, setCallsError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<RentCallDetail | null>(null);
  const [analysis, setAnalysis] = useState<CallAnalysis | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [calling, setCalling] = useState(false);

  const handleCall = async () => {
    if (!detail?.tenant_id) return;
    setCalling(true);
    try {
      const result = await initiateCall(detail.tenant_id);
      if (result.status === "initiated" || result.status === "queued") {
        alert(`Call initiated to tenant!`);
      } else {
        alert(`Failed: ${result.error_message || result.message}`);
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "Failed to call"}`);
    } finally {
      setCalling(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    setLoadingCalls(true);
    setCallsError(null);
    getRentCalls()
      .then((res) => {
        if (!cancelled) {
          setCalls(res.calls);
          if (res.calls.length > 0)
            setSelectedId((prev) => (prev ? prev : res.calls[0].id));
        }
      })
      .catch((err) => {
        if (!cancelled)
          setCallsError(
            err instanceof Error ? err.message : "Failed to load calls",
          );
      })
      .finally(() => {
        if (!cancelled) setLoadingCalls(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadDetailAndAnalysis = useCallback((callId: string) => {
    setSelectedId(callId);
    setDetail(null);
    setAnalysis(null);
    setAnalysisError(null);
    setLoadingDetail(true);
    getCallDetail(callId)
      .then((detailRes) => {
        setDetail(detailRes);
        const hasStoredAnalysis = Boolean(detailRes.ai_summary?.trim());
        if (hasStoredAnalysis) {
          setAnalysis({
            summary: detailRes.ai_summary ?? "",
            promise_amount: detailRes.promise_amount ?? null,
            promise_date: detailRes.promise_date ?? null,
            sentiment: detailRes.sentiment ?? "neutral",
          });
          setLoadingDetail(false);
          return;
        }
        return getCallAnalysis(callId).then((analysisRes) => {
          setAnalysis(analysisRes);
        });
      })
      .catch((err) => {
        setAnalysisError(
          err instanceof Error ? err.message : "Failed to load details",
        );
        getCallDetail(callId)
          .then(setDetail)
          .catch(() => setDetail(null));
      })
      .finally(() => setLoadingDetail(false));
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      setAnalysis(null);
      setLoadingDetail(false);
      return;
    }
    if (!calls.some((c) => c.id === selectedId)) return;
    loadDetailAndAnalysis(selectedId);
  }, [selectedId, calls, loadDetailAndAnalysis]);

  const transcriptLines = parseTranscript(detail?.transcript ?? null);

  const todayStr = new Date().toDateString();
  const callsToday = calls.filter(
    (c) => c.created_at && new Date(c.created_at).toDateString() === todayStr,
  ).length;
  const promises = calls.filter((c) => c.outcome === "promise").length;
  const followUps = calls.filter((c) => c.outcome === "no_answer").length;

  const stats = [
    { l: "Calls today", v: String(callsToday), c: "text-gray-900" },
    { l: "Promises", v: String(promises), c: "text-emerald-600" },
    { l: "Follow-ups", v: String(followUps), c: "text-amber-600" },
  ];

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left List */}
      <div className="w-[400px] border-r border-gray-200/80 flex flex-col bg-white">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                AI Agents
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Sara&apos;s calls &amp; activity today
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-gray-50/80 rounded-xl p-2.5 border border-gray-100"
              >
                <div className={`text-lg font-bold ${s.c}`}>{s.v}</div>
                <div className="text-[10px] text-gray-500 font-medium">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Tabs
          defaultValue="all"
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="px-5 pt-3 border-b border-gray-100 shrink-0">
            <TabsList className="bg-gray-100/80 h-8 p-1">
              <TabsTrigger value="all" className="text-xs px-3 py-1">
                All
              </TabsTrigger>
              <TabsTrigger value="rent" className="text-xs px-3 py-1">
                Rent
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="text-xs px-3 py-1">
                Maintenance
              </TabsTrigger>
              <TabsTrigger
                value="live"
                className="text-xs px-3 py-1 text-purple-700 data-[state=active]:text-purple-700 data-[state=active]:bg-white"
              >
                <Radio size={12} className="text-red-500" /> Live
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 h-0">
            {loadingCalls ? (
              <div className="p-6 text-center text-sm text-gray-500">
                <ContentLoader message="Loading calls..." />
              </div>
            ) : callsError ? (
              <div className="p-6 text-center text-sm text-red-600">
                {callsError}
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {calls.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedId === c.id
                        ? "bg-blue-50/50 hover:bg-blue-50/80"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 flex shrink-0 items-center justify-center bg-gray-100 border border-gray-200 text-lg">
                        {getSentimentIcon(
                          selectedId === c.id
                            ? (analysis?.sentiment ?? "neutral")
                            : "neutral",
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-bold text-gray-900">
                            {c.tenant_name}
                          </p>
                          <span className="text-[10px] text-gray-500 whitespace-nowrap">
                            {formatCallTime(c.created_at)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2 truncate">
                          {c.unit_number} · {c.property_name}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={getOutcomeBadge(c.outcome ?? "")}
                            className="text-[10px] uppercase font-semibold tracking-wider h-5 px-1.5"
                          >
                            {getOutcomeLabel(c.outcome ?? "")}
                          </Badge>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {c.language_used ?? "—"} ·{" "}
                            {formatDuration(c.duration_seconds)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loadingCalls && !callsError && calls.length === 0 && (
              <div className="p-6 text-center text-sm text-gray-500">
                No rent calls yet
              </div>
            )}
          </ScrollArea>
        </Tabs>
      </div>

      {/* Right Detail View */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedId ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm font-medium">
            Select a call to view details
          </div>
        ) : loadingDetail && !detail ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
            Loading…
          </div>
        ) : detail ? (
          <ScrollArea className="flex-1 p-8">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                      {detail.tenant_name}
                    </h2>
                    <Badge
                      variant={getOutcomeBadge(detail.outcome ?? "")}
                      className="uppercase text-[10px] font-bold tracking-wider"
                    >
                      {getOutcomeLabel(detail.outcome ?? "")}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5">
                    <MapPin size={14} /> Unit {detail.unit_number} ·{" "}
                    {detail.property_name} · {formatCallTime(detail.created_at)}
                  </p>
                </div>
                {/* <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="h-9 font-semibold gap-1.5 rounded-xl"
                    onClick={handleCall}
                    disabled={calling || !detail?.tenant_id}
                  >
                    <Phone size={14} />
                    {calling ? "Calling…" : "Call Again"}
                  </Button>
                </div> */}
              </div>

              {/* Sara's Analysis (dynamic from API) */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-100 flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded-lg bg-gray-900 text-white flex items-center justify-center">
                    <Sparkles size={12} />
                  </div>
                  <span className="font-bold text-sm text-gray-900">
                    Sara&apos;s Analysis
                  </span>
                </div>
                <div className="p-5">
                  {analysisError ? (
                    <p className="text-sm text-amber-700">
                      Analysis could not be loaded. {analysisError}
                    </p>
                  ) : (
                    <>
                      <p className="text-sm leading-relaxed text-gray-700">
                        {analysis?.summary ?? "No analysis yet."}
                      </p>
                      {analysis && (
                        <div className="grid grid-cols-3 gap-3 mt-5">
                          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-1">
                              Promised
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {analysis.promise_amount ?? "—"}
                            </p>
                          </div>
                          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-1">
                              Date
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {analysis.promise_date ?? "—"}
                            </p>
                          </div>
                          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                              Sentiment
                            </p>
                            <p className="text-lg font-bold text-gray-900 flex items-center gap-1.5 capitalize">
                              {getSentimentIcon(
                                analysis.sentiment ?? "neutral",
                              )}{" "}
                              {analysis.sentiment ?? "—"}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Transcript */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[min(50vh,400px)]">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                  <h3 className="font-bold text-sm text-gray-900">
                    Call Transcript
                  </h3>
                  <Badge
                    variant="secondary"
                    className="font-medium bg-gray-100 text-gray-600"
                  >
                    {detail.language_used ?? "—"}
                  </Badge>
                </div>
                <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="pr-3">
                      {transcriptLines.length > 0 ? (
                        <div className="divide-y divide-gray-50">
                          {transcriptLines.map((line, i) => (
                            <div
                              key={i}
                              className={`p-4 flex gap-4 ${
                                line.role === "sara"
                                  ? "bg-blue-50/30"
                                  : "bg-white"
                              }`}
                            >
                              <div
                                className={`shrink-0 w-14 text-[11px] font-bold uppercase tracking-wider mt-0.5 ${
                                  line.role === "sara"
                                    ? "text-blue-600"
                                    : "text-gray-400"
                                }`}
                              >
                                {line.role === "sara" ? "Sara" : "Tenant"}
                              </div>
                              <div className="flex-1 text-sm leading-relaxed text-gray-800">
                                {line.text}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-10 flex flex-col items-center justify-center text-center">
                          <div className="text-4xl mb-4">
                            {detail.outcome === "live" ? (
                              <Radio
                                size={40}
                                className="text-red-500 animate-pulse"
                              />
                            ) : (
                              <MailX size={40} className="text-gray-400" />
                            )}
                          </div>
                          <h4 className="text-base font-bold text-gray-900 mb-1">
                            {detail.outcome === "live"
                              ? "Call in progress..."
                              : "No Transcript Available"}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {detail.outcome === "live"
                              ? "Transcript text will appear here once the call ends."
                              : "This call went unanswered, so no audio was recorded."}
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
            Call not found
          </div>
        )}
      </div>
    </div>
  );
}
