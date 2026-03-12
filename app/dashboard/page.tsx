'use client';

import { useState } from 'react';

import { AgentsSection } from '@/components/dashboard/AgentsSection';
import { ChatSection } from '@/components/dashboard/ChatSection';
import { DashboardSection } from '@/components/dashboard/DashboardSection';
import { PropertiesSection } from '@/components/dashboard/PropertiesSection';
import Sidebar from '@/components/dashboard/Sidebar';
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
    <main className="min-h-screen w-full overflow-hidden bg-[radial-gradient(110%_100%_at_15%_0%,#c8ddf4_0%,#a9c7e5_40%,#8aaed0_100%)] p-2 md:p-5">
      <div className="mx-auto h-[calc(100vh-1rem)] max-w-[1600px] overflow-hidden rounded-[30px] border border-[#d2e1f3] bg-[#edf3fb]/90 shadow-[0_40px_110px_rgba(30,68,115,0.28)] backdrop-blur md:h-[calc(100vh-2.5rem)]">
        <div className="flex h-full w-full flex-col md:flex-row">
          <Sidebar screen={screen} setScreen={setScreen} />

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {screen === 'dashboard' && <DashboardSection setScreen={setScreen} />}
            {screen === 'agents' && <AgentsSection />}
            {screen === 'tickets' && <TicketsSection />}
            {screen === 'properties' && <PropertiesSection onViewTenant={handleViewTenant} />}
            {screen === 'tenant-detail' && selectedTenant && (
              <TenantDetailPage tenant={selectedTenant} onBack={handleBackFromTenant} />
            )}

            {/* ChatSection is ALWAYS mounted but hidden when not active.
                This preserves conversation state across tab switches. */}
            <div className={screen === 'chat' ? 'flex h-full flex-1 overflow-hidden' : 'hidden'}>
              <ChatSection />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
