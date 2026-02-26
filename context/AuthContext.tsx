import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService, AuthResponse } from '@/services/api';
import { User } from '@/types/api';

const AUTH_STORAGE_KEY = '@soulseer_auth';

interface AuthUser extends User {
  readerId?: string;
}

interface StoredAuth {
  user: AuthUser;
  token: string;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed: StoredAuth = JSON.parse(stored);
          setUser(parsed.user);
          setToken(parsed.token);
          console.log('Loaded stored auth for:', parsed.user.email, 'role:', parsed.user.role);
        }
      } catch (error) {
        console.error('Error loading stored auth:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    loadStoredAuth();
  }, []);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await apiService.login(email, password);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Login failed');
      }
      return response.data;
    },
    onSuccess: async (data: AuthResponse) => {
      const authUser: AuthUser = {
        ...data.user,
        readerId: data.user.readerId,
      };
      setUser(authUser);
      setToken(data.token);
      
      const storedAuth: StoredAuth = {
        user: authUser,
        token: data.token,
      };
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(storedAuth));
      console.log('Login successful for:', authUser.email, 'role:', authUser.role);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ email, password, name }: { email: string; password: string; name: string }) => {
      const response = await apiService.register(email, password, name);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Registration failed');
      }
      return response.data;
    },
    onSuccess: async (data: AuthResponse) => {
      const authUser: AuthUser = {
        ...data.user,
        readerId: data.user.readerId,
      };
      setUser(authUser);
      setToken(data.token);
      
      const storedAuth: StoredAuth = {
        user: authUser,
        token: data.token,
      };
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(storedAuth));
      console.log('Registration successful for:', authUser.email);
    },
  });

  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    console.log('User logged out');
  }, []);

  const { mutateAsync: loginAsync } = loginMutation;
  const { mutateAsync: registerAsync } = registerMutation;

  const login = useCallback(async (email: string, password: string) => {
    return loginAsync({ email, password });
  }, [loginAsync]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    return registerAsync({ email, password, name });
  }, [registerAsync]);

  return {
    user,
    token,
    isLoading,
    isInitialized,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    isReader: user?.role === 'reader',
    isClient: user?.role === 'client',
    login,
    register,
    logout,
    loginError: loginMutation.error?.message || null,
    registerError: registerMutation.error?.message || null,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
});
