'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/client';
import {
  Building2,
  FileText,
  LayoutDashboard,
  Loader2,
  LogOut,
  MessageSquare,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ElementType, useState } from 'react';

import { PropLogo } from './PropLogo';

interface SidebarItemProps {
  id: string;
  label: string;
  icon: ElementType;
  badge?: string;
  active: boolean;
  setScreen: (id: string) => void;
}

export function SidebarItem({
  id,
  label,
  icon: Icon,
  badge,
  active,
  setScreen,
}: SidebarItemProps) {
  return (
    <button
      onClick={() => setScreen(id)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${active ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900'}`}
    >
      <Icon size={18} className={active ? 'text-blue-600' : 'text-gray-500'} />
      <span className="flex-1 text-left text-sm">{label}</span>
      {badge && (
        <Badge
          variant="destructive"
          className="h-5 px-1.5 min-w-5 flex items-center justify-center text-[10px] rounded-full"
        >
          {badge}
        </Badge>
      )}
    </button>
  );
}

interface SidebarProps {
  screen: string;
  setScreen: (id: string) => void;
}

export function Sidebar({ screen, setScreen }: SidebarProps) {
  const supabase = createClient();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div className="w-64 border-r border-gray-200 bg-gray-50/50 flex flex-col p-5 shrink-0 h-full overflow-y-auto">
      <div className="pl-1 mb-8">
        <PropLogo size={26} />
      </div>

      <div className="space-y-6 flex-1">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase mb-3 pl-3">
            Main
          </p>
          <div className="space-y-1">
            <SidebarItem
              active={screen === 'dashboard'}
              id="dashboard"
              label="Dashboard"
              icon={LayoutDashboard}
              setScreen={setScreen}
            />
            <SidebarItem
              active={screen === 'agents'}
              id="agents"
              label="AI Agents"
              icon={Sparkles}
              badge="1"
              setScreen={setScreen}
            />
            <SidebarItem
              active={screen === 'chat'}
              id="chat"
              label="Ask Sara"
              icon={MessageSquare}
              setScreen={setScreen}
            />
            <SidebarItem
              active={screen === 'tickets'}
              id="tickets"
              label="Maintenance"
              icon={Wrench}
              badge="2"
              setScreen={setScreen}
            />
            <SidebarItem
              active={screen === 'tenants'}
              id="tenants"
              label="Tenants"
              icon={Users}
              setScreen={setScreen}
            />
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase mb-3 pl-3">
            More
          </p>
          <div className="space-y-1">
            <SidebarItem
              active={screen === 'properties'}
              id="properties"
              label="Properties"
              icon={Building2}
              setScreen={setScreen}
            />
            <SidebarItem
              active={screen === 'documents'}
              id="documents"
              label="Documents"
              icon={FileText}
              setScreen={setScreen}
            />
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoggingOut ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <LogOut size={18} />
        )}
        <span className="text-sm font-medium">
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </span>
      </button>

      <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm flex items-center gap-3">
        <Avatar className="h-9 w-9 border border-blue-100">
          <AvatarFallback className="bg-blue-600 text-white font-bold text-xs">
            VN
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">
            Vikram Nair
          </p>
          <p className="text-[11px] text-gray-500 truncate">
            2 properties · 12 units
          </p>
        </div>
      </div>
    </div>
  );
}
