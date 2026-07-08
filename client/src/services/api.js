import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
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
  (error) => {
    return Promise.reject(error);
  }
);

export default api;