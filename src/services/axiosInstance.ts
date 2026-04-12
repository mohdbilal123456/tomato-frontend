import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:5000/api
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    // ✅ already retried → stop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // ✅ refresh endpoint skip
    if (originalRequest.url === "/api/auth/refresh") {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      originalRequest._retry = true;

      try {
        await api.post("/api/auth/refresh");
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err); // ❌ redirect mat karo yaha
      }
    }

    return Promise.reject(error);
  }
);