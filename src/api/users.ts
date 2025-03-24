import axiosInstance from "./axios-instances/axios-instance";
import { notification } from "antd";
import fileRequestAxiosInstance from "./axios-instances/file-axios-request-instance";

const USERS_ROUTE = "/users";

export const getAllUsers = async (showNotification = true) => {
  try {
    const response = await axiosInstance.get(`${USERS_ROUTE}/getAllUsers`, {
      withCredentials: true,
    });
    return response?.data?.users;
  } catch (error: any) {
    if (showNotification) {
      notification.error({
        message: "Fetching all users data failed",
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
        placement: "top",
      });
    }
    throw error;
  }
};

export const filterUsers = async (query: string, showNotification = true) => {
  try {
    const response = await axiosInstance.get(`${USERS_ROUTE}/filter?search=${encodeURIComponent(query)}`, {
      withCredentials: true,
    });
    return response?.data?.users;
  } catch (error: any) {
    if (showNotification) {
      notification.error({
        message: "Filtering users failed",
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
        placement: "top",
      });
    }
    throw error;
  }
};

export const getUserProfile = async (showNotification = true) => {
  try {
    const response = await axiosInstance.get(`${USERS_ROUTE}/getMyProfile`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    if (showNotification) {
      notification.error({
        message: "Fetching User Data Failed",
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
        placement: "top",
      });
    }
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
    const response = await axiosInstance.delete(
      `${USERS_ROUTE}/deleteFavoriteGymById/`,
      {
        data: { userId, gymId },
        withCredentials: true,
      }
    );
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

export const updateProfile = async (
  userID: string,
  firstname: string,
  lastname: string,
  city: string,
  street: string,
  avatar: File | null
) => {
  const registerFormData = new FormData();
  registerFormData.append("firstName", firstname);
  registerFormData.append("lastName", lastname);
  registerFormData.append("city", city);
  registerFormData.append("street", street);

  if (avatar) registerFormData.append("avatar", avatar);

  try {
    const response = await fileRequestAxiosInstance.put(
      `${USERS_ROUTE}/updateUserById/${userID}`,
      registerFormData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    notification.error({
      message: "Profile Update Failed",
      description:
        error.response?.data?.message ||
        "Something went wrong. Please try again.",
      placement: "top",
    });
    throw error;
  }
};

export const deleteUserById = async (userId: string) => {
  try {
    await axiosInstance.delete(`${USERS_ROUTE}/${userId}`, { withCredentials: true });
    notification.success({
      message: "User Deleted",
      description: "The user has been successfully deleted.",
      placement: "top",
    });
  } catch (error: any) {
    notification.error({
      message: "Failed to Delete User",
      description:
        error.response?.data?.message ||
        "Something went wrong. Please try again.",
      placement: "top",
    });
    throw error;
  }
};
