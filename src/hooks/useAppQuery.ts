import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

export const DEFAULT_STALE_TIME = 1000 * 60;

export function useAppQuery<TData, TError = Error, TSelected = TData>(
  options: UseQueryOptions<TData, TError, TSelected>,
): UseQueryResult<TSelected, TError> {
  return useQuery({
    staleTime: DEFAULT_STALE_TIME,
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
}
