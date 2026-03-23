"use client";

import type { BarberService } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import {
  createServiceAction,
  deleteServiceAction,
  getServicesByBarberIdAction,
  patchServiceAction,
} from "@/features/service/actions/service-actions";
import type { serviceSchemaType } from "@/features/service/schema/serviceSchema";
import { useSafeQuery } from "@/hooks/use-safe-query";

export function useServicesCRUD(barberId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["services", barberId];

  function updateCache(
    updateFn: (old: BarberService[] | undefined) => BarberService[],
  ) {
    queryClient.setQueryData(
      queryKey,
      (old: { services: BarberService[] } | null | undefined) => {
        const current = old?.services;
        const updated = updateFn(current);
        return { services: updated };
      },
    );
  }

  const { executeAsync: fetchServices } = useAction(
    getServicesByBarberIdAction,
  );
  const { data, isLoading, isError } = useSafeQuery<{
    services: BarberService[];
  }>(queryKey, () => fetchServices({ barberId }));

  const { executeAsync: execCreate, isPending: isCreating } =
    useAction(createServiceAction);
  const { executeAsync: execUpdate, isPending: isUpdating } =
    useAction(patchServiceAction);
  const { executeAsync: execDelete } = useAction(deleteServiceAction);

  const createService = async (
    input: { barberId: string } & serviceSchemaType,
  ) => {
    const result = await execCreate(input);
    if (!result?.data?.service) return;
    toast.success("Serviço criado com sucesso!");
    updateCache(old => [...(old ?? []), result.data!.service]);
  };

  const updateService = async (
    input: { serviceId: string } & serviceSchemaType,
  ) => {
    const result = await execUpdate(input);
    if (!result?.data?.service) return;
    toast.success("Serviço atualizado com sucesso!");
    const updated = result.data.service;
    updateCache(old =>
      old ? old.map(s => (s.id === updated.id ? updated : s)) : [updated],
    );
  };

  const deleteService = async (serviceId: string) => {
    const result = await execDelete({ serviceId });
    if (!result?.data?.serviceId) return;
    toast.success("Serviço deletado com sucesso!");
    updateCache(old => (old ? old.filter(s => s.id !== serviceId) : []));
  };

  return {
    services: data?.services,
    isLoading,
    isError,
    createService,
    updateService,
    deleteService,
    isCreating,
    isUpdating,
  };
}
