/** biome-ignore-all lint/suspicious/noArrayIndexKey: <Pode usar índice no skeleton> */
"use client";

import type { ExceptionDate } from "@prisma/client";
import { useMemo } from "react";
import { useExceptionDates } from "@/features/barber/hooks/use-exception-dates";
import { BookingSkeleton } from "@/features/booking/components/booking-skeleton";
import CancelAlertDialog from "@/shared/components/cancel-alert-dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { timeDateToString } from "@/utils/convertTimes";

interface ExceptionsCardProps {
  barberId: string;
}

function isPastException(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return target < today;
}

function getTimeLabel(exception: ExceptionDate) {
  if (exception.isClosedFullTime) {
    return "Fechado o dia todo";
  }

  if (exception.startTime && exception.endTime) {
    return `${timeDateToString(new Date(exception.startTime))} - ${timeDateToString(new Date(exception.endTime))}`;
  }

  return "Horário parcial";
}

function ExceptionCardItem({
  exception,
  isDeleting,
  onDelete,
}: {
  exception: ExceptionDate;
  isDeleting: boolean;
  onDelete: () => void;
}) {
  const date = new Date(exception.date);

  return (
    <CancelAlertDialog
      handleCancel={onDelete}
      isLoading={isDeleting}
      title="Excluir exceção"
      description={
        <span>
          Tem certeza que deseja excluir a exceção do dia{" "}
          <strong>
            {date.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </strong>
          {exception.motivo ? (
            <>
              {" "}
              (<strong>{exception.motivo}</strong>)
            </>
          ) : null}
          ? Esta ação não pode ser desfeita.
        </span>
      }
      cancelButtonText="Não, manter exceção"
      confirmText="Sim, excluir"
      loadingText="Excluindo..."
    >
      <Card className="flex w-full min-w-full cursor-pointer flex-row items-center justify-between p-0 transition-opacity hover:opacity-75">
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold text-base">{getTimeLabel(exception)}</p>
            {exception.isClosedFullTime && (
              <Badge variant="secondary">Dia inteiro</Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            {exception.motivo?.trim()
              ? exception.motivo
              : "Sem motivo informado"}
          </p>
          <p className="text-muted-foreground text-xs capitalize">
            {date.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex h-full flex-col items-center justify-center border-l p-4 py-3">
          <p className="text-xs capitalize">
            {date.toLocaleDateString("pt-BR", { month: "long" })}
          </p>
          <p className="font-bold text-xl capitalize">
            {date.toLocaleDateString("pt-BR", { day: "2-digit" })}
          </p>
          <p className="text-xs capitalize">
            {date.toLocaleDateString("pt-BR", { year: "numeric" })}
          </p>
        </div>
      </Card>
    </CancelAlertDialog>
  );
}

export function ExceptionsCard({ barberId }: ExceptionsCardProps) {
  const { exceptionDates, isLoading, isDeleting, deleteExceptionDate } =
    useExceptionDates(barberId);

  const sorted = useMemo(() => {
    if (!exceptionDates) {
      return [];
    }

    return [...exceptionDates].sort((a, b) => {
      const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateDiff !== 0) {
        return dateDiff;
      }

      const aStart = a.startTime ? new Date(a.startTime).getTime() : 0;
      const bStart = b.startTime ? new Date(b.startTime).getTime() : 0;
      return aStart - bStart;
    });
  }, [exceptionDates]);

  const upcoming = useMemo(
    () => sorted.filter(item => !isPastException(new Date(item.date))),
    [sorted],
  );
  const past = useMemo(
    () => sorted.filter(item => isPastException(new Date(item.date))),
    [sorted],
  );

  const tabs = [
    { label: "Próximas", value: "upcoming" },
    { label: "Passadas", value: "past" },
  ] as const;

  const emptyMessages: Record<(typeof tabs)[number]["value"], string> = {
    upcoming: "Você não tem exceções futuras.",
    past: "Você não tem exceções passadas.",
  };

  const Skeleton = (
    <div className="flex flex-col gap-4">
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <BookingSkeleton key={`exception-skeleton-${index}`} />
        ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-6 self-end">
      <Tabs defaultValue={tabs[0].value}>
        <TabsList className="mb-4">
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map(tab => {
          const list = tab.value === "upcoming" ? upcoming : past;

          return (
            <TabsContent key={tab.value} value={tab.value}>
              {isLoading ? (
                Skeleton
              ) : list.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  {emptyMessages[tab.value]}
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {list.map(exception => (
                    <ExceptionCardItem
                      key={exception.id}
                      exception={exception}
                      isDeleting={isDeleting}
                      onDelete={() => deleteExceptionDate(exception.id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
