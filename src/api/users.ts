import axiosInstance from "./axios-instances/axios-instance";
import { notification } from "antd";
const USERS_ROUTE = "/users";

export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get(`${USERS_ROUTE}/getMyProfile`, {
        withCredentials: true
    });
    return response.data;
  } catch (error:any) {
    notification.error({
      message: "Fetching User Data Failed",
      description: error.response?.data?.message || "Something went wrong. Please try again.",
      placement: "top",
    });
    throw error;
  }
};