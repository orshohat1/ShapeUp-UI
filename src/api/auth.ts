import axiosInstance from "./axios-instance";
const AUTH_ROUTE = "/users";

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(`${AUTH_ROUTE}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// TODO: need to add a register parameters here
export const register = async (
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  birthdate: Date,
  city: string
) => {
  try {
    const response = await axiosInstance.post(`${AUTH_ROUTE}/register`, {
      firstname,
      lastname,
      email,
      password,
      birthdate,
      city,
    });
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};
