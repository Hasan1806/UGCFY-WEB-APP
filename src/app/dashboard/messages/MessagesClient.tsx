/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { MessageSquare, Send, User } from "lucide-react";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { formatDashboardDateTime } from "@/lib/dashboard/formatDashboardDate";

interface Props {
  initialThreads: any[];
}

export function MessagesClient({ initialThreads }: Props) {
  const [threads] = useState(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  const activeThread = threads.find(t => t.id === activeThreadId);

  if (threads.length === 0) {
    return (
      <div className="min-h-full">
        <DashboardEmptyState 
          title="No creator conversations yet"
          description="Messages will appear once creators begin collaborating on your campaigns."
          icon={MessageSquare}
        />
      </div>
    );
  }

  return (
    <div className="h-[600px] md:h-full flex flex-col md:flex-row bg-white overflow-hidden w-full relative border border-gray-200 rounded-3xl shadow-sm">
      {/* Threads Sidebar */}
      <div className={`md:w-80 border-r border-gray-200 flex-col h-full bg-gray-50/50 shrink-0 ${activeThread ? 'hidden md:flex' : 'flex flex-1'}`}>
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-800">Inbox</h2>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100/60">
          {threads.map(t => (
            <div 
              key={t.id} 
              onClick={() => setActiveThreadId(t.id)}
              className={`p-4 cursor-pointer transition ${activeThreadId === t.id ? 'bg-red-50/50 border-l-2 border-red-600' : 'hover:bg-white'}`}
            >
              <h4 className="text-xs font-bold text-gray-800 truncate">{t.title}</h4>
              <p className="text-[10px] text-gray-500 mt-1 truncate">{t.lastMessage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex-col h-full bg-gray-50/20 ${activeThread ? 'flex' : 'hidden md:flex'}`}>
        {activeThread ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white shadow-sm z-10 flex items-center gap-3">
              <button 
                onClick={() => setActiveThreadId(null)}
                className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <h3 className="text-sm font-extrabold text-gray-900">{activeThread.title}</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {(activeThread.messages || []).map((msg: any) => (
                <div key={msg.id} className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-gray-800">Sender</span>
                      <span className="text-[10px] text-gray-400">{formatDashboardDateTime(msg.created_at)}</span>
                    </div>
                    <div className="text-sm text-gray-700 mt-1 bg-white p-3 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {(!activeThread.messages || activeThread.messages.length === 0) && (
                <div className="text-center text-xs text-gray-400 py-10">No messages yet. Start the conversation.</div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
                  readOnly 
                />
                <button className="h-11 w-11 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition cursor-pointer shadow-md">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <MessageSquare className="h-12 w-12 text-gray-200 mb-4" />
            <p className="text-sm font-bold text-gray-400">Select a thread to view messages</p>
          </div>
        )}
      </div>
    </div>
  );
}
