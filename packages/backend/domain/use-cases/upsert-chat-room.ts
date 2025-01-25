import { z } from "zod";
import { ChatRoomRepository } from "../interfaces/chat-room-repository";
import { ConflictError } from "../interfaces/error";
import { ChatRoom } from "../models/chat-room";

export const UpsertChatRoomRequest = ChatRoom;
export type UpsertChatRoomRequest = z.infer<typeof UpsertChatRoomRequest>;

export type CreateChatRoom = (chatRoom: ChatRoom) => Promise<ChatRoom>;

export default function makeUpsertChatRoom(
  chatRoomRepository: ChatRoomRepository
) {
  return async function upsertChatRoom(
    upsertChatroomRequest: UpsertChatRoomRequest
  ) {
    const chatRoom = ChatRoom.parse(upsertChatroomRequest);

    const existingChatRoom = await chatRoomRepository.get(chatRoom.id);

    if (!existingChatRoom) {
      await chatRoomRepository.create(chatRoom);
    } else {
      if (existingChatRoom.deleted_at) {
        throw new ConflictError(`Chat room ${chatRoom.id} is deleted`);
      }
      await chatRoomRepository.update(chatRoom.id, chatRoom);
    }
  };
}
