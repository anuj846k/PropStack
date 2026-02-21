"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpRight,
  Building2,
  FileText,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Phone,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { ElementType, useState, useRef, useEffect } from "react";

import {
  mockTickets,
  mockTenants,
  mockCalls,
  chatHistories,
  initChat,
} from './data';
import {
  getSeverityBadge,
  getStatusBadge,
  getStatusLabel,
  getOutcomeBadge,
  getOutcomeLabel,
  getSentimentIcon,
} from './utils';
import { PropLogo } from './PropLogo';

export function AgentsSection() {
  const [selected, setSelected] = useState(mockCalls[0]);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left List */}
      <div className="w-[400px] border-r border-gray-200 flex flex-col bg-white">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                AI Agents
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Sara&apos;s calls & activity today
              </p>
            </div>
            <Button size="sm" className="h-8 gap-1.5 text-xs select-none">
              Trigger Call <Phone size={14} />
            </Button>
          </div>

          <div className="bg-purple-50 border border-purple-200/50 rounded-xl p-3 flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_0_4px_rgba(168,85,247,0.2)] animate-pulse shrink-0" />
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-xs font-bold text-purple-700 truncate">
                Sara is live right now
              </p>
              <p className="text-[11px] text-purple-600/80 truncate">
                Calling Priya Sharma — AC follow-up
              </p>
            </div>
            <span className="text-xs font-semibold text-purple-700 px-2 py-1 bg-purple-100 rounded-md cursor-pointer hover:bg-purple-200 transition-colors">
              Listen
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { l: "Calls today", v: "4", c: "text-gray-900" },
              { l: "Promises", v: "1", c: "text-green-600" },
              { l: "Follow-ups", v: "2", c: "text-amber-600" },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-gray-50/80 rounded-lg p-2.5 border border-gray-100"
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
          <div className="px-5 pt-3 border-b border-gray-200">
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
                🔴 Live
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1">
            <div className="divide-y divide-gray-100">
              {mockCalls.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${selected?.id === c.id ? "bg-blue-50/50 hover:bg-blue-50/80" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 flex shrink-0 items-center justify-center bg-gray-100 border border-gray-200 text-lg">
                      {getSentimentIcon(c.sentiment)}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-bold text-gray-900">
                          {c.tenant}
                        </p>
                        <span className="text-[10px] text-gray-500 whitespace-nowrap">
                          {c.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2 truncate">
                        {c.unit} · {c.property}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={getOutcomeBadge(c.outcome)}
                          className="text-[10px] uppercase font-semibold tracking-wider h-5 px-1.5"
                        >
                          {getOutcomeLabel(c.outcome)}
                        </Badge>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {c.language} · {c.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Tabs>
      </div>

      {/* Right Detail View */}
      <div className="flex-1 bg-gray-50/50 flex flex-col overflow-hidden">
        {selected ? (
          <ScrollArea className="flex-1 p-8">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                      {selected.tenant}
                    </h2>
                    <Badge
                      variant={getOutcomeBadge(selected.outcome)}
                      className="uppercase text-[10px] font-bold tracking-wider"
                    >
                      {getOutcomeLabel(selected.outcome)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                    <MapPin size={14} /> Unit {selected.unit} ·{" "}
                    {selected.property} · {selected.time}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 font-semibold text-gray-600"
                  >
                    Schedule Follow-up
                  </Button>
                  <Button size="sm" className="h-9 font-semibold gap-1.5">
                    Call Again <Phone size={14} />
                  </Button>
                </div>
              </div>

              {/* AI Summary Card */}
              <Card className="shadow-sm border-gray-200 overflow-hidden">
                <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-200 flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded bg-gray-900 text-white flex items-center justify-center">
                    <Sparkles size={12} />
                  </div>
                  <span className="font-bold text-sm text-gray-900">
                    Sara&apos;s Analysis
                  </span>
                </div>
                <CardContent className="p-5">
                  <p className="text-[14px] leading-relaxed text-gray-700">
                    {selected.summary}
                  </p>
                  {selected.promiseAmount && (
                    <div className="grid grid-cols-3 gap-3 mt-5">
                      <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                        <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1">
                          Promised
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {selected.promiseAmount}
                        </p>
                      </div>
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                        <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-1">
                          Date
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {selected.promiseDate}
                        </p>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                          Sentiment
                        </p>
                        <p className="text-lg font-bold text-gray-900 flex items-center gap-1.5 capitalize">
                          {getSentimentIcon(selected.sentiment)}{" "}
                          {selected.sentiment}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Transcript */}
              <Card className="shadow-sm border-gray-200">
                <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-gray-900">
                    Call Transcript
                  </h3>
                  <Badge
                    variant="secondary"
                    className="font-medium bg-gray-100 text-gray-600"
                  >
                    {selected.language}
                  </Badge>
                </div>
                <CardContent className="p-5 p-0">
                  {selected.transcript.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {selected.transcript.map((line, i) => (
                        <div
                          key={i}
                          className={`p-4 flex gap-4 ${line.role === "sara" ? "bg-blue-50/30" : "bg-white"}`}
                        >
                          <div
                            className={`shrink-0 w-14 text-[11px] font-bold uppercase tracking-wider mt-0.5 ${line.role === "sara" ? "text-blue-600" : "text-gray-400"}`}
                          >
                            {line.role === "sara" ? "Sara" : "Tenant"}
                          </div>
                          <div className="flex-1 text-[13.5px] leading-relaxed text-gray-800">
                            {line.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 flex flex-col items-center justify-center text-center">
                      <div className="text-4xl mb-4">
                        {selected.outcome === "live" ? "🔴" : "��"}
                      </div>
                      <h4 className="text-base font-bold text-gray-900 mb-1">
                        {selected.outcome === "live"
                          ? "Call in progress..."
                          : "No Transcript Available"}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {selected.outcome === "live"
                          ? "Transcript text will appear here once the call ends."
                          : "This call went unanswered, so no audio was recorded."}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm font-medium">
            Select a call to view robust details
          </div>
        )}
      </div>
    </div>
  );
}
