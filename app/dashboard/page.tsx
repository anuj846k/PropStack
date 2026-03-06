'use client';

import { useState } from 'react';

import { AgentsSection } from '@/components/dashboard/AgentsSection';
import { ChatSection } from '@/components/dashboard/ChatSection';
import { DashboardSection } from '@/components/dashboard/DashboardSection';
import { PropertiesSection } from '@/components/dashboard/PropertiesSection';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TenantDetailPage } from '@/components/dashboard/TenantDetailPage';
import { TicketsSection } from '@/components/dashboard/TicketsSection';
import { type Tenant } from '@/lib/api';

export default function App() {
  const [screen, setScreen] = useState('dashboard');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const handleViewTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setScreen('tenant-detail');
  };

  const handleBackFromTenant = () => {
    setSelectedTenant(null);
    setScreen('properties');
  };

  return (
    <main className="h-screen w-full bg-[#f5f6fa] font-sans overflow-hidden">
      <div className="flex w-full h-full">
        <Sidebar screen={screen} setScreen={setScreen} />
        {screen === 'dashboard' && <DashboardSection setScreen={setScreen} />}
        {screen === 'agents' && <AgentsSection />}
        {screen === 'tickets' && <TicketsSection />}
        {screen === 'properties' && <PropertiesSection onViewTenant={handleViewTenant} />}
        {screen === 'tenant-detail' && selectedTenant && (
          <TenantDetailPage tenant={selectedTenant} onBack={handleBackFromTenant} />
        )}

        {/* ChatSection is ALWAYS mounted but hidden when not active.
            This preserves conversation state across tab switches. */}
        <div className={screen === 'chat' ? 'flex-1 flex overflow-hidden' : 'hidden'}>
          <ChatSection />
        </div>
      </div>
    </main>
  );
}
