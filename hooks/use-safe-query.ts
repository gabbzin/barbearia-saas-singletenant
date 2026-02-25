"use client";

import { useQuery } from "@tanstack/react-query";

export function useSafeQuery<TData>(
  queryKey: unknown[],
  queryFn: () => Promise<
    | { data?: TData; serverError?: string; validationErrors?: unknown }
    | undefined
  >,
  options?: { enabled?: boolean },
) {
  const { data, isLoading, isError } = useQuery<TData | null>({
    queryKey,
    queryFn: async () => {
      const result = await queryFn();
      if (result?.serverError || result?.validationErrors) return null;
      return result?.data ?? null;
    },
    ...options,
  });

  return { data: data ?? null, isLoading, isError };
}
