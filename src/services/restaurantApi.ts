import { restaurantApi } from "./axiosInstance";


export const restaurantAPI = {
  fetchRestaurant:async()=>{
    const {data} = await restaurantApi.get("/api/restaurant/myrestaurant")
    return data
  },
  createRestaurant:async(data:any)=>{
   const response = await restaurantApi.post("/api/restaurant/addrestaurant",data)
   return response
    
  },
  updateRestaurantStatus:async(status:boolean)=>{
    const {data} = await restaurantApi.put("/api/restaurant/status",{status})
    return data
  },
  updateRestaurantService : async (payload:any)=>{
    const {data} = await restaurantApi.put("/api/restaurant/edit",payload)
    return data
  },
  getNearByRestaurant:async(config:any)=>{
    const {data} = await restaurantApi.get("/api/restaurant/all",config)
    return data
  }
}
