# Checklist de Padronizacao de Fuso Horario

Este guia e para padronizar data/hora sem quebrar o sistema todo de uma vez.

## Regra base

- `booking.date` (`Timestamptz`): salvar sempre como instante UTC.
- Horarios comerciais (`disponibility`, `barberBreak`, `exceptionDate` por horario): tratar como hora local da barbearia (`HH:mm`).
- Exibicao de data/hora: sempre formatar com `DEFAULT_TIMEZONE`.

## Ordem segura de migracao

1. Criar util central de timezone (`utils/timezone.ts`)
   - `formatInBarberTimezone(date, pattern)`
   - `getBarberDayRange(date)`
   - `combineDateAndTimeInBarberTimezone(date, timeHHmm)`
   - `isSameBarberDay(a, b)`

2. Blindar criacao de agendamento no server
   - `features/booking/functions/create-booking.ts`
   - `features/booking/functions/create-booking-without-session.ts`
   - Evitar depender de `setHours` no client para montar instante final.

3. Padronizar calculo de slots disponiveis
   - `features/booking/functions/get-date-available-time-slots.ts`
   - Usar range diario no fuso da barbearia.
   - Evitar `toISOString().slice(...)` para regra de horario local.

4. Revisar montagem de data/hora no client
   - `shared/components/appointment-sheet.tsx`
   - `features/dashboard_barber/components/new-booking-manual-dialog.tsx`
   - Preferir enviar `date + time` e montar no server com helper central.

5. Padronizar filtros de "hoje/passado/futuro"
   - `features/booking/functions/get-bookings.ts`
   - `features/booking/actions/get-notconfirmed-bookings-barber-action.ts`
   - `features/booking/actions/get-history.ts`
   - `features/booking/hooks/useBookings.ts`
   - `features/booking/components/booking-client.tsx`

6. Padronizar exibicao
   - Centralizar formatacao em helper com `DEFAULT_TIMEZONE`.
   - Evitar `toLocaleString` sem timezone explicito.

## Testes manuais obrigatorios

- Booking `15:00` com duracao `3h` e expediente ate `18:00`.
- Janela `21:00` ate `00:00`.
- Virada de dia (`23:30` -> `00:15`).
- Usuario em timezone diferente da barbearia.
- Excecao parcial (`ExceptionDate` com inicio/fim).

## Objetivo final

Centralizar as regras de tempo no backend/utilitarios, reduzir logica de timezone no client e garantir consistencia em busca, criacao, validacao e exibicao.
