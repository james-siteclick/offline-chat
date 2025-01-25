import { z } from "zod";
import { ChatRoom } from "./chat-room";
import { User } from "./user";

export const Message = z.object({
  id: z.string().uuid(),
  chat_room_id: ChatRoom.shape.id,
  user_id: User.shape.id,
  created_at: z.date(),
  message: z.string(),
});

export type Message = z.infer<typeof Message>;
