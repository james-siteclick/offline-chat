import { useNavigate } from "react-router";
import { createChatRoom, getChatRooms } from "../data/chat-rooms";
import { HttpError } from "../data/utils/http-error";
import { useAppStore } from "../store/app";
import { useChatRoomsStore } from "../store/chat-rooms";
import { getLastUpdatedAt, merge } from "../store/merge";
import { getMaxDate } from "../utils/date";
import AddChatRoomForm from "./AddChatRoomForm";

async function fullSync() {
  const chatRooms = await getChatRooms();
  const state = useChatRoomsStore.getState();
  useChatRoomsStore.setState({
    ...state,
    lastSync: new Date(),
    mutationQueue: [],
    chatRooms: chatRooms,
  });
}

async function incrementalSync() {
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

          <div className="col-9 p-3">hello</div>
        </div>
      </div>
    </div>
  );
}

function NavBar() {
  const appStore = useAppStore();
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <span className="navbar-brand">Chat</span>
        <div className="d-flex">Logged in as {appStore.user?.username}</div>
        <div className="d-flex">
          <a href="#" onClick={() => appStore.logout()}>
            Logout
          </a>
        </div>
      </div>
    </nav>
  );
}
