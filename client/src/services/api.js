import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://smart-ecommerce-backend-iml1.vercel.app/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    try {
      const authStorage = localStorage.getItem("smart-commerce-auth");

      if (authStorage) {
        const parsedAuth = JSON.parse(authStorage);
        const token = parsedAuth?.state?.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.log("Token read error:", error.message);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;