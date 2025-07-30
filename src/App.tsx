import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Holiday from "./pages/Holiday";
import CreateLeaveApp from "./pages/CreateLeaveApp";
import History from "./pages/History";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<History />} />
        <Route path="/holiday" element={<Holiday />} />
        <Route path="/create-leave-app" element={<CreateLeaveApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
