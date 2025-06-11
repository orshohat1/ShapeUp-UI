import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Space,
} from "antd";
import {
  UserOutlined,
  ShopOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
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
import {
  fetchDashboardCounts,
  getRevenueByCity,
  getRevenueByDate,
} from "../../../api/admin";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

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
  const [counts, setCounts] = useState<AdminStats>({
    userCount: 0,
    gymOwnerCount: 0,
    adminCount: 0,
    gymCount: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRevenues = async () => {
      try {
        const [cityData, dailyData] = await Promise.all([
          getRevenueByCity(),
          getRevenueByDate(),
        ]);

        setCityRevenue(Array.isArray(cityData) ? cityData : []);
        setDailyRevenue(Array.isArray(dailyData) ? dailyData : []);
      } catch (err) {
        console.error("Failed to load revenues", err);
      }
    };

    fetchRevenues();
  }, []);


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

  const totalAccounts =
    counts.userCount + counts.gymOwnerCount + counts.adminCount;

  const COLORS = {
    users: "#A2E1C8",
    gymOwners: "#E25B4B",
    gyms: "#4B9BD7",
  };

  const labels = ["Total Users", "Total Gym Owners", "Total Gyms"];

  const dataSets = [
    [
      { name: "Users", value: counts.userCount },
      { name: "Remaining", value: totalAccounts - counts.userCount },
    ],
    [
      { name: "Gym Owners", value: counts.gymOwnerCount },
      { name: "Remaining", value: totalAccounts - counts.gymOwnerCount },
    ],
    [
      { name: "Gyms", value: counts.gymCount },
      { name: "Remaining", value: 0 },
    ],
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Admin Dashboard
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Platform Overview" bordered={false}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card
                  style={{
                    backgroundColor: "#A2E1C8",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                  }}
                >
                  <Space direction="vertical" align="center">
                    <UserOutlined style={{ fontSize: 32, color: "#fff" }} />
                    <Typography.Text style={{ fontSize: 16, color: "#fff" }}>
                      Users
                    </Typography.Text>
                    <Typography.Text strong style={{ fontSize: 24, color: "#fff" }}>
                      {counts.userCount}
                    </Typography.Text>
                  </Space>
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  style={{
                    backgroundColor: "#E25B4B",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                  }}
                >
                  <Space direction="vertical" align="center">
                    <CheckCircleOutlined style={{ fontSize: 32, color: "#fff" }} />
                    <Typography.Text style={{ fontSize: 16, color: "#fff" }}>
                      Gym Owners
                    </Typography.Text>
                    <Typography.Text strong style={{ fontSize: 24, color: "#fff" }}>
                      {counts.gymOwnerCount}
                    </Typography.Text>
                  </Space>
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  style={{
                    backgroundColor: "#4B9BD7",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                  }}
                >
                  <Space direction="vertical" align="center">
                    <ShopOutlined style={{ fontSize: 32, color: "#fff" }} />
                    <Typography.Text style={{ fontSize: 16, color: "#fff" }}>
                      Gyms
                    </Typography.Text>
                    <Typography.Text strong style={{ fontSize: 24, color: "#fff" }}>
                      {counts.gymCount}
                    </Typography.Text>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Quick Actions" style={{ height: "100%" }} bordered={false}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Button
                  block
                  type="default"
                  icon={<UserOutlined />}
                  style={{
                    height: 48,
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                  onClick={() => navigate("/admin/users")}
                >
                  Manage Users
                </Button>
              </Col>
              <Col xs={24} sm={12}>
                <Button
                  block
                  type="default"
                  icon={<ShopOutlined />}
                  style={{
                    height: 48,
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                  onClick={() => navigate("/admin/gyms")}
                >
                  Manage Gyms
                </Button>
              </Col>
              <Col xs={24} sm={24}>
                <Button
                  block
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  style={{
                    height: 48,
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                  onClick={() => navigate("/admin/pending")}
                >
                  Gym Owners Approval
                </Button>
              </Col>
            </Row>
          </Card>


        </Col>

        <Col xs={24} lg={12}>
          <Card title="Revenue Over Time" bordered={false}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip
                  formatter={(value: number) => [`${value.toFixed(2)}$`, "Revenue"]}
                />

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

        <Col xs={24} lg={12}>
          <Card title="Revenue by City" bordered={false}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[...cityRevenue].sort((a, b) => (a.city > b.city ? 1 : -1))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="city" tick={false} axisLine={false} />
                <YAxis />
                <RechartsTooltip
                  formatter={(value: number) => [`${value.toFixed(2)}$`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#F0AD4E" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

        </Col>
      </Row>
    </div>
  );
};

export default DashboardAdmin;
