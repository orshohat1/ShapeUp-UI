import React, { useState, useEffect } from "react";
import "./Dashboard.less";
import logo from "../../assets/Logo/shape-up.png";
import dashboard from "../../assets/Logo/Dashboard.png";
import { PlusCircleOutlined, LogoutOutlined, EditOutlined } from "@ant-design/icons";
import { getUserProfile } from "../../api/users";
import { useUserProfile } from "../../context/useUserProfile";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import { getGymsByOwner } from "../../api/gym-owner";

interface DashboardProps {
  children?: React.ReactNode;
}
const Dashboard: React.FC<DashboardProps> = () => {
  const { userProfile, setUserProfile } = useUserProfile();
  const [loadingUserProfile, setLoadingUserProfile] = useState(true);
  const [userProfileError, setUserProfileError] = useState(null);
  const [gyms, setGyms] = useState<any | null>(null);
  const [loadingGyms, setLoadingGyms] = useState(true);
  const [gymsError, setGymsError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUserProfile({
          avatarUrl: data.avatarUrl,
          birthdate: data.birthdate,
          email: data.email,
          favoriteGyms: data.favoriteGyms,
          firstName: data.firstName,
          gender: data.gender,
          lastName: data.lastName,
          role: data.role,
          id: data._id,
          street: data.street,
        });

        try {
          const gyms = await getGymsByOwner(data._id);
          setGyms(gyms);
        } catch (error: any) {
          setGymsError(
            error.response?.data?.message || "Failed to load gyms data"
          );
        } finally {
          setLoadingGyms(false);
        }
      } catch (err: any) {
        setUserProfileError(
          err.response?.data?.message || "Failed to load user data"
        );
      } finally {
        setLoadingUserProfile(false);
      }
    };

    fetchProfile();
  }, []);

  if (userProfileError)
    return <p style={{ color: "red" }}>{userProfileError}</p>;

  return (
    <div className="container-fluid">
      {(loadingUserProfile || loadingGyms) && <LoadingOverlay />}

      <div className="row">
        {/* Sidebar */}
        <aside className="col-auto align-items-center justify-content-center sidebar">
          <div>
            <img src={logo} className="logo" />
            <img src={dashboard} className="dashboard" />
          </div>
          <div className="aside-bottom-container">
            <div className="divider"></div>
            <div className="user-info">
              <img
                src={userProfile?.avatarUrl}
                alt="avatar"
                className="user-avatar"
              />
              <span className="user-name">
                {userProfile?.firstName} {userProfile?.lastName}
              </span>
              <EditOutlined className="edit-icon" />
              <LogoutOutlined className="logout-icon" />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="col bg-white p-3">
          <h1>Overview</h1>
          <div className="my-gyms-header">
            {gymsError ? (
              <p style={{ color: "red" }}>{gymsError}</p>
            ) : (
              <>
                <p className="my-gyms-text">My Gyms</p>
                <p className="my-gyms-count">{gyms?.length}</p>

                {/* // TODO: create component for gym card */}
                {gyms?.map((gym: any) => (
                  <div key={gym._id} className="gym-card">
                    <p>{gym.name}</p>
                    <p>{gym.location}</p>
                  </div>
                ))}
              </>
            )}
            <PlusCircleOutlined className="plus-icon" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
