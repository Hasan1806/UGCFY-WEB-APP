"use client";
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";
import { 
  CheckSquare, 
  Check, 
  X, 
  CheckCircle2, 
  Lock,
  RotateCcw,
  ShieldCheck
} from "lucide-react";
import { z } from "zod";
import { SafeAvatar } from "@/components/dashboard/SafeAvatar";
import { safeLower } from "@/lib/dashboard/dashboardSafety";
import { formatDashboardDate } from "@/lib/dashboard/formatDashboardDate";
import { formatDashboardNumber } from "@/lib/dashboard/formatDashboardNumber";

const CreatorSchema = z.object({
  full_name: z.string().nullish().transform(v => v || "Creator"),
  avatar_url: z.string().nullish().transform(v => v || null),
  location: z.string().nullish().transform(v => v || ""),
  instagram_url: z.string().nullish().transform(v => v || "")
}).nullish().transform(v => v || { full_name: "Creator", avatar_url: null, location: "", instagram_url: "" });

const CampaignSchema = z.object({
  title: z.string().nullish().transform(v => v || "Campaign"),
  budget: z.number().nullish().transform(v => v || 0)
}).nullish().transform(v => v || { title: "Campaign", budget: 0 });

const SubmissionSchema = z.object({
  id: z.string(),
  application_id: z.string().nullish().transform(v => v || ""),
  campaign_id: z.string().nullish().transform(v => v || ""),
  creator_id: z.string().nullish().transform(v => v || ""),
  video_url: z.string().nullish().transform(v => v || ""),
  thumbnail_url: z.string().nullish().transform(v => v || ""),
  caption: z.string().nullish().transform(v => v || "UGC video submission"),
  notes: z.string().nullish().transform(v => v || "No submission notes provided."),
  status: z.string().nullish().transform(v => v || "Pending"),
  feedback: z.string().nullable(),
  created_at: z.string().nullish().transform(v => v || null),
  campaign: CampaignSchema,
  creator: CreatorSchema
});

type UGCSubmission = z.infer<typeof SubmissionSchema>;

export default function ApprovalsPage() {
  const supabase = createClient();
  const [submissions, setSubmissions] = useState<UGCSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState<UGCSubmission | null>(null);
  const [revisionFeedback, setRevisionFeedback] = useState("");
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadSubmissions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("ugc_submissions")
        .select(`
          *,
          campaign:campaigns(*),
          creator:creator_profiles(*)
        `)
        .order("created_at", { ascending: false });

      if (error && error.code !== "42P01") {
        console.error("Error fetching submissions", error);
      }

      const fetchedSubmissions = data || [];
      const parsedSubmissions = z.array(SubmissionSchema).parse(fetchedSubmissions);

      setSubmissions(parsedSubmissions);
      if (parsedSubmissions.length > 0) {
        setSelectedSub(parsedSubmissions[0] || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const handleApprove = async () => {
    if (!selectedSub) return;
    setActionSuccess(null);

    try {
      await supabase
        .from("ugc_submissions")
        .update({ status: "Approved" })
        .eq("id", selectedSub.id);

      setSubmissions(prev => 
        prev.map(s => s.id === selectedSub.id ? { ...s, status: "Approved" } : s)
      );
      setSelectedSub(prev => prev ? { ...prev, status: "Approved" } : null);

      setActionSuccess("Escrow funds released! Creator notified.");
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestRevision = async () => {
    if (!selectedSub || !revisionFeedback) return;
    setActionSuccess(null);

    try {
      await supabase
        .from("ugc_submissions")
        .update({ status: "Rejected", feedback: revisionFeedback })
        .eq("id", selectedSub.id);

      setSubmissions(prev => 
        prev.map(s => s.id === selectedSub.id ? { ...s, status: "Rejected", feedback: revisionFeedback } : s)
      );
      setSelectedSub(prev => prev ? { ...prev, status: "Rejected", feedback: revisionFeedback } : null);

      setShowRevisionModal(false);
      setRevisionFeedback("");
      setActionSuccess("Revision request submitted to creator.");
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 min-h-full">
      <DashboardPageHeader 
        title="Content Approvals" 
        description="Review UGC video deliverables. Approving releases pre-funded escrow payouts to creators immediately."
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
        </div>
      ) : submissions.length === 0 ? (
        <DashboardEmptyState 
          title="No approvals pending."
          description="Creator submissions that need review will appear here."
          icon={CheckSquare}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Content Pipeline</h3>
            
            <div className="space-y-3">
              {submissions.map((sub) => {
                const isSelected = selectedSub?.id === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSub(sub)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
                      isSelected 
                        ? "border-red-500 shadow-md ring-1 ring-red-500/20" 
                        : "border-gray-200 hover:border-gray-300 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <DashboardStatusBadge 
                        status={sub.status === "Rejected" ? "Revision Requested" : sub.status} 
                        type={sub.status === "Approved" ? "success" : sub.status === "Pending" ? "warning" : "danger"} 
                      />
                      <span className="text-[10px] text-gray-400">
                        {formatDashboardDate(sub.created_at)}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-gray-800 line-clamp-1">
                      {sub.caption || "UGC video submission"}
                    </h4>
                    
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                      <SafeAvatar
                        src={sub.creator.avatar_url}
                        name={sub.creator.full_name}
                        alt={sub.creator.full_name}
                        size="sm"
                        className="h-6 w-6 text-[10px] bg-red-50 text-red-600 border-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-gray-700 truncate">{sub.creator.full_name}</p>
                        <p className="text-[9px] text-gray-400 truncate">{sub.campaign.title}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-8">
            {selectedSub ? (
              <DashboardCard className="p-6 sm:p-8 space-y-6 hover:shadow-sm cursor-default hover:border-gray-200/60">
                
                {actionSuccess && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-pulse">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span>{actionSuccess}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-gray-100 pb-5">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-red-50 text-red-600 rounded-md">
                      {selectedSub.campaign.title}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900 mt-2">
                      {selectedSub.caption}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted by <span className="font-semibold text-gray-700">{selectedSub.creator.full_name}</span> • {selectedSub.creator.location}
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-3 shrink-0 h-fit">
                    <div className="p-2 bg-gray-100 text-gray-600 rounded-xl">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Escrow Balance</p>
                      <p className="text-sm font-extrabold text-gray-800 mt-0.5">
                        ${formatDashboardNumber(selectedSub.campaign.budget)} USD
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  <div className="md:col-span-5 flex justify-center">
                    <div className="relative w-full max-w-[240px] aspect-[9/16] rounded-[36px] border-[8px] border-gray-900 bg-black overflow-hidden shadow-2xl ring-4 ring-gray-900/10">
                      
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-gray-900 rounded-full z-20" />
                      
                      {selectedSub.video_url ? (
                        <video
                          src={selectedSub.video_url}
                          controls
                          playsInline
                          className="w-full h-full object-cover"
                          poster={selectedSub.thumbnail_url || undefined}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-950 px-4 text-center text-xs font-bold text-white/70">
                          No video file attached
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none text-white z-10 flex flex-col justify-end">
                        <p className="text-xs font-bold flex items-center gap-1">
                          @{safeLower(selectedSub.creator.full_name).replace(/\s/g, "")}
                          
                        </p>
                        <p className="text-[9px] text-white/80 mt-1 line-clamp-2 leading-relaxed">
                          {selectedSub.caption}
                        </p>
                      </div>

                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Creator's Cover Note</h4>
                      <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl italic text-xs text-gray-600 leading-relaxed">
                        "{selectedSub.notes || "No submission notes provided."}"
                      </div>
                    </div>

                    {selectedSub.feedback && (
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Previous Revision Feedback</h4>
                        <div className="p-4 bg-red-50/50 border border-red-100/50 rounded-2xl text-xs text-red-700 font-semibold leading-relaxed">
                          "{selectedSub.feedback}"
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-red-50/60 border border-red-100/30 rounded-2xl flex items-start gap-3">
                      <ShieldCheck className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <h5 className="font-bold text-gray-800">Escrow Security Policy</h5>
                        <p className="text-gray-500 mt-0.5">Approve content release only if video deliverables fulfill all design mandates. Releasing funds completes the project cycle.</p>
                      </div>
                    </div>

                    {selectedSub.status === "Pending" && (
                      <div className="flex flex-wrap gap-3 pt-2">
                        <button
                          onClick={handleApprove}
                          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Check className="h-4 w-4" />
                          Approve & Release Escrow
                        </button>
                        <button
                          onClick={() => setShowRevisionModal(true)}
                          className="px-4 py-2.5 border border-gray-200 bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <X className="h-4 w-4" />
                          Request Revision
                        </button>
                      </div>
                    )}

                    {selectedSub.status === "Approved" && (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold w-fit">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>Escrow Funds Successfully Disbursed</span>
                      </div>
                    )}
                  </div>

                </div>

              </DashboardCard>
            ) : null}
          </div>

        </div>
      )}

      <AnimatePresence>
        {showRevisionModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRevisionModal(false)}
              className="absolute inset-0 bg-black cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-100 z-10"
            >
              <button 
                onClick={() => setShowRevisionModal(false)}
                className="absolute right-4 top-4 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 cursor-pointer transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-6 pr-8">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  Request UGC Revision
                  <RotateCcw className="h-5 w-5 text-red-500" />
                </h3>
                <p className="text-sm text-gray-500 mt-1">Provide detailed adjustments or edits required from the creator.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Feedback Comments</label>
                  <textarea
                    rows={4}
                    value={revisionFeedback}
                    onChange={(e) => setRevisionFeedback(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition resize-none shadow-sm"
                    placeholder="e.g. Please mention the Flyknit mesh cushioning technology within the first 5 seconds. The audio transition at the end feels slightly cut off."
                  />
                </div>

                <button
                  onClick={handleRequestRevision}
                  disabled={!revisionFeedback.trim()}
                  className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  Send Revision Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
