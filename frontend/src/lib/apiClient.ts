const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export class ApiClient {
  private static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nexus_access_token');
    }
    return null;
  }

  public static async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; message?: string; data?: T; errors?: any }> {
    const token = this.getAccessToken();

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || 'API so\'rovida xatolik yuz berdi');
      }

      return json;
    } catch (error: any) {
      console.error(`API Error [${endpoint}]:`, error);
      return {
        success: false,
        message: error.message || 'Tarmoq xatosi yuz berdi',
      };
    }
  }

  public static get<T = any>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  public static post<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  public static put<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  public static delete<T = any>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export default ApiClient;
