"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CampaignsFilterBar } from "@/components/brand/CampaignsFilterBar";
import { CampaignCard } from "@/components/brand/CampaignCard";
import { pageVariants } from "@/components/animations/motionVariants";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

type Campaign = {
  title: string;
  category: string;
  status: string;
  progress: number;
  creators: number;
  deadline: string;
  id: string;
  variant: "active" | "draft" | "review" | "complete";
};

export default function BrandCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("campaigns")
          .select("*")
          .eq("brand_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          setCampaigns(data.map(c => ({
            id: c.id,
            title: c.title || c.name,
            category: c.category || "UGC",
            status: c.status,
            progress: c.progress || 0,
            creators: c.creators_count || 0,
            deadline: new Date(c.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            variant: c.status?.toLowerCase() as "active" | "draft" | "review" | "complete" || "active"
          })));
        }
      } catch (error: any) {
        toast.error("Failed to fetch campaigns");
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();

    // Subscribe to real-time updates for campaigns
    const channel = supabase
      .channel("campaigns_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "campaigns" },
        (payload) => {
          fetchCampaigns(); // Simplest way is to refetch, or optimistically update state
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (loading) {
     return <div className="flex items-center justify-center h-screen text-white">Loading Campaigns...</div>;
  }

  return (
    <motion.div initial="initial" animate="animate" variants={pageVariants} className="mx-auto max-w-[1640px] space-y-6">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-white/50">Campaigns</p>
          <h1 className="mt-3 text-4xl font-[var(--font-display)] font-semibold text-white">Campaign management</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/60">Filter campaigns, preview progress, and launch new briefs from the brand command center.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/brand/campaigns/new" className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#DC143C] to-[#9B1239] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-button)] transition hover:brightness-110">
            + Create Campaign
          </Link>
          <button className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm text-white/80 transition hover:bg-white/10">Export</button>
        </div>
      </div>

      <CampaignsFilterBar />

      <div className="grid gap-6 xl:grid-cols-3">
        {campaigns.length === 0 ? (
           <div className="col-span-3 text-center text-white/60 py-10">No campaigns found. Create your first one!</div>
        ) : (
          campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} {...campaign} />
          ))
        )}
        <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 280, damping: 24 }}>
          <div className="glass-edge flex h-full flex-col items-center justify-center rounded-[32px] border border-dashed border-white/10 bg-[rgba(255,255,255,0.04)] p-8 text-center transition hover:-translate-y-1 hover:border-[#DC143C]/50 hover:bg-white/10 min-h-[300px]">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(220,20,60,0.18)] text-3xl text-white">+</div>
            <h2 className="text-xl font-semibold text-white">New Campaign</h2>
            <p className="mt-3 text-sm text-white/60">Start a new creator campaign with a high-impact brief and launch timeline.</p>
            <Link href="/brand/campaigns/new" className="mt-6 inline-flex rounded-2xl bg-gradient-to-br from-[#DC143C] to-[#9B1239] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-button)]">
              Create one
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
