"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      <ScrollArea className="flex-1 bg-gray-50/30">
        <div className="p-8 max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading tenants...</p>
          </div>
        </div>
      </ScrollArea>
    );
  }

  if (error) {
    return (
      <ScrollArea className="flex-1 bg-gray-50/30">
        <div className="p-8 max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="flex-1 bg-gray-50/30">
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tenant Directory
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-1">
              {tenants.length} active leases · {overdueTenants.length} flagged for review
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <Card className="shadow-sm border-gray-200/60">
            <CardContent className="p-5">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Collection Rate
              </p>
              <div className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
                {tenants.length > 0 ? Math.round((collectedRent / totalRent) * 100) : 0}%
              </div>
              <div className="text-xs font-semibold text-green-600">
                ₹{(collectedRent / 1000).toFixed(0)}k of ₹{(totalRent / 1000).toFixed(0)}k
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-gray-200/60">
            <CardContent className="p-5">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Occupancy
              </p>
              <div className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
                {tenants.length} Units
              </div>
              <div className="text-xs font-semibold text-blue-600">
                All units occupied
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-gray-200/60">
            <CardContent className="p-5">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Risk Exposure
              </p>
              <div className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
                ₹{(overdueTenants.reduce((sum, t) => sum + t.rent_amount, 0) / 1000).toFixed(0)}k
              </div>
              <div className="text-xs font-semibold text-red-500">
                {overdueTenants.length} individuals overdue
              </div>
            </CardContent>
          </Card>
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
                  Property
                </TableHead>
                <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-gray-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((t) => (
                <TableRow
                  key={t.tenant_id}
                  className="hover:bg-gray-50/80 cursor-pointer"
                >
                  <TableCell>
                    <div className="font-bold text-sm text-gray-900">
                      {t.tenant_name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 font-medium">
                      {t.tenant_phone || "No phone"}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-gray-700 text-sm">
                    {t.unit_number}
                  </TableCell>
                  <TableCell className="font-bold text-gray-900">
                    ₹{(t.rent_amount / 1000).toFixed(0)}k
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={t.is_overdue ? "destructive" : "success"}
                      className="uppercase text-[10px] font-bold tracking-wider"
                    >
                      {t.is_overdue ? "overdue" : "paid"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-gray-500">
                    {t.property_name}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold"
                        onClick={() => handleCallTenant(t)}
                        disabled={callingTenant === t.tenant_id}
                      >
                        {callingTenant === t.tenant_id ? "Calling..." : "Deploy AI Call"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-semibold"
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
        </Card>
      </div>
    </ScrollArea>
  );
}
