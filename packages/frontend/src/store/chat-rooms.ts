import { ChatRoom } from "@offline-chat/backend";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { makeLocalStorage } from "./json-local-storage";

interface ChatRoomsState {
  lastSync?: Date;
  chatRooms: ChatRoom[];
  mutationQueue: ChatRoom["id"][];
  addChatRoom: (name: string) => void;
  clearMutation: (id: string) => void;
}

function addChatRoom(chatRooms: ChatRoom[], id: string, newChatRoom: string) {
  return [
    ...chatRooms,
    {
      id,
      created_at: new Date(),
      name: newChatRoom,
    },
  ];
}

export const useChatRoomsStore = create<ChatRoomsState>()(
  persist(
    (set) => ({
      chatRooms: [],
      mutationQueue: [],
      clearMutation(id: string) {
        set((state) => ({
          ...state,
          mutationQueue: this.mutationQueue.filter(
            (existingId) => existingId !== id
          ),
        }));
      },
      addChatRoom(name: string) {
        set((state) => {
          const id = uuidv4();
          return {
            ...state,
            chatRooms: addChatRoom(state.chatRooms, id, name),
            newChatRoom: "",
            mutationQueue: [...state.mutationQueue, id],
          };
        });
      },
    }),
    {
      name: "chatrooms", // name of the item in the storage (must be unique),
      storage: makeLocalStorage(),
    }
  )
);
