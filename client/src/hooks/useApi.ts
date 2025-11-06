import { useState, useCallback } from 'react';
import { api } from '@/services/api';
import { APIError } from '@/types';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseApiResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await apiFunction(...args);
        setData(result);
        options.onSuccess?.(result);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An unexpected error occurred');
        setError(error);
        options.onError?.(error);
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction, options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, error, isLoading, execute, reset };
}

// Example usage:
// const { data: documents, error, isLoading, execute: fetchDocuments } = useApi(api.getDocuments);

export function useDocuments() {
  return useApi(api.getDocuments.bind(api));
}

export function useUploadDocument() {
  return useApi(api.uploadDocument.bind(api));
}

export function useWorkflows() {
  return useApi(api.getWorkflows.bind(api));
}

export function useProcessText() {
  return useApi(api.processText.bind(api));
}

export function useOCR() {
  return useApi(api.processOCR.bind(api));
}

export function useAuth() {
  const login = useApi(api.login.bind(api));
  const register = useApi(api.register.bind(api));
  const logout = useApi(api.logout.bind(api));
  const profile = useApi(api.getUserProfile.bind(api));

  return {
    login,
    register,
    logout,
    profile,
  };
}