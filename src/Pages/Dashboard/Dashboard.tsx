import React, { useState, useEffect } from "react";
import "./Dashboard.less";
import logo from "../../assets/Logo/shape-up.png";
import dashboard from "../../assets/Logo/Dashboard.png";
import { PlusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { Modal, Input, Button, notification } from "antd";
import { getUserProfile } from "../../api/users";
import { useUserProfile } from "../../context/useUserProfile";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import { getGymsByOwner, addGym, updateGymById } from "../../api/gym-owner";
import GymBox from '../../components/GymBox/GymBox';

const Dashboard: React.FC = () => {
  const { userProfile, setUserProfile } = useUserProfile();
  const [loadingUserProfile, setLoadingUserProfile] = useState(true);
  const [userProfileError, setUserProfileError] = useState(null);
  const [gyms, setGyms] = useState<any | null>(null);
  const [loadingGyms, setLoadingGyms] = useState(true);
  const [gymsError, setGymsError] = useState(null);
  const [isAddGymModalVisible, setIsAddGymModalVisible] = useState(false);
  const [isEditGymModalVisible, setIsEditGymModalVisible] = useState(false);
  const [gymData, setGymData] = useState({ name: "", city: "", description: "" });
  const [gymImages, setGymImages] = useState<any[]>([]);
  const [selectedGym, setSelectedGym] = useState<any>(null);

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

  const handleOpenEditGymModal = (gym: any) => {
    setSelectedGym(gym);
    setGymData({ name: gym.name, city: gym.city, description: gym.description });
    setGymImages(gym.pictures);
    setIsEditGymModalVisible(true);
  };

  const handleCloseEditGymModal = () => {
    setIsEditGymModalVisible(false);
    setSelectedGym(null);
    setGymData({ name: "", city: "", description: "" });
    setGymImages([]);
  };

  const handleGymDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setGymData({ ...gymData, [e.target.name]: e.target.value });
  };

  const handleSaveGym = async () => {
    const formData = new FormData();

    formData.append("name", gymData.name);
    formData.append("city", gymData.city);
    formData.append("description", gymData.description);

    gymImages.forEach((image) => {
      formData.append("pictures", image);
    });

    try {
      if (!userProfile) {
        throw new Error("User profile not found");
      }
      const newGym = await addGym(formData, userProfile.id);

      // it updates gyms list on the screen without re-fetching
      setGyms((prevGyms: any) => [...prevGyms, newGym]);

      handleCloseAddGymModal();
    } catch (error) {
      console.error("Error saving gym:", error);
    }
  };

  const handleUpdateGym = async () => {
    const formData = new FormData();

    formData.append("name", gymData.name);
    formData.append("city", gymData.city);
    formData.append("description", gymData.description);

    if (gymImages.length === 0) {
      notification.warning({
        message: "Image Upload Minimum",
        description: "At least one picture is required",
        placement: "top",
        duration: 3,
      });
      handleCloseEditGymModal();
      return;
    }

    gymImages.forEach((image) => {
      formData.append("pictures[]", image);
    });

    try {
      if (!selectedGym) {
        throw new Error("No gym selected for update");
      }

      const updatedGym = await updateGymById(formData, selectedGym._id);

      setGyms((prevGyms: any) =>
        prevGyms.map((gym: any) => (gym._id === selectedGym._id ? updatedGym : gym))
      );

      handleCloseEditGymModal();
    } catch (error) {
      console.error("Error updating gym:", error);
    }
  };

  const handleGymEdit = (gym: any) => handleOpenEditGymModal(gym);

  const handleGymDelete = () => {
    console.log('Delete clicked');
  };

  const handleGymUpdatePrices = () => {
    console.log('Update Prices clicked');
  };

  const handleGymGeneratePricingSuggestions = () => {
    console.log('Generate Pricing Suggestions clicked');
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
          <p className="my-gyms-text">My Gyms ({gyms?.length})</p>
          <PlusCircleOutlined className="plus-icon" onClick={handleOpenAddGymModal} />
          <div className="my-gyms-header">
            {gymsError ? (
              <p style={{ color: "red" }}>{gymsError}</p>
            ) : (
              gyms?.map((gym: any) => (
                <GymBox
                  key={gym._id}
                  gymName={gym.name}
                  city={gym.city}
                  onEdit={() => handleGymEdit(gym)}
                  onDelete={handleGymDelete}
                  onUpdatePrices={handleGymUpdatePrices}
                  onGeneratePricingSuggestions={handleGymGeneratePricingSuggestions}
                />
              ))
            )}
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
                  {/* Check if the image is a File object or a URL */}
                  <img
                    src={typeof image === "string" ? image : URL.createObjectURL(image)}
                    alt={`Gym Image ${index}`}
                  />
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

      {/* Edit Gym Modal */}
      <Modal
        title="Edit Gym"
        open={isEditGymModalVisible}
        onCancel={handleCloseEditGymModal}
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
                  {/* Check if the image is a File object or a URL */}
                  <img
                    src={typeof image === "string" ? image : URL.createObjectURL(image)}
                    alt={`Gym Image ${index}`}
                  />
                  <button onClick={() => handleRemoveImage(index)} className="remove-image-btn">✖</button>
                </div>
              ))}
            </div>

          </div>
        </div>

        <div className="modal-actions" style={{ marginTop: "20px", textAlign: "right" }}>
          <Button type="primary" onClick={handleUpdateGym} className="save-btn">Save Changes</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
