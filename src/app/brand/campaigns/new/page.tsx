import Link from "next/link";

export default function CreateCampaignPage() {
  return (
    <main className="min-h-screen bg-bg-deep px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 backdrop-blur-xl text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          <p className="text-sm uppercase tracking-[0.28em] text-white/50">New campaign</p>
          <h1 className="mt-3 text-4xl font-[var(--font-display)] font-semibold text-white">Create a campaign brief</h1>
          <p className="mt-4 max-w-2xl text-sm text-white/60">This is a placeholder route for the campaign creation flow. Build the step wizard next to continue the SaaS experience.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/brand/campaigns" className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Back to campaigns
            </Link>
            <button className="rounded-2xl bg-gradient-to-br from-[#DC143C] to-[#9B1239] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-button)]">
              Start wizard
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
