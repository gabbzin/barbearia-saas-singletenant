# Resumo da Arquitetura - barbeariaSaaS (Single-Tenant)

Este documento descreve a estrutura, tecnologias, modelo de dados e decisões arquiteturais do projeto de SaaS para Barbearia. Use este texto como contexto inicial ao conversar com Inteligências Artificiais (como ChatGPT, Claude, Gemini Web, Google AI Studio) para obter ajuda com desenvolvimento, refatoração ou novas features.

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 16 (App Router) construído sobre React 19.
- **Linguagem**: TypeScript.
- **Banco de Dados**: PostgreSQL.
- **ORM**: Prisma (`@prisma/client`).
- **Autenticação e Sessões**: Better Auth (`@better-auth/stripe` integrado).
- **Gerenciamento de Estado Global**: Zustand.
- **Data Fetching e Cache**: TanStack React Query (`@tanstack/react-query`).
- **Server Actions Type-Safe**: `next-safe-action`.
- **UI e Estilização**: Tailwind CSS (v4/PostCSS) + shadcn/ui.
- **Componentes Base**: Radix UI.
- **Animações**: Framer Motion / UI Dinâmica com `tw-animate-css`.
- **Pagamentos / Assinaturas**: Stripe (`stripe` e `@stripe/stripe-js`).
- **Envio de E-mails**: Resend + React Email + Nodemailer.
- **Storage**: Vercel Blob para imagens.
- **Validação de Dados**: Zod e React Hook Form.

## 📁 Estrutura de Diretórios (Design Orientado a Funcionalidades)

A aplicação segue uma abordagem modular focada no modelo **Feature-Sliced Design (parcial) / Domain-Driven**, o que facilita escalabilidade:

- **`/app`**: Regras de roteamento (Next.js App Router).
  - `/(auth)`: Rotas de autenticação, login e registro.
  - `/(protected)`: Rotas protegidas divididas por contexto de usuário:
    - `/admin`: Dashboard e configurações do dono da barbearia.
    - `/barber`: Painel, visão de agenda e histórico restrito ao barbeiro.
    - `/client`: Agendamentos e controle da própria assinatura.
    - `/profile`: Edição de perfil e configurações de conta.
  - `/api`: Endpoints REST e Webhooks (ex: Stripe, autenticação).

- **`/features`**: Aqui reside o "coração" da regra de negócios. Cada pasta encapsula componentes, hooks, ações e lógicas de um domínio específico:
  - `barber`: Lida com gerência de barbeiros, disponibilidades e exceções.
  - `booking`: Sistema de agendamentos, verificação de horários, conflitos e workflow de marcação.
  - `dashboard_barber`: Métricas e visualização diária do profissional.
  - `landing_page`: Componentes visuais para captação de clientes.
  - `rating`: Avaliações e feedback de cortes concluídos.
  - `service`: CRUD de serviços oferecidos (ex: Corte, Barba, Pigmentação).
  - `signature`: Lógica de planos de assinatura (Stripe, Tiers).
  - `user`: Gerenciamento de clientes e perfis.

- **`/shared` e `/components`**: Blocos de construção genéricos (UI). Os componentes do shadcn ficam organizados sob `@/shared/components/ui`.
- **`/lib`**: Configurações compartilhadas dos clientes (ex: inicialização do Prisma, configuração do Better Auth, instâncias do Stripe).
- **`/prisma`**: Schemas do banco de dados e migrações.

## 🗄️ Modelo de Dados (Prisma Schema)

O banco é modelado para um ambiente **Single-Tenant** (1 barbearia gerenciando N barbeiros e M clientes).

### Entidades de Usuário e Permissões
- **User**: Conta base com `role` (`USER`, `ADMIN`, `BARBER`), email, senha e integração com Stripe (`stripeCustomerId`). Pode ter uma Assinatura (`Subscription`).
- **Session / Account**: Entidades padrão do Better Auth para gerenciar OAuth, tokens e dispositivos logados.

### Entidades do Negócio (Barbearia)
- **Barbershop**: Configurações globais do estabelecimento (nome, endereço, banners). Em single-tenant, geralmente operamos com um único registro default.
- **Barber**: Perfil estendido para profissionais. Linkado a um usuário. Possui métricas próprias.
- **BarberService**: Os serviços ofertados pelo barbeiro. Define preço (em centavos) e duração estimada em minutos.
- **Disponibility**: Horários regulares de expediente por dia da semana (`dayOfWeek`).
- **BarberBreak**: Pausas recorrentes dentro de um dia (ex: horário de almoço).
- **ExceptionDate**: Férias, feriados ou bloqueios específicos de agenda do profissional.

### Entidades de Fluxo
- **Booking**: O agendamento. Conecta `User`, `Barber`, `Service`. Trabalha com status de máquina de estado: (`SCHEDULED`, `COMPLETED`, `CANCELLED`). Suporta "Ghost Users" (clientes sem conta, cujos dados vão em `customerName/Phone`). Registra também como foi pago (Cobranca Stripe, Assinatura, Físico).
- **Rating**: Nota e avaliação do cliente para um Booking `COMPLETED`.
- **Plan / Subscription**: Estrutura robusta de pagamentos recorrentes espelhando o painel do Stripe (`planId`, `stripeSubscriptionId`, `status: ACTIVE | CANCELED`).

## ⚙️ Padrões Importantes e Fluxos de Dados

1. **Autenticação**: Roles são centrais. O fluxo redireciona conforme a role após o login (Admin -> Dashboard Admin, Barbeiro -> Agenda, User -> Meus Agendamentos).
2. **Data Mutations**: O projeto usa pesadamente Server Actions via `next-safe-action` para validar payload com Zod antes de tocar no Prisma, garantindo segurança contra tampering do cliente.
3. **Ghost Users**: O banco permite cadastrar agendamentos sem atrelar a um `UserId` estrito (quando a própria barbearia marca por telefone). Para isso a tabela `Booking` possui meta-fields de clientes avulsos.
4. **Resoluções de Conflito de Agenda (Booking)**: O fluxo de agendamento precisa cruzar dados de `Disponibility`, subtrair `BarberBreak`, verificar `ExceptionDate` e conferir sobreposição com outros `Booking` na data/hora desejada, considerando o campo `durationInMinutes` do `BarberService`.
5. **Integração Financeira**: Os webhooks da Vercel batem num endpoint que sincroniza o status de assinaturas e faturas automáticas de volta para o Supabase/Neon PostgreSQL de produção.
