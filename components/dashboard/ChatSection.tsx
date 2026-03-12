'use client';

import type { PromptInputMessage } from '@/components/ai-elements/prompt-input';
import { Badge } from '@/components/ui/badge';
import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import { TextStreamChatTransport } from 'ai';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ChatConversation, type ChatMessageType } from './ChatConversation';
import { ChatPromptInputBar } from './ChatPromptInputBar';
import { ChatSidebar } from './ChatSidebar';

/** Shape returned by GET /api/conversations/[id]/messages */
interface StoredMessage {
  id: string;
  sender_type: 'landlord' | 'tenant' | 'ai';
  message_text: string;
  created_at: string;
}

/** Convert DB message → UIMessage (what useChat / setMessages expects) */
function storedToUiMessage(m: StoredMessage): UIMessage {
  return {
    id: m.id,
    role: m.sender_type === 'ai' ? 'assistant' : 'user',
    parts: [{ type: 'text' as const, text: m.message_text }],
  };
}

export function ChatSection() {
  const endRef = useRef<HTMLDivElement>(null);

  // null = new blank chat (no conversation created yet)
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);

  // Create conversation when starting new chat
  const createNewConversation = useCallback(async () => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Chat' }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.id;
      }
    } catch (err) {
      console.error('Failed to create conversation:', err);
    }
    return null;
  }, []);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new TextStreamChatTransport({
      api: '/api/chat',
      body: {
        userId: 'propstack-owner',
        // Only send session_id if it's a valid UUID
        ...(activeConversationId ? { session_id: activeConversationId } : {}),
      },
      fetch: async (url, init) => {
        const res = await fetch(url, init);

        // Capture conversation/session ID from headers
        const convId = res.headers.get('x-conversation-id');
        const sessionId = res.headers.get('x-session-id');
        const newId = convId || sessionId;

        if (res.ok && newId && !activeConversationId) {
          setActiveConversationId(newId);
        }

        return res;
      },
    }),
    id: activeConversationId ?? 'new',
  });

  // Mark as initialized after first render
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  // ── Load history when user clicks a past conversation ──────────────────────
  const handleSelectConversation = useCallback(
    async (id: string) => {
      if (id === activeConversationId) return;
      setLoadingHistory(true);
      try {
        const res = await fetch(`/api/conversations/${id}/messages`);
        if (res.ok) {
          const data: StoredMessage[] = await res.json();
          const mapped = data.map(storedToUiMessage);

          setActiveConversationId(id);

          // Delay setMessages so useChat registers the new ID first and doesn't flush it
          setTimeout(() => {
            setMessages(mapped);
          }, 10);
        }
      } finally {
        setLoadingHistory(false);
      }
    },
    [activeConversationId, setMessages],
  );

  // ── Start a brand-new conversation ─────────────────────────────────────────
  const handleNewChat = useCallback(async () => {
    setActiveConversationId(null);
    setMessages([]);

    // Create a new conversation via API
    const newId = await createNewConversation();
    if (newId) {
      setActiveConversationId(newId);
      setSidebarRefreshKey((k) => k + 1);
    }
  }, [setMessages, createNewConversation]);

  // ── Submit a message ───────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    (payload: PromptInputMessage) => {
      const hasText = Boolean(payload.text?.trim());
      const hasFiles = Boolean(payload.files?.length);
      if (hasText || hasFiles) {
        sendMessage({
          text: payload.text?.trim() || 'Sent with attachments',
          files: payload.files,
        });
      }
    },
    [sendMessage],
  );

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const noop = useCallback(() => {}, []);
  const isGenerating = status === 'submitted' || status === 'streaming';

  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden  border border-[#d7e4f4] bg-[#f4f8ff]/85 ">
      <ChatSidebar
        activeConversationId={activeConversationId}
        onSelect={handleSelectConversation}
        onNew={handleNewChat}
        refreshKey={sidebarRefreshKey}
      />

      {/* Main Chat Interface */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="z-10 flex h-[76px] shrink-0 items-center justify-between border-b border-[#dce8f8] bg-white/75 px-6 backdrop-blur">
          <div>
            <h2 className="text-[16px] font-semibold tracking-tight text-[#1f2c3f]">
              Ask Sara Anything
            </h2>
            <p className="mt-0.5 text-[11px] font-medium text-[#6a7f99]">
              Multimodal reasoning across leases, rent and repairs
            </p>
          </div>
          <Badge
            variant="outline"
            className="h-7 gap-1.5 rounded-full border-[#bcdcc8] bg-[#edf9f1] px-2.5 text-[10px] font-bold tracking-widest text-[#2f7a4a] uppercase"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />{' '}
            Active
          </Badge>
        </div>

        <ChatConversation
          messages={loadingHistory ? [] : (messages as ChatMessageType[])}
          isGenerating={isGenerating || loadingHistory}
          endRef={endRef}
        />

        <ChatPromptInputBar
          status={status}
          onSubmit={handleSubmit}
          onSpeechTranscription={noop}
        />
      </div>
    </div>
  );
}
