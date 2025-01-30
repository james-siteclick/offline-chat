import { useAppStore } from "../../store/app";

export default function NavBar() {
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
