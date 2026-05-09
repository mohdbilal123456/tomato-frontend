import axios from "axios";
import { AUTH_SERVICE_URL, RESTAURANT_SERVICE_URL } from "../config/env";
import { notifySessionExpired } from "../utils/authEvents";

export const authApi = axios.create({
  baseURL: AUTH_SERVICE_URL,
  withCredentials: true,
});
console.log("AUTH URL:", AUTH_SERVICE_URL);

export const restaurantApi = axios.create({
  baseURL: RESTAURANT_SERVICE_URL,
  withCredentials: true,
});

const attachInterceptor = (client: typeof authApi) => {
  client.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;
      const requestUrl = String(originalRequest?.url ?? "");
      console.log("requestUrl",requestUrl)
      const isRefreshRequest = requestUrl.includes("/api/auth/refresh");
      console.log("isRefreshRequest",isRefreshRequest)
      if (!originalRequest) return Promise.reject(error);
      if (originalRequest._retry) return Promise.reject(error);
      if (isRefreshRequest) {
        notifySessionExpired();
        return Promise.reject(error);
      }

      if (error.response?.status === 401) {
        originalRequest._retry = true;

        try { 
          await authApi.post("/api/auth/refresh");
          return client(originalRequest);
        } catch (err) {
          notifySessionExpired();
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );
};

attachInterceptor(authApi);
attachInterceptor(restaurantApi);
