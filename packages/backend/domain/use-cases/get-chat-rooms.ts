import { z } from "zod";
import { ChatRoomRepository } from "../interfaces/chat-room-repository";
import { ChatRoom } from "../models/chat-room";

export const GetChatRoomsQuery = z.object({
  since: z.coerce.date().optional(),
});
export type GetChatRoomsQuery = z.infer<typeof GetChatRoomsQuery>;

export type GetChatRooms = (query: GetChatRoomsQuery) => Promise<ChatRoom[]>;

export default function makeGetChatRooms(
  chatRoomsRepository: ChatRoomRepository
): GetChatRooms {
  return function getChatRooms(query: GetChatRoomsQuery) {
    return chatRoomsRepository.getAll(query.since);
  };
}
