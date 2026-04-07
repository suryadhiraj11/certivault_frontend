import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api"
});

// ✅ REQUEST INTERCEPTOR (already correct)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 ADD THIS (VERY IMPORTANT)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      
      // 🔥 TOKEN EXPIRED / INVALID
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      alert("Session expired. Please login again.");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;
