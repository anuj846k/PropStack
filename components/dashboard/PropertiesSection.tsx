"use client";

import { Suspense, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Building2,
  Home,
  MapPin,
  ChevronRight,
  Users,
  DoorOpen,
} from "lucide-react";
import { getProperties, getPropertyUnits, type Property, type Unit, type Tenant } from "@/lib/api";
import { useLoading, ContentLoader } from "@/components/loading-provider";
import { Skeleton } from "../ui/skeleton";

interface PropertyWithUnits extends Property {
  units?: Unit[];
  expanded?: boolean;
}

interface PropertiesSectionProps {
  onViewTenant: (tenant: Tenant) => void;
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
  sub,
  subColor,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string | number;
  sub: string;
  subColor: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon size={18} className={iconColor} />
        </div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
      </div>
      <div className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
        {value}
      </div>
      <div className={`text-xs font-semibold ${subColor}`}>{sub}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Content                                                       */
/* ------------------------------------------------------------------ */
function PropertiesSectionContent({ onViewTenant }: PropertiesSectionProps) {
  const { startLoading, stopLoading } = useLoading();
  const [properties, setProperties] = useState<PropertyWithUnits[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedProperty, setExpandedProperty] = useState<string | null>(null);
  const [propertyUnits, setPropertyUnits] = useState<Record<string, Unit[]>>({});
  const [loadingUnits, setLoadingUnits] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadProperties() {
      startLoading();
      try {
        const data = await getProperties();
        setProperties(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load properties");
      } finally {
        setLoading(false);
        stopLoading();
      }
    }
    loadProperties();
  }, [startLoading, stopLoading]);

  const handleToggleExpand = async (propertyId: string) => {
    if (expandedProperty === propertyId) {
      setExpandedProperty(null);
      return;
    }

    setExpandedProperty(propertyId);

    if (!propertyUnits[propertyId]) {
      setLoadingUnits((prev) => ({ ...prev, [propertyId]: true }));
      startLoading();
      try {
        const units = await getPropertyUnits(propertyId);
        setPropertyUnits((prev) => ({ ...prev, [propertyId]: units }));
      } catch (err) {
        console.error("Failed to load units:", err);
      } finally {
        setLoadingUnits((prev) => ({ ...prev, [propertyId]: false }));
        stopLoading();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex">
        <ContentLoader message="Loading properties..." />
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

  const totalUnits = properties.reduce((sum, p) => sum + p.total_units, 0);
  const occupiedUnits = properties.reduce((sum, p) => sum + p.occupied_units, 0);
  const vacantUnits = properties.reduce((sum, p) => sum + p.vacant_units, 0);

  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden">
      <ScrollArea className="h-full min-h-0 flex-1">
        <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Properties
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {properties.length} buildings · {totalUnits} units
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <StatCard
            icon={Building2}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            label="Total Properties"
            value={properties.length}
            sub="Buildings managed"
            subColor="text-blue-600"
          />
          <StatCard
            icon={Users}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            label="Occupied Units"
            value={occupiedUnits}
            sub={`${totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0}% occupancy`}
            subColor="text-emerald-600"
          />
          <StatCard
            icon={DoorOpen}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            label="Vacant Units"
            value={vacantUnits}
            sub="Ready for lease"
            subColor="text-amber-600"
          />
        </div>

        {/* Property List */}
        <div className="space-y-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => handleToggleExpand(property.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{property.name}</h3>
                    {property.address && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {property.address}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{property.total_units} units</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="success" className="text-[10px]">
                        {property.occupied_units} occupied
                      </Badge>
                      {property.vacant_units > 0 && (
                        <Badge variant="outline" className="text-[10px]">
                          {property.vacant_units} vacant
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ChevronRight
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                      expandedProperty === property.id ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </div>

              {expandedProperty === property.id && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-5">
                  {loadingUnits[property.id] ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="w-full h-20 rounded-2xl" />
                      ))}
                    </div>
                  ) : propertyUnits[property.id]?.length === 0 ? (
                    <p className="text-sm text-gray-500">No units in this property</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {propertyUnits[property.id]?.map((unit) => (
                        <div
                          key={unit.id}
                          className={`bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between transition-colors ${
                            unit.occupancy_status === "occupied" && unit.tenant_name
                              ? "cursor-pointer hover:border-blue-300 hover:bg-blue-50/30"
                              : ""
                          }`}
                          onClick={() => {
                            if (unit.occupancy_status === "occupied" && unit.tenant_name && unit.tenant_id) {
                              onViewTenant({
                                tenant_id: unit.tenant_id,
                                tenant_name: unit.tenant_name,
                                tenant_phone: null,
                                tenant_email: null,
                                unit_id: unit.id,
                                unit_number: unit.unit_number,
                                property_name: property.name,
                                property_address: property.address,
                                rent_amount: unit.rent_amount,
                                days_overdue: 0,
                                is_overdue: false,
                                payment_status: "unpaid",
                              });
                            }
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                              <Home className="h-4 w-4 text-gray-500" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                Unit {unit.unit_number}
                              </p>
                              <p className="text-xs text-gray-500">
                                ₹{unit.rent_amount.toLocaleString()}/mo
                              </p>
                              {unit.occupancy_status === "occupied" && unit.tenant_name && (
                                <p className="text-xs text-blue-600 font-medium mt-0.5">
                                  {unit.tenant_name}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge
                            variant={unit.occupancy_status === "occupied" ? "success" : "outline"}
                            className="text-[10px]"
                          >
                            {unit.occupancy_status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function PropertiesFallback() {
  return (
    <div className="flex-1 flex">
      <ContentLoader message="Loading properties..." />
    </div>
  );
}

export function PropertiesSection(props: PropertiesSectionProps) {
  return (
    <Suspense fallback={<PropertiesFallback />}>
      <PropertiesSectionContent {...props} />
    </Suspense>
  );
}
