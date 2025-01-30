import { useNavigate } from "react-router";
import { useAppStore } from "../store/app";
import { useChatRoomsStore } from "../store/chat-rooms";
import { fullSync, incrementalSync } from "../store/chat-rooms-sync";
import AddChatRoomForm from "./components/AddChatRoomForm";
import NavBar from "./components/NavBar";

incrementalSync();
fullSync();

export default function Index() {
  const chatRoomsStore = useChatRoomsStore();
  const appStore = useAppStore();
  const navigate = useNavigate();

  if (!appStore.user) {
    navigate("/login");
  }

  const visibleChatRooms = chatRoomsStore.chatRooms
    .filter((chatRoom) => !chatRoom.deleted_at)
    .sort((a, b) => {
      if (a.name === b.name) {
        return 0;
      }
      return a.name > b.name ? 1 : -1;
    });

  return (
    <div>
      <NavBar />

      <div className="container-fluid">
        <div className="row align-items-start">
          <div className="col-3 p-3" style={{ background: "#e9ecef" }}>
            <ul className="list-unstyled">
              {visibleChatRooms.map((chatRoom) => (
                <li key={chatRoom.id}>
                  # {chatRoom.name} {chatRoom?.deleted_at?.toISOString()}
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ float: "right" }}
                    title={`Delete ${chatRoom.name}`}
                    onClick={() => chatRoomsStore.deleteChatRoom(chatRoom.id)}
                  >
                    ×
                  </a>
                </li>
              ))}
            </ul>
            <AddChatRoomForm onSubmit={chatRoomsStore.addChatRoom} />
          </div>

          <div className="col-9 p-3">Messages here...</div>
        </div>
      </div>
    </div>
  );
}
