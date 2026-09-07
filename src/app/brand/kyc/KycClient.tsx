/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Save,
  ShieldCheck,
  UploadCloud,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { VerificationStatusWall } from "@/app/dashboard/verification/VerificationStatusWall";
import type { BrandAccessStatus } from "@/lib/auth/getBrandAccessStatus";

type BrandUploadKey = "doc1" | "doc2" | "doc3" | "doc4" | "doc5";

type FormState = {
  brandName: string;
  platformHandle: string;
  legalName: string;
  bio: string;
  cin: string;
  gstin: string;
  pan: string;
  hqAddress: string;
  directorName: string;
  din: string;
  contactEmail: string;
  financeEmail: string;
};

type UploadState = {
  key: BrandUploadKey;
  document_type: string;
  bucket: string;
  path: string;
  original_filename: string;
  mime_type?: string;
  size_bytes?: number;
};

interface Props {
  initialDocuments: any[];
  initialProfile: any;
  initialSubmission: any;
  userEmail: string | null;
  accessStatus: BrandAccessStatus;
}

const INPUT_CLASS =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#E11D48] focus:outline-none focus:ring-4 focus:ring-[#E11D48]/10";
const TEXTAREA_CLASS =
  "min-h-[120px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#E11D48] focus:outline-none focus:ring-4 focus:ring-[#E11D48]/10";
const LABEL_CLASS = "text-sm font-semibold text-slate-800";
const HELPER_CLASS = "mt-1 text-xs text-slate-500";
const ERROR_CLASS = "mt-2 text-sm font-medium text-red-600";

const DOCUMENTS: Array<{
  key: BrandUploadKey;
  document_type: string;
  label: string;
  helper: string;
}> = [
  { key: "doc1", document_type: "certificate_of_incorporation", label: "Certificate of Incorporation", helper: "PDF format" },
  { key: "doc2", document_type: "gst_certificate", label: "GST Certificate (REG-06)", helper: "PDF format" },
  { key: "doc3", document_type: "company_pan_card", label: "Company PAN Card", helper: "Image or PDF" },
  { key: "doc4", document_type: "cancelled_cheque", label: "Cancelled Cheque", helper: "Image or PDF" },
  { key: "doc5", document_type: "director_id_proof", label: "Director ID Proof", helper: "Aadhaar or passport" },
];

function getWordCount(value: string) {
  return value.trim() ? value.trim().split(/\s+/).filter(Boolean).length : 0;
}

function normalizeHandle(value: string) {
  const clean = value.trim().replace(/^@+/, "");
  return clean ? `@${clean}` : "";
}

function buildInitialForm(initialProfile: any, initialSubmission: any, userEmail: string | null): FormState {
  const savedForm = initialSubmission?.form_data || {};
  return {
    brandName: savedForm.brandName || initialProfile?.brand_name || initialProfile?.company_name || "",
    platformHandle: savedForm.platformHandle || initialProfile?.platform_handle || "",
    legalName: savedForm.legalName || initialProfile?.legal_name || "",
    bio: savedForm.bio || initialProfile?.bio || initialProfile?.business_description || "",
    cin: savedForm.cin || initialProfile?.cin_number || "",
    gstin: savedForm.gstin || initialProfile?.gst_number || "",
    pan: savedForm.pan || initialProfile?.pan_number || "",
    hqAddress: savedForm.hqAddress || initialProfile?.business_address || initialProfile?.location || "",
    directorName: savedForm.directorName || initialProfile?.director_name || "",
    din: savedForm.din || initialProfile?.din_number || "",
    contactEmail: savedForm.contactEmail || initialProfile?.contact_email || userEmail || "",
    financeEmail: savedForm.financeEmail || initialProfile?.finance_email || userEmail || "",
  };
}

function buildInitialUploads(initialDocuments: any[], initialSubmission: any): Record<BrandUploadKey, UploadState | null> {
  const initial = DOCUMENTS.reduce((acc, document) => {
    acc[document.key] = null;
    return acc;
  }, {} as Record<BrandUploadKey, UploadState | null>);

  const savedUploads = Array.isArray(initialSubmission?.form_data?.uploads)
    ? initialSubmission.form_data.uploads
    : [];

  for (const upload of savedUploads) {
    if (upload?.key && upload.path) {
      initial[upload.key as BrandUploadKey] = upload;
    }
  }

  for (const doc of initialDocuments) {
    const match = DOCUMENTS.find((item) => item.document_type === doc.document_type);
    if (match) {
      initial[match.key] = {
        key: match.key,
        document_type: match.document_type,
        bucket: doc.bucket || "brand-kyc-documents",
        path: doc.path,
        original_filename: doc.original_filename || match.label,
        mime_type: doc.mime_type || undefined,
        size_bytes: doc.size_bytes || undefined,
      };
    }
  }

  return initial;
}

export function KycClient({ initialDocuments, initialProfile, initialSubmission, userEmail, accessStatus }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState<FormState>(() => buildInitialForm(initialProfile, initialSubmission, userEmail));
  const [uploads, setUploads] = useState<Record<BrandUploadKey, UploadState | null>>(() =>
    buildInitialUploads(initialDocuments, initialSubmission)
  );
  const [agreements, setAgreements] = useState({
    masterService: Boolean(initialSubmission?.form_data?.agreements?.masterService),
    digitalSignature: Boolean(initialSubmission?.form_data?.agreements?.digitalSignature),
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [busyAction, setBusyAction] = useState<"save_draft" | "submit" | null>(null);
  const [uploadingKey, setUploadingKey] = useState<BrandUploadKey | null>(null);
  const [isEditing, setIsEditing] = useState(() => accessStatus === "incomplete" || accessStatus === "draft");
  const [currentStatus, setCurrentStatus] = useState<BrandAccessStatus>(accessStatus);

  const wordCount = getWordCount(form.bio);
  const uploadedCount = Object.values(uploads).filter(Boolean).length;
  const requiredValues = [
    form.brandName,
    form.platformHandle,
    form.legalName,
    wordCount >= 30 && wordCount <= 120 ? "bio" : "",
    form.gstin,
    form.pan,
    form.hqAddress,
    form.directorName,
    form.din,
    form.contactEmail,
    form.financeEmail,
    uploadedCount === DOCUMENTS.length ? "docs" : "",
    agreements.masterService && agreements.digitalSignature ? "agreements" : "",
  ];
  const completedCount = requiredValues.filter((value) => Boolean(String(value).trim())).length;
  const completionPercentage = Math.round((completedCount / requiredValues.length) * 100);

  const missingItems = useMemo(() => {
    const items: string[] = [];
    if (!form.brandName.trim()) items.push("Brand display name");
    if (!form.platformHandle.trim()) items.push("Platform handle");
    if (!form.legalName.trim()) items.push("Legal entity name");
    if (wordCount < 30 || wordCount > 120) items.push("Corporate bio between 30 and 120 words");
    if (!form.gstin.trim()) items.push("GSTIN");
    if (!form.pan.trim()) items.push("Company PAN");
    if (!form.hqAddress.trim()) items.push("Registered headquarters address");
    if (!form.directorName.trim()) items.push("Primary director name");
    if (!form.din.trim()) items.push("DIN");
    if (!form.contactEmail.trim()) items.push("Primary contact email");
    if (!form.financeEmail.trim()) items.push("Finance email");
    if (uploadedCount < DOCUMENTS.length) items.push("All five statutory documents");
    if (!agreements.masterService || !agreements.digitalSignature) items.push("Agreement confirmations");
    return items;
  }, [agreements, form, uploadedCount, wordCount]);

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  async function uploadFile(key: BrandUploadKey, file: File) {
    setBanner(null);
    setUploadingKey(key);

    try {
      if (file.size > 8 * 1024 * 1024) {
        throw new Error("File size must be under 8MB.");
      }

      const allowed = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
      if (!allowed.includes(file.type)) {
        throw new Error("Only PDF, PNG, JPG, JPEG, and WEBP files are allowed.");
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Please login again to upload documents.");
      }

      const definition = DOCUMENTS.find((document) => document.key === key)!;
      const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const path = `${user.id}/${key}/${file.lastModified || file.size}-${safeFilename}`;
      const { error } = await supabase.storage
        .from("brand-kyc-documents")
        .upload(path, file, { upsert: false });

      if (error) {
        throw new Error(error.message || "Upload failed.");
      }

      setUploads((current) => ({
        ...current,
        [key]: {
          key,
          document_type: definition.document_type,
          bucket: "brand-kyc-documents",
          path,
          original_filename: file.name,
          mime_type: file.type,
          size_bytes: file.size,
        },
      }));
    } catch (error) {
      setBanner({
        type: "error",
        message: error instanceof Error ? error.message : "Upload failed.",
      });
    } finally {
      setUploadingKey(null);
    }
  }

  async function save(action: "save_draft" | "submit") {
    if (busyAction) return;
    setBusyAction(action);
    setBanner(null);
    setFieldErrors({});

    try {
      const response = await fetch("/api/brand/verification", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          action,
          form: {
            ...form,
            platformHandle: normalizeHandle(form.platformHandle),
            cin: form.cin.toUpperCase(),
            gstin: form.gstin.toUpperCase(),
            pan: form.pan.toUpperCase(),
          },
          uploads: Object.values(uploads).filter(Boolean),
          agreements,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.ok) {
        const issues = result.error?.details?.issues;
        if (Array.isArray(issues)) {
          const nextErrors: Record<string, string> = {};
          for (const issue of issues) {
            const path = Array.isArray(issue.path) ? issue.path : [];
            const field = path[0] === "form" ? path[1] : path[0];
            if (field && !nextErrors[String(field)]) nextErrors[String(field)] = String(issue.message);
          }
          setFieldErrors(nextErrors);
        }
        let errorMsg = result.error?.message || "Unable to save verification.";
        if (result.error?.details && typeof result.error.details === "object" && "message" in result.error.details) {
          const dbMessage = (result.error.details as any).message;
          const dbCode = (result.error.details as any).code;
          errorMsg = `${errorMsg} - Database Error ${dbCode ? `[${dbCode}]` : ""}: ${dbMessage}`;
        }
        throw new Error(errorMsg);
      }

      setForm((current) => ({
        ...current,
        platformHandle: normalizeHandle(current.platformHandle),
        cin: current.cin.toUpperCase(),
        gstin: current.gstin.toUpperCase(),
        pan: current.pan.toUpperCase(),
      }));

      setBanner({
        type: "success",
        message: action === "submit" ? "Verification submitted." : "Draft saved.",
      });

      router.refresh();
      if (action === "submit") {
        setCurrentStatus("pending");
        setIsEditing(false);
      }
    } catch (error) {
      setBanner({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to save verification.",
      });
    } finally {
      setBusyAction(null);
    }
  }

  function renderFieldError(name: string) {
    return fieldErrors[name] ? <p className={ERROR_CLASS}>{fieldErrors[name]}</p> : null;
  }

  if (!isEditing) {
    return (
      <VerificationStatusWall
        status={currentStatus === "approved" || currentStatus === "rejected" || currentStatus === "on_hold" ? currentStatus : "pending"}
        onEdit={() => setIsEditing(true)}
        onGoDashboard={() => router.push("/dashboard")}
        onSignOut={async () => {
          await supabase.auth.signOut();
          router.push("/login");
          router.refresh();
        }}
      />
    );
  }

  return (
    <div className="bg-[#FDFBFB]">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-[#E11D48]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">Brand KYC</p>
                  <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0A0A0A] sm:text-3xl">
                    Complete Brand Verification
                  </h1>
                </div>
              </div>
              <p className="mt-4 text-sm font-medium leading-6 text-slate-600">
                Submit the same corporate, registry, signatory, document, and agreement details used by the UGCFY app so campaigns can run through verified brand accounts.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Completion</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-4xl font-black text-[#0A0A0A]">{completionPercentage}%</span>
                <span className="pb-1 text-sm font-semibold text-slate-500">{completedCount}/{requiredValues.length} checks</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white">
                <div className="h-2 rounded-full bg-[#E11D48]" style={{ width: `${completionPercentage}%` }} />
              </div>
            </div>
          </div>
        </header>

        {banner && (
          <div className={`flex items-start gap-3 rounded-2xl border p-4 text-sm font-semibold ${
            banner.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}>
            {banner.type === "success" ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /> : <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />}
            <span>{banner.message}</span>
          </div>
        )}

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-extrabold text-[#0A0A0A]">Missing required fields</h2>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {missingItems.length === 0 ? (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Ready to submit
              </div>
            ) : (
              missingItems.map((item) => (
                <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                  {item}
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-extrabold text-[#0A0A0A]">Business Details</h2>
          <p className={HELPER_CLASS}>Matches mobile app section: Corporate Identity.</p>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className={LABEL_CLASS}>Brand display name</span>
              <input className={INPUT_CLASS} value={form.brandName} onChange={(event) => updateField("brandName", event.target.value)} placeholder="e.g., Nexus Retail" />
              {renderFieldError("brandName")}
            </label>
            <label className="space-y-2">
              <span className={LABEL_CLASS}>Platform handle</span>
              <input className={INPUT_CLASS} value={form.platformHandle} onChange={(event) => updateField("platformHandle", event.target.value)} onBlur={() => updateField("platformHandle", normalizeHandle(form.platformHandle))} placeholder="@nexus_retail" />
              {renderFieldError("platformHandle")}
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className={LABEL_CLASS}>Full legal entity name</span>
              <input className={INPUT_CLASS} value={form.legalName} onChange={(event) => updateField("legalName", event.target.value)} placeholder="e.g., Nexus Retail Pvt. Ltd." />
              {renderFieldError("legalName")}
            </label>
            <label className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between gap-3">
                <span className={LABEL_CLASS}>Corporate bio and mission</span>
                <span className={`text-xs font-bold ${wordCount >= 30 && wordCount <= 120 ? "text-emerald-600" : "text-slate-500"}`}>{wordCount}/30 words</span>
              </div>
              <textarea className={TEXTAREA_CLASS} value={form.bio} onChange={(event) => updateField("bio", event.target.value)} placeholder="Detail your product lines, customer audience, brand promise, and campaign goals." />
              <p className={HELPER_CLASS}>Minimum 30 words, maximum 120 words.</p>
              {renderFieldError("bio")}
            </label>
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-extrabold text-[#0A0A0A]">Verification Details</h2>
          <p className={HELPER_CLASS}>Matches mobile app section: Taxation and Registries.</p>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
            <label className="space-y-2">
              <span className={LABEL_CLASS}>CIN number</span>
              <input className={INPUT_CLASS} value={form.cin} onChange={(event) => updateField("cin", event.target.value.toUpperCase())} placeholder="U72200MH2026PTC123456" />
              {renderFieldError("cin")}
            </label>
            <label className="space-y-2">
              <span className={LABEL_CLASS}>GSTIN tax number</span>
              <input className={INPUT_CLASS} value={form.gstin} onChange={(event) => updateField("gstin", event.target.value.toUpperCase())} placeholder="27AAAAA0000A1Z5" />
              {renderFieldError("gstin")}
            </label>
            <label className="space-y-2">
              <span className={LABEL_CLASS}>Company PAN</span>
              <input className={INPUT_CLASS} value={form.pan} onChange={(event) => updateField("pan", event.target.value.toUpperCase())} placeholder="AAACS0000A" />
              {renderFieldError("pan")}
            </label>
            <label className="space-y-2 md:col-span-3">
              <span className={LABEL_CLASS}>Registered headquarters address</span>
              <textarea className={TEXTAREA_CLASS} value={form.hqAddress} onChange={(event) => updateField("hqAddress", event.target.value)} placeholder="Must match incorporation certificates exactly." />
              {renderFieldError("hqAddress")}
            </label>
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-extrabold text-[#0A0A0A]">Contact Details</h2>
          <p className={HELPER_CLASS}>Matches mobile app section: Authorized Signatories.</p>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className={LABEL_CLASS}>Primary director name</span>
              <input className={INPUT_CLASS} value={form.directorName} onChange={(event) => updateField("directorName", event.target.value)} placeholder="Authorized person" />
              {renderFieldError("directorName")}
            </label>
            <label className="space-y-2">
              <span className={LABEL_CLASS}>Director identification number (DIN)</span>
              <input className={INPUT_CLASS} value={form.din} onChange={(event) => updateField("din", event.target.value.replace(/\D/g, ""))} placeholder="00001234" />
              {renderFieldError("din")}
            </label>
            <label className="space-y-2">
              <span className={LABEL_CLASS}>Primary contact email</span>
              <input className={INPUT_CLASS} type="email" value={form.contactEmail} onChange={(event) => updateField("contactEmail", event.target.value)} placeholder="contact@brand.com" />
              {renderFieldError("contactEmail")}
            </label>
            <label className="space-y-2">
              <span className={LABEL_CLASS}>Finance / billing email</span>
              <input className={INPUT_CLASS} type="email" value={form.financeEmail} onChange={(event) => updateField("financeEmail", event.target.value)} placeholder="finance@brand.com" />
              {renderFieldError("financeEmail")}
            </label>
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-extrabold text-[#0A0A0A]">Documents</h2>
          <p className={HELPER_CLASS}>Matches mobile app section: Statutory Document Vault.</p>
          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {DOCUMENTS.map((document) => {
              const upload = uploads[document.key];
              const isUploading = uploadingKey === document.key;
              return (
                <div key={document.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#E11D48]">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-extrabold text-slate-900">{document.label}</p>
                          <p className="mt-1 text-xs font-medium text-slate-500">{upload ? upload.original_filename : document.helper}</p>
                        </div>
                      </div>
                    </div>
                    <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-800 transition hover:border-[#E11D48] hover:text-[#E11D48]">
                      {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : upload ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <UploadCloud className="h-4 w-4" />}
                      {isUploading ? "Uploading" : upload ? "Replace" : "Upload"}
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf,.png,.jpg,.jpeg,.webp"
                        disabled={Boolean(uploadingKey) || Boolean(busyAction)}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          event.target.value = "";
                          if (file) void uploadFile(document.key, file);
                        }}
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-extrabold text-[#0A0A0A]">Master Escrow Agreement</h2>
          <p className={HELPER_CLASS}>Matches mobile app section: Escrow and Master Agreement.</p>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            <p><strong className="text-slate-950">Article I: Capital Isolation.</strong> Campaign financial configurations resolve into localized platform escrow accounts before creators commence work.</p>
            <p className="mt-3"><strong className="text-slate-950">Article II: IP and Licensing.</strong> Brand secures digital distribution licenses over executed assets per campaign contract terms.</p>
            <p className="mt-3"><strong className="text-slate-950">Article III: Data Veracity.</strong> Brand asserts that uploaded tax documents reflect the operating legal entity.</p>
          </div>
          <div className="mt-5 space-y-3">
            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300 text-[#E11D48] focus:ring-[#E11D48]"
                checked={agreements.masterService}
                onChange={(event) => setAgreements((current) => ({ ...current, masterService: event.target.checked }))}
              />
              <span className="text-sm font-medium leading-6 text-slate-800">
                I accept the Master Service Agreement and Escrow Isolation Protocols.
              </span>
            </label>
            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300 text-[#E11D48] focus:ring-[#E11D48]"
                checked={agreements.digitalSignature}
                onChange={(event) => setAgreements((current) => ({ ...current, digitalSignature: event.target.checked }))}
              />
              <span className="text-sm font-medium leading-6 text-slate-800">
                Digital signature: I execute this declaration under penalty of platform ban for fraud.
              </span>
            </label>
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold text-slate-500">
            Drafts persist after refresh. Submit when all mobile KYC fields and documents are complete.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={async () => {
                if (!busyAction) {
                  await save("save_draft");
                }
                await supabase.auth.signOut();
                router.push("/login");
                router.refresh();
              }}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 sm:w-auto"
            >
              <LogOut className="h-4 w-4" />
              Save & Log Out
            </button>
            <button
              type="button"
              onClick={() => void save("save_draft")}
              disabled={Boolean(busyAction) || Boolean(uploadingKey)}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-800 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {busyAction === "save_draft" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => void save("submit")}
              disabled={Boolean(busyAction) || Boolean(uploadingKey)}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0A0A0A] px-5 text-sm font-extrabold text-white transition hover:bg-[#BE123C] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {busyAction === "submit" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Submit Verification
            </button>
            {process.env.NODE_ENV !== "production" && (
              <button
                type="button"
                onClick={async () => {
                  setBusyAction("submit");
                  try {
                    const res = await fetch("/api/brand/bypass", { method: "POST" });
                    if (res.ok) {
                      router.push("/dashboard");
                      router.refresh();
                    } else {
                      setBanner({ type: "error", message: "Bypass failed" });
                    }
                  } catch {
                    setBanner({ type: "error", message: "Bypass failed" });
                  } finally {
                    setBusyAction(null);
                  }
                }}
                disabled={Boolean(busyAction)}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-200 px-5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-300 sm:w-auto"
              >
                Bypass (Test)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
