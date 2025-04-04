import React, { useEffect, useRef, useState } from "react";
import { Input, Spin, Pagination, Tooltip, Button, Modal } from "antd";
import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import { filterGyms, getAllGymsForAdmin } from "../../../api/gyms";
import { deleteGymById } from "../../../api/gym-owner";
import { useNavigate } from "react-router-dom";

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
  const isFirstRender = useRef(true);
  const pageSize = 5;
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchAllGyms();
  }, []);

  const handleGymFetch = () => {
    if (search.trim()) {
      fetchFilteredGyms(search.trim());
    } else {
      fetchAllGyms();
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const delayDebounce = setTimeout(() => {
      handleGymFetch();
    }, 400);

    return () => clearTimeout(delayDebounce);
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
          handleGymFetch();
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/dashboard")}
          style={{ padding: 0 }}
        >
          Back to Dashboard
        </Button>
      </div>

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
            {/* Table Headers */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid #f0f0f0",
                padding: "12px 16px",
                borderRadius: 8,
                backgroundColor: "#e0e0e0",
                fontWeight: "bold",
              }}
            >
              <div style={{ flex: 2 }}>Name</div>
              <div style={{ flex: 2 }}>City</div>
              <div style={{ flex: 1 }}>Reviews</div>
              <div style={{ flex: 2 }}>Owner</div>
              <div style={{ flex: 0.5 }}>Actions</div>
            </div>

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
                  <div style={{ flex: 2 }}>{gym.city}</div>
                  <div style={{ flex: 1 }}>{gym.amountOfReviews}</div>
                  <div style={{ flex: 2 }}>
                    {gym.owner
                      ? `${gym.owner.firstName} ${gym.owner.lastName}`
                      : "Unknown"}
                  </div>
                  <div style={{ flex: 0.5 }}>
                    <Tooltip title="Delete gym">
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDeleteGym(gym._id)}
                      />
                    </Tooltip>
                  </div>
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
            />
          </div>
        </>
      )}
    </div>
  );
};

export default GymListModalContent;
