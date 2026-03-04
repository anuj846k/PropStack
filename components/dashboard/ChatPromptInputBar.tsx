"use client";

import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
  type ChatStatus,
  usePromptInputController,
} from "@/components/ai-elements/prompt-input";
import { SpeechInput } from "@/components/ai-elements/speech-input";
import { ArrowUpRight, GlobeIcon, Loader2 } from "lucide-react";

interface ChatPromptInputBarProps {
  status: string;
  onSubmit: (payload: PromptInputMessage) => void;
  onSpeechTranscription: (text: string) => void;
}

function SpeechToPromptInput({
  onSpeechTranscription,
}: {
  onSpeechTranscription: (text: string) => void;
}) {
  const controller = usePromptInputController();

  return (
    <SpeechInput
      onTranscriptionChange={(text) => {
        controller.textInput.setInput(text);
        onSpeechTranscription(text);
      }}
      size="sm"
      variant="ghost"
      className="h-9 w-9 shrink-0"
      aria-label="Voice input"
    />
  );
}

export function ChatPromptInputBar({
  status,
  onSubmit,
  onSpeechTranscription,
}: ChatPromptInputBarProps) {
  return (
    <div className=" mb-3 z-10 shrink-0 backdrop-blur">
      <div className="mx-auto w-full max-w-[860px]">
        <PromptInputProvider>
          <PromptInput
            onSubmit={(message, event) => {
              if (status === "streaming" || status === "submitted") {
                event?.preventDefault();
                return;
              }
              onSubmit(message);
            }}
            className="w-full [&_[data-slot=input-group]]:rounded-2xl [&_[data-slot=input-group]]:border-2 [&_[data-slot=input-group]]:border-slate-200 [&_[data-slot=input-group]]:bg-white [&_[data-slot=input-group]]:shadow-[0_8px_24px_-18px_rgba(15,23,42,0.55)] [&_[data-slot=input-group]]:overflow-hidden [&_[data-slot=input-group]]:focus-within:border-blue-600 [&_[data-slot=input-group]]:focus-within:ring-4 [&_[data-slot=input-group]]:focus-within:ring-blue-600/15"
            globalDrop
            multiple
          >
            <PromptInputBody>
              <PromptInputTextarea
                placeholder="Ask Sara about rent status, maintenance issues, or vendor phonebook..."
                className="min-h-[56px] max-h-[200px] text-[15px] font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal px-4 py-3.5"
              />
            </PromptInputBody>
            <PromptInputFooter className="flex-row items-center justify-between gap-2 px-3 py-2.5 bg-slate-50/80 border-t border-slate-100">
              <PromptInputTools className="flex-1 gap-2">
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger />
                  <PromptInputActionMenuContent>
                    <PromptInputActionAddAttachments />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>
                <SpeechToPromptInput
                  onSpeechTranscription={onSpeechTranscription}
                />
                <PromptInputButton
                  variant="ghost"
                  className="h-9 px-2 text-xs font-medium text-slate-600"
                >
                  <GlobeIcon size={16} />
                  <span className="hidden sm:inline">Search</span>
                </PromptInputButton>
              </PromptInputTools>
              <PromptInputSubmit
                status={status as ChatStatus}
                disabled={status === "streaming" || status === "submitted"}
                className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm text-white shrink-0 [&_svg]:text-white"
              >
                {status === "streaming" || status === "submitted" ? (
                  <Loader2
                    className="animate-spin"
                    size={20}
                    strokeWidth={2.5}
                  />
                ) : (
                  <ArrowUpRight size={20} strokeWidth={2.5} />
                )}
              </PromptInputSubmit>
            </PromptInputFooter>
          </PromptInput>
        </PromptInputProvider>
      </div>
    </div>
  );
}
