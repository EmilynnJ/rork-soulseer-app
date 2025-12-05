import createContextHook from '@nkzw/create-context-hook';
import { useState } from 'react';

type UserRole = 'client' | 'reader' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  balance: number;
}

const DEFAULT_USER: User = {
  id: 'u1',
  name: 'Sarah Anderson',
  email: 'sarah.anderson@example.com',
  role: 'client', // Default role
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop',
  balance: 45.00,
};

// Mock Reader Profile for when switching to reader
const READER_PROFILE = {
  id: 'r1',
  name: 'Mystic Sarah',
  email: 'sarah.reader@soulseer.app',
  role: 'reader' as const,
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&fit=crop',
  balance: 1250.50,
};

export const [UserContext, useUser] = createContextHook(() => {
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [isReaderOnline, setIsReaderOnline] = useState(false);

  const toggleRole = () => {
    if (user.role === 'client') {
      setUser({ ...READER_PROFILE, role: 'reader' });
    } else {
      setUser({ ...DEFAULT_USER, role: 'client' });
    }
  };

  const toggleOnlineStatus = () => {
    setIsReaderOnline((prev) => !prev);
  };

  const addFunds = (amount: number) => {
    setUser((prev) => ({ ...prev, balance: prev.balance + amount }));
  };

  return {
    user,
    isReaderOnline,
    toggleRole,
    toggleOnlineStatus,
    addFunds,
  };
});
