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
  // 1. If it's undefined, null, or not a string, return an empty string safely.
  if (!rawText || typeof rawText !== 'string') {
    return '';
  }
  
  try {
    // 2. Perform your necessary replacements here (e.g., removing specific markdown)
    // Example: return rawText.replace(/\*\*/g, ''); 
    return rawText; // Add your actual replace logic back here safely
  } catch (err) {
    console.error("Text formatting failed:", err);
    return rawText; // Fallback to raw text if regex fails
  }
};

export default function GlobalChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
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

  // Onboarding Intercept trigger
  useEffect(() => {
    const handleOpenOnboarding = () => {
      setIsOpen(true);
      // Reset chat history and insert SIYAA's first onboarding message
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
    };

    window.addEventListener("open-SIYAA-onboarding", handleOpenOnboarding);
    return () => {
      window.removeEventListener("open-SIYAA-onboarding", handleOpenOnboarding);
    };
  }, [setMessages]);

  // Auto scroll to bottom when new messages arrive or chat window opens
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

  // Helper to extract text from message parts or content
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
    <>
      {/* EMAIL / CONTACT US BUTTON */}
      <a
        href="mailto:support@ugcfy.com"
        className={`fixed right-6 z-40 h-[60px] w-[60px] rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:-translate-y-1 active:scale-95 transition-all duration-500 cursor-pointer group bottom-[96px] overflow-visible ${isOpen ? "opacity-0 pointer-events-none translate-y-4 scale-75" : "opacity-100 translate-y-0 scale-100"
          }`}
        aria-label="Contact Us via Email"
        title="Contact Us"
      >
        {/* Outer Animated Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 blur-[12px] opacity-20 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"></div>

        {/* Button Surface */}
        <div className="absolute inset-0 rounded-full bg-[#0A0A0A] border border-white/20 overflow-hidden flex items-center justify-center pointer-events-none shadow-inner transition-colors duration-300 group-hover:border-white/40 group-hover:bg-[#111111]">
          <Mail className="h-6 w-6 text-slate-300 group-hover:text-white group-hover:scale-110 transition-transform duration-300" />
        </div>
      </a>

      {/* FLOATING ACTION BUTTON (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-[60px] w-[60px] rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:-translate-y-1 active:scale-95 transition-all duration-300 cursor-pointer group overflow-visible"
        aria-label="Open Chat with SIYAA"
      >
        {/* Outer Animated Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#E11D48] to-[#F43F5E] blur-[12px] opacity-40 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none"></div>

        {/* Button Surface */}
        <div className="absolute inset-0 rounded-full bg-[#0A0A0A] border border-white/20 overflow-hidden flex items-center justify-center pointer-events-none shadow-inner">
          <AnimatePresence>
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center w-full h-full text-white"
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ scale: 0.5, opacity: 0, rotate: 90 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
                className="relative flex items-center justify-center w-full h-full text-white"
              >
                <div className="relative">
                  <MessageSquare className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" fillOpacity={0.1} />
                  
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status Indicator */}
        {!isOpen && (
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5 z-20 translate-x-[5%] -translate-y-[5%]">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#0A0A0A]"></span>
          </span>
        )}
      </button>

      {/* CHAT WINDOW INTERFACE */}
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
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 2. CHAT MESSAGES BODY */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
              <AnimatePresence initial={false}>
                {/* Cold Start Empty State Greeting */}
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

                {/* Map of Active Streamed Messages */}
                {messages.map((message) => {
                  const isAssistant = message.role === "assistant";
                  const textContent = getMessageText(message);

                  // Skip rendering if there is no text chunk in the message content or parts
                  if (!textContent) return null;

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2.5 items-start ${isAssistant ? "justify-start text-left" : "justify-end text-right"}`}
                    >
                      {isAssistant && (
                        <div className="h-7 w-7 rounded-full bg-slate-900 flex items-center justify-center shrink-0 border border-slate-800 shadow-sm overflow-hidden">
                          <SafeImage src="/SIYAA-avatar.png" alt="SIYAA Avatar" width={28} height={28} className="object-cover" />
                        </div>
                      )}

                      <div
                        className={`text-xs py-2.5 px-4 rounded-2xl max-w-[80%] leading-relaxed font-medium whitespace-pre-wrap shadow-sm ${isAssistant
                          ? "bg-slate-100 border border-slate-200/30 text-slate-800 rounded-tl-none"
                          : "bg-gradient-to-tr from-brand-red-600 to-rose-600 text-white rounded-tr-none"
                          }`}
                      >
                        {textContent}
                      </div>
                    </motion.div>
                  );
                })}

                {/* API Key Missing or general error block */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 rounded-xl flex flex-col gap-2 text-[11px] font-bold ${error.message?.includes("free chat limit")
                      ? "bg-slate-900 border border-slate-800 text-white"
                      : error.message?.includes("429") || error.message?.includes("SIYAA is currently assisting")
                        ? "bg-amber-50/90 border border-amber-200 text-amber-800"
                        : "bg-red-50/80 border border-red-100 text-red-700"
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      {error.message?.includes("free chat limit") ? null : (
                        <AlertCircle className={`h-4 w-4 shrink-0 mt-0.5 ${error.message?.includes("429") || error.message?.includes("SIYAA is currently assisting")
                          ? "text-amber-600"
                          : "text-red-500"
                          }`} />
                      )}

                      <div className="flex flex-col gap-2 w-full">
                        <span className="text-sm font-extrabold tracking-tight">
                          {error.message?.includes("free chat limit")
                            ? "Unlock Full AI Access"
                            : error.message?.includes("429") || error.message?.includes("SIYAA is currently assisting")
                              ? "System Busy"
                              : "Failed to fetch reply."}
                        </span>

                        <p className={`text-xs font-normal leading-relaxed ${error.message?.includes("free chat limit")
                          ? "text-slate-300"
                          : error.message?.includes("429") || error.message?.includes("SIYAA is currently assisting")
                            ? "text-amber-700/95"
                            : "text-red-600/90"
                          }`}>
                          {(() => {
                            if (error.message?.includes("free chat limit")) {
                              return "You've reached the free chat limit. Register for UGC FY to unlock full access to SIYAA's AI intelligence and campaign strategies.";
                            }
                            if (error.message?.includes("429") || error.message?.includes("SIYAA is currently assisting")) {
                              return "SIYAA is currently assisting a massive volume of brands. Please wait 10 seconds and try again.";
                            }
                            try {
                              const parsed = JSON.parse(error.message);
                              return parsed.error || error.message;
                            } catch {
                              return error.message;
                            }
                          })()}
                        </p>

                        {error.message?.includes("free chat limit") && (
                          <Link href="/signup" className="mt-2 w-full text-center bg-brand-red-600 hover:bg-brand-red-700 text-white font-bold py-2.5 rounded-lg transition-colors">
                            Register Now
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Loading State bubble */}
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2.5 items-start text-left"
                  >
                    <div className="h-7 w-7 rounded-full bg-slate-900 flex items-center justify-center shrink-0 border border-slate-800 shadow-sm overflow-hidden">
                      <SafeImage src="/SIYAA-avatar.png" alt="SIYAA Avatar" width={28} height={28} className="object-cover" />
                    </div>
                    <div className="bg-slate-100 py-3 px-4 rounded-2xl rounded-tl-none max-w-[80%] flex items-center gap-1 shadow-sm">
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* 3. QUICK ACTIONS BAR */}
            {messages.length === 0 && (
              <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-200/50 flex flex-col gap-1.5 shrink-0">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickActionClick(action)}
                    className="w-full text-left px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200/80 text-[11px] font-bold text-slate-600 hover:text-brand-red-600 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-[0.99]"
                  >
                    <span className="text-brand-red-500">⚡</span>
                    <span>{action}</span>
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={handleFormSubmit}
              className="flex items-center gap-3 w-full p-4 bg-white border-t border-gray-100 shrink-0"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (error) clearError();
                }}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-base"
              />
              <button
                type={isLoading ? "button" : "submit"}
                onClick={isLoading ? () => stop() : undefined}
                disabled={!isLoading && !inputValue.trim()}
                className={`p-3 rounded-xl transition-all flex items-center justify-center shrink-0 ${
                  inputValue.trim() && !isLoading
                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/10 cursor-pointer'
                    : isLoading
                      ? 'bg-slate-800 hover:bg-slate-900 text-white shadow-slate-900/10 cursor-pointer'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                aria-label={isLoading ? "Stop generating" : "Send message"}
              >
                {isLoading ? (
                  <span className="relative flex h-5 w-5 items-center justify-center">
                    <span className="h-2 w-2 bg-white rounded-sm animate-pulse" />
                  </span>
                ) : (
                  <Send className="w-5 h-5 stroke-[2]" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
