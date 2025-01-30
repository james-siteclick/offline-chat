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

  return (
    <div>
      <NavBar />

      <div className="container-fluid">
        <div className="row align-items-start">
          <div className="col-3 p-3" style={{ background: "#e9ecef" }}>
            <ul className="list-unstyled">
              {chatRoomsStore.chatRooms.map((chatRoom) => (
                <li key={chatRoom.id}>
                  <a href="#" className="text-decoration-none">
                    # {chatRoom.name}
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
