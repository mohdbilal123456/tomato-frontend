import { restaurantApi } from "../axiosInstance"

export const cartAPI = {
  addToCart: async (restaurantId: string, itemId: string) => {
    const { data } = await restaurantApi.post("/api/cart/add-to-cart", { restaurantId, itemId })
    return data
  },
  fetchCart: async () => {
    const { data } = await restaurantApi.post("/api/cart/get-cart")
    return data
  },
  increementQuantity: async (itemId:string) => {
    const { data } = await restaurantApi.put("/api/cart/inc",{itemId})
    return data
  },
  decreementQuantity: async (itemId:string) => {
    const { data } = await restaurantApi.put("/api/cart/dnc",{itemId})
    return data
  },
  clearCart:async()=>{
    const { data } = await restaurantApi.delete("/api/cart/clear")
    return data
  }
}