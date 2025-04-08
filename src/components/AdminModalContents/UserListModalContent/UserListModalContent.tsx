import React, { useEffect, useRef, useState } from "react";
import "./UserListModalContent.less";
import { Button, Input, Pagination, Tooltip, Avatar, Spin, Modal } from "antd";
import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import { deleteUserById, filterUsers, getAllUsers } from "../../../api/users";
import { useNavigate } from "react-router-dom";

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  role: string;
  avatarUrl?: string;
}

const UserListModalContent: React.FC = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const isFirstRender = useRef(true);
  const pageSize = 5;
  const navigate = useNavigate();

  const fetchAllUsers = async () => {
    console.log("Fetch all users...");
    try {
      setLoading(true);
      const users = await getAllUsers();
      setUsers(users || []);
    } catch (err) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredUsers = async (query: string) => {
    try {
      setLoading(true);
      const users = await filterUsers(query);
      setUsers(users || []);
    } catch (err) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const delayDebounce = setTimeout(() => {
      handleUserFetch();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const paginated = users?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleUserFetch = () => {
    if (search.trim()) {
      fetchFilteredUsers(search.trim());
    } else {
      fetchAllUsers();
    }
  };

  const handleDeleteUser = (userId: string, userRole: string) => {
    const extraWarning =
      userRole === "gym_owner"
        ? " This will also delete all gyms exists under this owner's account."
        : "";

    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: `This action cannot be undone.${extraWarning}`,
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "Cancel",
      maskClosable: true,
      onOk: async () => {
        try {
          await deleteUserById(userId);
          handleUserFetch();
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
              <div style={{ flex: 1 }}>Role</div>
              <div style={{ flex: 0.5 }}>Actions</div>
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
                  <div className="ellipsis" style={{ flex: 1 }}>
                    <span style={{ fontWeight: 500 }}>{user.firstName}</span>
                  </div>
                  <div className="ellipsis" style={{ flex: 1 }}>
                    {user.lastName}
                  </div>
                  <div className="ellipsis" style={{ flex: 2 }}>
                    {user.email}
                  </div>
                  <div className="ellipsis" style={{ flex: 1 }}>
                    {user.city}
                  </div>
                  <div
                    className="ellipsis"
                    style={{ flex: 1, textTransform: "capitalize" }}
                  >
                    {user.role.replace(/_/g, " ")}
                  </div>
                  <div style={{ flex: 0.5 }}>
                    {user.role !== "admin" && (
                      <Tooltip title="Delete user">
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          danger
                          onClick={() => handleDeleteUser(user._id, user.role)}
                        />
                      </Tooltip>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: 24, textAlign: "center", color: "#999" }}>
                No users found.
              </div>
            )}
          </div>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Pagination
              current={currentPage}
              total={users?.length}
              pageSize={pageSize}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default UserListModalContent;
