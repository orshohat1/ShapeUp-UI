import React, { useEffect, useState } from "react";
import { getGyms } from "../../../api/gyms";
import { addFavoriteGym, removeFavoriteGym } from "../../../api/users";
import GymCard from "../../../components/GymCard/GymCard";
import { Button, Pagination, Spin, Alert } from "antd";
import "./GymsList.less";
import { useUserProfile } from "../../../context/useUserProfile";

const GymsList: React.FC = () => {
  const [gyms, setGyms] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const gymsPerPage = 6;
  const { userProfile } = useUserProfile();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedGyms = await getGyms();
        setGyms(fetchedGyms);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load gyms.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userProfile) {
      setUser((prevUser: any) => {
        if (prevUser?.favoriteGyms === userProfile.favoriteGyms) {
          console.log("User profile updated, but favoriteGyms are the same", prevUser);
          return prevUser;
        }

        console.log("User profile updated, updating favoriteGyms", { ...userProfile, favoriteGyms: prevUser?.favoriteGyms || null });
        return { ...userProfile, favoriteGyms: prevUser?.favoriteGyms || null };
      });
    }
  }, [userProfile]);

  if (loading) return <Spin size="large" className="loading-spinner" />;
  if (error)
    return <Alert message="Error" description={error} type="error" showIcon />;

  const indexOfLastGym = currentPage * gymsPerPage;
  const indexOfFirstGym = indexOfLastGym - gymsPerPage;
  const currentGyms = gyms.slice(indexOfFirstGym, indexOfLastGym);

  const toggleFavorite = async (gymId: string) => {
    if (!userProfile) return;

    try {
      if (user.favoriteGyms?.includes(gymId)) {
        await removeFavoriteGym(user._id, gymId);
        setUser({
          ...user,
          favoriteGyms: user.favoriteGyms.filter((id: string) => id !== gymId),
        });
      } else {
        await addFavoriteGym(user._id, gymId);
        setUser({ ...user, favoriteGyms: [...user.favoriteGyms, gymId] });
      }
    } catch (err) {
      console.error("Failed to update favorites", err);
    }
  };

  return (
    <div className="gyms-container">
      <div className="main-content">
        <div className="header">
          <div className="profile">
            {user && <img src={user.avatarUrl} alt="User" />}
            <span>Hello, {user ? user.firstName : "Guest"}!</span>
          </div>
          <div className="actions">
            <Button>Filter</Button>
            <Button>Favorites</Button>
          </div>
        </div>

        <div className="gyms-list">
          {currentGyms.map((gym) => (
            <GymCard
              key={gym._id}
              gymId={gym._id}
              gymName={gym.name}
              city={gym.city}
              rating={gym.rating || "No ratings yet"}
              reviewsCount={gym.reviewsCount || 0}
              images={gym.pictures || ["/default-gym.jpg"]}
              isFavorite={user ? user?.favoriteGyms?.includes(gym._id) : false}
              onToggleFavorite={() => toggleFavorite(gym._id)}
            />
          ))}
        </div>

        <div className="pagination-container">
          <Pagination
            current={currentPage}
            total={gyms.length}
            pageSize={gymsPerPage}
            onChange={(page) => setCurrentPage(page)}
            className="pagination"
          />
        </div>
      </div>
    </div>
  );
};

export default GymsList;
