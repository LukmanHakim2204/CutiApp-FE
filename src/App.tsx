import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Holiday from "./pages/Holiday";
import CreateLeaveApp from "./pages/CreateLeaveApp";
import History from "./pages/History";
import SubmitLeaveApp from "./pages/SubmitLeaveApp";

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
        <Route path="/submit-leave-app" element={<SubmitLeaveApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
