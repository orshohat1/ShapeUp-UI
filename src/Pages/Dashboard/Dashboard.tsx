import React from 'react';
import './Dashboard.less';
import logo from '../../assets/Logo/shape-up.png'
interface DashboardProps {
  children?: React.ReactNode;
}
const Dashboard: React.FC<DashboardProps> = () => {
  return (
    <div className="container">
      <aside className="sidebar">
        <img src={logo} className="logo" />
        <div className="divider"></div>
      </aside>
      <main className="main">
        <div className="content">
          <header className="header">
            <h1 className="main-title">Overview</h1>
            <span className="title">My Gyms</span>
          </header>          
        </div>
      </main>
    </div>
  );
};

export default Dashboard;