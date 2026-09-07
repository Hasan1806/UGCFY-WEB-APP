"use client";

import React, { useRef, useEffect, useState } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setError(false);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error("API Error");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let assistantContent = "";
      const assistantMessageId = (Date.now() + 1).toString();

      setMessages((prev) => [...prev, { id: assistantMessageId, role: "assistant", content: "" }]);
      setIsLoading(false); // Stop loading indicator once stream starts

      if (reader) {
        let done = false;
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            assistantContent += decoder.decode(value, { stream: true });
            setMessages((prev) => 
              prev.map(msg => 
                msg.id === assistantMessageId ? { ...msg, content: assistantContent } : msg
              )
            );
          }
        }
      }
    } catch {
      setError(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] w-full max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex-shrink-0">
      <div className="bg-[#0A0A0A] p-4 text-white flex items-center gap-3">
        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold">UGCFY Assistant</h3>
          <p className="text-xs text-white/60">Ask me anything about the platform.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
            <Bot className="w-12 h-12 mb-4 text-slate-400" />
            <p className="text-slate-600">I am the UGCFY AI. How can I help you today?</p>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex gap-4 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-[var(--color-primary)]" />
              </div>
            )}
            
            <div className={`px-5 py-3.5 rounded-2xl max-w-[80%] ${
              m.role === "user" 
                ? "bg-slate-900 text-white rounded-br-sm shadow-md" 
                : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm shadow-sm"
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
            </div>

            {m.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-slate-600" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
              <Loader2 className="w-4 h-4 text-[var(--color-primary)] animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse delay-75"></div>
              <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse delay-150"></div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 text-center">
            Failed to fetch response. Check your API keys.
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-[var(--color-primary)] text-white rounded-lg disabled:opacity-50 hover:bg-red-700 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
