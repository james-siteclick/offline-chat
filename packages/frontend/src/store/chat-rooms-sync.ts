import { createChatRoom, getChatRooms } from "../data/chat-rooms";
import { HttpError } from "../data/utils/http-error";
import { getMaxDate } from "../utils/date";
import { useAppStore } from "./app";
import { useChatRoomsStore } from "./chat-rooms";
import { getLastUpdatedAt, merge } from "./merge";

export async function fullSync() {
  const chatRooms = await getChatRooms();
  const state = useChatRoomsStore.getState();
  useChatRoomsStore.setState({
    ...state,
    lastSync: new Date(),
    mutationQueue: [],
    chatRooms: chatRooms,
  });
}

export async function incrementalSync() {
  const app = useAppStore.getState();
  if (!app.user) {
    window.setTimeout(incrementalSync, 5000);
    return console.log("Skipping sync, not authenticated");
  }

  const state = useChatRoomsStore.getState();

  // Push local mutations
  const promises = [...state.mutationQueue]
    .map((id) => state.chatRooms.find((chatRoom) => chatRoom.id === id))
    .filter((chatRoom) => chatRoom !== undefined)
    .map(async (chatRoom) => {
      try {
        await createChatRoom(chatRoom);
        const { mutationQueue, ...rest } = useChatRoomsStore.getState();
        useChatRoomsStore.setState({
          ...rest,
          mutationQueue: mutationQueue.filter((item) => item !== chatRoom.id),
        });
      } catch (err) {
        console.error(err);
        // If local state conflicts with DB state, do a full sync
        if (err instanceof HttpError && err.statusCode === 409) {
          return fullSync();
        }
      }
    });

  // Get remote mutations
  const lastSyncDate = getMaxDate(state.chatRooms.map(getLastUpdatedAt));
  const getRemoteMutations = getChatRooms(lastSyncDate).then((chatRooms) => {
    const state = useChatRoomsStore.getState();

    console.log("Getting remote mutations since...", lastSyncDate, chatRooms);
    useChatRoomsStore.setState({
      ...state,
      lastSync: new Date(),
      chatRooms: merge(state.chatRooms, chatRooms),
    });
  });

  await Promise.all([...promises, getRemoteMutations]);

  window.setTimeout(incrementalSync, 5000);
}
