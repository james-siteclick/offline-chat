import { z } from "zod";
import { ChatRoomRepository } from "../interfaces/chat-room-repository";
import { ChatRoom } from "../models/chat-room";

export const CreateChatRoomRequest = ChatRoom.omit({ deleted_at: true });
export type CreateChatRoomRequest = z.infer<typeof CreateChatRoomRequest>;

export type CreateChatRoom = (chatRoom: ChatRoom) => Promise<ChatRoom>;

export default function makeCreateChatRoom(
  chatRoomRepository: ChatRoomRepository
) {
  return async function createChatRoom(
    createChatRoomRequest: CreateChatRoomRequest
  ) {
    const chatRoom = ChatRoom.parse(createChatRoomRequest);
    // @todo - handle conflict
    return chatRoomRepository.create(chatRoom);
  };
}
