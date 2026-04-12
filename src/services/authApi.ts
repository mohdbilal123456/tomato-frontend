import type { Role } from "../types";
import { api } from "./axiosInstance";

export const authAPI = {
  loginWithGoogle: async (code: string) => {
    const { data } = await api.post("/api/auth/login", { code });
    console.log("data",data)
    return data;
  },

  getProfile: async () => {
    const { data } = await api.get("/api/auth/me");
    return data;
  },
  addRole: async (role: Role) => {
    const { data } = await api.put("/api/auth/add/role", { role })
    return data
  },
  logOut:async()=>{
    const {data}=await api.post("/api/auth/logout")
    console.log("DATA LOGOUT",data)
    return data
  }
};