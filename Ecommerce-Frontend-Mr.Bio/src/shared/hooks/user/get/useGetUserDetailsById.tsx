import { useQuery } from '@tanstack/react-query';
import { API } from '../../../../services/api';

interface UseGetByIdOptions<T> {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
}

export function useGetUserDetailsById<T>(
  id: string | number | undefined,
  options?: UseGetByIdOptions<T>
) {
  return useQuery<T, Error>({
    queryKey: ['userDetails', id], // Fixed query key
    queryFn: () => {
      if (!id) {
        throw new Error('ID is required');
      }
      return API.get<T>(`users/${id}`).then((response) => response.data);
    },
    enabled: options?.enabled !== false && !!id,
    staleTime: options?.staleTime ?? 60_000,
    gcTime: options?.gcTime ?? 300_000,
    ...(options || {}),
  });
}