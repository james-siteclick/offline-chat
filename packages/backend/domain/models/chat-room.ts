import { z } from "zod";

export const ChatRoom = z.object({
  id: z.string().uuid(),
  name: z.string(),
  created_at: z.date(),
  deleted_at: z.date().optional(),
});

export type ChatRoom = z.infer<typeof ChatRoom>;
