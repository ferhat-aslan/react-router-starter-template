// app/lib/api-client.ts
const API_BASE_URL = "http://localhost:3000" 

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(url, config);

        if (!response.ok) {
          reject(response);
          throw new Error("Error");
        }

        resolve(response);
      } catch (error) {
        reject(error);
        throw error;
      }
    });
  }

}

// Create a singleton instance
export const apiClient = new ApiClient();


// Export the class if someone wants to create their own instance
export default ApiClient;
