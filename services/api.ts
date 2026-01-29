import {
  Reader,
  LiveStream,
  Product,
  CommunityPost,
  Message,
  User,
  Transaction,
  ReaderEarnings,
  ApiResponse,
} from '@/types/api';

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.EXPO_PUBLIC_RORK_API_BASE_URL || '';
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      if (!API_BASE_URL) {
        console.warn('API_BASE_URL not configured, returning mock data');
        return { data: [] as any, success: true };
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn(`API returned non-JSON response for ${endpoint}, using fallback`);
        return { data: [] as any, success: false };
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}: ${errorText}`);
        return { data: [] as any, success: false };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      return { data: [] as any, success: false };
    }
  }

  async getOnlineReaders(): Promise<Reader[]> {
    const response = await this.request<Reader[]>('/api/readers/online');
    return response.data;
  }

  async getAllReaders(): Promise<Reader[]> {
    const response = await this.request<Reader[]>('/api/readers');
    return response.data;
  }

  async getReaderById(id: string): Promise<Reader> {
    const response = await this.request<Reader>(`/api/readers/${id}`);
    return response.data;
  }

  async getLiveStreams(): Promise<LiveStream[]> {
    const response = await this.request<LiveStream[]>('/api/streams/live');
    return response.data;
  }

  async getProducts(category?: string): Promise<Product[]> {
    const query = category ? `?category=${category}` : '';
    const response = await this.request<Product[]>(`/api/products${query}`);
    return response.data;
  }

  async getCommunityPosts(limit?: number): Promise<CommunityPost[]> {
    const query = limit ? `?limit=${limit}` : '';
    const response = await this.request<CommunityPost[]>(`/api/community/posts${query}`);
    return response.data;
  }

  async getMessages(userId: string): Promise<Message[]> {
    const response = await this.request<Message[]>(`/api/messages/${userId}`);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<User>('/api/auth/me');
    return response.data;
  }

  async getReaderEarnings(readerId: string): Promise<ReaderEarnings> {
    const response = await this.request<ReaderEarnings>(`/api/readers/${readerId}/earnings`);
    return response.data;
  }

  async getTransactions(userId: string, limit?: number): Promise<Transaction[]> {
    const query = limit ? `?limit=${limit}` : '';
    const response = await this.request<Transaction[]>(`/api/users/${userId}/transactions${query}`);
    return response.data;
  }

  async addFunds(userId: string, amount: number): Promise<Transaction> {
    const response = await this.request<Transaction>('/api/payments/add-funds', {
      method: 'POST',
      body: JSON.stringify({ userId, amount }),
    });
    return response.data;
  }

  async updateReaderStatus(readerId: string, isOnline: boolean): Promise<void> {
    await this.request<void>('/api/readers/status', {
      method: 'PUT',
      body: JSON.stringify({ readerId, isOnline }),
    });
  }

  async subscribeToNewsletter(email: string): Promise<void> {
    await this.request<void>('/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }
}

export const apiService = new ApiService();
