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

export function TenantsSection() {
  return (
    <ScrollArea className="flex-1 bg-gray-50/30">
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tenant Directory
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-1">
              4 active leases · 2 flagged for review
            </p>
          </div>
          <Button className="font-semibold shadow-sm">Add Tenant</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[
            {
              label: "Collection Velocity",
              val: "100% Rate",
              sub: "Perfect record this month",
              color: "text-green-600",
            },
            {
              label: "Occupancy",
              val: "24 Units",
              sub: "1 vacant property detected",
              color: "text-blue-600",
            },
            {
              label: "Risk Exposure",
              val: "₹43k Late",
              sub: "2 individuals overdue",
              color: "text-red-500",
            },
          ].map((k, i) => (
            <Card key={i} className="shadow-sm border-gray-200/60">
              <CardContent className="p-5">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  {k.label}
                </p>
                <div className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
                  {k.val}
                </div>
                <div className={`text-xs font-semibold ${k.color}`}>
                  {k.sub}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-sm border-gray-200/60 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-gray-500">
                  Tenant
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-gray-500">
                  Unit
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-gray-500">
                  Rent (Mo)
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-gray-500">
                  Status
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-gray-500">
                  Lease term
                </TableHead>
                <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-gray-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTenants.map((t) => (
                <TableRow
                  key={t.id}
                  className="hover:bg-gray-50/80 cursor-pointer"
                >
                  <TableCell>
                    <div className="font-bold text-sm text-gray-900">
                      {t.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 font-medium">
                      {t.property}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-gray-700 text-sm">
                    {t.unit}
                  </TableCell>
                  <TableCell className="font-bold text-gray-900">
                    ₹{(t.rent / 1000).toFixed(0)}k
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={t.status === "paid" ? "success" : "destructive"}
                      className="uppercase text-[10px] font-bold tracking-wider"
                    >
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-gray-500">
                    {t.lease}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold"
                      >
                        Deploy AI Call
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-semibold"
                      >
                        Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </ScrollArea>
  );
}
