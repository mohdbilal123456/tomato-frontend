import type { Role } from "../types";
import { authApi } from "./axiosInstance";

export const authAPI = {
  loginWithGoogle: async (code: string) => {
    const { data } = await authApi.post("/api/auth/login", { code });
    return data;
  },

  getProfile: async () => {
    const { data } = await authApi.get("/api/auth/me");
    return data;
  },
  addRole: async (role: Role) => {
    const { data } = await authApi.put("/api/auth/add/role", { role })
    return data
  },
  logOut:async()=>{
    const {data}=await authApi.post("/api/auth/logout")
    return data
  }
};
