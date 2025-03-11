import axiosInstance from "./axios-instances/axios-instance";
import { notification } from "antd";

const USERS_ROUTE = "/askChatAi";

export const askChatAi = async (userId: string, userBirthDate: string, userGender: string) => {
    try {
        const response = await axiosInstance.post(
            `${USERS_ROUTE}/${userId}`,
            { question: `Please give me a workout plan. i was born in ${userBirthDate} and i am a ${userGender}` },
            { withCredentials: true }
          );
      return response.data.message;
    } catch (error: any) {
      notification.error({
        message: "Fetching Chat AI response Failed",
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
        placement: "top",
      });
      throw error;
    }
  };