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
} from "recharts";
import UserListModalContent from "../../../components/AdminModalContents/UserListModalContent/UserListModalContent";
import GymListModalContent from "../../../components/AdminModalContents/GymListModalContent/GymListModalContent";
import StatisticsCard from "../../../components/AdminModalContents/StatisticsCard/StatisticsCard";
import { fetchDashboardCounts } from "../../../api/admin";

interface DailyRevenue {
  day: string;
  revenue: number;
}

interface CityRevenue {
  city: string;
  revenue: number;
}

interface AdminStats {
  userCount: number;
  gymOwnerCount: number;
  adminCount: number;
  gymCount: number;
}

const DashboardAdmin: React.FC = () => {
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

  const [counts, setCounts] = useState<AdminStats>({
    userCount: 0,
    gymOwnerCount: 0,
    adminCount: 0,
    gymCount: 0,
  });

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const data: AdminStats = await fetchDashboardCounts(true);
        setCounts(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadCounts();
  }, []);

  const totalAccounts = counts
    ? counts.userCount + counts.gymOwnerCount + counts.adminCount
    : 0;

  const COLORS = {
    users: "#A2E1C8",
    gymOwners: "#E25B4B",
    gyms: "#4B9BD7",
  };

  const labels = ["Total Users", "Total Gym Owners", "Total Gyms"];

  const dataSets = [
    [
      { name: "Users", value: counts?.userCount },
      { name: "Remaining", value: totalAccounts - counts?.userCount },
    ],
    [
      { name: "Gym Owners", value: counts?.gymOwnerCount },
      { name: "Remaining", value: totalAccounts - counts?.gymOwnerCount },
    ],
    [
      { name: "Gyms", value: counts?.gymCount },
      { name: "Remaining", value: 0 },
    ],
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>
        Admin Dashboard
      </h1>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <StatisticsCard
            dataSets={dataSets}
            colors={[COLORS.gymOwners, COLORS.users, COLORS.gyms]}
            labels={labels}
          />
        </Col>

        <Col span={12}>
          <Card title="Quick Actions" style={{ height: "100%" }}>
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
          <Card title="Revenues" style={{ height: "100%" }}>
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
          <Card title="Revenue by City" style={{ height: "100%" }}>
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
        {/* Need to change "pending" to the new component */}
      </Modal>
    </div>
  );
};

export default DashboardAdmin;
