"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { mockCalls, mockTickets } from "@/lib/data/dashboard";
import {
  getMaintenanceTickets,
  getProperties,
  getVacancyCost,
  type MaintenanceTicket,
  type Property,
  type VacancyCostSummary,
} from "@/lib/api";
import { getStatusLabel } from "@/lib/utils/dashboard";
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
  TrendingDown,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import type { CSSProperties, ElementType } from "react";
import { useEffect, useMemo, useState } from "react";

const ticketIconMap: Record<string, ElementType> = {
  wrench: Wrench,
  snowflake: Snowflake,
  lightbulb: Lightbulb,
  lock: Lock,
};

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function MetricCard({
  icon: Icon,
  title,
  value,
  trend,
  trendLabel,
  trendTone,
}: {
  icon: ElementType;
  title: string;
  value: string;
  trend: string;
  trendLabel: string;
  trendTone: "up" | "down" | "neutral";
}) {
  const trendClass =
    trendTone === "up"
      ? "bg-emerald-50 text-emerald-700"
      : trendTone === "down"
        ? "bg-red-50 text-red-700"
        : "bg-slate-100 text-slate-600";

  return (
    <article className="rounded-[22px] border border-[#d9e5f4] bg-white/90 p-5 shadow-[0_10px_30px_rgba(29,69,122,0.08)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ebf3ff] text-[#3d6fb4]">
            <Icon className="h-[18px] w-[18px]" />
          </div>
          <p className="text-[15px] font-medium text-[#263041]">{title}</p>
        </div>
        <button className="text-[#8fa2bc] transition-colors hover:text-[#4f6785]" aria-label={`${title} actions`}>
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-end gap-3">
        <p className="text-[34px] font-semibold tracking-tight text-[#1f2837]">{value}</p>
        <span className={`mb-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${trendClass}`}>
          {trendTone === "down" ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
          {trend}
        </span>
      </div>
      <p className="mt-1 text-xs text-[#7a899e]">{trendLabel}</p>
    </article>
  );
}

function TicketIcon({ iconType, severity }: { iconType: string; severity: string }) {
  const Icon = ticketIconMap[iconType] || Wrench;
  const iconColor =
    severity === "high"
      ? "text-red-600"
      : severity === "medium"
        ? "text-amber-600"
        : "text-emerald-600";

  return <Icon className={`h-4 w-4 ${iconColor}`} />;
}

export function DashboardSection({ setScreen }: { setScreen: (id: string) => void }) {
  const [vacancy, setVacancy] = useState<VacancyCostSummary | null>(null);
  const [vacancyError, setVacancyError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<MaintenanceTicket[] | null>(null);
  const [properties, setProperties] = useState<Property[] | null>(null);
  const [propertiesError, setPropertiesError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadVacancy() {
      try {
        const data = await getVacancyCost();
        if (!cancelled) {
          setVacancy(data);
        }
      } catch (err) {
        if (!cancelled) {
          setVacancyError(
            err instanceof Error ? err.message : "Failed to load vacancy cost",
          );
        }
      }
    }

    void loadVacancy();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProperties() {
      try {
        const data = await getProperties();
        if (!cancelled) {
          setProperties(data);
        }
      } catch (err) {
        if (!cancelled) {
          setPropertiesError(
            err instanceof Error ? err.message : "Failed to load properties",
          );
        }
      }
    }

    void loadProperties();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadTickets() {
      try {
        // Fetch the most recent open tickets for this landlord
        const data = await getMaintenanceTickets("open");
        if (!cancelled) {
          setTickets(data);
        }
      } catch {
        // For now we silently fall back to mock data in the UI if tickets fail to load.
      }
    }

    void loadTickets();

    return () => {
      cancelled = true;
    };
  }, []);

  const vacancyCost = vacancy?.total_vacancy_cost ?? 0;

  const totalProperties = properties?.length ?? 0;
  const totalUnits = properties
    ? properties.reduce((sum, p) => sum + (p.total_units ?? 0), 0)
    : 0;
  const totalOccupiedUnits = properties
    ? properties.reduce((sum, p) => sum + (p.occupied_units ?? 0), 0)
    : 0;
  const openTickets =
    tickets && tickets.length > 0
      ? tickets.length
      : mockTickets.filter((ticket) => ticket.status !== "resolved").length;

  const weeklyPulse = useMemo(() => {
    const fallback = [2840, 3175, 3260, 4090, 3320, 3380, 3240];
    return fallback.map((value, index) => ({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index],
      value,
    }));
  }, []);

  const peakBarIndex = useMemo(() => {
    let best = 0;
    weeklyPulse.forEach((point, index) => {
      if (point.value > weeklyPulse[best].value) {
        best = index;
      }
    });
    return best;
  }, [weeklyPulse]);

  const peakBar = weeklyPulse[peakBarIndex];
  const maxPulse = Math.max(...weeklyPulse.map((point) => point.value), 1);

  const pieSegments = useMemo(() => {
    const segments = [
      {
        label: "Vacancy",
        value: Math.max(vacancyCost, 4000),
        color: "#3982e9",
      },
      {
        label: "Open Tickets",
        value: Math.max(openTickets * 4500, 3000),
        color: "#afd0f7",
      },
      {
        label: "Buffer",
        value: 6500,
        color: "#d5e7fd",
      },
    ];

    const total = segments.reduce((sum, item) => sum + item.value, 0);
    let running = 0;
    const gradient = segments
      .map((segment) => {
        const start = (running / total) * 100;
        running += segment.value;
        const end = (running / total) * 100;
        return `${segment.color} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
      })
      .join(", ");

    return {
      legend: segments,
      total,
      gradient,
    };
  }, [openTickets, vacancyCost]);

  const pieStyle: CSSProperties = {
    background: `conic-gradient(${pieSegments.gradient})`,
  };

  const recentRentCalls = mockCalls
    .filter((activity) => activity.type === "rent_collection")
    .slice(0, 3)
    .map((activity) => ({
      id: activity.id,
      tenant: activity.tenant,
      unit: activity.unit,
      property: activity.property,
      type: activity.type,
      status: activity.status,
      time: activity.time,
      valueLabel: activity.promiseAmount ?? activity.duration,
      valueTone:
        activity.status === "in_progress"
          ? "warning"
          : activity.outcome === "no_answer"
            ? "negative"
            : "neutral",
    }));

  return (
    <ScrollArea className="h-full">
      <div className="mx-auto w-full max-w-[1240px] px-4 pb-6 pt-2 md:px-8 md:pb-8 md:pt-8">
        <header className="mb-5 flex flex-col gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-[34px] font-semibold tracking-tight text-[#1f2837]">Hello, Anuj!</h1>
            <p className="mt-1 text-sm text-[#5f7088]">Explore information and activity about your properties</p>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <label className="flex h-12 w-full items-center gap-2 rounded-full border border-[#dae7f6] bg-white px-4 shadow-sm md:w-[320px]">
              <Search className="h-4 w-4 text-[#7f93ae]" />
              <input
                className="w-full bg-transparent text-sm text-[#23344d] placeholder:text-[#8ea2bc] focus:outline-none"
                placeholder="Search Anything..."
              />
            </label>
            <button className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#dae7f6] bg-white text-[#556a85] shadow-sm transition-colors hover:bg-[#f3f8ff]">
              <MessageSquare className="h-4 w-4" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <button className="flex h-11 w-11 items-center justify-center rounded-full border border-[#dae7f6] bg-white text-[#556a85] shadow-sm transition-colors hover:bg-[#f3f8ff]">
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </header>

        <section className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
          <MetricCard
            icon={Building2}
            title="Total Property"
            value={totalProperties.toString()}
            trend={propertiesError ? "Error" : "Live"}
            trendLabel={
              propertiesError ??
              (totalProperties > 0
                ? `${totalProperties} properties with ${totalUnits} total units`
                : "No properties found")
            }
            trendTone={propertiesError ? "down" : "neutral"}
          />
          <MetricCard
            icon={Users}
            title="Occupied Units"
            value={totalOccupiedUnits.toString()}
            trend={propertiesError ? "Error" : "Live"}
            trendLabel={
              propertiesError ??
              (totalUnits > 0
                ? `${totalOccupiedUnits} of ${totalUnits} units occupied`
                : "No units found")
            }
            trendTone={propertiesError ? "down" : "neutral"}
          />
          <MetricCard
            icon={IndianRupee}
            title="Vacancy Cost"
            value={formatCurrency(vacancyCost)}
            trend={vacancyError ? "Error" : "Live"}
            trendLabel={
              vacancyError ??
              (vacancy && vacancy.total_vacant_units > 0
                ? `${vacancy.total_vacant_units} units currently vacant`
                : "No vacant units right now")
            }
            trendTone={vacancyError ? "down" : "neutral"}
          />
        </section>

        <section className="mb-4 grid grid-cols-1 gap-3 xl:grid-cols-[2fr_1fr]">
          <article className="rounded-[24px] border border-[#d9e5f4] bg-white/90 p-5 shadow-[0_10px_30px_rgba(29,69,122,0.08)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xl font-semibold text-[#1f2837]">Portfolio Pulse</p>
                <p className="mt-1 text-xs text-[#7688a1]">
                  {vacancyError
                    ? vacancyError
                    : `Vacancy impact this month: ${formatCurrency(vacancyCost)}`}
                </p>
              </div>
              <button
                onClick={() => setScreen("agents")}
                className="inline-flex items-center gap-1 rounded-full border border-[#d7e4f4] px-3 py-1.5 text-xs font-semibold text-[#4f6785] transition-colors hover:bg-[#f2f7ff]"
              >
                Live Feed
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="relative rounded-[18px] border border-[#e6eff9] bg-[#f8fbff] p-4">
              <div className="pointer-events-none absolute left-0 right-0 top-4 grid grid-rows-4 gap-7 px-4">
                <div className="border-t border-dashed border-[#d9e6f6]" />
                <div className="border-t border-dashed border-[#d9e6f6]" />
                <div className="border-t border-dashed border-[#d9e6f6]" />
                <div className="border-t border-dashed border-[#d9e6f6]" />
              </div>

              <div className="relative flex h-[180px] items-end gap-2 md:gap-3">
                {weeklyPulse.map((point, index) => {
                  const active = index === peakBarIndex;
                  return (
                    <div key={point.day} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className={`w-full rounded-lg ${
                          active
                            ? "bg-[#4d7fb6] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)]"
                            : "bg-[#d5e4f6]"
                        }`}
                        style={{ height: `${Math.max((point.value / maxPulse) * 128, 24)}px` }}
                      />
                      <span className="text-[11px] text-[#6e8099]">{point.day}</span>
                    </div>
                  );
                })}
              </div>

              <div className="absolute right-4 top-3 rounded-xl border border-[#dce8f8] bg-white px-3 py-2 shadow-sm">
                <p className="text-[11px] font-semibold text-[#335279]">{formatCurrency(peakBar.value)}</p>
                <p className="text-[10px] text-[#8ca0ba]">{peakBar.day} peak</p>
              </div>
            </div>
          </article>

          <article className="rounded-[24px] border border-[#d9e5f4] bg-white/90 p-5 shadow-[0_10px_30px_rgba(29,69,122,0.08)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xl font-semibold text-[#1f2837]">Cost Breakdown</p>
              <button
                onClick={() => setScreen("properties")}
                className="text-xs font-medium text-[#5e7390] transition-colors hover:text-[#1f385c]"
              >
                See Details
              </button>
            </div>

            <div className="flex flex-col items-center gap-5 md:flex-row md:items-start md:justify-between xl:flex-col xl:items-center">
              <div className="relative h-44 w-44 rounded-full" style={pieStyle}>
                <div className="absolute inset-[22%] rounded-full bg-white" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-2xl font-semibold text-[#1f2837]">{formatCurrency(pieSegments.total)}</p>
                </div>
              </div>

              <div className="space-y-3">
                {pieSegments.legend.map((segment) => (
                  <div key={segment.label} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                    <span className="min-w-[78px] text-xs text-[#647991]">{segment.label}</span>
                    <span className="text-xs font-semibold text-[#4e682f]">{formatCurrency(segment.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          <article className="rounded-[24px] border border-[#d9e5f4] bg-white/90 p-5 shadow-[0_10px_30px_rgba(29,69,122,0.08)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xl font-semibold text-[#1f2837]">Recent Rent Collection</p>
              <button
                onClick={() => setScreen("agents")}
                className="text-xs font-medium text-[#5e7390] transition-colors hover:text-[#1f385c]"
              >
                See All
              </button>
            </div>

            <div className="space-y-3">
              {recentRentCalls.map((activity) => {
                const valueClass =
                  activity.valueTone === "warning"
                    ? "text-amber-700"
                    : activity.valueTone === "negative"
                      ? "text-red-700"
                      : "text-[#2f5b88]";

                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between rounded-2xl border border-[#e5eef9] bg-[#f8fbff] px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#1f2837]">
                        {activity.tenant} • {activity.property}
                      </p>
                      <p className="mt-1 text-xs text-[#7b8ca2]">
                        {activity.time} · {activity.type.replace("_", " ")}
                      </p>
                    </div>
                    <span className={`ml-4 shrink-0 text-sm font-semibold ${valueClass}`}>
                      {activity.valueLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="rounded-[24px] border border-[#d9e5f4] bg-white/90 p-5 shadow-[0_10px_30px_rgba(29,69,122,0.08)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xl font-semibold text-[#1f2837]">Maintenance Request</p>
              <button
                onClick={() => setScreen("tickets")}
                className="text-xs font-medium text-[#5e7390] transition-colors hover:text-[#1f385c]"
              >
                See All
              </button>
            </div>

            <div className="space-y-3">
              {(tickets && tickets.length > 0 ? tickets.slice(0, 3) : mockTickets).map((ticket) => {
                const isApiTicket = !("issue" in ticket);
                const apiTicket = ticket as MaintenanceTicket;
                const severity =
                  isApiTicket && apiTicket.priority
                    ? apiTicket.priority === "high"
                      ? "high"
                      : apiTicket.priority === "medium"
                        ? "medium"
                        : "low"
                    : (ticket as typeof mockTickets[number]).severity ?? "medium";
                const severityBorder =
                  severity === "high"
                    ? "border-red-100 bg-red-50"
                    : severity === "medium"
                      ? "border-amber-100 bg-amber-50"
                      : "border-emerald-100 bg-emerald-50";
                const unitLabel = isApiTicket
                  ? apiTicket.unit?.unit_number ?? "—"
                  : (ticket as typeof mockTickets[number]).unit;
                const tenantLabel = isApiTicket
                  ? apiTicket.tenant?.name ?? "Unknown tenant"
                  : (ticket as typeof mockTickets[number]).tenant;
                const status = isApiTicket ? apiTicket.status ?? "open" : (ticket as typeof mockTickets[number]).status;
                const issueTitle = isApiTicket
                  ? apiTicket.title ?? apiTicket.ai_summary ?? "Maintenance issue"
                  : (ticket as typeof mockTickets[number]).issue;
                const iconType = isApiTicket
                  ? apiTicket.issue_category === "plumbing" ||
                      apiTicket.issue_category === "carpentry" ||
                      apiTicket.issue_category === "other"
                    ? "wrench"
                    : apiTicket.issue_category === "electrical"
                      ? "lightbulb"
                      : apiTicket.issue_category === "cleaning"
                        ? "snowflake"
                        : "lock"
                  : (ticket as typeof mockTickets[number]).iconType;

                return (
                  <div
                    key={ticket.id}
                    className="grid grid-cols-1 gap-2 rounded-2xl border border-[#e5eef9] bg-[#f8fbff] px-4 py-3 md:grid-cols-[1.8fr_1fr_1fr] md:items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${severityBorder}`}>
                        <TicketIcon iconType={iconType} severity={severity} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1f2837]">{issueTitle}</p>
                        <p className="text-[11px] text-[#8294ad]">
                          Unit {unitLabel} · {ticket.id}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs font-medium text-[#4f6785] md:text-sm">{tenantLabel}</p>

                    <div className="flex items-center justify-between md:justify-end md:gap-3">
                      <span className="text-xs font-medium uppercase tracking-wide text-[#6b7f97]">
                        {getStatusLabel(status)}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          severity === "high"
                            ? "bg-red-100 text-red-700"
                            : severity === "medium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {severity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </section>
      </div>
    </ScrollArea>
  );
}
