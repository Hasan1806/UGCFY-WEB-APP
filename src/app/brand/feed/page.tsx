"use client";

import { motion } from "framer-motion";
import { FeedPostCard } from "@/components/brand/FeedPostCard";
import { pageVariants } from "@/components/animations/motionVariants";

const posts = [
  { title: "Holiday UGC Showcase", type: "UGC Showcase", caption: "See the top creator content driving engagement for our winter launch.", creator: "Ava Hart", stats: { views: "42K", applications: "128" }, featured: true },
  { title: "Campaign Spotlight", type: "Campaign Spotlight", caption: "Highlighting the newest deliverables from the apparel awareness push.", creator: "Milo Reed", stats: { views: "28K", applications: "74" } },
  { title: "Creator Shoutout", type: "Shoutout", caption: "Recognizing top creator contributions and expert storytelling.", creator: "Nia Sol", stats: { views: "19K", applications: "54" } },
  { title: "Announcement", type: "Announcement", caption: "Brand update: new product launch guidelines and content format changes.", creator: "Team", stats: { views: "11K", applications: "8" } },
];

export default function BrandFeedPage() {
  return (
    <motion.div initial="initial" animate="animate" variants={pageVariants} className="mx-auto max-w-[1640px] space-y-6 pb-10">
      <header className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <p className="text-sm uppercase tracking-[0.28em] text-white/50">Brand feed</p>
        <h1 className="mt-3 text-4xl font-[var(--font-display)] font-semibold text-white">Content & community updates</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">Curate posts, publish announcements, and keep your brand story on the platform feed.</p>
      </header>
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-white/50">Composer</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Publish a new feed post</h2>
              </div>
              <button className="rounded-2xl bg-gradient-to-br from-[#DC143C] to-[#9B1239] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-button)]">
                Publish
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <textarea className="min-h-[160px] w-full rounded-[28px] border border-white/10 bg-white/5 p-5 text-sm text-white outline-none placeholder:text-white/40" placeholder="Write your post..." />
              <div className="flex flex-wrap items-center gap-3">
                <button className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/80 hover:bg-white/10">Upload media</button>
                <button className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/80 hover:bg-white/10">Select post type</button>
                <span className="text-sm text-white/50">Scheduled publish available</span>
              </div>
            </div>
          </section>
          <div className="grid gap-6 lg:grid-cols-2">
            {posts.map((post) => (
              <FeedPostCard key={post.title} {...post} />
            ))}
          </div>
        </div>
        <aside className="space-y-6">
          <section className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <p className="text-sm uppercase tracking-[0.28em] text-white/50">Top metrics</p>
            <div className="mt-6 space-y-4">
              {[
                { label: "Top post", value: "Holiday UGC Showcase" },
                { label: "Engagement", value: "+18%" },
                { label: "Reach", value: "120K" },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/80">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/50">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <p className="text-sm uppercase tracking-[0.28em] text-white/50">Pinned draft</p>
            <div className="mt-4 rounded-[28px] border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              <p className="font-semibold text-white">Product launch teaser</p>
              <p className="mt-2 text-white/60">Ready to schedule for next week. Includes new brand narrative and creator callout.</p>
            </div>
          </section>
        </aside>
      </div>
    </motion.div>
  );
}
