import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email("Please enter a valid email address").max(150),
  phone: z.string().max(50).optional(),
  company_name: z.string().max(100).optional(),
  subject: z.string().max(200).optional(),
  message: z.string().max(5000).optional(),
  query: z.string().max(5000).optional(),
  form_type: z.enum(["contact", "creator_contact", "request_demo", "get_started", "free_trial"]).default("contact"),
  metadata: z.record(z.string(), z.unknown()).optional(),
});
