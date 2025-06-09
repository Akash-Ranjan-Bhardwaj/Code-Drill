import axios from "axios";
const baseURL = import.meta.env.VITE_API_BACKEND_BASE_URL;

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
