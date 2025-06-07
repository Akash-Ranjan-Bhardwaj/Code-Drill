import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "https://code-drill.onrender.com/api/v1" : "https://code-drill.onrender.com/api/v1",
  withCredentials: true,
});
