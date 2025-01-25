import { z } from "zod";

export const ChatRoom = z.object({
  id: z.string().uuid(),
  name: z.string().max(255),
  created_at: z.coerce.date(),
  deleted_at: z.coerce.date().optional(),
});

export type ChatRoom = z.infer<typeof ChatRoom>;
