import axiosInstance from "./axios-instances/axios-instance";
import { notification } from "antd";

const CHAT_AI_ROUTE = "/askChatAi";

export const askChatAi = async (userId: string, userBirthDate: Date, userGender: string) => {
    try {
        let question = 'Please give me a workout plan. I know you are just an AI model but please send me the best you know.';
        if(userBirthDate != null)
          question += ` I was born in ${userBirthDate.toString()}.`;
        if(userGender != null)
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

  export const askPricingSuggestion = async (ownerId: string, prices: number[]) => {
  try {
    let question = '';
    if (prices.length === 0) {
      question = `Please suggest improved pricing for a gym with no current prices.`;
    }
    else
    {
      question = `Please suggest the gym owner how to change the pricing for a gym with the current prices: ${prices.join(", ")}`;
    }
    question += `\n The different pricing are for 1 day pass, 3 day pass, and 5 day pass respectively.`;
      
    console.log("@@@@@@@@@@@@");
    console.log(question);
    console.log("@@@@@@@@@@@@");
    const response = await axiosInstance.post(
      `${CHAT_AI_ROUTE}/${ownerId}`,
      { question: question },
      { withCredentials: true }
    );
    return response.data.message;
  } catch (error: any) {
    notification.error({
      message: "Pricing Suggestion Failed",
      description: error.response?.data?.message || "Something went wrong. Please try again.",
      placement: "top",
    });
  }
};

