import React, { useState, useEffect } from "react";
import "./Dashboard.less";
import { PlusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Modal,
  Input,
  Button,
  notification,
  Tooltip,
  AutoComplete,
} from "antd";
import { useUserProfile } from "../../context/useUserProfile";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import {
  getGymsByOwner,
  addGym,
  deleteGymById,
} from "../../api/gym-owner";
import { getGymReviews } from "../../api/reviews";
import GymBox from "../../components/GymBox/GymBox";
import { io, Socket } from "socket.io-client";
import { IGymOwnerStatus } from "../../constants/enum/IGymOwnerStatus";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);
import axiosInstance from "../../api/axios-instances/axios-instance";

const CHAT_SERVER_URL = import.meta.env.VITE_CHAT_SERVER_URL;
const PATH = "/users-chat";

const socket: Socket = io(CHAT_SERVER_URL, {
  path: PATH,
  transports: ["websocket", "polling"],
});

// CKAN resource IDs
const CITIES_RESOURCE_ID = "d4901968-dad3-4845-a9b0-a57d027f11ab";
const STREETS_RESOURCE_ID = "a7296d1a-f8c9-4b70-96c2-6ebb4352f8e3";

const Dashboard: React.FC = () => {
  const { userProfile } = useUserProfile();
  const [gyms, setGyms] = useState<any[] | null>(null);
  const [gymsWithUnread, setGymsWithUnread] = useState<Record<string, boolean>>(
    {}
  );
  const [loadingGyms, setLoadingGyms] = useState(true);
  const [gymsError, setGymsError] = useState<string | null>(null);
  const [isAddGymModalVisible, setIsAddGymModalVisible] = useState(false);
  const [gymData, setGymData] = useState({
    name: "",
    city: "",
    street: "",
    streetNumber: "",
    description: "",
    prices: [0, 0, 0],
  });
  const [gymImages, setGymImages] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [hebrewCity, setHebrewCity] = useState<string>("");
  const [allCityRecords, setAllCityRecords] = useState<
    { hebrew: string; latin: string }[]
  >([]);
  const [allCities, setAllCities] = useState<string[]>([]);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [allStreets, setAllStreets] = useState<string[]>([]);
  const [streetOptions, setStreetOptions] = useState<string[]>([]);
  const [purchaseStats, setPurchaseStats] = useState<
    { date: string; count: number }[]
  >([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch last 7 days of purchases
  useEffect(() => {
    const fetchPurchaseData = async () => {
      try {
        const res = await axiosInstance.get(
          `${BACKEND_URL}/purchase/getGymOwnerPurchases`,
          {
            withCredentials: true,
          }
        );
        const data = res.data;

        const last7Days = Array.from({ length: 7 }).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          const isoDate = date.toISOString().slice(0, 10); // 'YYYY-MM-DD'
          return isoDate;
        });

        const counts = last7Days.map((date) => {
          const count = data.filteredPurchases.filter(
            (p: any) => p.purchaseDate.slice(0, 10) === date
          ).length;
          return { date, count };
        });

        setPurchaseStats(counts);
      } catch (err) {
        console.error("Failed to fetch purchases:", err);
      }
    };

    fetchPurchaseData();
  }, []);

  // Fetch gyms, unread chats, and calculate average rating
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (userProfile?.id) {
          const gyms = await getGymsByOwner(userProfile.id);
          setGyms(gyms);
          // Check unread messages per gym
          gyms.forEach((gym: any) => {
            socket.emit(
              "get_gym_chats",
              userProfile?.id,
              gym.name,
              (chatUsers: any[]) => {
                let hasUnread = false;

                chatUsers.forEach((user) => {
                  socket.emit(
                    "get_unread_count",
                    userProfile?.id,
                    gym._id,
                    gym.name,
                    (count: number) => {
                      if (count > 0) {
                        hasUnread = true;
                        setGymsWithUnread((prev) => ({
                          ...prev,
                          [gym._id]: true,
                        }));
                      }
                    }
                  );
                });
                if (!hasUnread) {
                  setGymsWithUnread((prev) => ({ ...prev, [gym._id]: false }));
                }
              }
            );
          });
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
        console.error("Error fetching gyms: ", error);
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

  // Fetch all cities (both Hebrew and Latin) once
  useEffect(() => {
    const fetchAllCities = async () => {
      try {
        const res = await fetch(
          `https://data.gov.il/api/3/action/datastore_search?resource_id=${CITIES_RESOURCE_ID}&limit=3200`
        );
        const json: any = await res.json();
        const records = (json.result.records as any[]) || [];
        const cityRecs = records
          .map((r) => ({
            hebrew: r["שם_ישוב"]?.trim(),
            latinRaw: r["שם_ישוב_לועזי"]?.trim(),
          }))
          .filter((r) => r.latinRaw)
          .map((r) => {
            const latin = r.latinRaw
              .replace(/-/g, " ")
              .replace(/\s+/g, " ")
              .split(" ")
              .map(
                (w: any) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
              )
              .join(" ");
            return { hebrew: r.hebrew, latin };
          });

        // Dedupe by latin name
        const cityMap = new Map<string, string>();
        cityRecs.forEach(({ latin, hebrew }) => {
          if (!cityMap.has(latin)) {
            cityMap.set(latin, hebrew);
          }
        });

        const uniqueCityRecs = Array.from(cityMap.entries()).map(
          ([latin, hebrew]) => ({ latin, hebrew })
        );

        setAllCityRecords(uniqueCityRecs);
        setAllCities(uniqueCityRecs.map((c) => c.latin));
      } catch (err) {
        console.error("Failed to load cities:", err);
      }
    };
    fetchAllCities();
  }, []);

  // Fetch streets whenever Hebrew city changes
  useEffect(() => {
    const fetchStreets = async () => {
      if (!hebrewCity) {
        setAllStreets([]);
        setStreetOptions([]);
        return;
      }
      try {
        const params = new URLSearchParams({
          resource_id: STREETS_RESOURCE_ID,
          q: JSON.stringify({ שם_ישוב: hebrewCity }),
          limit: "32000",
        });
        const res = await fetch(
          `https://data.gov.il/api/3/action/datastore_search?${params}`
        );
        const json: any = await res.json();
        const recs = (json.result.records as Array<{ שם_רחוב: string }>) || [];
        const streets = Array.from(
          new Set(recs.map((r) => r["שם_רחוב"].trim()).filter((s) => s))
        ).sort((a, b) => a.localeCompare(b, "he")) as string[];
        setAllStreets(streets);
        setStreetOptions(streets);
      } catch (err) {
        console.error("Failed to fetch streets:", err);
      }
    };
    fetchStreets();
  }, [hebrewCity]);

  // Filter helpers
  const handleCitySearch = (input: string) => {
    if (!input) {
      setCityOptions([]);
      return;
    }
    const filtered = allCities.filter((c) =>
      c
        .replace(/[^a-z]/gi, "")
        .toLowerCase()
        .includes(input.replace(/[^a-z]/gi, "").toLowerCase())
    );

    setCityOptions(filtered.slice(0, 20));
  };
  const handleStreetSearch = (input: string) => {
    if (!input) {
      setStreetOptions([]);
      return;
    }
    const filtered = allStreets.filter((s) =>
      s
        .replace(/[^א-ת]/gi, "")
        .toLowerCase()
        .includes(input.replace(/[^א-ת]/gi, "").toLowerCase())
    );
    setStreetOptions(filtered.slice(0, 20));
  };

  const handleRemoveImage = (imageIndexToDelete: number) => {
    setGymImages(
      gymImages.filter((_, currentIndex) => currentIndex !== imageIndexToDelete)
    );
  };

  const handleOpenAddGymModal = () => setIsAddGymModalVisible(true);

  const handleCloseAddGymModal = () => {
    setIsAddGymModalVisible(false);
    setGymData({
      name: "",
      city: "",
      street: "",
      streetNumber: "",
      description: "",
      prices: [0, 0, 0],
    });
    setGymImages([]);
  };


  const handleGymDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setGymData({ ...gymData, [e.target.name]: e.target.value });
  };

  const handleSaveGym = async () => {
    const formData = new FormData();

    formData.append("name", gymData.name);
    formData.append("city", gymData.city);
    formData.append("street", gymData.street);
    formData.append("streetNumber", gymData.streetNumber);
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
    <div className="container-fluid" style={{ padding: "2rem 5rem" }}>
      {loadingGyms && <LoadingOverlay />}
      <div className="row">
        {/* Main Content */}
        <main className="col bg-white p-3">
          <h1>Overview</h1>

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
              className={`plus-icon ${userProfile?.gymOwnerStatus !== IGymOwnerStatus.APPROVED
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
                  gymId={gym._id}
                  gymName={gym.name}
                  images={gym.pictures || []}
                  description={gym.description}
                  city={gym.city}
                  street={gym.street}
                  streetNumber={gym.streetNumber}
                  ownerId={gym.owner}
                  prices={gym.prices}
                  openingHours={gym.openingHours}
                  onDelete={() => handleGymDelete(gym._id)}
                  hasUnread={gymsWithUnread[gym._id] === true}
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

            <AutoComplete
              options={cityOptions.map((city) => ({
                label: city,
                value: city,
              }))}
              value={gymData.city}
              onSearch={handleCitySearch}
              onSelect={(val) => {
                setGymData({ ...gymData, city: val });
                const match = allCityRecords.find((r) => r.latin === val);
                setHebrewCity(match?.hebrew || "");
              }}
              onChange={(val) => setGymData({ ...gymData, city: val })}
              placeholder="City"
              className="modal-input"
              allowClear
              filterOption={false}
              style={{ width: "100%" }}
            />

            <AutoComplete
              options={streetOptions.map((street) => ({
                label: street,
                value: street,
              }))}
              value={gymData.street}
              onSearch={handleStreetSearch}
              onSelect={(val) => setGymData({ ...gymData, street: val })}
              onChange={(val) => setGymData({ ...gymData, street: val })}
              placeholder="Street"
              className="modal-input"
              allowClear
              filterOption={false}
              style={{ width: "100%" }}
            />

            <Input
              name="streetNumber"
              placeholder="Street Number"
              value={gymData.streetNumber}
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

      <div className="chart-and-rating">
        {purchaseStats.length > 0 && (
          <div
            className="chart-container"
            style={{ maxWidth: "500px", marginTop: "20px" }}
          >
            <h3 className="chart-title">Weekly Summary: Bookings at My Gyms</h3>
            <Line
              data={{
                labels: purchaseStats.map((d) =>
                  new Date(d.date).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })
                ),
                datasets: [
                  {
                    label: "Bookings",
                    data: purchaseStats.map((d) => d.count),
                    borderColor: "#1890ff",
                    backgroundColor: "rgba(24, 144, 255, 0.3)",
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: "#1890ff",
                    pointBorderColor: "#1890ff",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    mode: "index",
                    intersect: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                    },
                  },
                },
              }}
            />
          </div>
        )}

        <div
          className="rating-container"
          style={{
            background: "#829cd3",
            borderRadius: "20px",
            padding: "20px",
            margin: "20px 0",
            color: "white",
            position: "relative",
            overflow: "hidden",
            width: "30%",
            marginLeft: "auto",
          }}
        >
          <p style={{ fontSize: "24px", margin: 0 }}>Average gyms rating</p>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: "5px 0" }}>
            {averageRating != null ? `${averageRating} / 5 ⭐` : "N/A"}
          </h2>

          {/* Avatar Row */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Star badge */}
            <div
              style={{
                marginLeft: "auto",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: "#ffd70033",
                border: "2px solid #ffd700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span role="img" aria-label="star" style={{ fontSize: "16px" }}>
                ⭐
              </span>
            </div>
          </div>

          {/* Background wave effect (decorative) */}
          <svg
            viewBox="0 0 500 150"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "40px",
              opacity: 0.3,
            }}
          >
            <path
              d="M0.00,49.98 C150.00,150.00 349.94,-50.00 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
              style={{ stroke: "none", fill: "#ffffff" }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
