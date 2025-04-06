import React, { useState, useEffect } from "react";
import "./Dashboard.less";
import { PlusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { Modal, Input, Button, notification, Tooltip } from "antd";
import { useUserProfile } from "../../context/useUserProfile";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import {
  getGymsByOwner,
  addGym,
  updateGymById,
  deleteGymById,
} from "../../api/gym-owner";
import { getGymReviews } from "../../api/reviews";
import GymBox from "../../components/GymBox/GymBox";
import { io, Socket } from "socket.io-client";
import { IGymOwnerStatus } from "../../constants/enum/IGymOwnerStatus";

const CHAT_SERVER_URL = "http://localhost:3002";
const PATH = "/users-chat";

const socket: Socket = io(CHAT_SERVER_URL, {
  path: PATH,
  transports: ["websocket", "polling"],
});

const Dashboard: React.FC = () => {
  const { userProfile } = useUserProfile();
  const [gyms, setGyms] = useState<any | null>(null);
  const [loadingGyms, setLoadingGyms] = useState(true);
  const [gymsError, setGymsError] = useState(null);
  const [isAddGymModalVisible, setIsAddGymModalVisible] = useState(false);
  const [isEditGymModalVisible, setIsEditGymModalVisible] = useState(false);
  const [gymData, setGymData] = useState({
    name: "",
    city: "",
    description: "",
    prices: [0, 0, 0],
  });
  const [gymImages, setGymImages] = useState<any[]>([]);
  const [selectedGym, setSelectedGym] = useState<any>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (userProfile?.id) {
          const gyms = await getGymsByOwner(userProfile.id);
          setGyms(gyms);
          let totalRating = 0;
          let totalReviews = 0;

          for (const gym of gyms) {
            const reviews = await getGymReviews(gym._id);
            if (reviews.length > 0) {
              const sum = reviews.reduce(
                (acc, review) => acc + review.rating,
                0
              );
              totalRating += sum;
              totalReviews += reviews.length;
            }
          }

          if (totalReviews > 0) {
            setAverageRating(Number((totalRating / totalReviews).toFixed(2)));
          } else {
            setAverageRating(null);
          }
        }
      } catch (error: any) {
        setGymsError(
          error.response?.data?.message || "Failed to load gyms data"
        );
      } finally {
        setLoadingGyms(false);
      }
    };

    fetchProfile();
  }, [userProfile]);

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
    setGymImages(
      gymImages.filter((_, currentIndex) => currentIndex !== imageIndexToDelete)
    );
  };

  const handleOpenAddGymModal = () => setIsAddGymModalVisible(true);

  const handleCloseAddGymModal = () => {
    setIsAddGymModalVisible(false);
    setGymData({ name: "", city: "", description: "", prices: ["", "", ""] });
    setGymImages([]);
  };

  const handleOpenEditGymModal = (gym: any) => {
    setSelectedGym(gym);
    setGymData({
      name: gym.name,
      city: gym.city,
      description: gym.description,
      prices: gym.prices || ["", "", ""],
    });
    setGymImages(gym.pictures);
    setIsEditGymModalVisible(true);
  };

  const handleCloseEditGymModal = () => {
    setIsEditGymModalVisible(false);
    setSelectedGym(null);
    setGymData({ name: "", city: "", description: "", prices: ["", "", ""] });
    setGymImages([]);
  };

  const handleGymDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setGymData({ ...gymData, [e.target.name]: e.target.value });
  };

  const handleSaveGym = async () => {
    const formData = new FormData();

    if (gymData.prices.some((price) => price === "" || isNaN(Number(price)))) {
      notification.warning({
        message: "Invalid Prices",
        description: "Please fill in all price levels with valid numbers.",
        placement: "top",
      });
      return;
    }

    formData.append("name", gymData.name);
    formData.append("city", gymData.city);
    formData.append("description", gymData.description);

    gymImages.forEach((image) => {
      formData.append("pictures", image);
    });

    formData.append("prices", JSON.stringify(gymData.prices.map(Number)));

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

    if (gymData.prices.some((price) => price === "" || isNaN(Number(price)))) {
      notification.warning({
        message: "Invalid Prices",
        description: "Please fill in all price levels with valid numbers.",
        placement: "top",
      });
      return;
    }

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

    formData.append("prices", JSON.stringify(gymData.prices.map(Number)));

    try {
      if (!selectedGym) {
        throw new Error("No gym selected for update");
      }

      const updatedGym = await updateGymById(formData, selectedGym._id);

      if (selectedGym.name !== gymData.name) {
        socket.emit(
          "update_gym_name",
          userProfile?.id,
          selectedGym.name,
          gymData.name,
          (response: any) => {
            if (!response.success) {
              notification.warning({
                message: "No Chats Found",
                description: response.message,
                placement: "top",
              });
            }
          }
        );
      }

      setGyms((prevGyms: any) =>
        prevGyms.map((gym: any) =>
          gym._id === selectedGym._id ? updatedGym : gym
        )
      );

      handleCloseEditGymModal();
    } catch (error) {
      console.error("Error updating gym:", error);
    }
  };

  const handleGymEdit = (gym: any) => handleOpenEditGymModal(gym);

  const handleGymDelete = async (gymId: string) => {
    try {
      await deleteGymById(gymId);
      setGyms((prevGyms: any) =>
        prevGyms.filter((gym: any) => gym._id !== gymId)
      );
    } catch (error) {
      console.error("Error deleting gym:", error);
      notification.error({
        message: "Deletion Failed",
        description: "Could not delete the gym. Please try again.",
        placement: "top",
      });
    }
  };

  return (
    <div className="container-fluid">
      {loadingGyms && <LoadingOverlay />}
      <div className="row">
        {/* Main Content */}
        <main className="col bg-white p-3">
          <h1>Overview</h1>
          {averageRating !== null && (
            <p style={{ fontSize: "16px", fontWeight: "bold" }}>
              Average Review Rating: {averageRating}
            </p>
          )}
          <p className="my-gyms-text">My Gyms ({gyms?.length})</p>
          <Tooltip
            title={
              userProfile?.gymOwnerStatus !== IGymOwnerStatus.APPROVED
                ? `Your status is ${userProfile?.gymOwnerStatus}`
                : null
            }
            placement="bottom"
            color="red"
          >
            <PlusCircleOutlined
              className={`plus-icon ${
                userProfile?.gymOwnerStatus !== IGymOwnerStatus.APPROVED
                  ? "disabled"
                  : ""
              }`}
              onClick={
                userProfile?.gymOwnerStatus === IGymOwnerStatus.APPROVED
                  ? handleOpenAddGymModal
                  : undefined
              }
            />
          </Tooltip>
          <div className="my-gyms-header">
            {gymsError ? (
              <p style={{ color: "red" }}>{gymsError}</p>
            ) : (
              gyms?.map((gym: any) => (
                <GymBox
                  key={gym._id + gym.name}
                  gymName={gym.name}
                  city={gym.city}
                  ownerId={gym.owner}
                  prices={gym.prices}
                  onEdit={() => handleGymEdit(gym)}
                  onDelete={() => handleGymDelete(gym._id)}
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
            <Input
              name="name"
              placeholder="Name"
              value={gymData.name}
              onChange={handleGymDataChange}
              className="modal-input"
            />
            <Input
              name="city"
              placeholder="City"
              value={gymData.city}
              onChange={handleGymDataChange}
              className="modal-input"
            />
            <Input.TextArea
              name="description"
              placeholder="Description"
              value={gymData.description}
              onChange={handleGymDataChange}
              className="modal-input"
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
            <p>Set Gym Prices (3 Pricing Programs):</p>
            <Input
              type="number"
              placeholder="Price for 1 day"
              value={gymData.prices[0]}
              onChange={(e) =>
                setGymData((prev) => ({
                  ...prev,
                  prices: [e.target.value, prev.prices[1], prev.prices[2]],
                }))
              }
              style={{ marginBottom: "10px" }}
            />
            <Input
              type="number"
              placeholder="Price for 3 days"
              value={gymData.prices[1]}
              onChange={(e) =>
                setGymData((prev) => ({
                  ...prev,
                  prices: [prev.prices[0], e.target.value, prev.prices[2]],
                }))
              }
              style={{ marginBottom: "10px" }}
            />
            <Input
              type="number"
              placeholder="Price for 5 days"
              value={gymData.prices[2]}
              onChange={(e) =>
                setGymData((prev) => ({
                  ...prev,
                  prices: [prev.prices[0], prev.prices[1], e.target.value],
                }))
              }
              style={{ marginBottom: "10px" }}
            />
          </div>

          {/* Right Side - Image Upload */}
          <div className="modal-image-upload" style={{ flex: 1 }}>
            <p>Upload Gym Images (Max: 5)</p>

            <label className="custom-file-upload">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={gymImages.length >= 5}
                style={{ display: "none" }}
              />
              <UploadOutlined style={{ fontSize: 24, cursor: "pointer" }} />
            </label>

            <div className="image-preview-container">
              {gymImages.map((image, index) => (
                <div key={index} className="image-preview">
                  {/* Check if the image is a File object or a URL */}
                  <img
                    src={
                      typeof image === "string"
                        ? image
                        : URL.createObjectURL(image)
                    }
                    alt={`Gym Image ${index}`}
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="remove-image-btn"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="modal-actions"
          style={{ marginTop: "20px", textAlign: "right" }}
        >
          <Button type="primary" onClick={handleSaveGym} className="save-btn">
            Save
          </Button>
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
            <Input
              name="name"
              placeholder="Name"
              value={gymData.name}
              onChange={handleGymDataChange}
              className="modal-input"
            />
            <Input
              name="city"
              placeholder="City"
              value={gymData.city}
              onChange={handleGymDataChange}
              className="modal-input"
            />
            <Input.TextArea
              name="description"
              placeholder="Description"
              value={gymData.description}
              onChange={handleGymDataChange}
              className="modal-input"
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
            <p>Set Gym Prices (3 Pricing Programs):</p>
            <Input
              type="number"
              placeholder="Price for 1 day"
              value={gymData.prices[0]}
              onChange={(e) =>
                setGymData((prev) => ({
                  ...prev,
                  prices: [e.target.value, prev.prices[1], prev.prices[2]],
                }))
              }
              style={{ marginBottom: "10px" }}
            />
            <Input
              type="number"
              placeholder="Price for 3 days"
              value={gymData.prices[1]}
              onChange={(e) =>
                setGymData((prev) => ({
                  ...prev,
                  prices: [prev.prices[0], e.target.value, prev.prices[2]],
                }))
              }
              style={{ marginBottom: "10px" }}
            />
            <Input
              type="number"
              placeholder="Price for 5 days"
              value={gymData.prices[2]}
              onChange={(e) =>
                setGymData((prev) => ({
                  ...prev,
                  prices: [prev.prices[0], prev.prices[1], e.target.value],
                }))
              }
              style={{ marginBottom: "10px" }}
            />
          </div>

          {/* Right Side - Image Upload */}
          <div className="modal-image-upload" style={{ flex: 1 }}>
            <p>Upload Gym Images (Max: 5)</p>

            <label className="custom-file-upload">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={gymImages.length >= 5}
                style={{ display: "none" }}
              />
              <UploadOutlined style={{ fontSize: 24, cursor: "pointer" }} />
            </label>

            <div className="image-preview-container">
              {gymImages.map((image, index) => (
                <div key={index} className="image-preview">
                  {/* Check if the image is a File object or a URL */}
                  <img
                    src={
                      typeof image === "string"
                        ? image
                        : URL.createObjectURL(image)
                    }
                    alt={`Gym Image ${index}`}
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="remove-image-btn"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="modal-actions"
          style={{ marginTop: "20px", textAlign: "right" }}
        >
          <Button type="primary" onClick={handleUpdateGym} className="save-btn">
            Save Changes
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
