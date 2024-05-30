'use client';

import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth/client';

interface UseUserTypeResult {
  userType: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useUserType(): UseUserTypeResult {
  const [userType, setUserType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const { data, error } = await authClient.getUser();

        if (error) {
          setError('Failed to fetch user type');
          setIsLoading(false);
          return;
        }

        if (data) {
          setUserType(data.role ?? null);
        }

        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch user type');
        setIsLoading(false);
      }
    };

    fetchUserType();
  }, []);

  return { userType, isLoading, error };
}
