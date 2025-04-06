import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Pagination, Avatar, Spin } from "antd";
import { ArrowLeftOutlined, FileOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getGymOwnersStatus, updateGymOwnerStatus } from "../../../api/admin";

interface GymOwners {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  gymOwnerLicenseImage: string;
  gymOwnerStatus: string;
  avatarUrl?: string;
}

const PendingListModalContent: React.FC = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [gymOwners, setGymOwners] = useState<GymOwners[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const isFirstRender = useRef(true);
  const pageSize = 5;
  const navigate = useNavigate();

  const fetchAllGymOwners = async () => {
    console.log("Fetch all gym owners...");
    try {
      setLoading(true);
      const gymOwners = await getGymOwnersStatus();
      setGymOwners(gymOwners || []);
    } catch (err) {
      setGymOwners([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredGymOwners = async (query: string) => {
    try {
      setLoading(true);
      const gymOwners = await getGymOwnersStatus(query);
      setGymOwners(gymOwners || []);
    } catch (err) {
      setGymOwners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllGymOwners();
  }, []);

  const handleGymOwnersFetch = () => {
    if (search.trim()) {
      fetchFilteredGymOwners(search.trim());
    } else {
      fetchAllGymOwners();
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const delayDebounce = setTimeout(() => {
      handleGymOwnersFetch();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const paginated = gymOwners?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleUpdateGymOwnerStatus = async (
    gymOwnerId: string,
    status: string
  ) => {
    try {
      await updateGymOwnerStatus(gymOwnerId, status, true);
      handleGymOwnersFetch();
    } catch (error) {
      console.error(error);
    }
  };

  const buttonStyles = (status: string, active: boolean) => {
    const baseStyle = {
      margin: "0 4px",
      fontWeight: active ? "bold" : "normal",
      borderWidth: active ? 2 : 1,
      borderStyle: "solid",
      backgroundColor: "transparent",
    };
    switch (status) {
      case "approved":
        return {
          ...baseStyle,
          color: "green",
          borderColor: active ? "darkgreen" : "lightgreen",
          ...(active && { backgroundColor: "rgba(0,128,0,0.1)" }),
        };
      case "pending":
        return {
          ...baseStyle,
          color: "blue",
          borderColor: active ? "darkblue" : "lightblue",
          ...(active && { backgroundColor: "rgba(0,0,255,0.1)" }),
        };
      case "declined":
        return {
          ...baseStyle,
          color: "red",
          borderColor: active ? "darkred" : "lightcoral",
          ...(active && { backgroundColor: "rgba(255,0,0,0.1)" }),
        };
      default:
        return baseStyle;
    }
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

      <Input.Search
        placeholder="Search users"
        allowClear
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 16 }}
        loading={loading}
      />

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* User Rows */}
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
              <div style={{ flex: 0.5 }}></div>
              <div style={{ flex: 1 }}>First Name</div>
              <div style={{ flex: 1 }}>Last Name</div>
              <div style={{ flex: 2 }}>Email</div>
              <div style={{ flex: 1 }}>City</div>
              <div style={{ flex: 1 }}>Gym License</div>
              <div style={{ flex: 2 }}>Status</div>
            </div>

            {paginated?.length > 0 ? (
              paginated.map((user) => (
                <div
                  key={user._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid #f0f0f0",
                    padding: "12px 16px",
                    borderRadius: 8,
                  }}
                >
                  <div style={{ flex: 0.5 }}>
                    <Avatar
                      src={user.avatarUrl}
                      size={32}
                      style={{ marginRight: 12 }}
                    >
                      {user.firstName[0]}
                    </Avatar>
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 500 }}>{user.firstName}</span>
                  </div>
                  <div style={{ flex: 1 }}>{user.lastName}</div>
                  <div style={{ flex: 2 }}>{user.email}</div>
                  <div style={{ flex: 1 }}>{user.city}</div>
                  <div style={{ flex: 1 }}>
                    {user.gymOwnerLicenseImage ? (
                      <a
                        href={user.gymOwnerLicenseImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        <FileOutlined style={{ marginRight: 6 }} />
                        License File
                      </a>
                    ) : (
                      <span style={{ color: "#999" }}>No Image</span>
                    )}
                  </div>
                  <div style={{ flex: 2 }}>
                    {["approved", "pending", "declined"].map((status) => (
                      <Button
                        key={status}
                        style={{
                          ...buttonStyles(
                            status,
                            user.gymOwnerStatus === status
                          ),
                          marginBottom: 8,
                        }}
                        onClick={() =>
                          handleUpdateGymOwnerStatus(user._id, status)
                        }
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: 24, textAlign: "center", color: "#999" }}>
                No gym owners found.
              </div>
            )}
          </div>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Pagination
              current={currentPage}
              total={gymOwners?.length}
              pageSize={pageSize}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PendingListModalContent;
