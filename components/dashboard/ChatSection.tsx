"use client";

import { Badge } from "@/components/ui/badge";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { useCallback, useEffect, useRef } from "react";

import { ChatConversation, type ChatMessageType } from "./ChatConversation";
import { ChatPromptInputBar } from "./ChatPromptInputBar";
import { ChatSidebar } from "./ChatSidebar";

export function ChatSection() {
  const endRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status } = useChat({
    transport: new TextStreamChatTransport({
      api: "/api/chat",
      body: { userId: "propstack-owner" },
    }),
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const handleSpeechTranscription = useCallback(
    (text: string) => {
      // Text is set in input via controller.textInput.setInput()
      // User will press Enter manually to submit
    },
    [],
  );

  const handleSubmit = useCallback(
    (payload: PromptInputMessage) => {
      const hasText = Boolean(payload.text?.trim());
      const hasFiles = Boolean(payload.files?.length);
      if (hasText || hasFiles) {
        sendMessage({
          text: payload.text?.trim() || "Sent with attachments",
          files: payload.files,
        });
      }
    },
    [sendMessage],
  );

  const isGenerating = status === "submitted" || status === "streaming";

  return (
    <div className="flex-1 flex overflow-hidden  border border-slate-200 bg-slate-100/70 shadow-[0_8px_40px_-16px_rgba(15,23,42,0.28)]">
      <ChatSidebar />

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <div className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur flex items-center px-6 justify-between shrink-0 shadow-sm z-10">
          <div>
            <h2 className="text-[15px] font-semibold text-slate-900 tracking-tight">
              Ask Sara Anything
            </h2>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
              Multimodal reasoning across leases, rent and repairs
            </p>
          </div>
          <Badge
            variant="outline"
            className="h-6 gap-1.5 bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold tracking-widest uppercase"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
            Active
          </Badge>
        </div>

        <ChatConversation
          messages={messages as ChatMessageType[]}
          isGenerating={isGenerating}
          endRef={endRef}
        />

        <ChatPromptInputBar
          status={status}
          onSubmit={handleSubmit}
          onSpeechTranscription={handleSpeechTranscription}
        />
      </div>
    </div>
  );
}
