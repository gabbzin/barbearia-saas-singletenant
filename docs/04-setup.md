# 04 - Setup

## Pré-requisitos

- Node.js 20+ (compatível com dependências e configuração atual).
- PostgreSQL disponível e acessível pela `DATABASE_URL`.
- Gerenciador de pacotes: `pnpm` (há `pnpm-lock.yaml` no repositório).

## Instalação

- Clonar o repositório.
- Instalar dependências:

```bash
pnpm install
```

- Copiar variáveis de ambiente:

```bash
cp .env.example .env
```

## Banco de dados (Prisma)

- Gerar Prisma Client (também ocorre no `postinstall`):

```bash
pnpm prisma generate
```

- Em desenvolvimento, aplicar migrations locais:

```bash
pnpm prisma migrate dev
```

- Em build/produção, o script `build` executa `prisma migrate deploy` automaticamente.

## Executar em desenvolvimento

```bash
pnpm dev
```

- Aplicação disponível em `http://localhost:3000`.

## Scripts disponíveis (`package.json`)

- `dev`: inicia Next.js em modo desenvolvimento (`next dev`).
- `build`: executa `prisma migrate deploy` e depois `next build`.
- `start`: inicia aplicação compilada (`next start`).
- `lint`: roda lint com ESLint.
- `test`: executa testes com Jest.
- `test:watch`: executa testes em modo watch.
- `seed:bookings`: roda seed de agendamentos (`tsx prisma/seed.bookings.ts`).
- `postinstall`: gera Prisma Client (`prisma generate`).
- `email:dev`: inicia ambiente de preview de emails (`email dev`).

## Variáveis de ambiente

### Definidas em `.env.example`

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `RESEND_API_KEY`
- `BLOB_READ_WRITE_TOKEN`
- `BLOB_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_BASE_URL`

### Usadas no código e não presentes em `.env.example`

- `BARBERSHOP_DEFAULT_TIMEZONE` (fallback no código: `America/Sao_Paulo`).
- `GOOGLE_EMAIL` (configuração de transporte de email OAuth2).
- `GOOGLE_EMAIL_REFRESH_TOKEN` (configuração de transporte de email OAuth2).
- `EMAIL_USER` (remetente em envios por Resend).

## Observações técnicas de setup

- O Prisma está configurado em `prisma.config.ts` com schema em `prisma/schema.prisma` e seed padrão `tsx prisma/seed.developer.ts`.
- O projeto possui testes com Jest (`jest.config.cjs`) e setup em `jest.setup.ts`.
- Não identificado no código: script único de bootstrap que faça install + migração + seed em um comando.
