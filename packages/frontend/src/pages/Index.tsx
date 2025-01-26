import { ChatRoom } from "@offline-chat/backend";
import { v4 as uuidv4 } from "uuid";

import { useState } from "react";
import { makeStore } from "../store/store";

const chatRoom: ChatRoom = {
  id: uuidv4(),
  name: "My chatroom",
  created_at: new Date(),
};

const store = makeStore<ChatRoom>();

export default function Index() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const newRoom: ChatRoom = {
      id: uuidv4(),
      name: "New one",
      created_at: new Date(),
    };
    store.enqueueMutation({
      type: "CREATE",
      data: newRoom,
    });
    setChatRooms(Array.from(store.getViewState().values()));
  }

  return (
    <div>
      <h1>Main page</h1>
      <button type="submit" className="btn btn-primary" onClick={handleClick}>
        Add Chat Room
      </button>
      {chatRooms.map((chatRoom) => (
        <li key={chatRoom.id}>
          {chatRoom.id} {chatRoom.name}
        </li>
      ))}
    </div>
  );
}
