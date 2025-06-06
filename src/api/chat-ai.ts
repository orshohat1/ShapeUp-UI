import axiosInstance from "./axios-instances/axios-instance";
import { notification } from "antd";

const CHAT_AI_ROUTE = "/askChatAi";

export const askChatAi = async (userId: string, userBirthDate: Date, userGender: string) => {
  try {
    let question = 'Please give me a workout plan. I know you are just an AI model but please send me the best you know.';
    if (userBirthDate != null)
      question += ` I was born in ${userBirthDate.toString()}.`;
    if (userGender != null)
      question += ` I am a ${userGender}.`
    const response = await axiosInstance.post(
      `${CHAT_AI_ROUTE}/${userId}`,
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

export const askPricingSuggestion = async (gymId: string) => {
  try {
    const response = await axiosInstance.post(
      `/askChatAi/suggest-pricing/${gymId}`,
      {},
      { withCredentials: true }
    );
    return response.data.message;
  } catch (error: any) {
    notification.error({
      message: "Pricing Suggestion Failed",
      description: error.response?.data?.message || "Something went wrong.",
      placement: "top",
    });
    throw error;
  }
};
