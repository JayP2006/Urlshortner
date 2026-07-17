import api from "./axios.js";

// AUTH
console.log("API URL:", import.meta.env.VITE_API_URL);
console.log("All env:", import.meta.env);
export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login ", data),
  logout: () => api.post("/auth/logout"),
};

// USER
export const userApi = {
  updateProfile: (data) => api.put("/user/profile", data),
  changePassword: (data) => api.post("/user/change-password", data),
  generateApiKey: () => api.post("/user/api-key"),
  deleteAccount: () => api.delete("/user/delete-account"),
};

// URL
export const urlApi = {
  shorten: (data) => api.post("/url/shorten", data),
  protectedShorten: (data) => api.post("/url/protected-shorten", data),
  locationShorten: (data) => api.post("/url/location-shorten", data),
  myUrls: (params) => api.get("/url/my-urls", { params }),
  remove: (id) => api.delete(`/url/${id}`),
  aiPreview: (url) => api.post("/url/ai-preview", { url }),
  generateQr: (url) => api.post("/url/generate-qr-code", { url }),
  analyticsSummary: () => api.get("/url/analytics/summary"),
  recentLinks: () => api.get("/url/analytics/recent-links"),
  predictions: () => api.get("/url/analytics/predictions"),
  hourlyStats: () => api.get("/url/analytics/summary/hourly"),
  urlAnalytics: (id) => api.get(`/url/${id}/analytics`),
  checkProtected: (shortCode, password) =>
    api.post(`/url/check-protected-link/${shortCode}`, { password }),
};
