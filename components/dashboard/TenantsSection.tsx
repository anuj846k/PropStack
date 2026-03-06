"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useEffect, useState } from "react";
import { ContentLoader } from "@/components/loading-provider";
import {
  BarChart3,
  IndianRupee,
  AlertTriangle,
} from "lucide-react";

import { getTenants, initiateCall, type Tenant } from "@/lib/api";

interface TenantsSectionProps {
  onViewTenant: (tenant: Tenant) => void;
}

export function TenantsSection({ onViewTenant }: TenantsSectionProps) {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [callingTenant, setCallingTenant] = useState<string | null>(null);

  useEffect(() => {
    async function loadTenants() {
      try {
        const data = await getTenants();
        setTenants(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tenants");
      } finally {
        setLoading(false);
      }
    }
    loadTenants();
  }, []);

  const handleCallTenant = useCallback(async (tenant: Tenant) => {
    setCallingTenant(tenant.tenant_id);
    try {
      const result = await initiateCall(tenant.tenant_id);
      if (result.status === "initiated" || result.status === "queued") {
        alert(`Call initiated to ${tenant.tenant_name}!`);
      } else {
        alert(`Failed to initiate call: ${result.message}`);
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "Failed to call"}`);
    } finally {
      setCallingTenant(null);
    }
  }, []);

  const overdueTenants = tenants.filter((t) => t.is_overdue);
  const totalRent = tenants.reduce((sum, t) => sum + t.rent_amount, 0);
  const collectedRent = tenants
    .filter((t) => !t.is_overdue)
    .reduce((sum, t) => sum + t.rent_amount, 0);

  if (loading) {
    return (
      <div className="flex-1 flex">
        <ContentLoader message="Loading tenants..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Tenant Directory
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {tenants.length} active leases · {overdueTenants.length} flagged for review
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <BarChart3 size={18} className="text-emerald-600" />
              </div>
              <p className="text-sm font-medium text-gray-500">Collection Rate</p>
            </div>
            <div className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
              {tenants.length > 0 ? Math.round((collectedRent / totalRent) * 100) : 0}%
            </div>
            <div className="text-xs font-semibold text-emerald-600">
              ₹{(collectedRent / 1000).toFixed(0)}k of ₹{(totalRent / 1000).toFixed(0)}k
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <IndianRupee size={18} className="text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-500">Occupancy</p>
            </div>
            <div className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
              {tenants.length} Units
            </div>
            <div className="text-xs font-semibold text-blue-600">
              All units occupied
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertTriangle size={18} className="text-red-500" />
              </div>
              <p className="text-sm font-medium text-gray-500">Risk Exposure</p>
            </div>
            <div className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
              ₹{(overdueTenants.reduce((sum, t) => sum + t.rent_amount, 0) / 1000).toFixed(0)}k
            </div>
            <div className="text-xs font-semibold text-red-500">
              {overdueTenants.length} individuals overdue
            </div>
          </div>
        </div>

        {/* Tenant Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/80">
              <TableRow>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                  Tenant
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                  Unit
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                  Rent (Mo)
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                  Property
                </TableHead>
                <TableHead className="text-right font-semibold text-xs uppercase tracking-wider text-gray-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((t) => (
                <TableRow
                  key={t.tenant_id}
                  className="hover:bg-gray-50/60 cursor-pointer"
                >
                  <TableCell>
                    <div className="font-semibold text-sm text-gray-900">
                      {t.tenant_name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {t.tenant_phone || "No phone"}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-700 text-sm">
                    {t.unit_number}
                  </TableCell>
                  <TableCell className="font-bold text-gray-900">
                    ₹{(t.rent_amount / 1000).toFixed(0)}k
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={t.is_overdue ? "destructive" : "success"}
                      className="uppercase text-[10px] font-semibold tracking-wider"
                    >
                      {t.is_overdue ? "overdue" : "paid"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {t.property_name}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold rounded-lg"
                        onClick={() => handleCallTenant(t)}
                        disabled={callingTenant === t.tenant_id}
                      >
                        {callingTenant === t.tenant_id ? "Calling..." : "Deploy AI Call"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-semibold rounded-lg"
                        onClick={() => onViewTenant(t)}
                      >
                        Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ScrollArea>
  );
}
