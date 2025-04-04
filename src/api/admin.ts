import axiosInstance from "./axios-instances/axios-instance";
import { notification } from "antd";

const ADMIN_ROUTE = "/admin";

export const fetchDashboardCounts = async (showNotification?: boolean) => {
  try {
    const response = await axiosInstance.get(`${ADMIN_ROUTE}/dashboardCounts`, {
      withCredentials: true,
    });
    return response?.data;
  } catch (error: any) {
    if (showNotification) {
      notification.error({
        message: "Fetching dashboard counts failed",
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
        placement: "top",
      });
    }
    throw error;
  }
};

export const updateGymOwnerStatus = async (
  gymOwnerId: string,
  status: string,
  showNotification?: boolean
) => {
  try {
    const response = await axiosInstance.patch(
      `${ADMIN_ROUTE}/updateGymOwnerStatus/${gymOwnerId}`,
      {
        status,
      },
      {
        withCredentials: true,
      }
    );
    return response?.data;
  } catch (error: any) {
    if (showNotification) {
      notification.error({
        message: "Update gym owner status failed",
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
        placement: "top",
      });
    }
    throw error;
  }
};

export const getGymOwnersStatus = async (showNotification?: boolean) => {
  try {
    const response = await axiosInstance.get(
      `${ADMIN_ROUTE}/getGymOwnersStatus`,
      {
        withCredentials: true,
      }
    );
    return response?.data;
  } catch (error: any) {
    if (showNotification) {
      notification.error({
        message: "Fetching gym owners failed",
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
        placement: "top",
      });
    }
    throw error;
  }
};
