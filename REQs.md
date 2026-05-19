# Documentação de Requisições do Sistema (Barbearia SaaS)

Este documento lista todas as requisições (comunicações entre Cliente e Servidor, bem como Webhooks externos) mapeadas no sistema. Sendo um projeto Next.js (App Router), a grande maioria das requisições ocorre através de **Server Actions** chamadas pelo cliente, muitas vezes acopladas ao React Query (`@tanstack/react-query`). 

## 1. Agendamentos (Booking) - `features/booking/`

### Ações (Actions & Functions)
- **`confirmBookingAction`**: Confirma um agendamento após a realização do checkout.
- **`getBookingsUserIdAction`**: Retorna todos os agendamentos pertencentes ao ID do usuário atual (cliente).
- **`getNextBookingAction`**: Recupera o próximo agendamento (mais próximo no futuro) do usuário.
- **`getBookingsBarberAction`**: Retorna a lista de agendamentos associados a um barbeiro específico.
- **`getHistory`**: Retorna o histórico de agendamentos passados do usuário.
- **`getLastBookingAction`**: Recupera a informação do último agendamento realizado.
- **`getNotConfirmedBookings`**: Retorna os agendamentos de um barbeiro que ainda não foram confirmados.
- **`cancelBookingAction`**: Realiza o cancelamento de um agendamento existente.
- **`createBooking`**: Cria um novo agendamento de forma padrão.
- **`createBookingWithoutSession`**: Cria um agendamento quando não há uma sessão de usuário ativa (ex: agendamento manual ou convidado).
- **`createBookingCheckoutSession`**: Inicia a sessão de checkout (ex: Stripe) vinculada a um agendamento.
- **`cancelBookingCheckoutSession`**: Cancela a sessão de checkout de um agendamento que não foi finalizado.
- **`getDateAvailableTimeSlots`**: Consulta e retorna todos os horários disponíveis para agendamento em uma data específica.

## 2. Barbeiros e Configurações (Barber) - `features/barber/`

### Ações (Actions)
- **`getBarbersAction`**: Retorna a lista de barbeiros cadastrados no sistema.
- **`getSettingsByBarberIdAction`**: Retorna as configurações gerais (horários de funcionamento, preferências) de um barbeiro.
- **`createDisponibilityAction`**: Cria/define as disponibilidades de horários de um barbeiro.
- **`createBarber`**: Cria o registro de um novo barbeiro no sistema.

#### Exceções de Datas (Folgas/Feriados)
- **`getExceptionDatesByBarberIdAction`**: Lista as datas de exceção (dias sem atendimento) de um barbeiro.
- **`createExceptionDateAction`**: Adiciona uma nova data de exceção.
- **`patchExceptionDateAction`**: Atualiza as informações de uma data de exceção existente.
- **`deleteExceptionDateAction`**: Remove uma data de exceção.

#### Pausas/Intervalos (Breaks)
- **`getBarberBreaksByBarberIdAction`**: Lista as pausas diárias (almoço, descanso) de um barbeiro.
- **`createBarberBreakAction`**: Cria um novo intervalo de pausa.
- **`patchBarberBreakAction`**: Modifica um intervalo de pausa.
- **`deleteBarberBreakAction`**: Exclui um intervalo de pausa.

## 3. Serviços (Service) - `features/service/`

### Ações (Actions)
- **`getServicesByBarberIdAction`**: Lista os serviços (cortes, barba, etc.) oferecidos por um barbeiro.
- **`createServiceAction`**: Cadastra um novo serviço.
- **`patchServiceAction`**: Atualiza os dados (nome, preço, duração) de um serviço.
- **`deleteServiceAction`**: Remove um serviço.

## 4. Assinaturas (Signature/Subscription) - `features/signature/`

### Ações (Actions)
- **`createSignature`**: Inicia o processo de criação de uma assinatura SaaS para o estabelecimento/barbeiro.
- **`cancelSignature`**: Processa o cancelamento de uma assinatura ativa.
- **`getCurrentSubscription`**: *(Mapeado via handler interno)* Recupera o status da assinatura atual.

## 5. Dashboard do Barbeiro - `features/dashboard_barber/`

### Ações (Actions)
- **`getBarberDefaultTimes`**: Retorna os horários padrões configurados do barbeiro logado.
- **`getBarberDashboardInfos`**: Retorna métricas e indicadores consolidados para o dashboard do barbeiro (ex: receita, total de agendamentos).
- **`getTimeline`**: Retorna a linha do tempo cronológica das atividades e agendamentos do dia para o barbeiro.

## 6. Avaliações (Rating) - `features/rating/`

### Ações (Actions)
- **`RatingAction`**: Processa a submissão de uma avaliação (nota, comentário) feita por um cliente referente a um atendimento.

## 7. Painel Administrativo (Admin) - `app/(protected)/admin/`

### Ações (Actions)
- **`getAdminDashboardInfos`**: Retorna os dados agregados para o dashboard do administrador geral do sistema (SaaS admin).

## 8. Rotas de API e Webhooks - `app/api/`

Essas são requisições HTTP tradicionais que o sistema expõe para integrações externas e autenticação:

### Autenticação (Better-Auth)
- **`[POST/GET] /api/auth/[...all]`**: Rotas gerenciadas pelo pacote `better-auth`. Processam login, logout, registro, validação de sessão e callbacks de OAuth (se aplicável).

<!-- ### Webhook do Stripe (Pagamentos/Assinaturas)
- **`[POST] /api/stripe/webhook`**: Recebe eventos transacionais do Stripe. Lida com os seguintes tipos de evento:
  - `checkout.session.completed`: Processa a finalização de um checkout (confirma agendamento pago ou nova assinatura).
  - `charge.refunded`: Processa um estorno/reembolso.
  - `customer.subscription.updated`: Atualiza o status da assinatura no banco de dados quando ela sofre alteração no Stripe.
  - `invoice.paid`: Marca faturas recorrentes como pagas.
  - `customer.subscription.deleted`: Desativa os recursos da conta quando a assinatura é cancelada e expira. -->
