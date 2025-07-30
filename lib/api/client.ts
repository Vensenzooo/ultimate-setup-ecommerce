// API client for frontend-backend communication
export class ApiClient {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Construire l'URL correcte : si l'endpoint ne commence pas par /api/, l'ajouter
    const url = endpoint.startsWith('/api/') ? endpoint : `/api/${endpoint}`
    
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }
    
    try {
      const response = await fetch(url, config)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('API Request Error:', error)
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
