'use client';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building2 } from 'lucide-react';
import { memo } from 'react';

export type ChatMessageType = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts?: Array<{ type: string; text?: string }>;
};

function getMessageText(message: ChatMessageType): string {
  if (!message.parts?.length) return '';
  return message.parts
    .filter(
      (p): p is { type: string; text: string } =>
        p.type === 'text' && typeof p.text === 'string',
    )
    .map((p) => p.text)
    .join('');
}

const ChatMessage = memo(function ChatMessage({
  message,
}: {
  message: ChatMessageType;
}) {
  const text = getMessageText(message);
  const isUser = message.role === 'user';
  return (
    <div
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <Avatar
        className={`h-9 w-9 shrink-0 flex items-center justify-center rounded-xl shadow-sm ${
          isUser
            ? 'rounded-full border border-slate-200 text-blue-600 font-bold text-xs'
            : 'bg-blue-600   text-white'
        }`}
      >
        {isUser ? 'U' : <Building2 size={14} />}
      </Avatar>
      <Message
        from={message.role as 'user' | 'assistant'}
        className={isUser ? 'max-w-[72%]' : 'max-w-full'}
      >
        <MessageContent
          className={
            isUser
              ? 'rounded-2xl rounded-tr-sm !bg-white border border-slate-200 px-4 py-3 text-slate-900 shadow-sm backdrop-blur [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded'
              : 'rounded-none !bg-transparent border-0 shadow-none px-0 py-0 backdrop-blur-0 text-slate-900 [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded'
          }
        >
          <MessageResponse className="text-[15px] leading-relaxed tracking-[0.01em] [&_ul]:my-2 [&_li]:my-0.5">
            {text}
          </MessageResponse>
        </MessageContent>
      </Message>
    </div>
  );
});

interface ChatConversationProps {
  messages: ChatMessageType[];
  isGenerating: boolean;
  endRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatConversation({
  messages,
  isGenerating,
  endRef,
}: ChatConversationProps) {
  return (
    <Conversation className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <ScrollArea className="flex-1 min-h-0">
        <ConversationContent className="p-7 pb-5">
          <div className="mx-auto w-full max-w-[860px] space-y-7">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-blue-100/80 bg-white/60 backdrop-blur-sm">
                <Avatar className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center rounded-xl mb-3">
                  <Building2 size={24} />
                </Avatar>
                <p className="text-sm font-semibold text-slate-900">
                  Good morning. I&apos;m Sara — your AI property manager.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Ask about rent status, maintenance, or tenants.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((m) => (
                  <ChatMessage key={m.id} message={m} />
                ))}
              </div>
            )}
            {isGenerating && (
              <div className="flex gap-3">
                <Avatar className="h-9 w-9 shrink-0 bg-slate-900 text-blue-100 flex items-center justify-center rounded-xl">
                  <Building2 size={14} />
                </Avatar>
                <div className="bg-white/90 border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2 backdrop-blur">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:75ms]" />
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:150ms]" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </ConversationContent>
      </ScrollArea>
      <ConversationScrollButton />
    </Conversation>
  );
}
