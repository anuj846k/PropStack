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
} from '@/lib/data/dashboard';
import {
  getSeverityBadge,
  getStatusBadge,
  getStatusLabel,
  getOutcomeBadge,
  getOutcomeLabel,
  getSentimentIcon,
} from '@/lib/utils/dashboard';
import { PropLogo } from './PropLogo';

export function DashboardSection({
  setScreen,
}: {
  setScreen: (id: string) => void;
}) {
  return (
    <ScrollArea className="flex-1 bg-gray-50/30">
      <div className="p-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Overview
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-1">
              Saturday, 21 Feb 2026
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              System Nominal
            </div>
            <Button
              onClick={() => setScreen("chat")}
              className="font-semibold shadow-sm px-6"
            >
              Ask Sara
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {[
            {
              label: "Total Monthly Rent",
              val: "₹4,25,000",
              sub: "+12.5% vs last month",
              c: "text-green-600",
              bg: "bg-green-50",
            },
            {
              label: "Maintenance",
              val: "12 Open",
              sub: "3 High Severity",
              c: "text-red-500",
              bg: "bg-red-50",
            },
            {
              label: "AI Efficiency",
              val: "42 hrs",
              sub: "Auto-resolved this mo.",
              c: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Vacancy Cost",
              val: "₹31,000",
              sub: "Lost to vacancy",
              c: "text-amber-600",
              bg: "bg-amber-50",
            },
          ].map((k, i) => (
            <Card
              key={i}
              className="shadow-sm border-gray-200/60 overflow-hidden"
            >
              <CardContent className="p-6">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  {k.label}
                </p>
                <div className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                  {k.val}
                </div>
                <div
                  className={`inline-flex text-xs font-bold px-2 py-1 rounded-md ${k.bg} ${k.c}`}
                >
                  {k.sub}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Live System Feed */}
          <Card className="shadow-sm border-gray-200/60 flex flex-col">
            <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between py-4">
              <CardTitle className="text-base font-bold text-gray-900">
                Live Telemetry
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setScreen("agents")}
                className="text-blue-600 font-semibold hover:text-blue-700 h-8 -mr-2"
              >
                View agent logs &rarr;
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="divide-y divide-gray-100">
                {[
                  {
                    t: "Sara is calling Priya Sharma — AC follow-up",
                    time: "Live Now",
                    badge: "Actioning",
                    dot: "bg-purple-500",
                  },
                  {
                    t: "Rent Promise: Rahul Mehta pledged ₹18k by 24th",
                    time: "9:14 AM",
                    badge: "Recorded",
                    dot: "bg-green-500",
                  },
                  {
                    t: "Vision Check: Bathroom pipe image flagged HIGH sev.",
                    time: "2m ago",
                    badge: "Analysis",
                    dot: "bg-red-500",
                  },
                  {
                    t: "Unanswered Call: Sneha Patil. Retry queued 2PM",
                    time: "9:31 AM",
                    badge: "Scheduled",
                    dot: "bg-amber-500",
                  },
                ].map((f, i) => (
                  <div
                    key={i}
                    className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 shrink-0 ${f.dot}`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-medium text-gray-900 truncate">
                        {f.t}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[11px] text-gray-500 font-medium">
                          {f.time}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          • {f.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Tickets */}
          <Card className="shadow-sm border-gray-200/60 flex flex-col">
            <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between py-4">
              <CardTitle className="text-base font-bold text-gray-900">
                Urgent Tickets
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setScreen("tickets")}
                className="text-blue-600 font-semibold hover:text-blue-700 h-8 -mr-2"
              >
                View board &rarr;
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="divide-y divide-gray-100">
                {mockTickets.slice(0, 4).map((t) => (
                  <div
                    key={t.id}
                    className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl shrink-0 border border-gray-200">
                        {t.emoji}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 mb-0.5">
                          {t.issue}
                        </p>
                        <p className="text-xs text-gray-500">
                          Unit {t.unit} · {t.tenant}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge
                        variant={getStatusBadge(t.status)}
                        className="text-[10px] uppercase font-bold tracking-wider px-2 h-5"
                      >
                        {getStatusLabel(t.status)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[9px] uppercase font-bold tracking-widest px-1.5 h-4 border-0 ${t.severity === "high" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}
                      >
                        {t.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
