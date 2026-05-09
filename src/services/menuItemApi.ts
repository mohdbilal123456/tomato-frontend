import { restaurantApi } from "./axiosInstance";

export const menuAPI = {
  addItem: async (formData: FormData) => {
    const { data } = await restaurantApi.post("/api/item/additem", formData);
    console.log("MENU DATA",data)
    return data;
  },

  getItems: async (restaurantId: string) => {
    const { data } = await restaurantApi.get(`/api/allitem/${restaurantId}`);
    return data;
  },

  deleteItem: async (itemId: string) => {
    console.log("itemId",itemId)
    const { data } = await restaurantApi.delete(`/api/item/${itemId}`);
    return data;
  },

  toggleAvailability: async (itemId: string) => {
    const { data } = await restaurantApi.put(`/api/item/status/${itemId}`);
    return data;
  },
  getMenuItems:async(restaurantId:string)=>{
    const data = await restaurantApi.post(`/api/item/allitems/${restaurantId}`)
    return data
  },
 
};