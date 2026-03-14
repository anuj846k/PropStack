"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building2 } from "lucide-react";
import { memo } from "react";

export type ChatMessageType = {
  id: string;
  role: "user" | "assistant" | "system";
  parts?: Array<{ type: string; text?: string }>;
};

function getMessageText(message: ChatMessageType): string {
  if (!message.parts?.length) return "";
  return message.parts
    .filter(
      (p): p is { type: string; text: string } =>
        p.type === "text" && typeof p.text === "string",
    )
    .map((p) => p.text)
    .join("");
}

const ChatMessage = memo(function ChatMessage({
  message,
}: {
  message: ChatMessageType;
}) {
  const text = getMessageText(message);
  const isUser = message.role === "user";
  return (
    <div
      className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <Avatar
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm ${
          isUser
            ? "rounded-full border border-[#cfe0f4] bg-white text-[#2f5b88] font-bold text-xs"
            : "bg-[#2f5b88] text-white"
        }`}
      >
        {isUser ? "U" : <Building2 size={14} />}
      </Avatar>
      <Message
        from={message.role as "user" | "assistant"}
        className={isUser ? "max-w-[72%]" : "max-w-[80%]"}
      >
        <MessageContent
          className={
            isUser
              ? "rounded-2xl rounded-tr-sm border border-[#d3e3f6] !bg-white px-4 py-3 text-[#1f2d40] shadow-sm [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5"
              : "rounded-2xl rounded-tl-sm border border-[#d8e6f8] !bg-white/92 px-4 py-3 text-[#24364d] shadow-sm [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5"
          }
        >
          <MessageResponse className="text-[15px] leading-relaxed tracking-[0.01em] [&_li]:my-0.5 [&_ul]:my-2">
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
    <Conversation className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[linear-gradient(180deg,#f7fbff_0%,#f2f8ff_100%)]">
      <ScrollArea className="flex-1 min-h-0">
        <ConversationContent className="px-6 py-7">
          <div className="mx-auto w-full max-w-[860px] space-y-7">
            {messages.length === 0 ? (
              <div className="rounded-[24px] border border-[#d7e4f4] bg-white/88 p-7 shadow-[0_12px_32px_rgba(35,76,130,0.1)] backdrop-blur-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#2f5b88] to-[#4475aa] text-white">
                      <Building2 size={24} />
                    </Avatar>
                    <div>
                      <p className="text-[15px] font-semibold text-[#1f2d40]">
                        Good morning. I&apos;m Sara — your AI property manager.
                      </p>
                      <p className="mt-1 text-[12px] text-[#6d829c]">
                        Ask about rent status, maintenance, or tenants.
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-[#cfe0f5] bg-[#eef5ff] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#33567f] uppercase">
                    Ready
                  </span>
                </div>

                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-[#e1ecfa] bg-[#f8fbff] px-3 py-2 text-[12px] font-medium text-[#365071]">
                    Who is overdue this week?
                  </div>
                  <div className="rounded-xl border border-[#e1ecfa] bg-[#f8fbff] px-3 py-2 text-[12px] font-medium text-[#365071]">
                    Show open maintenance tickets
                  </div>
                  <div className="rounded-xl border border-[#e1ecfa] bg-[#f8fbff] px-3 py-2 text-[12px] font-medium text-[#365071]">
                    Find tenant contact details
                  </div>
                </div>
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
                <Avatar className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2f5b88] text-white">
                  <Building2 size={14} />
                </Avatar>
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-[#d8e6f8] bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#3d6fb4]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#3d6fb4] [animation-delay:75ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#3d6fb4] [animation-delay:150ms]" />
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
