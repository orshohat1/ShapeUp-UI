import axiosInstance from "./axios-instances/axios-instance";
import { notification } from "antd";

const USERS_ROUTE = "/users";

export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get(`${USERS_ROUTE}/getMyProfile`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    notification.error({
      message: "Fetching User Data Failed",
      description:
        error.response?.data?.message || "Something went wrong. Please try again.",
      placement: "top",
    });
    throw error;
  }
};

export const addFavoriteGym = async (userId: string, gymId: string) => {
  try {
    const response = await axiosInstance.post(
      `${USERS_ROUTE}/addFavoriteGym/${userId}`,
      { gymId },
      { withCredentials: true }
    );
    notification.success({
      message: "Added to Favorites",
      description: "This gym has been added to your favorite list.",
      placement: "top",
    });
    return response.data;
  } catch (error: any) {
    notification.error({
      message: "Failed to Add Favorite Gym",
      description: error.response?.data?.message || "Something went wrong.",
      placement: "top",
    });
    throw error;
  }
};

export const removeFavoriteGym = async (userId: string, gymId: string) => {
  try {
    const response = await axiosInstance.delete(`${USERS_ROUTE}/deleteFavoriteGymById/`, {
      data: { userId, gymId },
      withCredentials: true,
    });
    notification.success({
      message: "Removed from Favorites",
      description: "This gym has been removed from your favorite list.",
      placement: "top",
    });
    return response.data;
  } catch (error: any) {
    notification.error({
      message: "Failed to Remove Favorite Gym",
      description: error.response?.data?.message || "Something went wrong.",
      placement: "top",
    });
    throw error;
  }
};