"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquarePlus, Loader2, AlertCircle } from "lucide-react";

interface Props {
  campaignId?: string | null;
  creatorId?: string | null;
}

export function StartCollaborationButton({ campaignId, creatorId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!campaignId || !creatorId) {
    return (
      <button 
        type="button" 
        disabled
        className="inline-flex min-h-10 items-center justify-center gap-1 rounded-2xl bg-slate-100 text-xs font-extrabold text-slate-400 cursor-not-allowed"
      >
        <MessageSquarePlus className="h-3.5 w-3.5" />
        Assign to a campaign first
      </button>
    );
  }

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/brand/collaboration/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_id: campaignId, creator_id: creatorId }),
      });
      const data = await res.json();
      if (!res.ok) {
        const errMsg = typeof data.error === "object" ? data.error.message : data.error;
        throw new Error(errMsg || "Failed to start collaboration");
      }
      
      router.push(`/dashboard/collaboration?conversation=${data.data.conversation_id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-flex flex-col">
      <button 
        onClick={handleStart}
        disabled={loading}
        type="button" 
        className="inline-flex w-full min-h-10 items-center justify-center gap-1 rounded-2xl bg-brand-red-600 px-2 text-xs font-extrabold text-white transition hover:bg-brand-red-700 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <MessageSquarePlus className="h-3.5 w-3.5" />
        )}
        {loading ? "Starting..." : "Start Collaboration"}
      </button>
      {error && (
        <div className="absolute top-full left-0 mt-1 w-full z-10 bg-white border border-red-200 rounded-lg p-2 shadow-lg flex items-start gap-1">
          <AlertCircle className="h-3 w-3 text-red-500 shrink-0 mt-0.5" />
          <span className="text-[10px] text-red-600 leading-tight">{error}</span>
        </div>
      )}
    </div>
  );
}
