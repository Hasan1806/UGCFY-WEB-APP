"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { pageVariants } from "@/components/animations/motionVariants";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const tabs = [
  { id: "profile", label: "Profile" },
  { id: "team", label: "Team" },
  { id: "security", label: "Security" },
  { id: "notifications", label: "Notifications" },
  { id: "billing", label: "Billing" },
];

const planFeatures = [
  "Unlimited campaign briefs",
  "Creator performance insights",
  "Priority support",
  "Team seats & permissions",
];

export default function BrandSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [brandName, setBrandName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [story, setStory] = useState("");

  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: userProfile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (userProfile) {
          setProfile(userProfile);
          setBrandName(userProfile.brand_name || "");
          setContactEmail(userProfile.email || user.email || "");
          setWebsite(userProfile.website || "");
          setStory(userProfile.story || "");
        }
      } catch (error: any) {
        toast.error("Failed to fetch profile");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [supabase]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          brand_name: brandName,
          website: website,
          story: story,
        })
        .eq("id", profile.id);

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-white">Loading Settings...</div>;
  }

  return (
    <motion.div initial="initial" animate="animate" variants={pageVariants} className="mx-auto max-w-[1540px] space-y-6 pb-10">
      <header className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <p className="text-sm uppercase tracking-[0.28em] text-white/50">Brand settings</p>
        <h1 className="mt-3 text-4xl font-[var(--font-display)] font-semibold text-white">Manage your account and team</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">Tune permissions, notifications, billing, and workflow preferences for your creator marketing team.</p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <aside className="space-y-4 rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          <p className="text-xs uppercase tracking-[0.28em] text-white/50">Settings overview</p>
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`block w-full rounded-3xl px-5 py-4 text-left text-sm font-medium transition ${activeTab === tab.id ? "bg-white/10 text-white shadow-[0_8px_30px_rgba(255,255,255,0.08)]" : "text-white/60 hover:bg-white/5 hover:text-white"}`}>
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-white/50">{tabs.find((tab) => tab.id === activeTab)?.label}</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{activeTab === "profile" && "Brand details"}
                  {activeTab === "team" && "Team members"}
                  {activeTab === "security" && "Login & access"}
                  {activeTab === "notifications" && "Alert preferences"}
                  {activeTab === "billing" && "Billing summary"}
                </h2>
              </div>
              <button onClick={handleSave} disabled={saving} className="rounded-2xl bg-gradient-to-br from-[#DC143C] to-[#9B1239] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-button)] disabled:opacity-50">
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {activeTab === "profile" && (
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4 rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm text-white/80">
                    <label className="block text-xs uppercase tracking-[0.28em] text-white/50">Brand name</label>
                    <input value={brandName} onChange={(e) => setBrandName(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none" />
                  </div>
                  <div className="space-y-4 rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm text-white/80">
                    <label className="block text-xs uppercase tracking-[0.28em] text-white/50">Primary contact email</label>
                    <input disabled value={contactEmail} className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none opacity-50 cursor-not-allowed" />
                  </div>
                  <div className="space-y-4 rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm text-white/80">
                    <label className="block text-xs uppercase tracking-[0.28em] text-white/50">Website</label>
                    <input value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none" />
                  </div>
                  <div className="space-y-4 rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm text-white/80">
                    <label className="block text-xs uppercase tracking-[0.28em] text-white/50">Brand story</label>
                    <textarea value={story} onChange={(e) => setStory(e.target.value)} className="h-full min-h-[160px] w-full rounded-2xl border border-white/10 bg-transparent p-4 text-sm text-white outline-none" />
                  </div>
                </div>
              )}

              {activeTab === "team" && (
                <div className="space-y-4 text-white/50 text-center py-10">
                   Team management is currently available via the Supabase Dashboard.
                </div>
              )}

              {activeTab === "security" && (
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4 rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm text-white/80">
                    <p className="text-sm font-semibold text-white">Password settings</p>
                    <input className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none" placeholder="New password" type="password" />
                  </div>
                  <div className="space-y-4 rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm text-white/80">
                    <p className="text-sm font-semibold text-white">Two-factor authentication</p>
                    <p className="text-sm text-white/60">Enable additional login protection for your team with SMS and authenticator apps.</p>
                    <button className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/80 hover:bg-white/10">Manage 2FA</button>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-4">
                  {[
                    { label: "Campaign updates", description: "Receive alerts for new submissions and approvals." },
                    { label: "Billing reminders", description: "Get notified when invoices are due." },
                    { label: "Platform announcements", description: "Stay informed on product releases and improvements." },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm text-white/80">
                      <div>
                        <p className="font-medium text-white">{item.label}</p>
                        <p className="mt-1 text-sm text-white/60">{item.description}</p>
                      </div>
                      <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10">Toggle</button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "billing" && (
                <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
                  <div className="space-y-4 rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm text-white/80">
                    <p className="text-sm uppercase tracking-[0.28em] text-white/50">Current plan</p>
                    <p className="mt-2 text-2xl font-semibold text-white">Growth Pro</p>
                    <p className="mt-2 text-sm text-white/60">Invoice generated monthly with premium creator match support.</p>
                    <div className="mt-5 space-y-3">
                      {planFeatures.map((feature) => (
                        <p key={feature} className="text-sm text-white/70">• {feature}</p>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm text-white/80">
                    <p className="text-sm uppercase tracking-[0.28em] text-white/50">Payment method</p>
                    <div className="mt-5 space-y-4">
                      <div className="rounded-3xl border border-white/10 bg-[#0f1729] p-4">
                        <p className="font-semibold text-white">Visa ending in 3245</p>
                        <p className="text-sm text-white/60">Expires 10/27</p>
                      </div>
                      <button className="w-full rounded-2xl bg-gradient-to-br from-[#DC143C] to-[#9B1239] px-5 py-3 text-sm font-semibold text-white">Update payment</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
