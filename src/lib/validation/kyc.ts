import { z } from "zod";

const cinRegex = /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;
const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export const kycSchema = z.object({
  document_type: z.string().min(1, "Document type is required"),
  bucket: z.string().min(1),
  path: z.string().min(1),
  original_filename: z.string().optional(),
  mime_type: z.string().optional(),
  size_bytes: z.number().optional(),
});

export const brandKycUploadSchema = z.object({
  key: z.enum(["doc1", "doc2", "doc3", "doc4", "doc5"]),
  document_type: z.string().min(1),
  bucket: z.string().min(1),
  path: z.string().min(1),
  original_filename: z.string().min(1),
  mime_type: z.string().optional(),
  size_bytes: z.number().optional(),
});

export const brandVerificationSchema = z.object({
  action: z.enum(["save_draft", "submit"]),
  form: z.object({
    brandName: z.string().trim(),
    platformHandle: z.string().trim(),
    legalName: z.string().trim(),
    bio: z.string().trim(),
    cin: z.string().trim().toUpperCase().optional().or(z.literal("")),
    gstin: z.string().trim().toUpperCase(),
    pan: z.string().trim().toUpperCase(),
    hqAddress: z.string().trim(),
    directorName: z.string().trim(),
    din: z.string().trim(),
    contactEmail: z.string().trim(),
    financeEmail: z.string().trim(),
  }),
  uploads: z.array(brandKycUploadSchema).default([]),
  agreements: z.object({
    masterService: z.boolean(),
    digitalSignature: z.boolean(),
  }),
}).superRefine((value, ctx) => {
  const wordCount = value.form.bio ? value.form.bio.split(/\s+/).filter(Boolean).length : 0;

  if (value.action === "submit" && !value.form.brandName) {
    ctx.addIssue({ code: "custom", path: ["form", "brandName"], message: "Brand display name is required." });
  }

  if (value.action === "submit" && !value.form.platformHandle) {
    ctx.addIssue({ code: "custom", path: ["form", "platformHandle"], message: "Platform handle is required." });
  }

  if (value.action === "submit" && !value.form.legalName) {
    ctx.addIssue({ code: "custom", path: ["form", "legalName"], message: "Legal entity name is required." });
  }

  if (value.action === "submit" && wordCount < 30) {
    ctx.addIssue({
      code: "custom",
      path: ["form", "bio"],
      message: "Corporate bio must contain at least 30 words.",
    });
  }

  if (wordCount > 120) {
    ctx.addIssue({
      code: "custom",
      path: ["form", "bio"],
      message: "Corporate bio must not exceed 120 words.",
    });
  }

  if (value.form.cin && !cinRegex.test(value.form.cin)) {
    ctx.addIssue({ code: "custom", path: ["form", "cin"], message: "Invalid CIN format." });
  }

  if (value.form.gstin && !gstinRegex.test(value.form.gstin)) {
    ctx.addIssue({ code: "custom", path: ["form", "gstin"], message: "Invalid GSTIN format." });
  }

  if (value.form.pan && !panRegex.test(value.form.pan)) {
    ctx.addIssue({ code: "custom", path: ["form", "pan"], message: "Invalid PAN format." });
  }

  if (value.form.contactEmail && !z.email().safeParse(value.form.contactEmail).success) {
    ctx.addIssue({ code: "custom", path: ["form", "contactEmail"], message: "Primary contact email is invalid." });
  }

  if (value.form.financeEmail && !z.email().safeParse(value.form.financeEmail).success) {
    ctx.addIssue({ code: "custom", path: ["form", "financeEmail"], message: "Finance email is invalid." });
  }

  if (value.action === "submit") {
    if (!value.form.gstin) {
      ctx.addIssue({ code: "custom", path: ["form", "gstin"], message: "GSTIN is required." });
    }

    if (!value.form.pan) {
      ctx.addIssue({ code: "custom", path: ["form", "pan"], message: "Company PAN is required." });
    }

    if (!value.form.hqAddress) {
      ctx.addIssue({ code: "custom", path: ["form", "hqAddress"], message: "Registered address is required." });
    }

    if (!value.form.directorName) {
      ctx.addIssue({ code: "custom", path: ["form", "directorName"], message: "Primary director name is required." });
    }

    if (!value.form.din) {
      ctx.addIssue({ code: "custom", path: ["form", "din"], message: "DIN is required." });
    }

    if (!value.form.contactEmail) {
      ctx.addIssue({ code: "custom", path: ["form", "contactEmail"], message: "Primary contact email is required." });
    }

    if (!value.form.financeEmail) {
      ctx.addIssue({ code: "custom", path: ["form", "financeEmail"], message: "Finance email is required." });
    }

    const uploadedKeys = new Set(value.uploads.map((upload) => upload.key));
    for (const key of ["doc1", "doc2", "doc3", "doc4", "doc5"] as const) {
      if (!uploadedKeys.has(key)) {
        ctx.addIssue({
          code: "custom",
          path: ["uploads", key],
          message: "All five verification documents are required.",
        });
      }
    }

    if (!value.agreements.masterService) {
      ctx.addIssue({
        code: "custom",
        path: ["agreements", "masterService"],
        message: "Master Service Agreement acceptance is required.",
      });
    }

    if (!value.agreements.digitalSignature) {
      ctx.addIssue({
        code: "custom",
        path: ["agreements", "digitalSignature"],
        message: "Digital signature confirmation is required.",
      });
    }
  }
});

export type BrandVerificationPayload = z.infer<typeof brandVerificationSchema>;
