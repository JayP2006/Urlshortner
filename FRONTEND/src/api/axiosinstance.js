import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://shrinkx-backend.onrender.com",
  withCredentials: true, // This ensures cookies are sent with requests
  headers: {
    "Content-Type": "application/json",
  } 
});

export default axiosInstance;
