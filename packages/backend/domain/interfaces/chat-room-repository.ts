import { ChatRoom } from "../models/chat-room";

export interface ChatRoomRepository {
  create(chatRoom: ChatRoom): Promise<void>;

  get(id: ChatRoom["id"]): Promise<ChatRoom | undefined>;

  update(
    id: ChatRoom["id"],
    update: Partial<Omit<ChatRoom, "id">>
  ): Promise<void>;

  getAll(since?: Date): Promise<ChatRoom[]>;
}
