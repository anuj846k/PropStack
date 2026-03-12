"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { MessageSquarePlus, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { PropLogo } from "./PropLogo";

interface Conversation {
  id: string;
  title: string | null;
  last_message_at: string | null;
  created_at: string;
}

function formatTime(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isToday(d)) return format(d, "h:mm a");
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMM d");
}

interface ChatSidebarProps {
  activeConversationId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  /** Incremented when a new conversation is created — triggers a re-fetch */
  refreshKey?: number;
}

export function ChatSidebar({
  activeConversationId,
  onSelect,
  onNew,
  refreshKey = 0,
}: ChatSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const hasFetched = useRef(false);

  const fetchConversations = useCallback(() => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/conversations");
        if (res.ok) setConversations(await res.json());
      } catch {
        // silently ignore network errors
      }
    });
  }, []);

  // Fetch on initial mount only
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchConversations();
    }
  }, [fetchConversations]);

  // Re-fetch when refreshKey changes (new conversation was created)
  useEffect(() => {
    if (refreshKey > 0) {
      fetchConversations();
    }
  }, [refreshKey, fetchConversations]);

  const filtered = conversations.filter((c) =>
    (c.title ?? "New conversation")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="flex min-h-0 w-[278px] flex-col border-r border-[#dce8f8] bg-[#ecf4ff]/90">
      <div className="border-b border-[#dce8f8] p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1f2c3f]">Conversations</h3>
          <Button
            size="sm"
            onClick={onNew}
            title="New conversation"
            className="flex h-8 items-center gap-1.5 rounded-full bg-[#2f5b88] px-3 text-xs text-white shadow-sm transition-colors hover:bg-[#244d77]"
          >
            <MessageSquarePlus size={13} />
            New
          </Button>
        </div>
        <div className="relative rounded-full border border-[#d8e6f8] bg-white shadow-sm">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ca1bd]"
          />
          <Input
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 border-0 bg-transparent pl-9 text-sm text-[#1f2c3f] shadow-none placeholder:text-[#8ea4be] focus-visible:ring-0"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-3">
        {isPending && conversations.length === 0 ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-2xl border border-[#dce8f8] bg-white/80"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="px-2 pt-6 text-center text-[12px] text-[#8299b5]">
            {search
              ? "No matches found"
              : "No conversations yet. Start chatting!"}
          </p>
        ) : (
          <div className="space-y-1">
            {filtered.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={cn(
                  "w-full  rounded-xl border p-2 text-left transition-all",
                  activeConversationId === conv.id
                    ? "border-[#bfd5f4] bg-white "
                    : "border-transparent bg-transparent hover:cursor-pointer hover:border-[#d4e3f7] hover:bg-white/85",
                )}
              >
                <div className="mb-0.5 flex items-start justify-between gap-1">
                  <span className="flex-1 truncate text-[13px] leading-tight font-semibold text-[#25374f]">
                    {conv.title ?? "New conversation"}
                  </span>
                  <span className="mt-0.5 shrink-0 text-[9px] font-medium text-[#8ca1ba]">
                    {formatTime(conv.last_message_at ?? conv.created_at)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="flex items-center gap-3 border-t border-[#dce8f8] bg-white/70 p-4">
        <PropLogo size={14} />
        <div>
          <p className="text-[12px] leading-tight font-bold text-[#1f2c3f]">
            Sara AI
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
            &amp; Listening
          </p>
        </div>
      </div>
    </div>
  );
}
