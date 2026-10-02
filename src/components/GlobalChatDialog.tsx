"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import SafeImage from "./SafeImage";
import Link from "next/link";
import {
  X,
  Send,
  AlertCircle,
  MessageSquare,
  Mail
} from "lucide-react";

// PERMANENT FIX: Defensive String Formatter
const safeFormatText = (rawText: unknown): string => {
  if (!rawText || typeof rawText !== 'string') {
    return '';
  }
  try {
    return rawText;
  } catch (err) {
    console.error("Text formatting failed:", err);
    return rawText;
  }
};

interface GlobalChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  startOnboarding?: boolean;
}

export default function GlobalChatDialog({ isOpen, onClose, startOnboarding }: GlobalChatDialogProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    sendMessage,
    status,
    error,
    clearError,
    stop,
    setMessages
  } = useChat();

  useEffect(() => {
    if (startOnboarding) {
      setMessages([
        {
          id: "SIYAA-onboarding-start",
          role: "assistant",
          parts: [
            {
              type: "text",
              text: "Hi! I'm SIYAA. Let's get your brand verified for UGC FY. To start, what is your Brand/Company Name?",
            }
          ]
        }
      ]);
    }
  }, [startOnboarding, setMessages]);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages]);

  const quickActions = [
    "How do I request brand access?",
    "How long does verification take?",
    "What is Escrow Protection?"
  ];

  const handleQuickActionClick = (actionText: string) => {
    if (error) clearError();
    sendMessage({ text: actionText });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || status === "submitted" || status === "streaming") return;
    if (error) clearError();
    sendMessage({ text: inputValue });
    setInputValue("");
  };

  const isLoading = status === "submitted" || status === "streaming";

  const getMessageText = (message: { content?: string; parts?: { type?: string; text?: string }[] }) => {
    if (!message) return "";
    let rawText = "";
    if (typeof message.content === "string" && message.content.length > 0) {
      rawText = message.content;
    } else if (Array.isArray(message.parts)) {
      rawText = message.parts
        .filter(part => part && (part.type === "text" || !part.type))
        .map(part => part.text || "")
        .join("\n");
    }
    return safeFormatText(rawText);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", damping: 22, stiffness: 280 }}
          className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[385px] h-[600px] max-h-[75vh] sm:max-h-[80vh] bg-white/90 backdrop-blur-2xl border border-slate-200/60 shadow-2xl rounded-3xl flex flex-col overflow-hidden text-left"
        >
          {/* 1. CHAT HEADER */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-4 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-brand-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-red-500/10 overflow-hidden border border-white/10">
                <SafeImage src="/SIYAA-avatar.png" alt="SIYAA Avatar" width={36} height={36} className="object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight">SIYAA</span>
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase"></p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* 2. CHAT MESSAGES BODY */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
            <AnimatePresence initial={false}>
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5 items-start text-left"
                >
                  <div className="h-7 w-7 rounded-full bg-slate-900 flex items-center justify-center shrink-0 border border-slate-800 shadow-sm overflow-hidden">
                    <SafeImage src="/SIYAA-avatar.png" alt="SIYAA Avatar" width={28} height={28} className="object-cover" />
                  </div>
                  <div className="bg-slate-100 text-slate-800 text-xs py-2.5 px-4 rounded-2xl rounded-tl-none font-medium max-w-[80%] leading-relaxed">
                    Hello! I am SIYAA, the AI powering UGC FY. How can I help you today? You can ask me about requesting access, verification times, or escrow protection.
                  </div>
                </motion.div>
              )}

              {messages.map((message) => {
                const isAssistant = message.role === "assistant";
                const textContent = getMessageText(message);
                if (!textContent) return null;

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2.5 items-start text-left ${isAssistant ? "" : "flex-row-reverse"}`}
                  >
                    {isAssistant ? (
                      <div className="h-7 w-7 rounded-full bg-slate-900 flex items-center justify-center shrink-0 border border-slate-800 shadow-sm overflow-hidden">
                        <SafeImage src="/SIYAA-avatar.png" alt="SIYAA Avatar" width={28} height={28} className="object-cover" />
                      </div>
                    ) : null}

                    <div className="flex flex-col gap-1.5 max-w-[80%]">
                      <div
                        className={`text-xs py-2.5 px-4 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                          isAssistant
                            ? "bg-slate-100 text-slate-800 rounded-tl-none font-medium"
                            : "bg-brand-red-600 text-white rounded-tr-none font-medium"
                        }`}
                      >
                        {textContent}
                      </div>

                      {/* Onboarding Trigger Button */}
                      {isAssistant && textContent.toLowerCase().includes("ready to complete verification") && (
                        <Link
                          href="/brand/onboarding"
                          onClick={onClose}
                          className="mt-1 self-start inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-red-600 hover:bg-brand-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                        >
                          <span>Complete KYC Verification</span>
                          <span>→</span>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5 items-start text-left"
                >
                  <div className="h-7 w-7 rounded-full bg-slate-900 flex items-center justify-center shrink-0 border border-slate-800 shadow-sm overflow-hidden">
                    <SafeImage src="/SIYAA-avatar.png" alt="SIYAA Avatar" width={28} height={28} className="object-cover" />
                  </div>
                  <div className="bg-slate-100 text-slate-800 text-xs py-3 px-4 rounded-2xl rounded-tl-none flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-start gap-2 text-left"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Unable to connect</p>
                    <p className="text-[11px] text-red-500 mt-0.5">Please try asking your question again.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* 3. QUICK SUGGESTIONS */}
          {messages.length === 0 && (
            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-1.5 shrink-0 text-left">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickActionClick(action)}
                  className="text-[11px] bg-white border border-slate-200/80 hover:border-brand-red-300 text-slate-600 hover:text-brand-red-600 px-2.5 py-1 rounded-full transition shadow-2xs font-medium cursor-pointer"
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          {/* 4. CHAT INPUT FOOTER */}
          <form onSubmit={handleFormSubmit} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask SIYAA anything..."
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red-500 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="h-8 w-8 bg-brand-red-600 hover:bg-brand-red-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition shadow-xs cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
