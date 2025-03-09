import axiosInstance from "./axios-instances/axios-instance";
import fileRequestAxiosInstance from "./axios-instances/file-axios-request-instance";
import { notification } from "antd";
const AUTH_ROUTE = "/users";

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(`${AUTH_ROUTE}/login`, {
      email,
      password,
    }, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    notification.error({
      message: "Login Failed",
      description: error.response?.data?.message || "Something went wrong. Please try again.",
      placement: "top",
    });
    throw error;
  }
};

export const register = async (
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  birthdate: Date,
  city: string,
  street: string,
  gender: string,
  avatar: File,
  gymOwnerDocumentFile?: File
) => {
  const registerFormData = new FormData();
  registerFormData.append("firstName", firstname);
  registerFormData.append("lastName", lastname);
  registerFormData.append("email", email);
  registerFormData.append("password", password);
  registerFormData.append("birthdate", birthdate.toString());
  registerFormData.append("city", city);
  registerFormData.append("street", street);
  registerFormData.append("gender", gender);
  registerFormData.append("avatar", avatar);

  if (gymOwnerDocumentFile) {
    registerFormData.append("gymOwnerLicenseImage", gymOwnerDocumentFile);
  }

  try {
    const response = await fileRequestAxiosInstance.post(
      `${AUTH_ROUTE}/signup`,
      registerFormData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    notification.error({
      message: "Registration Failed",
      description: error.response?.data?.message || "Something went wrong. Please try again.",
      placement: "top",
    });
    throw error;
  }
};

export const logoutServer = async () => {
  try {
    await axiosInstance.post(`${AUTH_ROUTE}/logout`, {
      refreshToken: localStorage.getItem("refreshToken"),
    }, { withCredentials: true });
  } catch (error: any) {
    notification.error({
      message: "Logout Failed",
      description: error.response?.data?.message || "Something went wrong. Please try again.",
      placement: "top",
    });
    throw error;
  }
}