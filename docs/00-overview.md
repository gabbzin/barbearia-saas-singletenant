# 00 - Overview

## Nome do projeto

- `barbearia-saas` (nome definido em `package.json`)

## Descrição objetiva

- Aplicação web full stack para gestão de barbearia com foco em agendamentos, usuários, serviços, barbeiros e assinaturas.
- Implementada com Next.js (App Router), com renderização de páginas e execução de lógica no servidor via Server Actions e rotas de API.

## Principais funcionalidades identificáveis

- Autenticação com Better Auth (email/senha e provedor Google OAuth).
- Controle de sessão e proteção de rotas para áreas autenticadas.
- Cadastro, edição e remoção de serviços de barbeiro.
- Gestão de barbeiros, pausas (`BarberBreak`), disponibilidade (`Disponibility`) e datas de exceção (`ExceptionDate`).
- Agendamentos com validações (ex.: bloqueio de data passada e conflito de horário já agendado).
- Consulta de próximos agendamentos e histórico de agendamentos.
- Cancelamento e confirmação de agendamentos.
- Fluxo de checkout com Stripe para pagamentos e assinaturas.
- Webhook Stripe para eventos de checkout, fatura paga, reembolso e mudanças de assinatura.
- Avaliação (`Rating`) associada a agendamentos.
- Dashboard administrativo com agregações de receita e quantidade de atendimentos.

## Stack utilizada

- Linguagem: TypeScript.
- Framework web: Next.js 16 (`app/` + App Router).
- UI: React 19 + Tailwind CSS 4 + Radix UI + shadcn/ui (via `components.json` e dependências).
- Estado e dados no cliente: TanStack Query e Zustand.
- Acesso a banco: Prisma ORM + `@prisma/adapter-pg` + PostgreSQL.
- Autenticação: Better Auth (`better-auth`, `better-auth/next-js`, plugin Stripe).
- Pagamentos: Stripe (`stripe`, `@stripe/stripe-js`).
- Upload/arquivos: UploadThing e Vercel Blob.
- Emails: React Email + Nodemailer (implementação também usa Resend em `lib/resend`).
- Testes: Jest + Testing Library.
- Qualidade de código: ESLint + Biome + Prettier.
