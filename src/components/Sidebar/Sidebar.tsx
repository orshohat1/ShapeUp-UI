import React, { useState } from "react";
import "./Sidebar.less";
import logo from "../../assets/Logo/shape-up.png";
import { HomeOutlined, EditOutlined, LogoutOutlined } from "@ant-design/icons";
import { useUserProfile } from "../../context/useUserProfile";
import { useNavigate } from "react-router-dom";
import UpdateProfileModal from "../UpdateProfileModal/UpdateProfileModal";
import { IUserType } from "../../constants/enum/IUserType";

const Sidebar: React.FC<{ user?: any }> = () => {
  const { userProfile, logout } = useUserProfile();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleLogout = async () => {
    logout();
    if (userProfile?.role === IUserType.ADMIN) {
      navigate("/admin/login");
    } 
    if (userProfile?.role === IUserType.USER) {
      navigate("/user/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <aside className="col-auto align-items-center justify-content-center sidebar">
      <div>
        <img src={logo} className="logo" alt="ShapeUp Logo" />
      </div>

      <div className="menu">
        {(userProfile?.role === IUserType.USER ||
          userProfile?.role === IUserType.ADMIN) && (
          <div className="menu-item">
            <div style={{ marginRight: "auto" }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="30" cy="30" r="10" fill="purple" />
                <circle cx="70" cy="30" r="10" fill="purple" />
                <circle cx="30" cy="70" r="10" fill="purple" />
                <circle cx="70" cy="70" r="10" fill="purple" />
              </svg>
            </div>
            <span className="item-title">Dashboard</span>
          </div>
        )}

        {userProfile?.role === IUserType.GYM_OWNER && (
          <div className="menu-item" onClick={() => navigate("/dashboard")}>
            <HomeOutlined style={{ marginRight: "auto", color: "purple" }} />
            <span className="item-title">Dashboard</span>
          </div>
        )}
      </div>

      <div className="aside-bottom-container">
        <div className="divider"></div>
        <div className="user-info">
          <img
            src={userProfile?.avatarUrl}
            alt="avatar"
            className="user-avatar"
          />
          <span className="user-name">
            {userProfile?.firstName} {userProfile?.lastName}
          </span>
          <div className="user-actions-container">
            <button className="icon-button" onClick={handleEdit}>
              <EditOutlined className="edit-icon" />
            </button>
            <button className="icon-button" onClick={handleLogout}>
              <LogoutOutlined className="logout-icon" />
            </button>
          </div>
        </div>
      </div>

      <UpdateProfileModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </aside>
  );
};

export default Sidebar;
