import axiosInstance from "./axios-instances/axios-instance";
import { notification } from "antd";

const GYMS_ROUTE = "/gyms";

// Fetch all gyms
export const getGyms = async () => {
  try {
    const response = await axiosInstance.get(GYMS_ROUTE, {
      withCredentials: true,
    });
    return response.data.gyms;
  } catch (error: any) {
    notification.error({
      message: "Fetching Gyms Failed",
      description:
        error.response?.data?.message || "Something went wrong. Please try again.",
      placement: "top",
    });
    throw error;
  }
};

// Fetch a gym by ID
export const getGymById = async (gymId: string) => {
  try {
    const response = await axiosInstance.get(`${GYMS_ROUTE}/${gymId}`, {
      withCredentials: true,
    });
    return response.data.gym;
  } catch (error: any) {
    notification.error({
      message: "Fetching Gym Details Failed",
      description:
        error.response?.data?.message || "Something went wrong. Please try again.",
      placement: "top",
    });
    throw error;
  }
};
