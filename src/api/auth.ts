import axiosInstance from "./axios-instance";
const AUTH_ROUTE = '/users';

export const login = async (username: string, password: string) => {
  try {
    const response = await axiosInstance.post(`${AUTH_ROUTE}/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// TODO: need to add a register parameters here
export const register = async (username: string, password: string) => {
  try {
    const response = await axiosInstance.post(`${AUTH_ROUTE}/register`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};
