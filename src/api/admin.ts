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
