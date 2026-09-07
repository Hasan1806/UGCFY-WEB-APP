import "server-only";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { getDashboardDateTimeValue } from "@/lib/dashboard/formatDashboardDate";
import { normalizeStatus } from "@/lib/dashboard/dashboardSafety";
import { isMissingRelationError, logSupabaseError } from "@/lib/dashboard/safeSupabaseQuery";

export type DashboardDataAvailability = {
  campaignsTable: boolean;
  pocTable: boolean;
  kycTable: boolean;
  shortlistsTable: boolean;
  messagesTable: boolean;
};

export type BrandDashboardData = {
  brand: {
    id: string;
    name: string | null;
    email: string | null;
    companyName: string | null;
    kycStatus: string | null;
    onboardingCompletedAt: string | null;
  };
  availability: DashboardDataAvailability;
  metrics: {
    totalCampaigns: number;
    activeCampaigns: number;
    draftCampaigns: number;
    shortlistedCreators: number;
    messageThreads: number;
    unreadMessages: number | null;
    submittedKycDocuments: number;
    pendingApprovals: number;
    contentDelivered: number;
    totalSpend: number | null;
  };
  onboarding: {
    completedSteps: number;
    totalSteps: number;
    percentage: number;
    steps: Array<{
      key: string;
      label: string;
      completed: boolean;
      href: string;
    }>;
  };
  campaigns: Array<{
    id: string;
    title: string;
    status: string;
    budget: number | null;
    currency: string;
    platforms: string[];
    createdAt: string | null;
    payment_status?: string;
  }>;
  pendingActions: Array<{
    title: string;
    description: string;
    href: string;
    priority: "high" | "medium" | "low";
  }>;
  recentActivity: Array<{
    title: string;
    description: string;
    timestamp: string | null;
    type: "profile" | "campaign" | "kyc" | "message" | "shortlist";
  }>;
};

export async function getBrandDashboardData(): Promise<BrandDashboardData> {
  const brandSession = await verifyBrand();

  if (!brandSession.ok) {
    throw new Error("Unauthorized dashboard access.");
  }

  const supabase = await createClient();
  const brandId = brandSession.brand.id;

  const availability: DashboardDataAvailability = {
    campaignsTable: true,
    pocTable: true,
    kycTable: true,
    shortlistsTable: true,
    messagesTable: true,
  };

  const metrics = {
    totalCampaigns: 0,
    activeCampaigns: 0,
    draftCampaigns: 0,
    shortlistedCreators: 0,
    messageThreads: 0,
    unreadMessages: null,
    submittedKycDocuments: 0,
    pendingApprovals: 0,
    contentDelivered: 0,
    totalSpend: null as number | null,
  };

  const campaigns: BrandDashboardData["campaigns"] = [];
  const pendingActions: BrandDashboardData["pendingActions"] = [];
  const recentActivity: BrandDashboardData["recentActivity"] = [];

  let pocCount = 0;

  // 1. Fetch POCs
  try {
    const { data: pocs, error } = await supabase
      .from("brand_poc")
      .select("id, created_at")
      .eq("brand_id", brandId);

    if (error) {
      if (isMissingRelationError(error)) {
        availability.pocTable = false;
      } else {
        logSupabaseError("[Dashboard] brand_poc", error);
      }
    } else {
      pocCount = pocs?.length || 0;
      if (pocs && pocs.length > 0) {
        recentActivity.push({
          title: "POC Added",
          description: "Point of contact registered.",
          timestamp: pocs?.[pocs.length - 1]?.created_at ?? null,
          type: "profile",
        });
      }
    }
  } catch (err) {
    logSupabaseError("[Dashboard] POCs handled error", err);
  }

  // 2. Fetch KYC
  try {
    const { data: kycDocs, error } = await supabase
      .from("brand_kyc_documents")
      .select("id, status, uploaded_at")
      .eq("brand_id", brandId);

    if (error) {
      if (isMissingRelationError(error)) {
        availability.kycTable = false;
      } else {
        logSupabaseError("[Dashboard] brand_kyc_documents", error);
      }
    } else {
      metrics.submittedKycDocuments = kycDocs?.length || 0;
      if (kycDocs && kycDocs.length > 0) {
        recentActivity.push({
          title: "KYC Document Uploaded",
          description: "Verification documents submitted.",
          timestamp: kycDocs?.[0]?.uploaded_at ?? null,
          type: "kyc",
        });
      }
    }
  } catch (err) {
    logSupabaseError("[Dashboard] KYC handled error", err);
  }

  // 3. Fetch Campaigns
  try {
    const { data: campaignData, error } = await supabase
      .from("campaigns")
      .select("id, title, status, payment_status, budget, created_at")
      .eq("brand_id", brandId)
      .order("created_at", { ascending: false });

    if (error) {
      if (isMissingRelationError(error)) {
        availability.campaignsTable = false;
      } else {
        logSupabaseError("[Dashboard] campaigns", error);
      }
    } else if (campaignData) {
      metrics.totalCampaigns = campaignData.length;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metrics.activeCampaigns = campaignData.filter((c: any) => normalizeStatus(c.status) === "active").length;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metrics.draftCampaigns = campaignData.filter((c: any) => normalizeStatus(c.status) === "draft").length;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      campaignData.slice(0, 5).forEach((c: any) => {
        campaigns.push({
          id: c.id,
          title: c.title,
          status: c.status,
          budget: Number(c.budget) || null,
          currency: "INR",
          platforms: [],
          createdAt: c.created_at ?? null,
          payment_status: c.payment_status,
        });
      });

      if (campaignData && campaignData.length > 0) {
        recentActivity.push({
          title: "Campaign Created",
          description: `Created campaign: ${campaignData?.[0]?.title}`,
          timestamp: campaignData?.[0]?.created_at ?? null,
          type: "campaign",
        });
      }
    }
  } catch (err) {
    logSupabaseError("[Dashboard] Campaigns handled error", err);
  }

  // 4. Fetch Shortlists
  try {
    const { count, error } = await supabase
      .from("brand_shortlists")
      .select("*", { count: "exact", head: true })
      .eq("brand_id", brandId);

    if (error) {
      if (isMissingRelationError(error)) {
        availability.shortlistsTable = false;
      } else {
        logSupabaseError("[Dashboard] brand_shortlists", error);
      }
    } else {
      metrics.shortlistedCreators = count || 0;
    }
  } catch (err) {
    logSupabaseError("[Dashboard] Shortlists handled error", err);
  }

  // 5. Fetch Messages
  try {
    const { count, error } = await supabase
      .from("chat_threads")
      .select("*", { count: "exact", head: true })
      .eq("brand_id", brandId);

    if (error) {
      if (isMissingRelationError(error)) {
        availability.messagesTable = false;
      } else {
        logSupabaseError("[Dashboard] chat_threads", error);
      }
    } else {
      metrics.messageThreads = count || 0;
    }
  } catch (err) {
    logSupabaseError("[Dashboard] Messages handled error", err);
  }

  // 6. Fetch Payments/Spend
  try {
    const { data: paymentData, error } = await supabase
      .from("payments")
      .select("amount")
      .eq("brand_id", brandId);

    if (!error && paymentData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metrics.totalSpend = paymentData.reduce((acc: any, p: any) => acc + (Number(p.amount) || 0), 0);
    }
  } catch {
    // optional table
  }

  // 7. Fetch Submissions (Approvals and delivered content)
  try {
    if (campaigns.length > 0) {
      const { data: subData, error } = await supabase
        .from("ugc_submissions")
        .select("id, status, campaign_id")
        .in("campaign_id", campaigns.map((c: { id: string }) => c.id))
        .in("status", ["Pending", "pending", "Approved", "approved"]);

      if (!error && subData) {
        metrics.pendingApprovals = subData.filter((submission) => normalizeStatus(submission.status) === "pending").length;
        metrics.contentDelivered = subData.filter((submission) => normalizeStatus(submission.status) === "approved").length;
      }
    }
  } catch {
    // optional table
  }

  // Determine Onboarding Progress
  const hasProfile = Boolean(brandSession.brand.company_name);
  const hasPoc = pocCount > 0;
  const hasKyc = metrics.submittedKycDocuments > 0;
  const hasCampaign = metrics.totalCampaigns > 0;
  const hasShortlist = metrics.shortlistedCreators > 0;
  const pendingPaymentCampaign = campaigns.find((campaign) => normalizeStatus(campaign.payment_status) === "pending");

  const steps = [
    { key: "profile", label: "Complete Brand Profile", completed: hasProfile, href: "/dashboard/profile" },
    { key: "poc", label: "Add Team/POC", completed: hasPoc, href: "/dashboard/team" },
    { key: "kyc", label: "Complete Verification", completed: hasKyc, href: "/dashboard/verification" },
    { key: "campaign", label: "Create First Campaign", completed: hasCampaign, href: "/dashboard/campaigns" },
    { key: "shortlist", label: "Shortlist Creators", completed: hasShortlist, href: "/dashboard/shortlist" },
  ];

  const completedSteps = steps.filter(s => s.completed).length;
  const totalSteps = steps.length;

  // Compile Pending Actions
  if (!hasProfile) {
    pendingActions.push({ title: "Complete Brand Profile", description: "Add missing brand details.", href: "/dashboard/profile", priority: "high" });
  }
  if (!hasPoc && availability.pocTable) {
    pendingActions.push({ title: "Add Team/POC", description: "Designate a team member.", href: "/dashboard/team", priority: "high" });
  }
  if (!hasKyc && availability.kycTable) {
    pendingActions.push({ title: "Complete Verification", description: "Verify your business.", href: "/dashboard/verification", priority: "high" });
  }
  if (hasProfile && hasPoc && hasKyc && !hasCampaign && availability.campaignsTable) {
    pendingActions.push({ title: "Create Campaign", description: "Launch your first UGC campaign.", href: "/dashboard/campaigns", priority: "medium" });
  }
  if (pendingPaymentCampaign) {
    pendingActions.push({
      title: "Payment required",
      description: `Complete payment to launch ${pendingPaymentCampaign.title}.`,
      href: "/dashboard/billing",
      priority: "high",
    });
  }

  // Sort recent activity
  recentActivity.sort((a, b) => getDashboardDateTimeValue(b.timestamp) - getDashboardDateTimeValue(a.timestamp));

  return {
    brand: {
      id: brandId,
      name: brandSession.user?.email || brandSession.brand.company_name || null,
      email: brandSession.user?.email || null,
      companyName: brandSession.brand.company_name || null,
      kycStatus: brandSession.brand.kyc_status || null,
      onboardingCompletedAt: null, // to be populated if tracked
    },
    availability,
    metrics,
    onboarding: {
      completedSteps,
      totalSteps,
      percentage: Math.round((completedSteps / totalSteps) * 100),
      steps,
    },
    campaigns,
    pendingActions,
    recentActivity: recentActivity.slice(0, 5),
  };
}
