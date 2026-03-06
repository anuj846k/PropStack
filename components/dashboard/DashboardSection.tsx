"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowUpRight,
  Bell,
  Building2,
  IndianRupee,
  Lightbulb,
  Lock,
  MessageSquare,
  MoreHorizontal,
  Search,
  Snowflake,
  Sparkles,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import type { ElementType } from "react";

import { mockTickets } from "@/lib/data/dashboard";
import { getStatusBadge, getStatusLabel } from "@/lib/utils/dashboard";

/* ------------------------------------------------------------------ */
/*  Ticket Icon mapper                                                 */
/* ------------------------------------------------------------------ */
const ticketIconMap: Record<string, ElementType> = {
  wrench: Wrench,
  snowflake: Snowflake,
  lightbulb: Lightbulb,
  lock: Lock,
};

function TicketIcon({ iconType, severity }: { iconType: string; severity: string }) {
  const Icon = ticketIconMap[iconType] || Wrench;
  const colorMap: Record<string, string> = {
    high: "text-red-500",
    medium: "text-amber-500",
    low: "text-green-500",
  };
  return <Icon size={18} className={colorMap[severity] || "text-gray-500"} />;
}

/* ------------------------------------------------------------------ */
/*  Stat Card                                                          */
/* ------------------------------------------------------------------ */
function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  trend,
  trendLabel,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  trend: string;
  trendLabel: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon size={20} className={iconColor} />
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <div className="flex items-end gap-3">
        <span className="text-2xl font-bold text-gray-900 tracking-tight">{value}</span>
        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mb-0.5">
          <TrendingUp size={12} />
          {trend}
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-1.5">{trendLabel}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Feed Item                                                          */
/* ------------------------------------------------------------------ */
function FeedItem({
  dot,
  title,
  time,
  tag,
}: {
  dot: string;
  title: string;
  time: string;
  tag: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4 hover:bg-gray-50/80 transition-colors rounded-xl cursor-pointer">
      <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${dot}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 leading-snug">{title}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[11px] text-gray-400 font-medium">{time}</span>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            • {tag}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export function DashboardSection({
  setScreen,
}: {
  setScreen: (id: string) => void;
}) {
  return (
    <ScrollArea className="flex-1">
      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Hello, Anuj!
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Explore information and activity about your properties
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 w-64 shadow-sm">
              <Search size={16} className="text-gray-400" />
              <span className="text-sm text-gray-400">Search Anything...</span>
            </div>
            <button className="relative w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors shadow-sm">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full ring-2 ring-[#f5f6fa]" />
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <StatCard
            icon={Building2}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            label="Total Properties"
            value="3"
            trend="+20%"
            trendLabel="Last month total 2"
          />
          <StatCard
            icon={Users}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
            label="Occupied Units"
            value="8"
            trend="+15%"
            trendLabel="Last month total 7"
          />
          <StatCard
            icon={IndianRupee}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            label="Monthly Rent"
            value="₹4.25L"
            trend="+12%"
            trendLabel="Last month total ₹3.8L"
          />
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Live Telemetry */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">
                Live Telemetry
              </h2>
              <button
                onClick={() => setScreen("agents")}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
              >
                View All
                <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="px-4 py-2 divide-y divide-gray-50">
              <FeedItem
                dot="bg-purple-500"
                title="Sara is calling Priya Sharma — AC follow-up"
                time="Live Now"
                tag="Actioning"
              />
              <FeedItem
                dot="bg-emerald-500"
                title="Rent Promise: Rahul Mehta pledged ₹18k by 24th"
                time="9:14 AM"
                tag="Recorded"
              />
              <FeedItem
                dot="bg-red-500"
                title="Vision Check: Bathroom pipe image flagged HIGH sev."
                time="2m ago"
                tag="Analysis"
              />
              <FeedItem
                dot="bg-amber-500"
                title="Unanswered Call: Sneha Patil. Retry queued 2PM"
                time="9:31 AM"
                tag="Scheduled"
              />
            </div>
          </div>

          {/* Urgent Tickets */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">
                Maintenance Requests
              </h2>
              <button
                onClick={() => setScreen("tickets")}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
              >
                See All
                <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {mockTickets.slice(0, 4).map((t) => (
                <div
                  key={t.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        t.severity === "high"
                          ? "bg-red-50 border-red-100"
                          : t.severity === "medium"
                            ? "bg-amber-50 border-amber-100"
                            : "bg-green-50 border-green-100"
                      }`}
                    >
                      <TicketIcon iconType={t.iconType} severity={t.severity} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {t.issue}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Unit {t.unit} · {t.tenant}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <Badge
                      variant={getStatusBadge(t.status)}
                      className="text-[10px] uppercase font-semibold tracking-wider px-2 h-5"
                    >
                      {getStatusLabel(t.status)}
                    </Badge>
                    <span
                      className={`text-[10px] uppercase font-semibold tracking-wider ${
                        t.severity === "high"
                          ? "text-red-500"
                          : "text-amber-500"
                      }`}
                    >
                      {t.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Ask Sara", Icon: MessageSquare, screen: "chat", bg: "bg-blue-50 border-blue-100 hover:bg-blue-100", iconColor: "text-blue-600" },
                { label: "View Properties", Icon: Building2, screen: "properties", bg: "bg-indigo-50 border-indigo-100 hover:bg-indigo-100", iconColor: "text-indigo-600" },
                { label: "AI Agent Logs", Icon: Sparkles, screen: "agents", bg: "bg-purple-50 border-purple-100 hover:bg-purple-100", iconColor: "text-purple-600" },
                { label: "Maintenance", Icon: Wrench, screen: "tickets", bg: "bg-amber-50 border-amber-100 hover:bg-amber-100", iconColor: "text-amber-600" },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => setScreen(action.screen)}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-colors cursor-pointer ${action.bg}`}
                >
                  <action.Icon size={22} className={action.iconColor} />
                  <span className="text-sm font-semibold text-gray-700">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
