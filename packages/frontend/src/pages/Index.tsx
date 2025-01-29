import { ChatRoom } from "@offline-chat/backend";
import { v4 as uuidv4 } from "uuid";

import { useState, useSyncExternalStore } from "react";
import * as api from "../data/api";
import { HttpError } from "../data/api";
import { StoreEventType, StoreSubscriber } from "../store/interfaces/events";
import { Store } from "../store/store";

const apiSubscriber: StoreSubscriber<ChatRoom> = async (event) => {
  switch (event.type) {
    case StoreEventType.init:
      const chatRooms = await api.getChatRooms();
      event.store.setState(
        new Map(chatRooms.map((chatRoom) => [chatRoom.id, chatRoom]))
      );
      break;

    case StoreEventType.enqueueMutation:
      if (event.mutation.type === "CREATE") {
        try {
          await api.createChatRoom(event.mutation.data);
        } catch (err) {
          // Already exists
          if (err instanceof HttpError && err.statusCode === 409) {
            event.store.deleteMutation(event.mutation);
            return window.alert("Chat room already exists");
          }
          throw err;
        }
      }
      break;
  }
};

const store = new Store<ChatRoom>();

export default function Index() {
  const chatRooms = useSyncExternalStore(
    (callback) => store.subscribe(callback),
    () => store.getViewState()
  );

  const chatRoomsList = Array.from(chatRooms.values());

  return (
    <div>
      <h1>Main page</h1>

      <OfflineSwitch />

      <button type="submit" className="btn btn-primary" onClick={handleClick}>
        Add Chat Room
      </button>
      {chatRoomsList.map((chatRoom) => (
        <li key={chatRoom.id}>
          {chatRoom.id} {chatRoom.name}
        </li>
      ))}
    </div>
  );
}

function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
  const newRoom: ChatRoom = {
    id: uuidv4(),
    name: window.prompt(`Chat room name`) ?? "(Untitled)",
    created_at: new Date(),
  };
  store.enqueueMutation({
    type: "CREATE",
    data: newRoom,
  });
}

function OfflineSwitch() {
  const [isOnline, setIsOnline] = useState(false);

  if (isOnline && !store.isSubscribed(apiSubscriber)) {
    console.log("Online mode");
    store.subscribe(apiSubscriber);
  }
  if (!isOnline && store.isSubscribed(apiSubscriber)) {
    console.log("Offline mode");
    store.unsubscribe(apiSubscriber);
  }
  return (
    <Switch
      label="Offline mode"
      onChange={(isOffline) => setIsOnline(!isOffline)}
    />
  );
}

type OnChangeHandler = (isChecked: boolean) => void;
type SwitchProps = {
  label: string;
  onChange: OnChangeHandler;
};
function Switch({ label, onChange }: SwitchProps) {
  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        id="flexSwitchCheckDefault"
        onChange={(evt) => onChange(evt.target.checked)}
      />
      <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
        {label}
      </label>
    </div>
  );
}
