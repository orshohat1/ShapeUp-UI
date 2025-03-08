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

export const addReview = async (gym: string, rating: number, content: string) => {
  try {
    console.log("Adding review", gym, rating, content);
    const response = await axiosInstance.post(
      `${REVIEWS_ROUTE}`,
      {
        rating,
        content,
        gym,
      },
      { withCredentials: true } // This should be in the config, not the body
    );
    return response.data;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

