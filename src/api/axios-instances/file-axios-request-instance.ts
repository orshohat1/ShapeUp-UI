import axios from "axios";
import { SERVER_URL } from "../../constants/api-config";

const fileRequestAxiosInstance = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export default fileRequestAxiosInstance;
