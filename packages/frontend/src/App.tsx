import { Route, Routes } from "react-router";
// import "./App.css";
import Login from "./pages/Login";

function Home() {
  return <h1>Home</h1>;
}

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
