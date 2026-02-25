"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import {
  createDisponibilityAction,
  getSettingsByBarberIdAction,
} from "@/features/barber/actions/barber-actions";
import type { TimesSchemaData } from "@/features/booking/schema/timesSchema";
import { useSafeQuery } from "@/hooks/use-safe-query";

type SettingsData = {
  barberId: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
};

export function useSettingsBarber(barberId: string) {
  const queryKey = ["settings", barberId];
  const queryClient = useQueryClient();

  const { executeAsync: fetchSettings } = useAction(
    getSettingsByBarberIdAction,
  );
  const { data, isLoading, isError } = useSafeQuery<{
    settings: SettingsData | null;
  }>(queryKey, () => fetchSettings({ barberId }));

  const { executeAsync: saveDisponibility, isPending: isSaving } = useAction(
    createDisponibilityAction,
  );

  const saveSettings = async (formData: TimesSchemaData) => {
    const result = await saveDisponibility({ ...formData, barberId });
    if (result?.serverError || result?.validationErrors) {
      toast.error("Erro ao salvar configurações.");
      return;
    }
    toast.success("Horários salvos com sucesso!");

    if (result?.data?.settings) {
      queryClient.setQueryData(queryKey, result.data);
    } else {
      queryClient.invalidateQueries({ queryKey });
    }
  };

  return {
    settings: data?.settings ?? null,
    isLoading,
    isError,
    saveSettings,
    isSaving,
  };
}
