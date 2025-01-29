import { ChatRoom } from "@offline-chat/backend";

const baseUrl = `${window.location.origin}/api`;

export class HttpError extends Error {
  constructor(message: string, readonly statusCode: number) {
    super(message);
  }
}

export async function getChatRooms() {
  const response = await fetch(`${baseUrl}/chat-rooms`);
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

function mapResponseToError(response: Response) {
  return new HttpError(response.statusText, response.status);
}
