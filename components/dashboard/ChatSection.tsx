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
    <div className="flex-1 flex overflow-hidden border border-slate-200 bg-slate-100/70 shadow-[0_8px_40px_-16px_rgba(15,23,42,0.28)]">
      <ChatSidebar
        activeConversationId={activeConversationId}
        onSelect={handleSelectConversation}
        onNew={handleNewChat}
      />

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
