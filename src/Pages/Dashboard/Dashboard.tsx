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
      </aside>
      <main className="main">
        <div className="content">
          <header className="header">
            <h1 className="title">Overview</h1>
          </header>          
        </div>
      </main>
    </div>
  );
};

export default Dashboard;