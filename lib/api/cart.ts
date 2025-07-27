// Cart API service for frontend
import { apiClient } from "./client"
import type { CartItem } from "@/hooks/use-cart"

export const cartApi = {
  getCart: async (): Promise<CartItem[]> => {
    return await apiClient.get<CartItem[]>("cart")
  },
  addItem: async (item: Omit<CartItem, "quantity">): Promise<CartItem[]> => {
    return await apiClient.post<CartItem[]>("cart/add", item)
  },
  removeItem: async (id: string): Promise<CartItem[]> => {
    return await apiClient.delete<CartItem[]>(`cart/remove/${id}`)
  },
  updateQuantity: async (id: string, quantity: number): Promise<CartItem[]> => {
    return await apiClient.put<CartItem[]>(`cart/update/${id}`, { quantity })
  },
  clearCart: async (): Promise<CartItem[]> => {
    return await apiClient.post<CartItem[]>("cart/clear", {})
  },
}
