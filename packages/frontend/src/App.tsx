import { Route, Routes } from "react-router";
// import "./App.css";
import Index from "./pages/Index";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route index element={<Index />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
