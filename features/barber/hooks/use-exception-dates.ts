"use client";

import type { ExceptionDate } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import {
  createExceptionDateAction,
  deleteExceptionDateAction,
  getExceptionDatesByBarberIdAction,
  patchExceptionDateAction,
} from "@/features/barber/actions/exception-date-actions";
import type { ExceptionDateFormSchemaType } from "@/features/barber/schema/exception-date-schema";
import { useSafeQuery } from "@/hooks/use-safe-query";

export function useExceptionDates(barberId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["exceptionDates", barberId];

  function updateCache(
    updateFn: (old: ExceptionDate[] | undefined) => ExceptionDate[],
  ) {
    queryClient.setQueryData(
      queryKey,
      (old: { exceptionDates: ExceptionDate[] } | null | undefined) => {
        const current = old?.exceptionDates;
        const updated = updateFn(current);
        return { exceptionDates: updated };
      },
    );
  }

  const { executeAsync: fetchExceptionDates } = useAction(
    getExceptionDatesByBarberIdAction,
  );

  const { data, isLoading, isError } = useSafeQuery<{
    exceptionDates: ExceptionDate[];
  }>(queryKey, () => fetchExceptionDates({ barberId }));

  const { executeAsync: execCreate, isPending: isCreating } = useAction(
    createExceptionDateAction,
  );
  const { executeAsync: execUpdate, isPending: isUpdating } = useAction(
    patchExceptionDateAction,
  );
  const { executeAsync: execDelete, isPending: isDeleting } = useAction(
    deleteExceptionDateAction,
  );

  const syncAvailableSlots = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["date-available-time-slots"],
    });
  };

  const createExceptionDate = async (input: ExceptionDateFormSchemaType) => {
    const result = await execCreate({ ...input, barberId });

    if (!result?.data?.exceptionDate) {
      toast.error("Erro ao criar exceção de data.");
      return;
    }

    toast.success("Exceção de data criada com sucesso!");
    updateCache(old => [...(old ?? []), result.data!.exceptionDate]);
    await syncAvailableSlots();
  };

  const updateExceptionDate = async (input: {
    exceptionDateId: string;
    data: ExceptionDateFormSchemaType;
  }) => {
    const result = await execUpdate({
      exceptionDateId: input.exceptionDateId,
      ...input.data,
    });

    if (!result?.data?.exceptionDate) {
      toast.error("Erro ao atualizar exceção de data.");
      return;
    }

    toast.success("Exceção de data atualizada com sucesso!");
    const updated = result.data.exceptionDate;
    updateCache(old =>
      old
        ? old.map(item => (item.id === updated.id ? updated : item))
        : [updated],
    );
    await syncAvailableSlots();
  };

  const deleteExceptionDate = async (exceptionDateId: string) => {
    const result = await execDelete({ exceptionDateId });

    if (!result?.data?.exceptionDateId) {
      toast.error("Erro ao deletar exceção de data.");
      return;
    }

    toast.success("Exceção de data deletada com sucesso!");
    updateCache(old =>
      old ? old.filter(item => item.id !== exceptionDateId) : [],
    );
    await syncAvailableSlots();
  };

  return {
    exceptionDates: data?.exceptionDates,
    isLoading,
    isError,
    isCreating,
    isUpdating,
    isDeleting,
    createExceptionDate,
    updateExceptionDate,
    deleteExceptionDate,
  };
}
