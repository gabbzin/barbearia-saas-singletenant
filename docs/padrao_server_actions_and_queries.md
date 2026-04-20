# Padrão de Server Actions e TanStack Query

Este documento descreve o padrão adotado no projeto para:

- Server Actions com **next-safe-action** (`actionClient`)
- Hooks de client usando **TanStack Query** (`useSafeQuery`) e **useAction**

## 1. Onde criar o quê

- **Funções de domínio/infra (Prisma puro, lógica de negócio):**
  - `features/<feature>/functions` ou `features/<feature>/services`
  - Nunca chamadas direto do client.
- **Server Actions públicas (chamadas do client):**
  - `features/<feature>/actions`
  - Sempre usando `actionClient` de `@/lib/actionClient`.
- **Hooks de client (React):**
  - `features/<feature>/hooks`
  - Usam `useAction` (next-safe-action) e/ou `useSafeQuery` (TanStack Query).

## 2. Padrão de Server Action com next-safe-action

Sempre seguir esta estrutura básica:

```ts
"use server";

import { returnValidationErrors } from "next-safe-action";
import { z } from "zod";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";

const inputSchema = z.object({
  // campos de entrada tipados e validados
});

export const minhaAction = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput }) => {
    const session = await verifySession();

    if (!session) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Usuário não autenticado."],
      });
    }

    // (Opcional) Regras de autorização adicionais
    // if (session.id !== parsedInput.userId) { ... }

    // Lógica principal (chamando funções/prisma de functions/services)
    const result = await prisma.algumaCoisa.findMany({ ... });

    // Retornar sempre um objeto bem definido
    return { result };
  });
```

**Regras importantes:**

- Sempre usar `return returnValidationErrors(...)` (com `return`) para interromper a execução.
- Nunca acessar Prisma direto no client; sempre através de uma server action.
- Para ações sensíveis (criar/editar/deletar, confirmar/cancelar, etc.), **sempre** validar sessão/role.

Exemplos no projeto:

- `features/booking/actions/get-last-booking.ts`
- `features/service/actions/service-actions.ts`
- `features/barber/actions/barber-actions.ts`
- `features/booking/actions/get-bookings-barber-action.ts`

## 3. Helper de query: useSafeQuery

Local: `hooks/use-safe-query.ts`

```ts
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
```

**Ideia:**

- Recebe um `queryFn` baseado em `useAction().executeAsync` (next-safe-action).
- Ignora automaticamente `serverError` / `validationErrors` retornando `null`.
- Expõe a interface padrão do TanStack Query: `{ data, isLoading, isError }`.

## 4. Padrão de hook de leitura (queries)

Exemplo: buscar barbeiros (`useBarbers`):

```ts
"use client";

import type { Barber } from "@prisma/client";
import { useAction } from "next-safe-action/hooks";
import { getBarbersAction } from "@/features/barber/actions/get-barbers-action";
import { useSafeQuery } from "@/hooks/use-safe-query";

export function useBarbers() {
  const { executeAsync } = useAction(getBarbersAction);

  const { data, isLoading } = useSafeQuery<{ barbers: Barber[] }>(
    ["barbers"],
    () => executeAsync(),
  );

  return { barbers: data?.barbers ?? null, isPending: isLoading } as const;
}
```

Exemplo: buscar bookings do barbeiro (`useBookings`):

```ts
"use client";

import type { Booking } from "@prisma/client";
import { useAction } from "next-safe-action/hooks";
import { getBookingsBarberAction } from "@/features/booking/actions/get-bookings-barber-action";
import { useSafeQuery } from "@/hooks/use-safe-query";

export function useBookings(barberId: string) {
  const { executeAsync } = useAction(getBookingsBarberAction);

  const { data, isLoading, isError } = useSafeQuery<{ bookings: Booking[] }>(
    ["bookings", barberId],
    () => executeAsync({ barberId }),
  );

  return { data: data?.bookings ?? null, isLoading, isError };
}
```

**Regras:**

- Sempre tipar `useSafeQuery<TData>` com o shape exato retornado pela action (`{ barbers: Barber[] }`, `{ bookings: Booking[] }`, etc.).
- `queryKey` deve ser estável e incluir os parâmetros (ex.: `["bookings", barberId]`).

## 5. Padrão de hook de escrita (mutations)

Exemplo: CRUD de serviços (`useServicesCRUD`):

- Ações de escrita são server actions:
  - `createServiceAction`
  - `patchServiceAction`
  - `deleteServiceAction`
- O hook usa `useAction` e atualiza o cache do React Query manualmente:

```ts
const { executeAsync: execCreate, isPending: isCreating } = useAction(createServiceAction);

const createService = async (input: { barberId: string } & serviceSchemaType) => {
  const result = await execCreate(input);
  if (!result?.data?.service) return;
  toast.success("Serviço criado com sucesso!");
  updateCache(old => [...(old ?? []), result.data.service]);
};
```

**Regras:**

- Mutations usam `useAction` direto (não `useSafeQuery`).
- Sempre tratar `serverError` / `validationErrors` antes de assumir sucesso.
- Atualizar cache via `queryClient.setQueryData` ou `invalidateQueries`.

Exemplo de atualização de cache em `useSettingsBarber`:

```ts
const queryKey = ["settings", barberId];
const queryClient = useQueryClient();

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
```

## 6. Exceções

- Funções puramente de leitura usadas **apenas no server** (por exemplo, no layout ou em outras actions) podem continuar como helpers `"use server"` em `functions/` ou `services/`.
- Elas não devem ser chamadas diretamente do client; o client fala sempre com server actions em `actions/`.

## 7. Checklist rápido

Antes de criar uma nova chamada de dados:

1. **É leitura ou escrita?**
   - Leitura: crie server action em `actions/` + hook com `useSafeQuery`.
   - Escrita: crie server action em `actions/` + hook com `useAction`.
2. **Tem validação?**
   - Use `zod` + `.inputSchema`.
3. **Tem auth/autorização?**
   - Use `verifySession` (ou `auth.api.getSession`) e, se necessário, cheque `role`/`id`.
4. **Atualiza UI/caches?**
   - Para lecturas: `useSafeQuery` já cuida da parte de estado.
   - Para mutações: atualize ou invalide o cache via React Query.
