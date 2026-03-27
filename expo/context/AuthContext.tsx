import createContextHook from '@nkzw/create-context-hook';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth as useClerkAuth, useSignIn, useSignUp, useUser } from '@clerk/clerk-expo';
import { setApiAuthTokenProvider } from '@/services/api';
import { User } from '@/types/api';

interface AuthUser extends User {
  readerId?: string;
}

interface AuthResponse {
  user: AuthUser;
  token: string;
}

const ADMIN_EMAIL = 'emilynnj14@gmail.com';

const getRoleFromUser = (email: string | null | undefined, metadataRole: unknown): User['role'] => {
  if (metadataRole === 'admin' || metadataRole === 'reader' || metadataRole === 'client') {
    return metadataRole;
  }

  if ((email ?? '').toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return 'admin';
  }

  return 'client';
};

const mapClerkUserToAuthUser = (clerkUser: ReturnType<typeof useUser>['user']): AuthUser | null => {
  if (!clerkUser) {
    return null;
  }

  const primaryEmail = clerkUser.primaryEmailAddress?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? '';
  const firstName = clerkUser.firstName ?? '';
  const lastName = clerkUser.lastName ?? '';
  const fallbackName = `${firstName} ${lastName}`.trim();

  const role = getRoleFromUser(primaryEmail, clerkUser.publicMetadata?.role);
  const readerId = typeof clerkUser.publicMetadata?.readerId === 'string' ? clerkUser.publicMetadata.readerId : undefined;

  return {
    id: clerkUser.id,
    name: fallbackName.length > 0 ? fallbackName : primaryEmail.split('@')[0] ?? 'User',
    email: primaryEmail,
    role,
    avatar: clerkUser.imageUrl,
    balance: 0,
    createdAt: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : new Date().toISOString(),
    readerId,
  };
};

export const [AuthProvider, useAuth] = createContextHook(() => {
  const { user: clerkUser, isLoaded: userLoaded } = useUser();
  const { getToken, signOut, isSignedIn } = useClerkAuth();
  const {
    signIn,
    setActive: setSignInActive,
    isLoaded: signInLoaded,
  } = useSignIn();
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const {
    signUp,
    setActive: setSignUpActive,
    isLoaded: signUpLoaded,
  } = useSignUp();

  useEffect(() => {
    setApiAuthTokenProvider(async () => {
      const token = await getToken();
      return token ?? null;
    });

    return () => {
      setApiAuthTokenProvider(null);
    };
  }, [getToken]);

  const user = useMemo<AuthUser | null>(() => mapClerkUserToAuthUser(clerkUser), [clerkUser]);

  const login = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    console.log('Attempting Clerk login for:', email);
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      if (!signInLoaded || !setSignInActive) {
        throw new Error('Authentication is still loading. Please try again.');
      }

      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status !== 'complete' || !result.createdSessionId) {
        console.error('Clerk login incomplete status:', result.status);
        throw new Error('Login could not be completed. Please verify your account and try again.');
      }

      await setSignInActive({ session: result.createdSessionId });

      const token = (await getToken()) ?? '';
      const updatedUser = mapClerkUserToAuthUser(clerkUser) ?? {
        id: `pending-${email.toLowerCase()}`,
        name: email.split('@')[0] ?? 'User',
        email: email.toLowerCase(),
        role: getRoleFromUser(email, null),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0] ?? 'User')}&background=6C63FF&color=fff`,
        balance: 0,
        createdAt: new Date().toISOString(),
      };

      console.log('Clerk login successful for:', updatedUser.email, 'role:', updatedUser.role);
      return { user: updatedUser, token };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setLoginError(errorMessage);
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  }, [clerkUser, getToken, setSignInActive, signIn, signInLoaded]);

  const register = useCallback(async (email: string, password: string, name: string): Promise<AuthResponse> => {
    console.log('Attempting Clerk signup for:', email);
    setRegisterError(null);
    setIsRegistering(true);

    try {
      if (!signUpLoaded || !setSignUpActive) {
        throw new Error('Authentication is still loading. Please try again.');
      }

      const trimmedName = name.trim();
      const nameParts = trimmedName.split(' ').filter(Boolean);
      const firstName = nameParts[0] ?? 'User';
      const lastName = nameParts.slice(1).join(' ') || undefined;

      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      if (result.status !== 'complete' || !result.createdSessionId) {
        console.error('Clerk signup incomplete status:', result.status);
        throw new Error('Signup needs additional verification in Clerk settings before continuing.');
      }

      await setSignUpActive({ session: result.createdSessionId });

      const token = (await getToken()) ?? '';
      const updatedUser = mapClerkUserToAuthUser(clerkUser) ?? {
        id: `pending-${email.toLowerCase()}`,
        name: trimmedName,
        email: email.toLowerCase(),
        role: getRoleFromUser(email, null),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(trimmedName)}&background=6C63FF&color=fff`,
        balance: 0,
        createdAt: new Date().toISOString(),
      };

      console.log('Clerk signup successful for:', updatedUser.email, 'role:', updatedUser.role);
      return { user: updatedUser, token };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setRegisterError(errorMessage);
      throw error;
    } finally {
      setIsRegistering(false);
    }
  }, [clerkUser, getToken, setSignUpActive, signUp, signUpLoaded]);

  const logout = useCallback(async () => {
    await signOut();
    console.log('User logged out from Clerk');
  }, [signOut]);

  return {
    user,
    token: null,
    isLoading: !userLoaded,
    isInitialized: userLoaded,
    isAuthenticated: !!isSignedIn,
    isAdmin: user?.role === 'admin',
    isReader: user?.role === 'reader',
    isClient: user?.role === 'client',
    login,
    register,
    logout,
    loginError,
    registerError,
    isLoggingIn,
    isRegistering,
  };
});
