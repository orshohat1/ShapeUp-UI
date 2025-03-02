import axiosInstance from "./axios-instances/axios-instance";
import { notification } from "antd";

const GYMS_ROUTE = "/gyms";

export const getGymsByOwner = async (ownerID: string) => {
  try {
    const response = await axiosInstance.get(`${GYMS_ROUTE}`, {
      params: {
        owner: ownerID,
      },
    });
    return response.data.gyms;
  } catch (error: any) {
    notification.error({
      message: "Fetching Gyms Failed",
      description:
        error.response?.data?.message ||
        "Something went wrong. Please try again.",
      placement: "top",
    });
    throw error;
  }
};

export const addGym = async (
  formData: FormData,
  ownerID: string
) => {
  try {
    const response = await axiosInstance.post(
      `${GYMS_ROUTE}`,
      formData,
      {
        params: {
          owner: ownerID,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );

    notification.success({
      message: "Gym Added Successfully",
      description: "The gym has been added to the platform.",
      placement: "top",
    });

    return response.data.gym;
  } catch (error: any) {
    let errorMessage = "Something went wrong. Please try again.";

    // Check for specific validation error message
    if (error.response?.data?.message === "Validation array is not empty") {
      errorMessage = "Please fill in all fields";
    } else if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message;
    }

    notification.error({
      message: "Adding Gym Failed",
      description: errorMessage,
      placement: "top",
    });

    throw error;
  }

};
