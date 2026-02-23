'use client';

import { useState } from 'react';

import { AgentsSection } from '@/components/dashboard/AgentsSection';
import { ChatSection } from '@/components/dashboard/ChatSection';
import { DashboardSection } from '@/components/dashboard/DashboardSection';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TenantsSection } from '@/components/dashboard/TenantsSection';
import { TicketsSection } from '@/components/dashboard/TicketsSection';

export default function App() {
  const [screen, setScreen] = useState('dashboard');

  return (
    <main className="h-screen w-full bg-white font-sans overflow-hidden">
      <div className="flex w-full h-full">
        <Sidebar screen={screen} setScreen={setScreen} />
        {screen === 'dashboard' && <DashboardSection setScreen={setScreen} />}
        {screen === 'agents' && <AgentsSection />}
        {screen === 'chat' && <ChatSection />}
        {screen === 'tickets' && <TicketsSection />}
        {screen === 'tenants' && <TenantsSection />}
      </div>
    </main>
  );
}

// TODO: Add loading state when fetching data for each section.