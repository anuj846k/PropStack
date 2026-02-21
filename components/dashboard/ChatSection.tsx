'use client';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { chatHistories, initChat } from './data';

export function ChatSection() {
  const [messages, setMessages] = useState(initChat);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (textStr: string) => {
    if (!textStr.trim()) return;
    setMessages((p) => [
      ...p,
      {
        role: 'user',
        text: textStr,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((p) => [
        ...p,
        {
          role: 'ai',
          text: "I've noted that. Anything else you need me to check?",
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    }, 1500);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sidebar History */}
      <div className="w-[300px] border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900">Conversations</h3>
            <Button size="sm" className="h-7 text-xs px-2.5">
              + New
            </Button>
          </div>
          <Input
            placeholder="Search history..."
            className="h-9 bg-gray-50 text-sm"
          />
        </div>
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-1">
            {chatHistories.map((h) => (
              <div
                key={h.id}
                className="p-3 rounded-xl border border-transparent hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between mb-1 text-[13px]">
                  <span className="font-bold text-gray-900 truncate max-w-[170px]">
                    {h.title}
                  </span>
                  <span className="text-gray-400 font-medium text-[11px] shrink-0 mt-0.5">
                    {h.time}
                  </span>
                </div>
                <p className="text-[12px] text-gray-500 truncate">
                  {h.preview}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center gap-3">
          <Avatar className="h-8 w-8 bg-blue-600 shape-square rounded-lg flex items-center justify-center text-white">
            <Sparkles size={14} />
          </Avatar>
          <div>
            <p className="text-[12px] font-bold text-gray-900 leading-tight">
              Sara AI
            </p>
            <p className="text-[10px] font-semibold text-green-600 flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>{' '}
              Online & Listening
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col bg-gray-50/30">
        <div className="h-14 border-b border-gray-200 bg-white flex items-center px-6 justify-between shrink-0 shadow-sm z-10">
          <div>
            <h2 className="text-[14px] font-bold text-gray-900 tracking-tight">
              Ask Sara Anything
            </h2>
            <p className="text-[11px] font-medium text-gray-500">
              Multimodal reasoning across leases, rent and repairs
            </p>
          </div>
          <Badge
            variant="outline"
            className="h-6 gap-1.5 bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-bold tracking-widest uppercase"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>{' '}
            Active
          </Badge>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="max-w-3xl mx-auto space-y-6 pb-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <Avatar
                  className={`h-8 w-8 shrink-0 flex items-center justify-center rounded-lg shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white font-bold text-xs' : 'bg-gray-900 text-white'}`}
                >
                  {m.role === 'user' ? 'VN' : <Sparkles size={14} />}
                </Avatar>
                <div
                  className={`max-w-[75%] ${m.role === 'user' ? 'items-end' : ''}`}
                >
                  <div
                    className={`text-[13.5px] leading-relaxed px-4 py-3 shadow-sm whitespace-pre-line ${m.role === 'user' ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm'}`}
                  >
                    {m.text}
                  </div>

                  {m.hasCard && m.card.type === 'overdue' && (
                    <Card className="mt-3 overflow-hidden border-gray-200 shadow-sm w-full max-w-sm">
                      <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          Overdue Summary
                        </p>
                      </div>
                      <CardContent className="p-0">
                        <div className="divide-y divide-gray-100">
                          {m.card.items.map((item, j) => (
                            <div
                              key={j}
                              className="p-3 flex items-center justify-between bg-white"
                            >
                              <div>
                                <p className="text-xs font-bold text-gray-900">
                                  {item.name}
                                </p>
                                <p className="text-[10px] text-gray-500 mt-0.5">
                                  Unit {item.unit} · {item.days}d late
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-[13px] font-bold text-gray-900 mb-1">
                                  {item.amount}
                                </p>
                                <Badge
                                  variant={
                                    item.status === 'promised'
                                      ? 'success'
                                      : 'destructive'
                                  }
                                  className="text-[9px] uppercase tracking-wider px-1.5 py-0 h-4"
                                >
                                  {item.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-4">
                <Avatar className="h-8 w-8 shrink-0 bg-gray-900 text-white flex items-center justify-center rounded-lg shadow-sm">
                  <Sparkles size={14} />
                </Avatar>
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </ScrollArea>

        <div className="p-6 bg-white border-t border-gray-200 z-10 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1 bg-white border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all shadow-sm">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder="Ask Sara about rent status, maintenance issues, or vendor phonebook..."
                  className="w-full bg-transparent p-3.5 text-sm resize-none outline-none min-h-[50px] max-h-[150px] font-medium placeholder:text-gray-400 placeholder:font-normal"
                  rows={1}
                />
                <div className="px-3 py-2 bg-gray-50/80 border-t border-gray-200 flex gap-2">
                  {['🎙️ Trigger Call', '📋 Raise Ticket', '📊 Deep Report'].map(
                    (t) => (
                      <Badge
                        key={t}
                        variant="outline"
                        className="text-[10px] font-semibold text-gray-500 bg-white cursor-pointer hover:bg-gray-100"
                      >
                        {t}
                      </Badge>
                    ),
                  )}
                </div>
              </div>
              <Button
                onClick={() => send(input)}
                size="icon"
                className="h-[52px] w-[52px] rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md"
              >
                <ArrowUpRight size={22} strokeWidth={2.5} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
