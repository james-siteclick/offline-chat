import { ChatRoomRepository } from "../interfaces/chat-room-repository";
import { ChatRoom } from "../models/chat-room";

export type GetChatRooms = () => Promise<ChatRoom[]>;

export default function makeGetChatRooms(
  chatRoomsRepository: ChatRoomRepository
): GetChatRooms {
  return function getChatRooms() {
    return chatRoomsRepository.getAll();
  };
}
