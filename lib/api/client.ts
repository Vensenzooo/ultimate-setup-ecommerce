// API client for frontend-backend communication
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export class ApiClient {
  baseURL: string
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}/${endpoint}`
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }
    try {
      const response = await fetch(url, config)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return await response.json()
    } catch (error) {
      throw error
    }
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }
  post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body: JSON.stringify(data) })
  }
  put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", body: JSON.stringify(data) })
  }
  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient()
