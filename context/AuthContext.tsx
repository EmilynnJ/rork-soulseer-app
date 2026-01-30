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
        console.log('[Auth] Loading stored auth...');
        if (stored) {
          const parsed: StoredAuth = JSON.parse(stored);
          console.log('[Auth] Found stored user:', parsed.user.email);
          console.log('[Auth] Stored role:', parsed.user.role);
          console.log('[Auth] Is admin check:', parsed.user.role === 'admin');
          setUser(parsed.user);
          setToken(parsed.token);
        } else {
          console.log('[Auth] No stored auth found');
        }
      } catch (error) {
        console.error('[Auth] Error loading stored auth:', error);
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    loadStoredAuth();
  }, []);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      console.log('[Auth] Attempting login for:', email);
      const response = await apiService.login(email, password);
      console.log('[Auth] Login response:', JSON.stringify(response, null, 2));
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Login failed');
      }
      return response.data;
    },
    onSuccess: async (data: AuthResponse) => {
      console.log('[Auth] Login success, user data:', JSON.stringify(data.user, null, 2));
      console.log('[Auth] User role from server:', data.user.role);
      
      const authUser: AuthUser = {
        ...data.user,
        readerId: data.user.readerId,
      };
      
      console.log('[Auth] Setting user with role:', authUser.role);
      console.log('[Auth] Is admin:', authUser.role === 'admin');
      
      // Clear old auth first to ensure fresh state
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      
      setUser(authUser);
      setToken(data.token);
      
      const storedAuth: StoredAuth = {
        user: authUser,
        token: data.token,
      };
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(storedAuth));
      console.log('[Auth] Stored new auth for:', authUser.email, 'role:', authUser.role);
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
    console.log('[Auth] Logging out user:', user?.email);
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    console.log('[Auth] User logged out, auth cleared');
  }, [user?.email]);

  const { mutateAsync: loginAsync } = loginMutation;
  const { mutateAsync: registerAsync } = registerMutation;

  const login = useCallback(async (email: string, password: string) => {
    return loginAsync({ email, password });
  }, [loginAsync]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    return registerAsync({ email, password, name });
  }, [registerAsync]);

  const isAdmin = user?.role === 'admin';
  const isReader = user?.role === 'reader';
  const isClient = user?.role === 'client';

  // Debug log whenever user changes
  useEffect(() => {
    if (user) {
      console.log('[Auth] Current user state - email:', user.email, 'role:', user.role, 'isAdmin:', user.role === 'admin');
    }
  }, [user]);

  return {
    user,
    token,
    isLoading,
    isInitialized,
    isAuthenticated: !!user && !!token,
    isAdmin,
    isReader,
    isClient,
    login,
    register,
    logout,
    loginError: loginMutation.error?.message || null,
    registerError: registerMutation.error?.message || null,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
});
