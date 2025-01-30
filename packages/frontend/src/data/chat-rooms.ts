import { ChatRoom } from "@offline-chat/backend";
import { mapResponseToError } from "./utils/http-error";

const baseUrl = `${window.location.origin}/api`;

export async function getChatRooms(since?: Date) {
  const params = since
    ? new URLSearchParams({
        since: since.toISOString(),
      })
    : new URLSearchParams();
  const response = await fetch(`${baseUrl}/chat-rooms?${params.toString()}`);
  if (response.ok) {
    const data = await response.json();
    return ChatRoom.array().parse(data);
  }
  throw mapResponseToError(response);
}

export async function createChatRoom(data: ChatRoom) {
  const response = await fetch(`${baseUrl}/chat-rooms`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  });
  if (!response.ok) {
    throw mapResponseToError(response);
  }
}
