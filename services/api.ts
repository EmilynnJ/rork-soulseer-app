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

const API_BASE_URL = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || '';

class ApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      if (!API_BASE_URL) {
        console.warn('API_BASE_URL not configured, returning empty data');
        return { data: [] as any, success: true };
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      return { data: [] as any, success: false };
    }
  }

  async getOnlineReaders(): Promise<Reader[]> {
    const response = await this.request<Reader[]>('/readers/online');
    return response.data;
  }

  async getAllReaders(): Promise<Reader[]> {
    const response = await this.request<Reader[]>('/readers');
    return response.data;
  }

  async getReaderById(id: string): Promise<Reader> {
    const response = await this.request<Reader>(`/readers/${id}`);
    return response.data;
  }

  async getLiveStreams(): Promise<LiveStream[]> {
    const response = await this.request<LiveStream[]>('/streams/live');
    return response.data;
  }

  async getProducts(category?: string): Promise<Product[]> {
    const query = category ? `?category=${category}` : '';
    const response = await this.request<Product[]>(`/products${query}`);
    return response.data;
  }

  async getCommunityPosts(limit?: number): Promise<CommunityPost[]> {
    const query = limit ? `?limit=${limit}` : '';
    const response = await this.request<CommunityPost[]>(`/community/posts${query}`);
    return response.data;
  }

  async getMessages(userId: string): Promise<Message[]> {
    const response = await this.request<Message[]>(`/messages/${userId}`);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<User>('/auth/me');
    return response.data;
  }

  async getReaderEarnings(readerId: string): Promise<ReaderEarnings> {
    const response = await this.request<ReaderEarnings>(`/readers/${readerId}/earnings`);
    return response.data;
  }

  async getTransactions(userId: string, limit?: number): Promise<Transaction[]> {
    const query = limit ? `?limit=${limit}` : '';
    const response = await this.request<Transaction[]>(`/users/${userId}/transactions${query}`);
    return response.data;
  }

  async addFunds(userId: string, amount: number): Promise<Transaction> {
    const response = await this.request<Transaction>('/payments/add-funds', {
      method: 'POST',
      body: JSON.stringify({ userId, amount }),
    });
    return response.data;
  }

  async updateReaderStatus(readerId: string, isOnline: boolean): Promise<void> {
    await this.request<void>('/readers/status', {
      method: 'PUT',
      body: JSON.stringify({ readerId, isOnline }),
    });
  }

  async subscribeToNewsletter(email: string): Promise<void> {
    await this.request<void>('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }
}

export const apiService = new ApiService();
