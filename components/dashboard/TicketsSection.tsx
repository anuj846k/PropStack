"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockTickets } from "@/lib/data/dashboard";
import { useState } from "react";
import { getStatusBadge, getStatusLabel } from "@/lib/utils/dashboard";
import {
  Wrench,
  Snowflake,
  Lightbulb,
  Lock,
  Star,
} from "lucide-react";
import type { ElementType } from "react";

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
  return <Icon size={22} className={colorMap[severity] || "text-gray-500"} />;
}

export function TicketsSection() {
  const [filter, setFilter] = useState("all");
  return (
    <div className="flex-1 flex overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-8 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Maintenance Triage
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                4 active workflow items
              </p>
            </div>
            <Button className="font-semibold shadow-sm rounded-xl px-5">
              New Ticket
            </Button>
          </div>

          <Tabs
            defaultValue="all"
            className="mb-6"
            value={filter}
            onValueChange={setFilter}
          >
            <TabsList>
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid gap-4">
            {mockTickets.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="p-5 flex items-center gap-5">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border ${
                      t.severity === "high"
                        ? "bg-red-50 border-red-100"
                        : t.severity === "medium"
                          ? "bg-amber-50 border-amber-100"
                          : "bg-green-50 border-green-100"
                    }`}
                  >
                    <TicketIcon iconType={t.iconType} severity={t.severity} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-bold text-gray-900 truncate">
                        {t.issue}
                      </h3>
                      <Badge
                        variant={
                          t.severity === "high"
                            ? "destructive"
                            : t.severity === "medium"
                              ? "warning"
                              : "outline"
                        }
                        className="text-[10px] uppercase font-bold tracking-widest"
                      >
                        {t.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {t.id} · Unit {t.unit} · {t.tenant}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Badge
                      variant={getStatusBadge(t.status)}
                      className="capitalize px-2.5"
                    >
                      {getStatusLabel(t.status)}
                    </Badge>
                    <span className="text-[11px] text-gray-400 font-semibold tracking-wider uppercase">
                      {t.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Vendor Directory */}
      <div className="w-80 border-l border-gray-200/80 bg-white flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Smart Vendor Routing</h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Sara automatically directs high-probability tasks to these matched
            professionals.
          </p>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {[
              {
                name: "Ravi Plumber",
                phone: "+91 98201 11111",
                tag: "Plumbing",
                rating: "4.8",
                available: true,
              },
              {
                name: "Suresh Electric",
                phone: "+91 90112 22222",
                tag: "Electrical",
                rating: "4.6",
                available: true,
              },
              {
                name: "AC Cool Services",
                phone: "+91 99321 44444",
                tag: "HVAC",
                rating: "4.7",
                available: true,
              },
              {
                name: "Mohan Carpenter",
                phone: "+91 87654 33333",
                tag: "Carpentry",
                rating: "4.5",
                available: false,
              },
            ].map((v, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-sm text-gray-900">
                      {v.name}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {v.phone}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-blue-50 text-blue-700 hover:bg-blue-100"
                  >
                    {v.tag}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[11px] font-bold text-gray-600 flex items-center gap-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" /> {v.rating}
                  </span>
                  <span
                    className={`text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 ${
                      v.available ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        v.available ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                    {v.available ? "Available" : "Busy"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <Button
            variant="outline"
            className="w-full font-semibold border-dashed border-2 border-gray-300 bg-transparent text-gray-600 hover:bg-gray-100 rounded-xl"
          >
            + Register Vendor
          </Button>
        </div>
      </div>
    </div>
  );
}
