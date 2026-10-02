"use client";

import React, { use } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { CampaignFormWizard } from "@/components/dashboard/CampaignFormWizard";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { campaigns } = useDashboard();
  const campaign = campaigns.find((c) => c.id === resolvedParams.id);

  if (!campaign) {
    return (
      <div className="py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-base font-extrabold text-slate-900">Campaign not found</h2>
        <p className="text-xs text-slate-500">The requested campaign does not exist or has been removed.</p>
        <Link
          href="/dashboard/campaigns"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 text-xs font-bold text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to campaigns
        </Link>
      </div>
    );
  }

  return <CampaignFormWizard initialData={campaign} isEdit={true} />;
}
