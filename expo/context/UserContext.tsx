import createContextHook from '@nkzw/create-context-hook';
import { useState } from 'react';
import { apiService } from '@/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';

export const [UserContext, useUser] = createContextHook(() => {
  const [isReaderOnline, setIsReaderOnline] = useState(false);
  const queryClient = useQueryClient();
  const { user: authUser, isLoading: authLoading, isAuthenticated, logout } = useAuth();

  const addFundsMutation = useMutation({
    mutationFn: ({ userId, amount }: { userId: string; amount: number }) => 
      apiService.addFunds(userId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'current'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ readerId, isOnline }: { readerId: string; isOnline: boolean }) => 
      apiService.updateReaderStatus(readerId, isOnline),
    onSuccess: () => {
      setIsReaderOnline((prev) => !prev);
    },
  });

  const addFunds = (amount: number) => {
    if (authUser?.id) {
      addFundsMutation.mutate({ userId: authUser.id, amount });
    }
  };

  const toggleOnlineStatus = () => {
    if (authUser?.id && authUser?.role === 'reader') {
      toggleStatusMutation.mutate({ readerId: authUser.id, isOnline: !isReaderOnline });
    }
  };

  const toggleRole = () => {
    console.log('Role switching is managed by authentication system');
  };

  return {
    user: authUser || null,
    isLoading: authLoading,
    error: null,
    isAuthenticated,
    isReaderOnline,
    toggleRole,
    toggleOnlineStatus,
    addFunds,
    logout,
  };
});
