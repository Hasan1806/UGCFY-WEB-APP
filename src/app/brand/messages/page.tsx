"use client";

import { motion } from "framer-motion";
import { pageVariants } from "@/components/animations/motionVariants";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function BrandMessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchMessagesData = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) return;
        setUser(currentUser);

        // Fetch messages for this user (simplistic view, assumes a single chat for demo or fetching all messages)
        const { data: msgs, error } = await supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: true })
          .limit(50);

        if (error) throw error;

        if (msgs) {
          setMessages(msgs.map((m: any) => ({
            id: m.id,
            type: m.sender_id === currentUser.id ? "brand" : "creator",
            text: m.content || m.message || m.text,
            sender: m.sender_name || (m.sender_id === currentUser.id ? "Me" : "Creator"),
            time: new Date(m.created_at).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })
          })));

          // Derive conversations from messages or mock for now if schema is unknown
          setConversations([
            { title: "General Chat", message: "Recent conversation", unread: 0, time: "Now", active: true }
          ]);
          setMembers([
            { name: "Creator", role: "Creator", initials: "CR" },
            { name: "Me", role: "Brand", initials: "ME" }
          ]);
        }
      } catch (error: any) {
        toast.error("Failed to load messages");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessagesData();

    const channel = supabase
      .channel("messages_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload: any) => {
          const m = payload.new as any;
          setMessages((prev) => [...prev, {
            id: m.id,
            type: m.sender_id === user?.id ? "brand" : "creator",
            text: m.content || m.message || m.text,
            sender: m.sender_name || (m.sender_id === user?.id ? "Me" : "Creator"),
            time: new Date(m.created_at).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })
          }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user?.id]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    try {
      const { error } = await supabase.from("messages").insert({
        sender_id: user.id,
        content: newMessage,
        // Assuming other required fields like receiver_id or conversation_id exist, 
        // we might need to adjust this depending on actual schema
      });
      if (error) throw error;
      setNewMessage("");
    } catch (error: any) {
      toast.error("Failed to send message");
      console.error(error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-white">Loading Messages...</div>;
  }

  return (
    <motion.div initial="initial" animate="animate" variants={pageVariants} className="mx-auto max-w-[1640px] space-y-6 pb-10">
      <header className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <p className="text-sm uppercase tracking-[0.28em] text-white/50">Messaging hub</p>
        <h1 className="mt-3 text-4xl font-[var(--font-display)] font-semibold text-white">Collaborate with creators in real time.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">Manage conversations, track updates, and keep campaigns moving from a single communication command center.</p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[280px_1fr_300px]">
        <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }} className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/50">Conversations</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Chats</h2>
            </div>
            <button className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/80 hover:bg-white/10">New</button>
          </div>
          <div className="mt-6 space-y-3">
            {conversations.map((item) => (
              <div key={item.title} className={`rounded-3xl border ${item.active ? "border-[#DC143C]/40 bg-[rgba(220,20,60,0.10)]" : "border-white/10 bg-white/5"} p-4 transition hover:border-white/20`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm text-white/60">{item.message}</p>
                  </div>
                  <span className="text-xs text-white/50">{item.time}</span>
                </div>
                {item.unread ? <span className="mt-4 inline-flex rounded-full bg-[#DC143C] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">{item.unread} new</span> : null}
              </div>
            ))}
          </div>
        </motion.aside>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.08 }} className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.45)] flex flex-col min-h-[500px]">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-white/50">Chat view</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">General Chat</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              <span className="h-2.5 w-2.5 rounded-full bg-[#DC143C]" />
              Active
            </div>
          </div>

          <div className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-5 flex-1 overflow-y-auto max-h-[500px]">
            {messages.length === 0 ? (
               <div className="text-center text-white/50 py-10">No messages yet.</div>
            ) : messages.map((item, index) => (
              <div key={item.id || index} className={`${item.type === "brand" ? "ml-auto max-w-[80%] rounded-[28px] bg-[rgba(220,20,60,0.18)] text-right" : item.type === "creator" ? "mr-auto max-w-[80%] rounded-[28px] bg-[rgba(255,255,255,0.08)]" : "mx-auto max-w-[75%] rounded-[28px] bg-[rgba(255,255,255,0.05)] text-center"} p-4 text-white/90`}>
                <p className="text-sm leading-6">{item.text}</p>
                <div className="mt-2 flex items-center justify-end gap-2 text-[11px] uppercase tracking-[0.24em] text-white/50">
                  {item.sender ? <span>{item.sender}</span> : null}
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-3">
            <input 
              type="text" 
              placeholder="Type a message..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/50" 
            />
            <button onClick={sendMessage} className="rounded-2xl bg-gradient-to-br from-[#DC143C] to-[#9B1239] px-5 py-3 text-sm font-semibold text-white">Send</button>
          </div>
        </motion.section>

        <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.16 }} className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-white/50">Group info</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Team details</h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">{members.length} members</span>
          </div>
          <div className="mt-6 space-y-4">
            {members.map((member) => (
              <div key={member.name} className="flex items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-white/80">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1E3A8A] text-sm font-semibold text-white">{member.initials}</div>
                  <div>
                    <p className="font-semibold text-white">{member.name}</p>
                    <p className="text-sm text-white/60">{member.role}</p>
                  </div>
                </div>
                <button className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.24em] text-white/70 hover:bg-white/10">View</button>
              </div>
            ))}
          </div>
        </motion.aside>
      </div>
    </motion.div>
  );
}
