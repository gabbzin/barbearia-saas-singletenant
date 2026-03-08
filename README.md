# barbeariaSaaS

Plataforma SaaS de agendamento e gestão para barbearias.

## Visão Geral

O barbeariaSaaS é um sistema criado para simplificar o gerenciamento de horários, serviços, pagamentos e atendimentos em barbearias. Ele permite que clientes agendem cortes em segundos, enquanto a equipe administra a agenda diária, profissionais, planos de assinatura e relatórios de forma centralizada.

## 🚀 Setup para Desenvolvimento

### Pré-requisitos

- Node.js 20+
- pnpm (recomendado) ou npm
- PostgreSQL (ou conta Neon/Supabase)

### Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd barbearia-saas-singletenant
```

2. Instale as dependências:

```bash
pnpm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

- **DATABASE_URL**: String de conexão PostgreSQL
- **BETTER_AUTH_SECRET**: Chave secreta (min. 32 caracteres)
- **GOOGLE_CLIENT_ID/SECRET**: Credenciais OAuth Google
- **STRIPE\_\***: Keys do Stripe dashboard
- **RESEND_API_KEY**: API key do Resend
- **BLOB\_\***: Tokens do Vercel Blob Storage

4. Execute as migrations do Prisma:

```bash
pnpm prisma migrate dev
pnpm prisma generate
```

5. (Opcional) Popule o banco com dados de teste:

```bash
pnpm prisma db seed
```

6. Inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

Acesse: http://localhost:3000

### Stack Tecnológica

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, shadcn/ui, Tailwind CSS
- **Design System**: componentes customizados em cima de shadcn/ui
- **Banco de Dados**: PostgreSQL + Prisma ORM
- **Auth**: Better Auth
- **Pagamentos**: Stripe (assinaturas e cobranças avulsas)
- **Email**: Resend + React Email
- **Storage**: Vercel Blob
- **Estado / Data**: React Query, Zustand, next-safe-action

## Principais Funcionalidades

- Agendamento online em poucos cliques (cliente escolhe barbeiro, serviço, data e horário disponíveis)
- Visualização da agenda diária e futura dos barbeiros
- Cadastro e gerenciamento de barbeiros e serviços
- Histórico de agendamentos do cliente
- Controle de horários disponíveis (disponibilidade, exceções, bloqueios)
- Painel administrativo para visão geral da barbearia
- Plano de assinatura para clientes (Stripe)
- Rating dos atendimentos (avaliação pós-serviço)
- Fluxo para atendimentos presenciais sem conta (ghost user)

## Fluxo Geral de Uso

1. O cliente acessa a landing page e faz login ou cadastro.
2. Escolhe o barbeiro, o serviço e o horário disponível.
3. Confirma o agendamento (com ou sem pagamento online, conforme o fluxo configurado).
4. O barbeiro visualiza sua agenda pelo painel do profissional.
5. O administrador acompanha receita, quantidade de agendamentos e equipe pelo painel administrativo.

## Perfis de Usuário

- **Administrador da barbearia**: gerencia barbeiros, serviços, horários, planos de assinatura e acompanha indicadores.
- **Barbeiro**: visualiza e gerencia sua própria agenda, vê detalhes dos clientes e registra atendimentos manuais.
- **Cliente**: realiza e acompanha seus agendamentos, plano de assinatura e avaliações realizadas.

## Acesso ao Sistema

Os usuários entram com credenciais próprias (email/senha ou login social, dependendo da configuração) e cada perfil possui permissões específicas no painel: administradores configuram a operação, barbeiros consultam e gerenciam sua agenda e clientes acessam seus agendamentos, plano e avaliações. O acesso é individual e seguro, respeitando o nível de permissão de cada usuário.

## Requisitos para Utilização

- Acesso à internet
- Navegador atualizado (Google Chrome, Edge, Firefox ou similares)
- Dispositivo desktop, tablet ou smartphone

## Boas Práticas de Uso

- Manter dados cadastrais atualizados
- Respeitar os horários agendados
- Cancelar ou reagendar com antecedência

## Limitações Conhecidas

- Alterações de agenda muito próximas do horário marcado podem não ser refletidas para todos os usuários em tempo real.
- A disponibilidade exibida depende do cadastro correto de horários, serviços e exceções pela barbearia.
- O funcionamento requer conexão estável à internet.

## Atualizações Futuras

O barbeariaSaaS evolui continuamente para oferecer uma experiência cada vez melhor para donos de barbearia, barbeiros e clientes. Estão previstas melhorias em:

- Notificações inteligentes (WhatsApp, email, push)
- Mais relatórios e métricas para o administrador
- Novas opções de personalização da agenda
- Integrações adicionais com ferramentas de marketing e automação
