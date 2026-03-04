"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { chatHistories } from "./data";
import { PropLogo } from "./PropLogo";

export function ChatSidebar() {
  return (
    <div className="w-[250px] border-r border-slate-200 bg-linear-to-b from-white to-slate-50 flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">Conversations</h3>
          <Button
            size="sm"
            className="h-8 text-xs px-3 bg-slate-900 hover:bg-slate-800 text-slate-100 rounded-lg shadow-sm"
          >
            + New
          </Button>
        </div>
        <Input
          placeholder="Search history..."
          className="h-9 bg-white/80 border-slate-200 text-sm shadow-sm focus-visible:ring-blue-600/20"
        />
      </div>
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-1.5">
          {chatHistories.map((h) => (
            <div
              key={h.id}
              className="p-3 rounded-xl border border-transparent hover:bg-white hover:border-blue-100 cursor-pointer transition-all hover:shadow-sm"
            >
              <div className="flex items-start justify-between mb-1 text-[13px]">
                <span className="font-bold text-slate-900 truncate max-w-[170px]">
                  {h.title}
                </span>
                <span className="text-slate-400 font-medium text-[11px] shrink-0 mt-0.5">
                  {h.time}
                </span>
              </div>
              <p className="text-[12px] text-slate-500 truncate">{h.preview}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 bg-white/80 border-t border-slate-200 flex items-center gap-3">
        <PropLogo size={14} />
        <div>
          <p className="text-[12px] font-bold text-slate-900 leading-tight">
            Sara AI
          </p>
          <p className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1.5 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
            & Listening
          </p>
        </div>
      </div>
    </div>
  );
}
