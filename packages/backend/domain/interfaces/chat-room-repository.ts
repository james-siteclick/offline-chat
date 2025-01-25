import { ChatRoom } from "../models/chat-room";

export interface ChatRoomRepository {
  create(chatRoom: ChatRoom): Promise<void>;
}
