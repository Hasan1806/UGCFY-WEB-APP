'use client'

import React, { useState } from 'react'
import { Plus, LayoutGrid, TrendingUp, CheckCircle, X, Megaphone, Video, Camera, FileText, Globe, Facebook, Linkedin, Twitter, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { DashboardEmptyState } from '@/components/dashboard/DashboardEmptyState'
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { DashboardStatusBadge } from '@/components/dashboard/DashboardStatusBadge'
import { normalizePlatform } from '@/lib/dashboard/normalizeDashboardData'
import { normalizeStatus } from '@/lib/dashboard/dashboardSafety'
import { formatDashboardNumber } from '@/lib/dashboard/formatDashboardNumber'
import type { CampaignListItem } from './page'

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface Props {
  initialCampaigns: CampaignListItem[];
}

function getPlatformIcon(platform: unknown) {
  const normalized = normalizePlatform(platform);

  switch (normalized) {
    case "instagram":
      return <Camera className="w-4 h-4" />;
    case "youtube":
      return <Video className="w-4 h-4" />;

    case "facebook":
      return <Facebook className="w-4 h-4" />;
    case "linkedin":
      return <Linkedin className="w-4 h-4" />;
    case "x":
      return <Twitter className="w-4 h-4" />;
    default:
      return <Globe className="w-4 h-4" />;
  }
}

export type WorkflowState = 
  | 'idle'
  | 'validating'
  | 'creating_campaign'
  | 'creating_payment_intent'
  | 'payment_checkout'
  | 'verifying_payment'
  | 'success'
  | 'error';

export function CampaignsClient({ initialCampaigns }: Props) {
  const [campaigns, setCampaigns] = useState<CampaignListItem[]>(initialCampaigns)
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'All' | 'Active' | 'Pending' | 'Completed'>('All')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [paymentMsg, setPaymentMsg] = useState<{ type: "info" | "error" | "success"; text: string } | null>(null)
  const [workflowState, setWorkflowState] = useState<WorkflowState>('idle')
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
    platform?: string;
    budget?: string;
    deliverables?: string;
  }>({});
  
  const [formData, setFormData] = useState({
    title: '',
    platform: 'instagram',
    budget: '',
    deliverables: '',
    startDate: '',
    endDate: '',
    targetAudience: '',
    description: '',
    requirements: '',
    inspirationReference: '',
    inspirationVideoId: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const buildCampaignPayload = () => {
    const platforms = [formData.platform].filter((p) => p !== "all");
    return {
      title: formData.title.trim(),
      description: formData.description?.trim() || null,
      platforms,
      deliverables: formData.deliverables?.trim() || "UGC Video",
      requirements: formData.requirements?.trim() || null,
      budget: Number(formData.budget),
      currency: "INR",
      inspirationReference: formData.inspirationReference?.trim() || null,
      inspirationVideoId: formData.inspirationVideoId || null
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const completeMockPayment = async (intentData: any) => {
    setWorkflowState('verifying_payment')
    setPaymentMsg({ type: "info", text: "Processing mock payment..." })
    try {
      const verifyRes = await fetch("/api/brand/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          campaign_id: intentData.campaignId,
          payment_id: intentData.paymentId,
          mock_order_id: intentData.orderId,
          mock_payment_id: `mock_payment_${Date.now()}`
        })
      })
      const verifyResult = await verifyRes.json()
      if (verifyRes.ok && verifyResult.ok) {
        setWorkflowState('success')
        setPaymentMsg({ type: "success", text: "Campaign Activated" })
        setCampaigns(prev => prev.map(c => c.id === intentData.campaignId ? { ...c, status: "active", fundsState: "Funds held for campaign" } : c))

        setTimeout(() => {
          setIsSlideOverOpen(false)
          setWorkflowState("idle")
        }, 2000)
      } else {
        throw new Error(verifyResult.error?.message || "Payment verification failed. No money was marked paid.")
      }
    } catch (err: unknown) {
      setWorkflowState('error')
      setPaymentMsg({ type: "error", text: err instanceof Error ? err.message : "Payment verification failed." })
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openRazorpayCheckout = async (intentData: any) => {
    setWorkflowState('payment_checkout')
    setPaymentMsg({ type: "info", text: "Loading secure payment checkout..." })
    
    const isLoaded = await loadRazorpayScript()
    if (!isLoaded) {
      throw new Error("Payment checkout could not be loaded. Please refresh and try again.")
    }

    const options = {
      key: intentData.keyId,
      amount: intentData.amount,
      currency: intentData.currency,
      name: "UGCFY Campaigns",
      description: `Funding for campaign: ${formData.title}`,
      order_id: intentData.orderId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler: async function (response: any) {
        try {
          setWorkflowState('verifying_payment')
          setPaymentMsg({ type: "info", text: "Verifying payment securely..." })
          const verifyRes = await fetch("/api/brand/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              payment_id: intentData.paymentId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          })
          const verifyResult = await verifyRes.json()
          if (verifyRes.ok && verifyResult.ok) {
            setWorkflowState('success')
            setPaymentMsg({ type: "success", text: "Campaign Activated" })
            setCampaigns(prev => prev.map(c => c.id === intentData.campaignId ? { ...c, status: "active", fundsState: "Funds held for campaign" } : c))
            setTimeout(() => setIsSlideOverOpen(false), 2000)
          } else {
            throw new Error(verifyResult.error?.message || "Payment verification failed. No money was marked paid.")
          }
        } catch (err: unknown) {
          setWorkflowState('error')
          setPaymentMsg({ type: "error", text: err instanceof Error ? err.message : "Payment verification failed." })
        }
      },
      theme: {
        color: "#dc2626"
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const razorpay = new (window as any).Razorpay(options)
    
    razorpay.on('payment.failed', function () {
      setWorkflowState('error')
      setPaymentMsg({ type: "error", text: "Payment failed or cancelled." })
    })
    razorpay.open()
  }

  async function handleSaveDraftAndProceedToPayment(e?: React.FormEvent) {
    if (e) e.preventDefault()
    
    try {
      setErrorMsg(null);
      setPaymentMsg(null);
      setFieldErrors({});
      setWorkflowState("creating_campaign");

      const payload = buildCampaignPayload();

      let hasErrors = false;
      const newFieldErrors: typeof fieldErrors = {};

      if (!payload.title) {
        newFieldErrors.title = "Campaign title is required.";
        hasErrors = true;
      }
      if (!payload.platforms.length) {
        newFieldErrors.platform = "Select at least one platform.";
        hasErrors = true;
      }
      if (!payload.budget || payload.budget <= 0) {
        newFieldErrors.budget = "Enter a valid campaign budget.";
        hasErrors = true;
      }
      if (!payload.deliverables) {
        newFieldErrors.deliverables = "Deliverables are required.";
        hasErrors = true;
      }

      setFieldErrors(newFieldErrors);

      if (hasErrors) {
        setWorkflowState("idle");
        return;
      }

      const campaignResponse = await fetch("/api/brand/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const campaignResult = await campaignResponse.json();

      if (!campaignResponse.ok || !campaignResult.ok) {
        throw new Error(campaignResult?.error?.message || "Unable to create campaign draft.");
      }

      const campaignId = campaignResult?.data?.campaign?.id;

      if (!campaignId) {
        throw new Error("Campaign draft was created but campaign id was not returned.");
      }

      const newCampaign = {
        id: campaignId,
        title: payload.title,
        status: campaignResult.data.campaign.status || 'draft',
        fundsState: "Payment pending",
        budget: payload.budget,
        currency: 'INR',
        platforms: payload.platforms.map((p: string) => normalizePlatform(p)),
        description: payload.description,
        createdAt: new Date().toISOString()
      }

      setCampaigns(prev => [newCampaign, ...prev])

      setWorkflowState("creating_payment_intent");

      const intentResponse = await fetch("/api/brand/campaigns/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_id: campaignId }),
      });

      const intentResult = await intentResponse.json();

      if (!intentResponse.ok || !intentResult.ok) {
        throw new Error(intentResult?.error?.message || "Unable to start payment.");
      }

      if (intentResult.data.provider === "mock") {
        await completeMockPayment(intentResult.data);
        return;
      }

      if (intentResult.data.provider === "razorpay") {
        await openRazorpayCheckout(intentResult.data);
        return;
      }

      throw new Error("Unsupported payment provider.");
    } catch (error) {
      setWorkflowState("error");
      setErrorMsg(error instanceof Error ? error.message : "Campaign workflow failed.");
    }
  }


  const filteredCampaigns = campaigns.filter((campaign) => {
    const status = normalizeStatus(campaign.status);

    if (activeFilter === "All") return true;
    if (activeFilter === "Pending") return status === "pending_payment" || status === "draft";

    return status === normalizeStatus(activeFilter);
  })

  const activeCount = campaigns.filter(c => normalizeStatus(c.status) === 'active').length
  const pendingCount = campaigns.filter(c => normalizeStatus(c.status) === 'pending_payment' || normalizeStatus(c.status) === 'draft').length


  const getButtonLabel = () => {
    switch (workflowState) {
      case 'idle': return "Save Draft & Proceed to Payment";
      case 'validating': return "Save Draft & Proceed to Payment";
      case 'creating_campaign': return "Saving Draft...";
      case 'creating_payment_intent': return "Preparing Payment...";
      case 'payment_checkout': return "Opening Checkout...";
      case 'verifying_payment': return "Verifying Payment...";
      case 'success': return "Campaign Activated";
      case 'error': return "Save Draft & Proceed to Payment";
      default: return "Save Draft & Proceed to Payment";
    }
  }

  return (
    <div className="min-h-full space-y-8">
      <DashboardPageHeader 
        title="Campaign Manager" 
        description="Manage your creator collaborations and active deliverables."
        action={
          <div className="flex gap-2 items-center">
            {activeFilter !== 'All' && (
              <button 
                onClick={() => setActiveFilter('All')}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors hidden sm:block"
              >
                Clear Filter
              </button>
            )}
            <button 
              onClick={() => setIsSlideOverOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Campaign
            </button>
          </div>
        }
      />

      {campaigns.length === 0 ? (
        <DashboardEmptyState
          title="No campaigns yet"
          description="Create your first campaign to start collaborating with creators."
          ctaLabel="Create Campaign"
          ctaAction={() => setIsSlideOverOpen(true)}
          icon={Megaphone}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard 
              onClick={() => setActiveFilter('All')}
              className={activeFilter === 'All' ? 'border-gray-900 shadow-md ring-1 ring-gray-900' : ''}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Campaigns</p>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">{campaigns.length}</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 shrink-0">
                  <LayoutGrid className="w-6 h-6" />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard 
              onClick={() => setActiveFilter('Active')}
              className={activeFilter === 'Active' ? 'border-gray-900 shadow-md ring-1 ring-gray-900' : ''}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active</p>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">{activeCount}</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard 
              onClick={() => setActiveFilter('Pending')}
              className={activeFilter === 'Pending' ? 'border-gray-900 shadow-md ring-1 ring-gray-900' : ''}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">{pendingCount}</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </DashboardCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCampaigns.map(campaign => (
              <DashboardCard key={campaign.id} className="flex flex-col h-full group relative cursor-pointer hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <DashboardStatusBadge status={campaign.status} />
                  {campaign.fundsState && (
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-amber-700">
                      {campaign.fundsState}
                    </span>
                  )}
                  <div className="flex gap-1">
                    {campaign.platforms.length > 0 ? (
                      campaign.platforms.map((platform, idx) => (
                        <div key={idx} className="text-gray-500 flex items-center gap-1 text-sm bg-gray-50 px-2 py-1 rounded-md border border-gray-100 shadow-sm" title={platform}>
                          {getPlatformIcon(platform)}
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 flex items-center gap-1 text-sm bg-gray-50 px-2 py-1 rounded-md border border-gray-100 shadow-sm" title="Other">
                        {getPlatformIcon("other")}
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                  {campaign.title}
                </h3>
                {campaign.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                    {campaign.description}
                  </p>
                )}
                {!campaign.description && <div className="flex-1" />}
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="font-bold text-gray-900 text-lg">
                    {campaign.budget !== null ? `${campaign.currency || "INR"} ${formatDashboardNumber(campaign.budget)}` : "No budget set"}
                  </div>
                  <Link 
                    href={`/dashboard/campaigns/${campaign.id}`}
                    className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
                  >
                    View Details &rarr;
                  </Link>
                </div>
              </DashboardCard>
            ))}
          </div>
        </>
      )}

      {/* Slide-Over Form */}
      {isSlideOverOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity cursor-pointer"
            onClick={() => setIsSlideOverOpen(false)}
          />
          
          <div className="fixed inset-y-0 right-0 z-[100] flex w-full max-w-2xl pl-10">
            <div className="w-full transform transition-transform duration-500 ease-in-out">
              <div className="flex h-full flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
                
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Launch New Campaign</h2>
                    <p className="text-sm text-gray-500 mt-1">Set up the foundation for your next creator collaboration.</p>
                  </div>
                  <button 
                    onClick={() => setIsSlideOverOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-6">
                  {errorMsg && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      {errorMsg}
                    </div>
                  )}
                  {paymentMsg && (
                    <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 text-sm font-semibold ${
                      paymentMsg.type === "error"
                        ? "bg-red-50 border-red-100 text-red-700"
                        : paymentMsg.type === "success"
                          ? "bg-green-50 border-green-100 text-green-700"
                          : "bg-blue-50 border-blue-100 text-blue-700"
                    }`}>
                      <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
                      <span>{paymentMsg.text}</span>
                    </div>
                  )}
                  <form id="create-campaign-form" onSubmit={handleSaveDraftAndProceedToPayment} className="space-y-8">
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Basic Details</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
                        <input 
                          type="text" 
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#E11D48] focus:outline-none focus:ring-4 focus:ring-[#E11D48]/10"
                          placeholder="e.g. Winter Holiday Launch"
                        />
                        {fieldErrors.title && (
                          <p className="mt-2 text-sm font-medium text-red-600">
                            {fieldErrors.title}
                          </p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                          <select 
                            name="platform"
                            value={formData.platform}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 focus:border-[#E11D48] focus:outline-none focus:ring-4 focus:ring-[#E11D48]/10"
                          >
                            <option value="instagram">Instagram</option>
                            <option value="youtube">YouTube</option>
                          </select>
                          {fieldErrors.platform && (
                            <p className="mt-2 text-sm font-medium text-red-600">
                              {fieldErrors.platform}
                            </p>
                          )}
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Budget (INR)</label>
                          <input 
                            type="number" 
                            name="budget"
                            min="0"
                            value={formData.budget}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#E11D48] focus:outline-none focus:ring-4 focus:ring-[#E11D48]/10"
                            placeholder="5000"
                          />
                          {fieldErrors.budget && (
                            <p className="mt-2 text-sm font-medium text-red-600">
                              {fieldErrors.budget}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Briefing</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          Brand Brief
                        </label>
                        <textarea 
                          name="description"
                          rows={3}
                          value={formData.description}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#E11D48] focus:outline-none focus:ring-4 focus:ring-[#E11D48]/10 resize-none"
                          placeholder="Describe the main message, tone, and goals for the creators..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-gray-400" />
                          Deliverables
                        </label>
                        <textarea 
                          name="deliverables"
                          rows={2}
                          value={formData.deliverables}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#E11D48] focus:outline-none focus:ring-4 focus:ring-[#E11D48]/10 resize-none"
                          placeholder="e.g. 1 Instagram Reel, 2 Stories"
                        />
                        {fieldErrors.deliverables && (
                          <p className="mt-2 text-sm font-medium text-red-600">
                            {fieldErrors.deliverables}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Inspiration / Reference</h3>
                      <p className="text-sm text-gray-500 mb-4">Add a video, creator reference, or content idea that inspired this campaign. Optional.</p>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Inspiration URL (Optional)</label>
                        <input 
                          type="url" 
                          name="inspirationReference"
                          value={formData.inspirationReference}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#E11D48] focus:outline-none focus:ring-4 focus:ring-[#E11D48]/10"
                          placeholder="https://instagram.com/p/..."
                        />
                      </div>
                    </div>
                  </form>
                </div>

                <div className="border-t border-gray-100 bg-gray-50/50 p-6">
                  <div className="flex flex-col sm:flex-row gap-3 justify-end items-center">
                    <button 
                      type="button" 
                      onClick={() => setIsSlideOverOpen(false)}
                      className="w-full sm:w-auto px-5 py-3 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors text-center"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      onClick={handleSaveDraftAndProceedToPayment}
                      disabled={workflowState !== 'idle' && workflowState !== 'error'} 
                      className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-[#E11D48] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#BE123C] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {getButtonLabel()}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}
