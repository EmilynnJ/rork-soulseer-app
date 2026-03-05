import AsyncStorage from '@react-native-async-storage/async-storage';
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

export interface AuthResponse {
  user: User & { readerId?: string };
  token: string;
}

const getApiBaseUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl;
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    const origin = window.location.origin;
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return origin;
    }
  }

  return '';
};
const USERS_STORAGE_KEY = '@soulseer_users';

let apiAuthTokenProvider: (() => Promise<string | null>) | null = null;

export const setApiAuthTokenProvider = (provider: (() => Promise<string | null>) | null): void => {
  apiAuthTokenProvider = provider;
};

interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'client' | 'reader' | 'admin';
  avatar: string;
  balance: number;
  createdAt: string;
  readerId?: string;
}

const ADMIN_EMAIL = 'emilynnj14@gmail.com';

async function getStoredUsers(): Promise<StoredUser[]> {
  try {
    const stored = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

async function saveStoredUsers(users: StoredUser[]): Promise<void> {
  await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function generateToken(): string {
  return 'tok_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const baseUrl = getApiBaseUrl();
      if (!baseUrl) {
        console.warn('API_BASE_URL not configured, returning mock data');
        return { data: [] as unknown as T, success: false };
      }

      const authToken = apiAuthTokenProvider ? await apiAuthTokenProvider() : null;

      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          ...options?.headers,
        },
      });

      const text = await response.text();
      
      if (!text || text.trim().length === 0) {
        console.warn(`API returned empty response for ${endpoint}`);
        return { data: [] as unknown as T, success: false, error: 'API returned empty response' };
      }

      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        console.warn(`API returned HTML for ${endpoint}, server may be misconfigured`);
        return { data: [] as unknown as T, success: false, error: 'API endpoint is not available on this deployment' };
      }

      if (!response.ok) {
        console.error(`API Error ${response.status} for ${endpoint}:`, text.substring(0, 200));
        try {
          const errorData = JSON.parse(text);
          return { data: [] as unknown as T, success: false, error: errorData.error || `Request failed with status ${response.status}` };
        } catch {
          return { data: [] as unknown as T, success: false, error: `Request failed with status ${response.status}` };
        }
      }

      try {
        const data = JSON.parse(text);
        return data;
      } catch (parseError) {
        console.error(`JSON parse error for ${endpoint}:`, parseError);
        console.error('Response text:', text.substring(0, 200));
        return { data: [] as unknown as T, success: false };
      }
    } catch (error) {
      console.error(`API Request failed for ${endpoint}:`, error);
      return { data: [] as unknown as T, success: false };
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

  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const baseUrl = getApiBaseUrl();
    if (baseUrl) {
      console.log('Using backend auth for login:', email, 'baseUrl:', baseUrl);
      return this.request<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    }

    console.log('Using local auth for login:', email);
    const users = await getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      console.log('User not found:', email);
      return { data: {} as AuthResponse, success: false, error: 'Invalid email or password' };
    }

    if (user.password !== password) {
      console.log('Invalid password for:', email);
      return { data: {} as AuthResponse, success: false, error: 'Invalid email or password' };
    }

    const authUser: User & { readerId?: string } = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      balance: user.balance,
      createdAt: user.createdAt,
      readerId: user.readerId,
    };

    console.log('Local login successful for:', email, 'role:', user.role);
    return {
      data: { user: authUser, token: generateToken() },
      success: true,
    };
  }

  async register(email: string, password: string, name: string): Promise<ApiResponse<AuthResponse>> {
    const baseUrl = getApiBaseUrl();
    if (baseUrl) {
      console.log('Using backend auth for registration:', email, 'baseUrl:', baseUrl);
      return this.request<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });
    }

    console.log('Using local auth for registration:', email);
    const users = await getStoredUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      console.log('Email already registered:', email);
      return { data: {} as AuthResponse, success: false, error: 'An account with this email already exists' };
    }

    const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const newUser: StoredUser = {
      id: generateId(),
      name,
      email: email.toLowerCase(),
      password,
      role: isAdmin ? 'admin' : 'client',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6C63FF&color=fff`,
      balance: 0,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await saveStoredUsers(users);

    const authUser: User & { readerId?: string } = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
      balance: newUser.balance,
      createdAt: newUser.createdAt,
    };

    console.log('Local registration successful for:', email, 'role:', newUser.role);
    return {
      data: { user: authUser, token: generateToken() },
      success: true,
    };
  }
}

export const apiService = new ApiService();
