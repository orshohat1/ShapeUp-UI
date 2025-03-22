import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Modal } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import UserListModalContent from "../../../components/AdminModalContents/UserListModalContent/UserListModalContent";
import GymListModalContent from "../../../components/AdminModalContents/GymListModalContent/GymListModalContent";

// Types
interface DailyRevenue {
  day: string;
  revenue: number;
}

interface CityRevenue {
  city: string;
  revenue: number;
}

interface AdminStats {
  totalGymOwners: number;
  totalUsers: number;
  totalGyms: number;
  pendingGymOwners: number;
}

const DashboardAdmin: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalGymOwners: 61,
    totalUsers: 22,
    totalGyms: 62,
    pendingGymOwners: 0,
  });

  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
  const [cityRevenue, setCityRevenue] = useState<CityRevenue[]>([]);
  const [activeModal, setActiveModal] = useState<
    "users" | "gyms" | "pending" | null
  >(null);

  useEffect(() => {
    setDailyRevenue([
      { day: "Sunday", revenue: 1200 },
      { day: "Monday", revenue: 1500 },
      { day: "Tuesday", revenue: 2000 },
      { day: "Wednesday", revenue: 1600 },
      { day: "Thursday", revenue: 1800 },
      { day: "Friday", revenue: 2100 },
      { day: "Saturday", revenue: 1900 },
    ]);

    setCityRevenue([
      { city: "City 1", revenue: 35 },
      { city: "City 2", revenue: 45 },
      { city: "City 3", revenue: 30 },
      { city: "City 4", revenue: 50 },
      { city: "City 5", revenue: 25 },
      { city: "City 6", revenue: 40 },
      { city: "City 7", revenue: 35 },
    ]);
  }, []);

  const COLORS = {
    gymOwners: "#E25B4B",
    users: "#A2E1C8",
    gyms: "#4B9BD7",
    pendingOwners: "#FFA500",
  };

  const gymOwnerData = [
    { name: "Gym Owners", value: stats.totalGymOwners },
    { name: "Empty", value: 100 - stats.totalGymOwners },
  ];
  const userData = [
    { name: "Users", value: stats.totalUsers },
    { name: "Empty", value: 100 - stats.totalUsers },
  ];
  const gymData = [
    { name: "Gyms", value: stats.totalGyms },
    { name: "Empty", value: 100 - stats.totalGyms },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>
        Admin Dashboard
      </h1>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="General statistics">
            <Row justify="space-around">
              {[gymOwnerData, userData, gymData].map((data, i) => (
                <Col span={8} key={i} style={{ textAlign: "center" }}>
                  <ResponsiveContainer width="100%" height={80}>
                    <PieChart>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={35}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                      >
                        <Cell fill={Object.values(COLORS)[i]} />
                        <Cell fill="#F3F3F3" />
                      </Pie>
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: 14, fontWeight: 600 }}
                      >
                        {data[0].value}
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    {["Total Gym Owners", "Total Users", "Total Gyms"][i]}
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Revenues">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <RechartsTooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4B9BD7"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Quick Actions">
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <Button
                  block
                  type="primary"
                  onClick={() => setActiveModal("users")}
                >
                  Manage Users
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  block
                  type="primary"
                  onClick={() => setActiveModal("gyms")}
                >
                  Manage Gyms
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  block
                  type="primary"
                  onClick={() => setActiveModal("pending")}
                >
                  Review Pending
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Revenue by City">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={cityRevenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="city" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="revenue" fill="#F0AD4E" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Modal
        title={
          activeModal === "users"
            ? "Manage Users"
            : activeModal === "gyms"
            ? "Manage Gyms"
            : activeModal === "pending"
            ? "Pending Gym Owners"
            : ""
        }
        open={!!activeModal}
        onCancel={() => setActiveModal(null)}
        footer={null}
        width={700}
      >
        {activeModal === "users" && <UserListModalContent />}
        {activeModal === "gyms" && <GymListModalContent />}
        {activeModal === "pending" && <UserListModalContent />}{" "}
        {/* Change it to new component */}
      </Modal>
    </div>
  );
};

export default DashboardAdmin;
