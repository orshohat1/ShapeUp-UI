import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Dashboard from "./Pages/Dashboard/Dashboard";
import LoginUser from "./Pages/User/Login/LoginUser";
import RegisterUser from "./Pages/User/Register/RegisterUser";
import GymsList from "./Pages/User/GymsList/GymsList";
import { UserProfileProvider } from "./context/UserProfileProvider";
import Sidebar from "./components/Sidebar/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const showSidebar = location.pathname === "/dashboard" || location.pathname === "/gyms";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {showSidebar && <Sidebar />}
      <div style={{ flex: 1, minHeight: "100vh" }}>
        {children}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <UserProfileProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user/login" element={<LoginUser />} />
            <Route path="/user/register" element={<RegisterUser />} />
            <Route path="/gyms" element={<GymsList />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </UserProfileProvider>
  );
};

export default App;
