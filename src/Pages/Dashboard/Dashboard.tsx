import React, { useState, useEffect } from "react";
import "./Dashboard.less";
import logo from "../../assets/Logo/shape-up.png";
import dashboard from "../../assets/Logo/Dashboard.png";
import { PlusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { Modal, Input, Button, notification } from "antd";
import { getUserProfile } from "../../api/users";
import { useUserProfile } from "../../context/useUserProfile";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import { getGymsByOwner } from "../../api/gym-owner";

const Dashboard: React.FC = () => {
  const { userProfile, setUserProfile } = useUserProfile();
  const [loadingUserProfile, setLoadingUserProfile] = useState(true);
  const [userProfileError, setUserProfileError] = useState(null);
  const [gyms, setGyms] = useState<any | null>(null);
  const [loadingGyms, setLoadingGyms] = useState(true);
  const [gymsError, setGymsError] = useState(null);
  const [isAddGymModalVisible, setIsAddGymModalVisible] = useState(false);
  const [gymData, setGymData] = useState({ name: "", city: "", description: "" });
  const [gymImages, setGymImages] = useState<File[]>([]);


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
          setGymsError(error.response?.data?.message || "Failed to load gyms data");
        } finally {
          setLoadingGyms(false);
        }
      } catch (err: any) {
        setUserProfileError(err.response?.data?.message || "Failed to load user data");
      } finally {
        setLoadingUserProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      if (gymImages.length + filesArray.length > 5) {
        notification.warning({
          message: "Image Upload Limit",
          description: "You can upload up to 5 images only.",
          placement: "top",
          duration: 3,
        });
        return;
      }
      setGymImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const handleRemoveImage = (imageIndexToDelete: number) => {
    setGymImages(gymImages.filter((_, currentIndex) => currentIndex !== imageIndexToDelete));
  };

  const handleOpenAddGymModal = () => setIsAddGymModalVisible(true);

  const handleCloseAddGymModal = () => {
    setIsAddGymModalVisible(false);
    setGymData({ name: "", city: "", description: "" });
    setGymImages([]);
  };

  const handleGymDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setGymData({ ...gymData, [e.target.name]: e.target.value });
  };

  const handleSaveGym = () => {
    console.log("Saving gym:", gymData);
    handleCloseAddGymModal();
  };

  if (userProfileError) return <p style={{ color: "red" }}>{userProfileError}</p>;

  return (
    <div className="container-fluid">
      {(loadingUserProfile || loadingGyms) && <LoadingOverlay />}
      <div className="row">
        {/* Sidebar */}
        <aside className="col-auto align-items-center justify-content-center sidebar">
          <div>
            <img src={logo} className="logo" alt="ShapeUp Logo" />
            <img src={dashboard} className="dashboard" alt="Dashboard" />
          </div>
          <div className="aside-bottom-container">
            <div className="divider"></div>
            <div className="user-info">
              <img src={userProfile?.avatarUrl} alt="avatar" className="user-avatar" />
              <span className="user-name">{userProfile?.firstName} {userProfile?.lastName}</span>

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
                <p className="my-gyms-text">My Gyms ({gyms?.length})</p>
                {gyms?.map((gym: any) => (
                  <div key={gym._id} className="gym-card">
                    <p>{gym.name}</p>
                    <p>{gym.location}</p>
                  </div>
                ))}
              </>
            )}
            <PlusCircleOutlined className="plus-icon" onClick={handleOpenAddGymModal} />
          </div>
        </main>
      </div>

      {/* Add Gym Modal */}
      <Modal
        title="Add Gym"
        open={isAddGymModalVisible}
        onCancel={handleCloseAddGymModal}
        footer={null}
        width={850}
      >
        <div style={{ display: "flex", gap: "20px" }}>
          {/* Left Side - Gym Inputs */}
          <div style={{ flex: "0 0 300px" }}>
            <Input name="name" placeholder="Name" value={gymData.name} onChange={handleGymDataChange} className="modal-input" />
            <Input name="city" placeholder="City" value={gymData.city} onChange={handleGymDataChange} className="modal-input" />
            <Input.TextArea name="description" placeholder="Description" value={gymData.description} onChange={handleGymDataChange} className="modal-input" autoSize={{ minRows: 3, maxRows: 6 }} />
          </div>

          {/* Right Side - Image Upload */}
          <div className="modal-image-upload" style={{ flex: 1 }}>
            <p>Upload Gym Images (Max: 5)</p>

            <label className="custom-file-upload">
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={gymImages.length >= 5} style={{ display: "none" }} />
              <UploadOutlined style={{ fontSize: 24, cursor: "pointer" }} />
            </label>

            <div className="image-preview-container">
              {gymImages.map((image, index) => (
                <div key={index} className="image-preview">
                  <img src={URL.createObjectURL(image)} alt={`Gym Image ${index}`} />
                  <button onClick={() => handleRemoveImage(index)} className="remove-image-btn">✖</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-actions" style={{ marginTop: "20px", textAlign: "right" }}>
          <Button type="primary" onClick={handleSaveGym} className="save-btn">Save</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
