"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MessageSquare, Send, User, Loader2 } from "lucide-react";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { SafeAvatar } from "@/components/dashboard/SafeAvatar";
import { formatDashboardDateTime } from "@/lib/dashboard/formatDashboardDate";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  conversation_id: string;
  sender_type: string;
  sender_id: string;
  body: string;
  created_at: string;
}

interface Conversation {
  id: string;
  title: string | null;
  last_message: string | null;
  last_message_at: string | null;
  created_at: string;
  creator_avatar_url?: string | null;
}

export function CollaborationClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryConversationId = searchParams.get("conversation");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [conversationsError, setConversationsError] = useState<string | null>(null);

  const [activeConversationId, setActiveConversationId] = useState<string | null>(queryConversationId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  const supabase = createClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  // Sync URL with active conversation
  useEffect(() => {
    if (activeConversationId) {
      router.replace(`/dashboard/collaboration?conversation=${activeConversationId}`, { scroll: false });
    } else {
      router.replace(`/dashboard/collaboration`, { scroll: false });
    }
  }, [activeConversationId, router]);

  // Fetch initial conversations
  useEffect(() => {
    let isMounted = true;
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/brand/collaboration/conversations");
        if (!res.ok) throw new Error("Could not fetch conversations");
        const json = await res.json();
        if (isMounted) {
          setConversations(json.data.conversations || []);
          
          if (!activeConversationId && json.data.conversations?.length > 0 && queryConversationId) {
            const exists = json.data.conversations.find((c: Conversation) => c.id === queryConversationId);
            if (exists) setActiveConversationId(exists.id);
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : "Unknown error";
          setConversationsError("Failed to load conversations: " + message);
        }
      } finally {
        if (isMounted) setConversationsLoading(false);
      }
    };
    fetchConversations();
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryConversationId]); // Only run on mount, queryConversationId used as initial state

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeConversationId) return;

    let isMounted = true;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      setError(null);
      try {
        const res = await fetch(`/api/brand/collaboration/messages?conversation_id=${activeConversationId}`);
        if (!res.ok) throw new Error("Could not load messages.");
        const data = await res.json();
        if (isMounted) {
          setMessages(data.data.messages || []);
        }
      } catch {
        if (isMounted) setError("Could not load messages.");
      } finally {
        if (isMounted) setLoadingMessages(false);
      }
    };

    fetchMessages();

    return () => {
      isMounted = false;
    };
  }, [activeConversationId]);

  // Realtime subscription
  useEffect(() => {
    if (!activeConversationId) return;

    const channel = supabase
      .channel(`conversation:${activeConversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "conversation_messages",
          filter: `conversation_id=eq.${activeConversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((current) => {
            if (current.some((m) => m.id === newMessage.id)) {
              return current;
            }
            return [...current, newMessage].sort(
              (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
          });
          
          // Optimistically update conversation list's last message
          setConversations((prev) => 
            prev.map(c => 
              c.id === activeConversationId 
                ? { ...c, last_message: newMessage.body, last_message_at: newMessage.created_at }
                : c
            )
          );
        }
      )
      .subscribe((status) => {
        if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          console.warn("Realtime connection lost. Messages will still refresh on reload.");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversationId, supabase]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = messageInput.trim();
    if (!body || !activeConversationId || sending) return;

    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/brand/collaboration/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: activeConversationId, body }),
      });

      if (!res.ok) throw new Error("Could not send message.");
      
      const { data } = await res.json();
      const newMessage = data.message;
      
      setMessageInput("");

      setMessages((current) => {
        if (current.some((m) => m.id === newMessage.id)) return current;
        return [...current, newMessage];
      });

      setConversations((prev) => {
        const updated = prev.map(c => 
          c.id === activeConversationId 
            ? { ...c, last_message: body, last_message_at: newMessage.created_at }
            : c
        );
        // Bring to top
        const active = updated.find(c => c.id === activeConversationId);
        const others = updated.filter(c => c.id !== activeConversationId);
        return active ? [active, ...others] : updated;
      });

    } catch {
      setError("Could not send message.");
    } finally {
      setSending(false);
    }
  };

  const handleStartTestConversation = async () => {
    try {
      setError(null);
      setIsCreatingConversation(true);

      const response = await fetch("/api/brand/collaboration/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Test collaboration",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(
          result?.error?.message || "Could not start test conversation."
        );
      }

      const conversation = result.data.conversation;

      setConversations((current) => {
        if (current.some((item) => item.id === conversation.id)) {
          return current;
        }

        return [conversation, ...current];
      });

      setActiveConversationId(conversation.id);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not start test conversation."
      );
    } finally {
      setIsCreatingConversation(false);
    }
  };

  if (conversationsError) {
    return (
      <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col items-center justify-center text-center">
        <MessageSquare className="h-10 w-10 text-red-400 mb-3" />
        <h3 className="text-red-800 font-bold text-lg mb-1">Collaboration Hub Error</h3>
        <p className="text-red-600 text-sm">{conversationsError}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-semibold transition">
          Retry
        </button>
      </div>
    );
  }

  if (conversationsLoading) {
    return (
      <div className="min-h-[500px] flex justify-center items-center">
        <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="min-h-[500px] flex flex-col justify-center items-center">
        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}
        <DashboardEmptyState 
          title="No collaborations yet"
          description="Creator conversations will appear here once a campaign has active creators or when you start a collaboration."
          icon={MessageSquare}
        />
        {process.env.NODE_ENV !== "production" && (
          <button
            type="button"
            onClick={handleStartTestConversation}
            disabled={isCreatingConversation}
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#E11D48] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#BE123C] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isCreatingConversation ? "Starting..." : "Start test conversation"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="h-[600px] md:h-[700px] flex flex-col md:flex-row bg-[#FDFBFB] overflow-hidden w-full relative border border-slate-200 rounded-3xl shadow-sm">
      {/* Threads Sidebar */}
      <div className={`md:w-80 border-r border-slate-200 flex-col h-full bg-white shrink-0 ${activeConversationId ? 'hidden md:flex' : 'flex flex-1'}`}>
        <div className="p-4 border-b border-slate-200 bg-white">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#0A0A0A]">Conversations</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {conversations.map(c => (
            <div 
              key={c.id} 
              onClick={() => setActiveConversationId(c.id)}
              className={`p-4 cursor-pointer transition flex items-center gap-3 ${activeConversationId === c.id ? 'bg-red-50 border-l-2 border-[#E11D48]' : 'hover:bg-slate-50'}`}
            >
              {c.creator_avatar_url ? (
                <SafeAvatar 
                  src={c.creator_avatar_url}
                  name={c.title || "Creator"}
                  className="w-10 h-10 border border-slate-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-[#0A0A0A] truncate">{c.title || "Untitled Conversation"}</h4>
                <p className="text-xs text-slate-500 mt-1 truncate">{c.last_message || "No messages yet"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex-col h-full bg-[#FDFBFB] relative ${activeConversationId ? 'flex' : 'hidden md:flex'}`}>
        {activeConversation ? (
          <>
            <div className="p-4 border-b border-slate-200 bg-white shadow-sm z-10 flex items-center gap-3">
              <button 
                onClick={() => setActiveConversationId(null)}
                className="md:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <h3 className="text-sm font-bold text-[#0A0A0A]">{activeConversation.title || "Untitled Conversation"}</h3>
            </div>
            
            {error ? (
              <div className="m-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {loadingMessages ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-xs text-slate-400 py-10">No messages yet. Start the conversation.</div>
              ) : (
                messages.map((msg) => {
                  const isBrand = msg.sender_type === "brand";
                  return (
                    <div key={msg.id} className={`flex gap-3 ${isBrand ? "flex-row-reverse" : ""}`}>
                      <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-slate-500" />
                      </div>
                      <div className={`flex flex-col ${isBrand ? "items-end" : "items-start"} max-w-[80%]`}>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-[10px] text-slate-400">{formatDashboardDateTime(msg.created_at)}</span>
                        </div>
                        <div className={`text-sm p-3 rounded-2xl shadow-sm break-words ${isBrand ? 'bg-[#0A0A0A] text-white rounded-tr-sm' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'}`}>
                          {msg.body}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-slate-200">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-full text-sm outline-none focus:bg-white focus:border-[#E11D48] focus:ring-2 focus:ring-red-100 transition"
                  disabled={sending}
                  maxLength={2000}
                />
                <button 
                  type="submit"
                  disabled={!messageInput.trim() || sending}
                  className="h-11 w-11 shrink-0 rounded-full bg-[#E11D48] text-white flex items-center justify-center hover:bg-[#BE123C] disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer shadow-md"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <MessageSquare className="h-12 w-12 text-slate-200 mb-4" />
            <p className="text-sm font-bold text-slate-400">Select a conversation to view messages</p>
          </div>
        )}
      </div>
    </div>
  );
}
