import React from 'react';
import './Dashboard.less';
import logo from '../../assets/Logo/shape-up.png';
import dashboard from '../../assets/Logo/Dashboard.png';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
interface DashboardProps {
  children?: React.ReactNode;
}
const Dashboard: React.FC<DashboardProps> = () => {
  return (
    <div className="container-fluid">
    <div className="row">
      {/* Sidebar */}
      <aside className="col-auto align-items-center justify-content-center sidebar">
        <img src={logo} className="logo" />
        <img src={dashboard} className='dashboard' />
        <div className="divider"></div>
      </aside>

      {/* Main Content */}
      <main className="col bg-white p-3">
        <h1>Overview</h1>
        <div className="my-gyms-header">
            <p className="my-gyms-text">My Gyms</p>
            <PlusCircleOutlined className="plus-icon" />
        </div>
      </main>
    </div>
  </div>
  );
};

export default Dashboard;