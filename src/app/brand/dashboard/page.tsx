"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { TiltCard } from "@/components/ui/TiltCard";
import { LiveDot } from "@/components/ui/LiveDot";
import { pageVariants, staggerContainer, staggerItem } from "@/components/animations/motionVariants";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const actions = [
  { title: "New Campaign", subtitle: "Create a high-impact creator brief." },
  { title: "Browse Creators", subtitle: "Explore talent across niches." },
  { title: "Deliverables", subtitle: "Review pending submissions." },
  { title: "Messages", subtitle: "Catch up with creators." },
];

export default function BrandDashboardPage() {
  const [kpis, setKpis] = useState([
    { title: "Active Campaigns", value: "0", trend: "0", color: "#DC143C", icon: "🚀" },
    { title: "Creators Reached", value: "0", trend: "0%", color: "#2563EB", icon: "👥" },
    { title: "Deliverables", value: "0", trend: "0", color: "#06B6D4", icon: "📦" },
    { title: "Pending Reviews", value: "0", trend: "0", color: "#EAB308", icon: "⏳" },
    { title: "Budget Deployed", value: "$0", trend: "0%", color: "#22C55E", icon: "💰" },
    { title: "Avg Rating", value: "0", trend: "0", color: "#F59E0B", icon: "⭐" },
  ]);
  const [pipelineItems, setPipelineItems] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch campaigns
        const { data: campaigns } = await supabase
          .from("campaigns")
          .select("*")
          .eq("brand_id", user.id)
          .order("created_at", { ascending: false });

        if (campaigns) {
          const activeCount = campaigns.filter(c => c.status === "Active" || c.status === "active").length;
          setKpis(prev => {
            const newKpis = [...prev];
            newKpis[0].value = activeCount.toString();
            return newKpis;
          });

          setPipelineItems(campaigns.slice(0, 3).map(c => ({
            name: c.title || c.name,
            status: c.status,
            progress: c.progress || 0,
            creators: c.creators_count || 0,
            due: new Date(c.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          })));
        }

        // Fetch notifications/activities
        const { data: notifs } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3);
        
        if (notifs) {
          setActivities(notifs.map(n => ({
            label: n.message,
            time: new Date(n.created_at).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' }),
            color: n.type === "success" ? "#22C55E" : (n.type === "error" ? "#DC143C" : "#2563EB")
          })));
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [supabase]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-white">Loading Dashboard...</div>;
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
      className="mx-auto max-w-[1640px] space-y-6"
    >
      <section className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-xl shadow-[0_16px_60px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm text-white/60">Dashboard</p>
            <h1 className="mt-2 text-3xl font-[var(--font-display)] font-semibold tracking-[-0.03em] text-white">Brand control center</h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full max-w-sm">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50">⌘K</span>
              <input
                type="search"
                placeholder="Search campaigns, creators, messages..."
                className="h-14 w-full rounded-[18px] border border-white/10 bg-white/5 px-12 text-sm text-white outline-none transition focus:border-[#DC143C] focus:ring-2 focus:ring-[#DC143C]/15"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10">Help</button>
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10 text-white">RB</div>
            </div>
          </div>
        </div>
      </section>

      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {kpis.map((item) => (
          <motion.div key={item.title} variants={staggerItem}>
            <TiltCard className="glass-edge rounded-[32px] p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[rgba(255,255,255,0.08)] text-2xl">{item.icon}</div>
                <div className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.26em] text-white/60">{item.title}</div>
              </div>
              <div className="mt-6">
                <p className="text-4xl font-[var(--font-display)] font-semibold tracking-[-0.03em] text-white">{item.value}</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-white/60">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.trend} this period</span>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>

      <GlassCard className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-white/50">Campaign pipeline</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Ongoing and upcoming briefs</h2>
          </div>
          <button className="rounded-2xl bg-gradient-to-br from-[#DC143C] to-[#9B1239] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-button)]">
            + New Campaign
          </button>
        </div>
        <div className="mt-6 space-y-4">
          {pipelineItems.length === 0 ? (
            <p className="text-white/60 text-sm">No campaigns found.</p>
          ) : pipelineItems.map((item) => (
            <div key={item.name} className="group rounded-[24px] border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(220,20,60,0.16)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">{item.name}</p>
                  <p className="mt-1 text-sm text-white/60">{item.creators} creators · due {item.due}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-[rgba(255,255,255,0.08)] px-3 py-2 text-sm uppercase tracking-[0.24em] text-white/70">{item.status}</span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-[#DC143C] to-[#9B1239]" style={{ width: `${item.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-white/50">Activity feed</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Recent platform updates</h2>
            </div>
            <span className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">Live</span>
          </div>
          <div className="mt-6 space-y-4">
            {activities.length === 0 ? (
              <p className="text-white/60 text-sm">No recent activities.</p>
            ) : activities.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="h-11 w-11 rounded-3xl" style={{ backgroundColor: item.color, opacity: 0.16 }} />
                <div>
                  <p className="text-sm text-white">{item.label}</p>
                  <p className="text-xs text-white/50">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-white/50">Quick actions</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Get things done</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4">
            {actions.map((action) => (
              <button key={action.title} className="rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-5 text-left transition hover:-translate-y-0.5 hover:bg-white/10">
                <p className="text-sm font-semibold text-white">{action.title}</p>
                <p className="mt-1 text-xs text-white/60">{action.subtitle}</p>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}
