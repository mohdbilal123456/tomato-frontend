import { restaurantApi } from "../axiosInstance";
import type { AxiosRequestConfig } from "axios";

type UpdateRestaurantPayload = {
  name: string;
  description?: string;
};


export const restaurantAPI = {
  fetchRestaurant:async()=>{
    const {data} = await restaurantApi.get("/api/restaurant/myrestaurant")
    return data
  },
  createRestaurant:async(data:FormData)=>{
   const response = await restaurantApi.post("/api/restaurant/addrestaurant",data)
   return response
    
  },
  updateRestaurantStatus:async(status:boolean)=>{
    const {data} = await restaurantApi.put("/api/restaurant/status",{status})
    return data
  },
  updateRestaurantService : async (payload:UpdateRestaurantPayload)=>{
    const {data} = await restaurantApi.put("/api/restaurant/edit",payload)
    return data
  },
  getNearByRestaurant:async(config:AxiosRequestConfig)=>{
    const {data} = await restaurantApi.get("/api/restaurant/all",config)
    return data
  },
  fetchSingleRestaurant:async(id:string)=>{
    const {data} = await restaurantApi.get(`/api/restaurant/${id}`)
    return data
  }
}
