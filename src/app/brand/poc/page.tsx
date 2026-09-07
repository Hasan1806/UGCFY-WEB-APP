"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { POCCard } from "@/components/brand/POCCard";
import { pageVariants } from "@/components/animations/motionVariants";

const pocCards = [
  {
    title: "Mina Torres",
    id: "BN01-01",
    status: "active" as const,
    assignedCampaigns: 3,
    accessLevel: "Full Access",
  },
  {
    title: "Kris Novak",
    id: "BN01-03",
    status: "pending" as const,
    assignedCampaigns: 1,
    accessLevel: "Messaging",
  },
  {
    title: "Cassie Ray",
    id: "BN01-04",
    status: "rejected" as const,
    assignedCampaigns: 0,
    accessLevel: "View Only",
    reason: "Missing required compliance docs.",
  },
];

export default function BrandPOCPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <motion.div initial="initial" animate="animate" variants={pageVariants} className="mx-auto max-w-[1640px] space-y-6 pb-10">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-white/50">POC management</p>
          <h1 className="mt-3 text-4xl font-[var(--font-display)] font-semibold text-white">Manage proof of concept roles</h1>
          <p className="mt-4 max-w-2xl text-sm text-white/60">Review POC slots, approve new requests, and keep your brand’s access flow smooth with transparent status control.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setDrawerOpen(true)} className="rounded-2xl bg-gradient-to-br from-[#DC143C] to-[#9B1239] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-button)] transition hover:brightness-110">
            Create new POC
          </button>
          <Link href="/brand/dashboard" className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm text-white/80 transition hover:bg-white/10">
            Back to dashboard
          </Link>
        </div>
      </div>

      <div className="rounded-[32px] border border-white/10 bg-[rgba(220,20,60,0.08)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#DC143C]/80">Free trial limit</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">3 / 3 POC slots used</h2>
          </div>
          <button className="rounded-2xl bg-gradient-to-br from-[#DC143C] to-[#9B1239] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-button)]">
            Upgrade Now →
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {pocCards.map((card) => (
          <POCCard key={card.id} {...card} />
        ))}
      </div>

      <AnimatePresence>
        {drawerOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[440px] flex-col overflow-y-auto border-l border-white/10 bg-bg-overlay p-6 shadow-[0_0_60px_rgba(0,0,0,0.65)]"
            >
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-white/50">Create POC</p>
                  <h2 className="text-2xl font-semibold text-white">Submit new proof of concept</h2>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 hover:bg-white/10">
                  Close
                </button>
              </div>
              <div className="space-y-5">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/50">Photo upload</p>
                  <div className="mt-4 flex h-36 items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-white/5 text-sm text-white/60">
                    Drag & drop or click to upload an avatar
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "POC name", placeholder: "Enter POC full name" },
                    { label: "POC ID", placeholder: "BN01-05" },
                    { label: "Campaign assignment", placeholder: "Select campaign" },
                  ].map((field) => (
                    <label key={field.label} className="block text-sm text-white/60">
                      <span className="mb-2 block uppercase tracking-[0.24em] text-white/50">{field.label}</span>
                      <input className="h-14 w-full rounded-[18px] border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-[#DC143C] focus:ring-2 focus:ring-[#DC143C]/15" placeholder={field.placeholder} />
                    </label>
                  ))}
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <p className="text-sm uppercase tracking-[0.24em] text-white/50">Access level</p>
                  <div className="mt-4 grid gap-3">
                    {['Full', 'Messaging', 'View'].map((level) => (
                      <button key={level} type="button" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10">
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="w-full rounded-2xl bg-gradient-to-br from-[#DC143C] to-[#9B1239] px-6 py-4 text-sm font-semibold text-white shadow-[var(--shadow-button)]">
                  Submit for approval
                </button>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className="fixed inset-x-0 bottom-0 z-40 block xl:hidden border-t border-white/10 bg-bg-deep/95 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1640px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button onClick={() => setDrawerOpen(true)} className="w-full rounded-2xl bg-gradient-to-br from-[#DC143C] to-[#9B1239] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-button)] sm:w-auto">
            Create new POC
          </button>
          <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/80 transition hover:bg-white/10 sm:w-auto">
            Upgrade now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
