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
    <div className="z-10 shrink-0 px-4 pb-4 pt-2 backdrop-blur">
      <div className="mx-auto w-full max-w-[900px]">
        <PromptInputProvider>
          <PromptInput
            onSubmit={(message, event) => {
              if (status === "streaming" || status === "submitted") {
                event?.preventDefault();
                return;
              }
              onSubmit(message);
            }}
            className="w-full [&_[data-slot=input-group]]:overflow-hidden [&_[data-slot=input-group]]:rounded-[22px] [&_[data-slot=input-group]]:border-2 [&_[data-slot=input-group]]:border-[#d6e5f8] [&_[data-slot=input-group]]:bg-white [&_[data-slot=input-group]]:shadow-[0_16px_36px_rgba(42,85,136,0.16)] [&_[data-slot=input-group]]:focus-within:border-[#4a79ad] [&_[data-slot=input-group]]:focus-within:ring-4 [&_[data-slot=input-group]]:focus-within:ring-[#7fa8d6]/20"
            globalDrop
            multiple
          >
            <PromptInputBody>
              <PromptInputTextarea
                placeholder="Ask Sara about rent status, maintenance issues, or vendor phonebook..."
                className="min-h-[58px] max-h-[200px] px-4 py-3.5 text-[15px] font-medium text-[#20344f] placeholder:font-normal placeholder:text-[#8ca1bc]"
              />
            </PromptInputBody>
            <PromptInputFooter className="flex-row items-center justify-between gap-2 border-t border-[#e6eff9] bg-[#f6faff] px-3 py-2.5">
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
                  className="h-9 rounded-full border border-[#d5e4f7] bg-white px-3 text-xs font-medium text-[#4f6785] hover:bg-[#f0f6ff]"
                >
                  <GlobeIcon size={16} />
                  <span className="hidden sm:inline">Grounded Search</span>
                </PromptInputButton>
              </PromptInputTools>
              <PromptInputSubmit
                status={status as ChatStatus}
                disabled={status === "streaming" || status === "submitted"}
                className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-[#2f5b88] to-[#4a79ad] text-white shadow-sm transition-colors hover:from-[#254a72] hover:to-[#3f6791] [&_svg]:text-white"
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
