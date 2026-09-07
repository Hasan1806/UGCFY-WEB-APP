import { z } from "zod";

export const brandProfileSchema = z.object({
  brand_name: z.string().min(1, "Brand name is required"),
  company_name: z.string().optional(),
  business_type: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  industry: z.string().optional(),
  contact_phone: z.string().optional(),
  business_description: z.string().optional(),
  gst_number: z.string().optional(),
  logo_url: z.string().optional(),
});

export const brandPocSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  designation: z.string().optional(),
  is_primary: z.boolean().default(false),
});
