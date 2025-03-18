import axiosInstance from "./axios-instances/axios-instance";
import { notification } from "antd";

const USERS_ROUTE = "/askChatAi";

export const askChatAi = async (userId: string, userBirthDate: Date, userGender: string) => {
    try {
        let question = 'Please give me a workout plan. I know you are just an AI model but please send me the best you know.';
        if(userBirthDate != null)
          question += ` I was born in ${userBirthDate.toString()}.`;
        if(userGender != null)
          question += ` I am a ${userGender}.`
        const response = await axiosInstance.post(
            `${USERS_ROUTE}/${userId}`,
            { question: question },
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