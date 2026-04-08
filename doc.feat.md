# Features a desenvolver na versão 1.7

## Direção da versão

- Objetivo principal: transformar o agendamento em fluxo de carrinho (estilo e-commerce), com cálculo automático de duração total e preço total.
- Escopo do pagamento: somente presencial no estabelecimento (sem Stripe neste repositório).
- Estratégia: MVP estruturado (rápido de entregar, sem criar dívida técnica desnecessária).

## Funcionalidades prioritárias

- Reconstruir tela do dashboard para ficar responsiva e bonita (em andamento).
- Adicionar cache nos bookings.
- Recriar formulário de criar agendamento com botão "Adicionar" para montar carrinho.
- Permitir montar combo de serviços no carrinho antes de confirmar horário.
- Calcular horário disponível com base na duração total do combo selecionado.
- Criar agendamento com múltiplos itens de serviço (em vez de fluxo unitário por serviço).

## Mudanças técnicas previstas (MVP estruturado)

### Banco de dados

- Evoluir modelagem para suportar itens de agendamento (ex.: `BookingItem`).
- Manter `Booking` como entidade principal (data, barbeiro, cliente, status, forma de pagamento, totais).
- Ajustar consultas/listagens para exibir resumo de múltiplos serviços por agendamento.

### Backend (Next fullstack)

- Atualizar cálculo de disponibilidade para receber lista de serviços (ou duração total consolidada).
- Atualizar criação de agendamento do cliente para persistir múltiplos itens em transação.
- Atualizar criação manual de agendamento (barbeiro) para seguir o mesmo padrão.

### Frontend

- Trocar ação de "Reservar" por "Adicionar" no card de serviço.
- Adaptar o `appointment-sheet` para exibir carrinho, total e duração total.
- Permitir remover item do carrinho antes da confirmação.
- Confirmar um único horário para o combo completo.

## Fora de escopo da 1.7

- Checkout Stripe, webhooks e reembolso neste repo.
- Integração com backend NestJS (será tratada em etapa futura).

## Critérios de aceite da feature de carrinho

- Usuário consegue adicionar e remover serviços antes de agendar.
- Sistema calcula duração total e só oferece horários válidos para o combo.
- Agendamento final é salvo corretamente com todos os itens do combo.
- Tela de agendamentos mostra resumo coerente do serviço/combinação.

## Checklist de execução (ordem sugerida)

### Fase 1 - Modelagem e base de domínio

- [ ] Definir estrutura final de agendamento com itens (`Booking` + `BookingItem`).
- [ ] Atualizar `prisma/schema.prisma` com nova modelagem e relacionamentos.
- [ ] Rodar migração e validar seed/dados locais.
- [ ] Revisar consultas impactadas por `booking.service` unico.

### Fase 2 - Disponibilidade por combo

- [ ] Atualizar contrato de disponibilidade para aceitar lista de servicos (ou duracao total).
- [ ] Refatorar `features/booking/functions/get-date-available-time-slots.ts` para calcular conflito usando duracao consolidada.
- [ ] Ajustar `features/booking/hooks/use-available-time-slots.ts` para novo payload.
- [ ] Validar cenarios: sem conflito, com conflito parcial, com intervalo, com excecao.

### Fase 3 - Criacao de agendamento com multiplos itens

- [ ] Atualizar `features/booking/functions/create-booking.ts` para criar 1 agendamento com N itens (transacao).
- [ ] Atualizar `features/booking/functions/create-booking-without-session.ts` no mesmo padrao.
- [ ] Garantir calculo de `priceInCents` total no agendamento.
- [ ] Garantir validacoes (servicos repetidos, servico inexistente, data passada).

### Fase 4 - Frontend do carrinho (cliente)

- [ ] Trocar acao principal em `features/service/components/service-item.tsx` para "Adicionar".
- [ ] Subir estado de carrinho em `app/(protected)/client/(no-header)/barbeiro/[id]/page.tsx` (ou contexto local da tela).
- [ ] Adaptar `shared/components/appointment-sheet.tsx` para listar itens, total e duracao total.
- [ ] Permitir remover item e limpar carrinho antes de confirmar.
- [ ] Confirmar horario unico para o combo completo.

### Fase 5 - Listagem e pos-agendamento

- [ ] Ajustar `features/booking/functions/get-bookings.ts` para retornar resumo dos itens.
- [ ] Ajustar `features/booking/components/booking-client.tsx` e `features/booking/components/booking-item.tsx` para exibicao de combo.
- [ ] Ajustar `features/booking/components/cancel-booking.tsx` para valor/resumo corretos.
- [ ] Revisar dashboard/barbeiro para manter consistencia dos dados.

### Fase 6 - Validacao final

- [ ] Testar fluxo completo cliente: adicionar -> escolher data/horario -> confirmar.
- [ ] Testar fluxo completo barbeiro: criacao manual com combo.
- [ ] Testar conflitos de agenda com diferentes combinacoes de servicos.
- [ ] Revisar performance basica das consultas mais usadas.
