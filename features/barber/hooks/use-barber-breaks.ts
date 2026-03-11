"use client";

import type { BarberBreak } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import {
  createBarberBreakAction,
  deleteBarberBreakAction,
  getBarberBreaksByBarberIdAction,
  patchBarberBreakAction,
} from "@/features/barber/actions/barber-break-actions";
import { useSafeQuery } from "@/hooks/use-safe-query";

export function useBarberBreakCRUD(barberId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["barberBreaks", barberId];

  function updateCache(
    updateFn: (old: BarberBreak[] | undefined) => BarberBreak[],
  ) {
    queryClient.setQueryData(queryKey, updateFn);
  }

  const { executeAsync: fetchBarberBreaks } = useAction(
    getBarberBreaksByBarberIdAction,
  );
  const { data, isLoading, isError } = useSafeQuery<{
    barberBreaks: BarberBreak[];
  }>(queryKey, () => fetchBarberBreaks({ barberId }));

  const { executeAsync: execCreate, isPending: isCreating } =
    useAction(createBarberBreakAction);
  const { executeAsync: execUpdate, isPending: isUpdating } =
    useAction(patchBarberBreakAction);
  const { executeAsync: execDelete } = useAction(deleteBarberBreakAction);

  const createBarberBreak = async (
    input: { barberId: string; dayOfWeek: number; startTime: string; endTime: string },
  ) => {
    const result = await execCreate(input);
    if (!result?.data?.barberBreak) return;
    toast.success("Intervalo criado com sucesso!");
    updateCache(old => [...(old ?? []), result.data!.barberBreak]);
  };

  const updateBarberBreak = async (
    input: { barberBreakId: string; dayOfWeek: number; startTime: string; endTime: string },
  ) => {
    const result = await execUpdate(input);
    if (!result?.data?.barberBreak) return;
    toast.success("Intervalo atualizado com sucesso!");
    const updated = result.data.barberBreak;
    updateCache(old =>
      old ? old.map(b => (b.id === updated.id ? updated : b)) : [updated],
    );
  };

  const deleteBarberBreak = async (barberBreakId: string) => {
    const result = await execDelete({ barberBreakId });
    if (!result?.data?.barberBreakId) return;
    toast.success("Intervalo deletado com sucesso!");
    updateCache(old => (old ? old.filter(b => b.id !== barberBreakId) : []));
  };

  return {
    barberBreaks: data?.barberBreaks,
    isLoading,
    isError,
    createBarberBreak,
    updateBarberBreak,
    deleteBarberBreak,
    isCreating,
    isUpdating,
  };
}
