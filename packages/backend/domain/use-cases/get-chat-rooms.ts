import { ChatRoom } from "../models/chat-room";

export type GetChatRooms = () => Promise<ChatRoom[]>;

export default function makeGetChatRoom(): GetChatRooms {
  return function getChatRooms() {
    const data: ChatRoom[] = [
      {
        id: "0c5c0ee1-3f82-41b1-93ab-5acec8f0b2a7",
        name: "General chat",
        created_at: new Date(),
      },
      {
        id: "4cad14ee-643a-477a-80ac-65099a068bbe",
        name: "Heat Pumps",
        created_at: new Date(),
      },
      {
        id: "a1bc8abd-d01a-49ed-aaa6-de8f1e371faf",
        name: "Solar Panels",
        created_at: new Date(),
      },
    ];

    return Promise.resolve(data);
  };
}
