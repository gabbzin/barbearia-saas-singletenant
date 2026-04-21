# 01 - Architecture

## Estrutura geral do sistema

- Monólito web em Next.js com frontend e backend no mesmo projeto.
- Camadas identificáveis:
- UI/páginas: `app/` e `features/**/components`.
- Lógica de servidor: `features/**/actions` e `features/**/functions` (Server Actions).
- Acesso a dados: `features/**/repository`, `features/**/services` e `lib/prisma.ts`.
- API HTTP: `app/api/auth/[...all]/route.ts` e `app/api/stripe/webhook/route.ts`.
- Banco de dados: PostgreSQL modelado com Prisma (`prisma/schema.prisma`).

## Organização de pastas relevante

- `app/`
- Rotas públicas e protegidas usando route groups: `(auth)` e `(protected)`.
- Layout raiz com providers globais (`QueryProvider`, `TooltipProvider`, hidratação de stores).
- Rotas de API para autenticação e webhook Stripe.
- `features/`
- Organização por domínio (ex.: `booking`, `barber`, `service`, `signature`, `user`, `dashboard_barber`).
- Cada domínio concentra `actions`, `functions`, `hooks`, `schema`, `components` e/ou `repository`.
- `shared/`
- Componentes e constantes compartilhados entre domínios.
- `lib/`
- Configurações técnicas e integrações (`auth`, `prisma`, `stripe-client`, mail/resend, constantes).
- `prisma/`
- `schema.prisma`, migrations e scripts de seed.
- `stores/`
- Estado global com Zustand e hidratação inicial da aplicação.

## Fluxo básico de requisição (identificável no código)

- Requisições web passam por `proxy.ts` para controle de acesso.
- Rotas públicas e APIs públicas permitidas seguem o fluxo normal.
- Para rotas protegidas, o proxy consulta `/api/auth/get-session` e redireciona conforme autenticação.
- Em páginas protegidas, layouts em `app/(protected)` também validam sessão com `verifySession`.
- Páginas/ações de servidor acessam o banco via Prisma (`lib/prisma.ts`).
- Para pagamentos/assinaturas:
- Server Actions criam sessão de checkout no Stripe.
- Stripe chama `POST /api/stripe/webhook`.
- O webhook valida assinatura e despacha para handlers por tipo de evento.

## Padrões arquiteturais detectados

- Arquitetura modular por feature (feature-first).
- Uso de Server Actions como camada de aplicação para mutações e consultas.
- Repositórios/serviços para leitura e encapsulamento de acesso a dados em alguns domínios.
- Validação de entrada com Zod nas ações de servidor.
- Cache de funções de leitura com `react` `cache` em consultas de sessão e dados base.
- Proteção de acesso em múltiplas camadas:
- middleware/proxy de rota,
- layouts protegidos,
- validações de sessão e papel (`role`) nas ações.
- Comunicação cliente-servidor também via `next-safe-action` (cliente de ação seguro).

## Pontos não identificados no código

- Arquitetura de filas assíncronas/background workers: Não identificado no código.
- Comunicação entre múltiplos serviços/microserviços: Não identificado no código.
- Estratégia formal de observabilidade (tracing centralizado, APM): Não identificado no código.
