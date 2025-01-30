import { ChatRoom } from "@offline-chat/backend";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { makeLocalStorage } from "./json-local-storage";

interface ChatRoomsState {
  chatRooms: ChatRoom[];
  mutationQueue: ChatRoom["id"][];
  addChatRoom: (name: string) => void;
  deleteChatRoom: (name: string) => void;
  clearMutation: (id: string) => void;
}

export const useChatRoomsStore = create<ChatRoomsState>()(
  persist(
    (set) => ({
      chatRooms: [],
      mutationQueue: [],
      addChatRoom(name: string) {
        set((state) => {
          const id = uuidv4();
          return {
            ...state,
            chatRooms: addChatRoom(state.chatRooms, id, name),
            mutationQueue: [...state.mutationQueue, id],
          };
        });
      },
      deleteChatRoom(id: string) {
        set((state) => ({
          ...state,
          chatRooms: deleteChatRoom(state.chatRooms, id),
          mutationQueue: [...state.mutationQueue, id],
        }));
      },
      clearMutation(id: string) {
        set((state) => ({
          ...state,
          mutationQueue: clearMutation(state.mutationQueue, id),
        }));
      },
    }),
    {
      name: "chatrooms", // name of the item in the storage (must be unique),
      storage: makeLocalStorage(),
    }
  )
);

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

function deleteChatRoom(chatRooms: ChatRoom[], id: string) {
  return chatRooms.map((chatRoom) => ({
    ...chatRoom,
    deleted_at:
      chatRoom.id === id && !chatRoom.deleted_at
        ? new Date()
        : chatRoom.deleted_at,
  }));
}

function clearMutation(mutationQueue: string[], id: string): string[] {
  return mutationQueue.filter((existingId) => existingId !== id);
}
