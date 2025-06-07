import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:"https://code-drill.onrender.com/api/v1",
  withCredentials: true,
});
