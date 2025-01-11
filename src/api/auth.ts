import axiosInstance from "./axios-instances/axios-instance";
import fileRequestAxiosInstance from "./axios-instances/file-axios-request-instance";
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
  city: string,
  street: string,
  gender: string,
  avatar: File,
  gymOwnerDocumentFile: File
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
  console.log("gymOwnerDocument", gymOwnerDocumentFile);
  // registerFormData.append("gymOwnerDocument", gymOwnerDocumentFile);

  try {
    const response = await fileRequestAxiosInstance.post(
      `${AUTH_ROUTE}/signup`,
      registerFormData
    );
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};
