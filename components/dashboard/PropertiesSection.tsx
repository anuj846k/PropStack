"use client";

import { Suspense, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Building2,
  Home,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { getProperties, getPropertyUnits, type Property, type Unit, type Tenant } from "@/lib/api";
import { useLoading, InlineLoader } from "@/components/loading-provider";

interface PropertyWithUnits extends Property {
  units?: Unit[];
  expanded?: boolean;
}

interface PropertiesSectionProps {
  onViewTenant: (tenant: Tenant) => void;
}

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
      <ScrollArea className="flex-1 bg-gray-50/30">
        <InlineLoader size={48} />
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

  const totalUnits = properties.reduce((sum, p) => sum + p.total_units, 0);
  const occupiedUnits = properties.reduce((sum, p) => sum + p.occupied_units, 0);
  const vacantUnits = properties.reduce((sum, p) => sum + p.vacant_units, 0);

  return (
    <ScrollArea className="flex-1 bg-gray-50/30">
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Properties
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-1">
              {properties.length} buildings · {totalUnits} units
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <Card className="shadow-sm border-gray-200/60">
            <CardContent className="p-5">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Total Properties
              </p>
              <div className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
                {properties.length}
              </div>
              <div className="text-xs font-semibold text-blue-600">
                Buildings managed
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-gray-200/60">
            <CardContent className="p-5">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Occupied Units
              </p>
              <div className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
                {occupiedUnits}
              </div>
              <div className="text-xs font-semibold text-green-600">
                {totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0}% occupancy
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-gray-200/60">
            <CardContent className="p-5">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Vacant Units
              </p>
              <div className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
                {vacantUnits}
              </div>
              <div className="text-xs font-semibold text-orange-500">
                Ready for lease
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {properties.map((property) => (
            <Card key={property.id} className="shadow-sm border-gray-200/60 overflow-hidden">
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleToggleExpand(property.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{property.name}</h3>
                    {property.address && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
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
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      expandedProperty === property.id ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </div>

              {expandedProperty === property.id && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  {loadingUnits[property.id] ? (
                    <p className="text-sm text-gray-500">Loading units...</p>
                  ) : propertyUnits[property.id]?.length === 0 ? (
                    <p className="text-sm text-gray-500">No units in this property</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {propertyUnits[property.id]?.map((unit) => (
                        <div
                          key={unit.id}
                          className={`bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between ${
                            unit.occupancy_status === "occupied" && unit.tenant_name ? "cursor-pointer hover:border-blue-300 hover:bg-blue-50/50" : ""
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
                            <Home className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                Unit {unit.unit_number}
                              </p>
                              <p className="text-xs text-gray-500">
                                ₹{unit.rent_amount.toLocaleString()}/mo
                              </p>
                              {unit.occupancy_status === "occupied" && unit.tenant_name && (
                                <p className="text-xs text-blue-600 font-medium">
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
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}

function PropertiesFallback() {
  return (
    <ScrollArea className="flex-1 bg-gray-50/30">
      <InlineLoader size={48} />
    </ScrollArea>
  );
}

export function PropertiesSection(props: PropertiesSectionProps) {
  return (
    <Suspense fallback={<PropertiesFallback />}>
      <PropertiesSectionContent {...props} />
    </Suspense>
  );
}
