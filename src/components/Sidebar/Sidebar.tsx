import React from "react";
import "./Sidebar.less";
import logo from "../../assets/Logo/shape-up.png";
import { HomeOutlined } from "@ant-design/icons";

const Sidebar: React.FC<{ user?: any }> = ({ user }) => {
  return (
    <aside className="sidebar">
      {/* ShapeUp Logo */}
      <div className="logo-container">
        <img src={logo} alt="ShapeUp Logo" className="logo" />
      </div>

      {/* Navigation */}
      <div className="menu">
        <div className="menu-item active">
          <HomeOutlined style={{ marginRight: "8px" }} />
          Gyms
        </div>
      </div>

      {/* User Profile */}
      {user && (
        <div className="user-info">
          <img src={user.avatarUrl} alt="User Avatar" className="user-avatar" />
          <span className="user-name">{user.firstName} {user.lastName}</span>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
