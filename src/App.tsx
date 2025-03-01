import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Dashboard from "./Pages/Dashboard/Dashboard";
import LoginUser from "./Pages/User/Login/LoginUser";
import RegisterUser from "./Pages/User/Register/RegisterUser";
import { UserProfileProvider } from "./context/UserProfileProvider";

const App = () => {
  return (
    <UserProfileProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user/login" element={<LoginUser />} />
          <Route path="/user/register" element={<RegisterUser />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </UserProfileProvider>
  );
};

export default App;
