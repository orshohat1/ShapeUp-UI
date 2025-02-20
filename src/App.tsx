import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import HomeUser from "./Pages/User/Home/HomeUser";
import LoginUser from "./Pages/User/Login/LoginUser";
import RegisterUser from "./Pages/User/Register/RegisterUser";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user/login" element={<LoginUser />} />
        <Route path="/user/home" element={<HomeUser />} />
        <Route path="/user/register" element={<RegisterUser />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
