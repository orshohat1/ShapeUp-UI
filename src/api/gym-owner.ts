import axiosInstance from "./axios-instances/axios-instance";
import { notification } from "antd";
const GYMS_ROUTE = "/gyms";

export const getGymsByOwner = async (ownerID: string) => {
  try {
    const response = await axiosInstance.get(`${GYMS_ROUTE}`, {
      params: {
        owner: ownerID
      },
    });
    return response.data.gyms;
  } catch (error: any) {
    notification.error({
      message: "Fetching Gyms Failed",
      description:
        error.response?.data?.message ||
        "Something went wrong. Please try again.",
      placement: "top",
    });
    throw error;
  }
};
