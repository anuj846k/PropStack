"use client";

import { createClient } from "@/lib/supabase/client";
import {
  Building2,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Loader2,
  LogOut,
  MessageSquare,
  Settings,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ElementType, useState } from "react";

import { PropLogo } from "./PropLogo";

interface SidebarIconProps {
  id: string;
  icon: ElementType;
  label: string;
  active: boolean;
  setScreen: (id: string) => void;
  badge?: number;
}

function SidebarIcon({
  id,
  icon: Icon,
  label,
  active,
  setScreen,
  badge,
}: SidebarIconProps) {
  return (
    <div className="relative group">
      <button
        onClick={() => setScreen(id)}
        className={`
          w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200
          ${
            active
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
              : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          }
        `}
        aria-label={label}
      >
        <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
      </button>
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
          {badge}
        </span>
      )}
      {/* Tooltip */}
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 pointer-events-none shadow-lg">
        {label}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
      </div>
    </div>
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
    router.push("/auth/login");
  };

  return (
    <div className="w-[72px] bg-white border-r border-gray-200/80 flex flex-col items-center py-5 shrink-0 h-full">
      {/* Logo */}
      <div className="mb-8">
        <PropLogo size={30} />
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col items-center gap-2 flex-1">
        <SidebarIcon
          id="dashboard"
          icon={LayoutDashboard}
          label="Dashboard"
          active={screen === "dashboard"}
          setScreen={setScreen}
        />
        <SidebarIcon
          id="agents"
          icon={Sparkles}
          label="AI Agents"
          active={screen === "agents"}
          setScreen={setScreen}
          badge={1}
        />
        <SidebarIcon
          id="chat"
          icon={MessageSquare}
          label="Ask Sara"
          active={screen === "chat"}
          setScreen={setScreen}
        />
        <SidebarIcon
          id="properties"
          icon={Building2}
          label="Properties"
          active={screen === "properties"}
          setScreen={setScreen}
        />
        <SidebarIcon
          id="tickets"
          icon={Wrench}
          label="Maintenance"
          active={screen === "tickets"}
          setScreen={setScreen}
          badge={2}
        />
        <SidebarIcon
          id="documents"
          icon={FileText}
          label="Documents"
          active={screen === "documents"}
          setScreen={setScreen}
        />

        {/* Divider */}
        <div className="w-8 h-px bg-gray-200 my-3" />

        <SidebarIcon
          id="settings"
          icon={Settings}
          label="Settings"
          active={screen === "settings"}
          setScreen={setScreen}
        />
        <SidebarIcon
          id="help"
          icon={HelpCircle}
          label="Help"
          active={screen === "help"}
          setScreen={setScreen}
        />
      </nav>

      {/* Bottom: Logout + Avatar */}
      <div className="flex flex-col items-center gap-3 mt-4">
        <div className="relative group">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-11 h-11 flex items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 disabled:opacity-50"
            aria-label="Logout"
          >
            {isLoggingOut ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <LogOut size={20} strokeWidth={1.8} />
            )}
          </button>
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 pointer-events-none shadow-lg">
            {isLoggingOut ? "Logging out..." : "Logout"}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
          </div>
        </div>

        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md cursor-pointer hover:shadow-lg transition-shadow">
          AK
        </div>
      </div>
    </div>
  );
}
