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
import LoginAdmin from "./Pages/Admin/Login/LoginAdmin";
import DashboardAdmin from "./Pages/Admin/Dashboard/DashboardAdmin";
import UserListModalContent from "./components/AdminModalContents/UserListModalContent/UserListModalContent";
import GymListModalContent from "./components/AdminModalContents/GymListModalContent/GymListModalContent";
import PendingListModalContent from "./components/AdminModalContents/PendingListModalContent/PendingListModalContent";
import { useUserProfile } from "./context/useUserProfile";
import { useEffect } from "react";
import NotFound from "./Pages/NotFound/NotFound";

interface LayoutProps {
  children: React.ReactNode;
}

const sidebarRoutes = [
  "/dashboard",
  "/gyms",
  "/admin/dashboard",
  "/admin/users",
  "/admin/gyms",
  "/admin/pending",
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const showSidebar = sidebarRoutes.includes(location.pathname);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {showSidebar && <Sidebar />}
      <div style={{ flex: 1, minHeight: "100vh" }}>{children}</div>
    </div>
  );
};

const AppContent = () => {
  const { refreshUserProfile } = useUserProfile();

  // Refresh user profile on app reload
  useEffect(() => {
    refreshUserProfile();
  }, []);

  return (
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
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route path="/admin/users" element={<UserListModalContent />} />
          <Route path="/admin/gyms" element={<GymListModalContent />} />
          <Route path="/admin/pending" element={<PendingListModalContent />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <UserProfileProvider>
      <AppContent />
    </UserProfileProvider>
  );
};

export default App;
