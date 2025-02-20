import axios from "axios";
import { SERVER_URL } from "../../constants/api-config";

const axiosInstance = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
