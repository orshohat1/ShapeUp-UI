import axiosInstance from "./axios-instances/axios-instance";
import { notification } from "antd";

const REVIEWS_ROUTE = "/reviews";

interface Review {
  rating: number;
  content: string;
}

export const getGymReviews = async (gymId: string): Promise<Review[]> => {
  try {
    const response = await axiosInstance.get(`${REVIEWS_ROUTE}/gym/${gymId}`, { withCredentials: true });
    return response.data.reviews || [];
  } catch (error: any) {
    notification.error({
      message: "Fetching Reviews Failed",
      description:
        error.response?.data?.message || "Something went wrong. Please try again.",
      placement: "top",
    });
    return [];
  }
};
