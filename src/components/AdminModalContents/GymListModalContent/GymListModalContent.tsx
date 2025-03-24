import React, { useEffect, useState } from "react";
import { Input, Spin, Pagination, Tooltip, Button, message, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { filterGyms, getAllGymsForAdmin } from "../../../api/gyms";
import { deleteGymById } from "../../../api/gym-owner";

interface GymData {
  _id: string;
  name: string;
  city: string;
  amountOfReviews: number;
  owner: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const GymListModalContent: React.FC = () => {
  const [gyms, setGyms] = useState<GymData[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const fetchAllGyms = async () => {
    try {
      setLoading(true);
      const gyms = await getAllGymsForAdmin();
      setGyms(gyms || []);
    } catch (err) {
      console.error(err);
      setGyms([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredGyms = async (query: string) => {
    try {
      setLoading(true);
      const gyms = await filterGyms(query);
      setGyms(gyms || []);
    } catch (err) {
      console.error(err);
      setGyms([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAllGyms();
  }, []);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search.trim()) {
        fetchFilteredGyms(search.trim());
      } else {
        fetchAllGyms();
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const paginated = gyms.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const handleDeleteGym = (gymId: string) => {  
    Modal.confirm({
      title: "Are you sure you want to delete this gym?",
      content: `This action cannot be undone.`,
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "Cancel",
      maskClosable: true,
      onOk: async () => {
        try {
          await deleteGymById(gymId);
          fetchAllGyms();
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  

  return (
    <div>
      {/* Search Input */}
      <Input.Search
        placeholder="Search gyms"
        allowClear
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 16 }}
        loading={loading}
      />

      {/* Loading Spinner */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Gym Rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {paginated?.length > 0 ? (
              paginated.map((gym) => (
                <div
                  key={gym._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid #f0f0f0",
                    padding: "12px 16px",
                    borderRadius: 8,
                  }}
                >
                  <div style={{ flex: 2, fontWeight: 500 }}>{gym.name}</div>
                  <div style={{ flex: 1 }}>{gym.city}</div>
                  <div style={{ flex: 1 }}>{gym.amountOfReviews}</div>
                  <div style={{ flex: 2 }}>
                    {gym.owner
                      ? `${gym.owner.firstName} ${gym.owner.lastName}`
                      : "Unknown"}
                  </div>
                  <Tooltip title="Delete gym">
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => handleDeleteGym(gym._id)}
                      />
                  </Tooltip>
                </div>
              ))
            ) : (
              <div style={{ padding: 24, textAlign: "center", color: "#999" }}>
                No gyms found.
              </div>
            )}
          </div>

          {/* Pagination */}
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Pagination
              current={currentPage}
              total={gyms.length}
              pageSize={pageSize}
              onChange={(page) => setCurrentPage(page)}
              size="small"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default GymListModalContent;
