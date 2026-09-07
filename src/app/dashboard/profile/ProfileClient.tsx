/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Camera, Save, Building, Mail, Globe, Phone, FileText, CheckCircle2, AlertCircle, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { SafeAvatar } from "@/components/dashboard/SafeAvatar";

interface Props {
  initialProfile: any;
}

export function ProfileClient({ initialProfile }: Props) {
  const router = useRouter();
  const [profile, setProfile] = useState({
    company_name: initialProfile?.company_name || "",
    website: initialProfile?.website_url || initialProfile?.website || "",
    industry: initialProfile?.industry || "",
    location: initialProfile?.location || "",
    business_description: initialProfile?.business_description || "",
    contact_email: initialProfile?.contact_email || "",
    phone: initialProfile?.phone || "",
    logo_url: initialProfile?.logo_url || "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#E11D48] focus:outline-none focus:ring-4 focus:ring-[#E11D48]/10 transition-all";
  const textareaClass = "min-h-[120px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#E11D48] focus:outline-none focus:ring-4 focus:ring-[#E11D48]/10 transition-all";

  // Calculate completion percentage
  const fields = [
    profile.company_name,
    profile.website,
    profile.industry,
    profile.location,
    profile.business_description,
    profile.contact_email,
    profile.phone,
    profile.logo_url
  ];
  const filledFields = fields.filter(f => typeof f === 'string' && f.trim().length > 0).length;
  const completionPercentage = Math.round((filledFields / fields.length) * 100);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const payload = {
        brand_name: profile.company_name, // the API expects brand_name
        company_name: profile.company_name,
        website: profile.website,
        industry: profile.industry,
        contact_phone: profile.phone,
        business_description: profile.business_description,
        logo_url: profile.logo_url
      };
      
      const res = await fetch("/api/brand/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error?.message || "Failed to save profile");
      }
      
      setSaveStatus({ type: "success", message: "Profile saved successfully." });
      setTimeout(() => setSaveStatus(null), 3000);
      router.refresh();
    } catch (err: any) {
      setSaveStatus({ type: "error", message: err.message || "An error occurred while saving." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setSaveStatus(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("assetType", "logo");

      const res = await fetch("/api/brand/profile-assets", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setSaveStatus({ type: "error", message: data.error || "Upload failed" });
        return;
      }

      setProfile((prev) => ({ ...prev, logo_url: data.url }));
      setSaveStatus({ type: "success", message: "Logo updated successfully!" });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus({ type: "error", message: "Error uploading file" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-24 space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Header section */}
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-[#0A0A0A] tracking-tight">Brand Profile</h1>
        <p className="text-slate-500 text-sm max-w-2xl">
          Manage your company identity, billing-facing details, and public campaign profile. Keep this information up to date to build trust with creators.
        </p>
      </div>

      {/* 2. Profile completion card */}
      <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="relative h-16 w-16 shrink-0">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${completionPercentage === 100 ? 'text-emerald-500' : 'text-[#E11D48]'} transition-all duration-1000 ease-out`}
                strokeDasharray={`${completionPercentage}, 100`}
                strokeWidth="3"
                strokeDashoffset="0"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-800">
              {completionPercentage}%
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Profile Completion</h3>
            <p className="text-sm text-slate-500 mt-1">
              {completionPercentage === 100 
                ? "Your profile is fully complete. Great job!" 
                : "Complete all fields to increase your credibility with top creators."}
            </p>
          </div>
        </div>
        
        {completionPercentage < 100 && (
          <div className="w-full md:w-auto bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
            <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">Missing Fields</p>
            <div className="flex flex-wrap gap-2">
              {fields.map((f, idx) => {
                const names = ['Company Name', 'Website', 'Industry', 'Location', 'Description', 'Email', 'Phone', 'Logo'];
                if (typeof f !== 'string' || f.trim().length === 0) {
                  return (
                    <span key={idx} className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1 rounded-md text-[10px] font-bold border border-red-100">
                      <AlertCircle className="h-3 w-3" />
                      {names[idx]}
                    </span>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 3. Company information card */}
          <div className="bg-white rounded-[24px] border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center shrink-0">
                <Building className="h-5 w-5 text-slate-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Company Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="block text-sm font-bold text-slate-700">Brand / Company Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={profile.company_name} 
                  onChange={e => setProfile({...profile, company_name: e.target.value})}
                  className={inputClass} 
                  placeholder="e.g. Acme Corp" 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Website URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Globe className="h-4 w-4 text-slate-400" />
                  </div>
                  <input 
                    type="url" 
                    value={profile.website} 
                    onChange={e => setProfile({...profile, website: e.target.value})}
                    className={`${inputClass} pl-10`} 
                    placeholder="https://example.com" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Industry / Category</label>
                <input 
                  type="text" 
                  value={profile.industry} 
                  onChange={e => setProfile({...profile, industry: e.target.value})}
                  className={inputClass} 
                  placeholder="e.g. Beauty, Tech, Fashion" 
                />
              </div>

              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="block text-sm font-bold text-slate-700">Country / City Location</label>
                <input 
                  type="text" 
                  value={profile.location} 
                  onChange={e => setProfile({...profile, location: e.target.value})}
                  className={inputClass} 
                  placeholder="e.g. New York, USA" 
                />
              </div>

              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="block text-sm font-bold text-slate-700">About Brand (Description)</label>
                <textarea 
                  value={profile.business_description} 
                  onChange={e => setProfile({...profile, business_description: e.target.value})}
                  className={textareaClass} 
                  placeholder="Describe your brand, your mission, and the type of content you usually look for..." 
                />
              </div>
            </div>
          </div>

          {/* 4. Contact information card */}
          <div className="bg-white rounded-[24px] border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Contact Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Work Email <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input 
                    type="email" 
                    disabled
                    value={profile.contact_email} 
                    className={`${inputClass} pl-10 bg-slate-50 cursor-not-allowed`} 
                    placeholder="email@company.com" 
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">To change billing email, please contact support.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-slate-400" />
                  </div>
                  <input 
                    type="tel" 
                    value={profile.phone} 
                    onChange={e => setProfile({...profile, phone: e.target.value})}
                    className={`${inputClass} pl-10`} 
                    placeholder="+1 (555) 000-0000" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* 5. Brand assets card */}
          <div className="bg-white rounded-[24px] border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center shrink-0">
                <ImageIcon className="h-5 w-5 text-slate-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Brand Assets</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 transition-all hover:bg-slate-100/50">
                <div className="relative mb-4 group cursor-pointer" onClick={() => document.getElementById("logoUpload")?.click()}>
                  <div className="h-24 w-24 rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden flex items-center justify-center">
                    <SafeAvatar
                      src={profile.logo_url}
                      name={profile.company_name || "B"}
                      size="xl"
                      className="h-full w-full rounded-none"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center text-white">
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <Camera className="h-6 w-6" />
                    )}
                  </div>
                  <input 
                    type="file" 
                    id="logoUpload" 
                    className="hidden" 
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleUpload(e.target.files[0]);
                    }}
                  />
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-bold text-slate-900">Company Logo</h4>
                  <p className="text-xs text-slate-500 mt-1">Square format, recommended 512x512px. PNG or JPG.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => document.getElementById("logoUpload")?.click()}
                  className="mt-4 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Upload Image
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Brand Guidelines</label>
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">PDF Document</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Not Uploaded</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-red-600 hover:text-red-700" disabled>
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 6. Sticky Save Button */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white/80 backdrop-blur-xl border-t border-slate-200 p-4 z-40 flex items-center justify-between md:justify-end gap-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        
        {saveStatus && (
          <div className={`text-sm font-bold flex items-center gap-2 ${saveStatus.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
            {saveStatus.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {saveStatus.message}
          </div>
        )}

        <button 
          onClick={handleSave}
          disabled={isSaving || !profile.company_name}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#E11D48] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-red-500/20 transition-all hover:bg-[#BE123C] disabled:cursor-not-allowed disabled:opacity-60 hover:-translate-y-0.5 active:translate-y-0"
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? "Saving changes..." : "Save Profile"}
        </button>
      </div>

    </div>
  );
}
