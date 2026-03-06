'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';
import { MessageSquarePlus, Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { PropLogo } from './PropLogo';

interface Conversation {
  id: string;
  title: string | null;
  last_message_at: string | null;
  created_at: string;
}

function formatTime(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isToday(d)) return format(d, 'h:mm a');
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d');
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
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const hasFetched = useRef(false);

  const fetchConversations = useCallback(() => {
    startTransition(async () => {
      try {
        const res = await fetch('/api/conversations');
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
    (c.title ?? 'New conversation')
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="w-[250px] border-r border-slate-200 bg-linear-to-b from-white to-slate-50 flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">Conversations</h3>
          <Button
            size="sm"
            onClick={onNew}
            title="New conversation"
            className="h-8 text-xs px-3 bg-slate-900 hover:bg-slate-800 text-slate-100 rounded-lg shadow-sm flex items-center gap-1.5"
          >
            <MessageSquarePlus size={13} />
            New
          </Button>
        </div>
        <div className="relative">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-8 bg-white/80 border-slate-200 text-sm shadow-sm focus-visible:ring-blue-600/20"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-3">
        {isPending && conversations.length === 0 ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 rounded-xl bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-[12px] text-slate-400 text-center pt-6 px-2">
            {search
              ? 'No matches found'
              : 'No conversations yet. Start chatting!'}
          </p>
        ) : (
          <div className="space-y-1.5">
            {filtered.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={cn(
                  'w-full text-left p-3 rounded-xl border transition-all',
                  activeConversationId === conv.id
                    ? 'bg-blue-50 border-blue-200 shadow-sm'
                    : 'border-transparent hover:bg-white hover:border-blue-100 hover:shadow-sm cursor-pointer',
                )}
              >
                <div className="flex items-start justify-between mb-0.5 gap-1">
                  <span className="font-semibold text-[13px] text-slate-900 truncate flex-1 leading-tight">
                    {conv.title ?? 'New conversation'}
                  </span>
                  <span className="text-slate-400 font-medium text-[11px] shrink-0 mt-0.5">
                    {formatTime(conv.last_message_at ?? conv.created_at)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 bg-white/80 border-t border-slate-200 flex items-center gap-3">
        <PropLogo size={14} />
        <div>
          <p className="text-[12px] font-bold text-slate-900 leading-tight">
            Sara AI
          </p>
          <p className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1.5 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
            &amp; Listening
          </p>
        </div>
      </div>
    </div>
  );
}
