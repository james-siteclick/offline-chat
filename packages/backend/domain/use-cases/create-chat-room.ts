import { z } from "zod";
import { ChatRoom } from "../models/chat-room";

export const CreateChatRoomRequest = ChatRoom.omit({ deleted_at: true });
export type CreateChatRoomRequest = z.infer<typeof CreateChatRoomRequest>;

export type CreateChatRoom = (chatRoom: ChatRoom) => Promise<ChatRoom>;

export default function makeCreateChatRoom() {
  return async function createChatRoom(
    createChatRoomRequest: CreateChatRoomRequest
  ) {
    const chatRoom = ChatRoom.parse(createChatRoomRequest);
    return chatRoom;
  };
}
