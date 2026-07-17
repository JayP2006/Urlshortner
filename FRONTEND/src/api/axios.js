import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Something went wrong";

    if (status === 401) {
      if (onUnauthorized) onUnauthorized();
    } else if (status === 403) {
      toast.error("You don't have access to this resource.");
    } else if (status === 404) {
      // Silent — pages handle 404 UI themselves
    } else if (status >= 500) {
      toast.error("Server error. Please try again shortly.");
    } else if (!error.response) {
      toast.error("Network error. Check your connection.");
    }

    return Promise.reject({ ...error, message });
  }
);

export default api;
