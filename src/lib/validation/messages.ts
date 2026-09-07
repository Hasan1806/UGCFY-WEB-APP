import { z } from "zod";

export const messageSchema = z.object({
  thread_id: z.string().uuid("Invalid thread ID").optional(),
  creator_id: z.string().uuid("Invalid creator ID").optional(),
  campaign_id: z.string().uuid("Invalid campaign ID").optional(),
  message: z.string().min(1, "Message cannot be empty").max(10000, "Message too long"),
});
