"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import {
  Bot,
  Building2,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SidebarProps {
  screen: string;
  setScreen: (id: string) => void;
  badge?: {
    agents?: number;
    tickets?: number;
  };
}

interface UserData {
  id: string;
  email?: string;
  role?: string;
  name?: string;
}

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "chat", icon: MessageSquare, label: "Ask Sara" },
  { id: "properties", icon: Building2, label: "Properties" },
  { id: "tickets", icon: Wrench, label: "Maintenance" },
  { id: "agents", icon: Bot, label: "AI Agents" },
] as const;

export default function DashboardSidebar({
  screen,
  setScreen,
  badge,
}: SidebarProps) {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user: sbUser },
      } = await supabase.auth.getUser();
      if (sbUser) {
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", sbUser.id)
          .single();

        setUser({
          id: sbUser.id,
          email: sbUser.email,
          ...profile,
        });
      }
      setLoading(false);
    }
    getUser();
  }, [supabase]);

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "?";

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/auth/login");
  }

  return (
    <aside className="w-full shrink-0 px-3 pt-3 pb-2 md:h-full md:min-h-0 md:w-[92px] md:self-stretch md:overflow-y-auto md:overflow-x-hidden md:px-4 md:py-8">
      <div className="flex w-full items-center justify-between md:min-h-full md:flex-col md:items-center md:justify-start md:gap-8">
        <button
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d4e1f3] bg-white text-[#1f385c] shadow-sm transition-colors hover:bg-[#f2f7ff] md:h-14 md:w-14"
          aria-label="Home"
          onClick={() => setScreen("dashboard")}
        >
          <Building2 className="h-6 w-6 md:h-7 md:w-7" />
        </button>

        <div className="flex items-center gap-3 md:flex-col md:gap-8">
          <nav className="flex items-center gap-2 overflow-x-auto rounded-full border border-[#d7e4f4] bg-white/95 p-2  md:max-h-[55vh] md:flex-col md:overflow-y-auto md:overflow-x-hidden md:rounded-[30px]">
            {navItems.map((item) => {
              const isActive = screen === item.id;
              const showBadge =
                item.id === "agents" ? badge?.agents : badge?.tickets;

              return (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => setScreen(item.id)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-all md:h-[46px] md:w-[46px] ${
                      isActive
                        ? "bg-[#3982e9] text-white shadow-[0_8px_20px_rgba(31,40,55,0.4)]"
                        : "bg-white text-[#5f7088] hover:bg-[#edf4ff] hover:text-[#1f385c]"
                    }`}
                    aria-label={item.label}
                    title={item.label}
                  >
                    <item.icon className="h-[18px] w-[18px] md:h-5 md:w-5" />
                  </button>
                  {showBadge !== undefined && showBadge > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff4d4f] px-1 text-[9px] font-semibold text-white ring-2 ring-white">
                      {showBadge}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:flex-col">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full border border-[#d7e4f4] bg-white p-0 hover:bg-[#eef4ff] md:h-11 md:w-11"
                  aria-label="Profile menu"
                >
                  <Avatar className="h-10 w-10 rounded-full md:h-11 md:w-11">
                    <AvatarFallback className="rounded-full bg-[#dbe9ff] text-xs font-semibold text-[#33527a]">
                      {loading ? "..." : initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" side="right" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{user?.name ?? "User"}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {user?.email}
                    </span>
                    {user?.role && (
                      <span className="text-xs font-normal text-muted-foreground">
                        {user.role.replace("_", " ")}
                      </span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer focus:bg-destructive/10 focus:text-destructive"
                  onSelect={handleLogout}
                >
                  <LogOut className="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d7e4f4] bg-white text-[#5f7088] transition-colors hover:bg-[#eef4ff] hover:text-[#1f385c] md:h-11 md:w-11"
              aria-label="Logout"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
