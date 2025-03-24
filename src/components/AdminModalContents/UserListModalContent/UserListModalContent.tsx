import React, { useEffect, useState } from "react";
import { Button, Input, Pagination, Tooltip, Avatar, Spin, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteUserById, filterUsers, getAllUsers } from "../../../api/users";

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
  const pageSize = 5;

  const fetchAllUsers = async () => {
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
    const delayDebounce = setTimeout(() => {
      if (search.trim()) {
        fetchFilteredUsers(search.trim());
      } else {
        fetchAllUsers();
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const paginated = users?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
          fetchAllUsers();
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  return (
    <div>
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
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                  <div
                    style={{ display: "flex", alignItems: "center", flex: 2 }}
                  >
                    <Avatar
                      src={user.avatarUrl}
                      size={32}
                      style={{ marginRight: 12 }}
                    >
                      {user.firstName[0]}
                    </Avatar>
                    <span style={{ fontWeight: 500 }}>{user.firstName}</span>
                  </div>
                  <div style={{ flex: 1 }}>{user.lastName}</div>
                  <div style={{ flex: 2 }}>{user.email}</div>
                  <div style={{ flex: 1 }}>{user.city}</div>
                  <div style={{ flex: 1, textTransform: "capitalize" }}>
                    {user.role}
                  </div>
                  <Tooltip title="Delete user">
                    {user.role !== "admin" && (
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDeleteUser(user._id, user.role)}
                      />
                    )}
                  </Tooltip>
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
              size="small"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default UserListModalContent;
