import axios from "axios";

const SERVER_URL = import.meta.env.VITE_BACKEND_URL;

const fileRequestAxiosInstance = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export default fileRequestAxiosInstance;
