import createContextHook from '@nkzw/create-context-hook';
import { useState } from 'react';
import { apiService } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const [UserContext, useUser] = createContextHook(() => {
  const [isReaderOnline, setIsReaderOnline] = useState(false);
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', 'current'],
    queryFn: () => apiService.getCurrentUser(),
    retry: false,
  });

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
    if (user?.id) {
      addFundsMutation.mutate({ userId: user.id, amount });
    }
  };

  const toggleOnlineStatus = () => {
    if (user?.id && user?.role === 'reader') {
      toggleStatusMutation.mutate({ readerId: user.id, isOnline: !isReaderOnline });
    }
  };

  const toggleRole = () => {
    console.log('Role switching is managed by authentication system');
  };

  return {
    user: user || null,
    isLoading,
    error,
    isReaderOnline,
    toggleRole,
    toggleOnlineStatus,
    addFunds,
  };
});
