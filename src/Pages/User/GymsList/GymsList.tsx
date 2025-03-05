import React, { useEffect, useState } from "react";
import { getGyms } from "../../../api/gyms";
import GymCard from "../../../components/GymCard/GymCard";
import { Button, Pagination, Spin, Alert } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import "./GymsList.less";

const GymsList: React.FC = () => {
  const [gyms, setGyms] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const gymsPerPage = 6;

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const fetchedGyms = await getGyms();
        setGyms(fetchedGyms);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load gyms.");
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, []);

  if (loading) return <Spin size="large" className="loading-spinner" />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;

  const indexOfLastGym = currentPage * gymsPerPage;
  const indexOfFirstGym = indexOfLastGym - gymsPerPage;
  const currentGyms = gyms.slice(indexOfFirstGym, indexOfLastGym);

  return (
    <div className="gyms-container">
      <div className="header">
        <div className="profile">👤 Hello, Ron Cohen!</div>
        <div className="actions">
          <Button>Filter</Button>
          <Button>Recommend</Button>
          <SettingOutlined className="settings-icon" />
        </div>
      </div>

      <div className="gyms-list">
        {currentGyms.map((gym) => (
          <GymCard
            key={gym._id}
            gymName={gym.name}
            city={gym.city}
            rating={gym.rating || 4.5}
            reviews={gym.reviews || 12}
            pricing={{ "1 day": "$5", "3 days": "$10", "5 days": "$14", "7 days": "$18" }}
            images={gym.pictures || ["/default-gym.jpg"]}
          />
        ))}
      </div>

      <Pagination
        current={currentPage}
        total={gyms.length}
        pageSize={gymsPerPage}
        onChange={(page) => setCurrentPage(page)}
        className="pagination"
      />
    </div>
  );
};

export default GymsList;
